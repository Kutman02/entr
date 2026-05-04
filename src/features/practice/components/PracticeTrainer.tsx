import GuestLine from '../../../components/GuestLine'
import SpeakIconButton from '../../../components/SpeakIconButton'
import Timer from '../../../components/Timer'
import Button from '../../../components/ui/Button'
import { usePractice } from '../../../hooks/usePractice'
import type { Phrase } from '../../../types/phrase'
import type { PracticeResult } from '../../../types/progress'
import { getLevelLabelRu, getScenarioLabelRu } from '../../../utils/phraseMeta'
import { getSpeechLocaleByLanguage } from '../../../utils/phraseLanguage'
import { speak } from '../../../utils/speech'

interface PracticeTrainerProps {
  phraseList: Phrase[]
  revealAfterSeconds: number
  initialRandomOrder: boolean
  onRandomOrderChange: (nextRandomOrder: boolean) => void
  onRegisterResult: (phraseId: number, result: PracticeResult) => void
}

export default function PracticeTrainer({
  phraseList,
  revealAfterSeconds,
  initialRandomOrder,
  onRandomOrderChange,
  onRegisterResult,
}: PracticeTrainerProps) {
  const {
    current,
    showAnswer,
    secondsLeft,
    next,
    revealNow,
    randomOrder,
    toggleRandomOrder,
    currentRound,
    totalRounds,
  } = usePractice(phraseList, revealAfterSeconds, {
    initialRandomOrder,
    onRandomOrderChange,
  })

  const primaryAnswer = current?.answers[0] ?? ''
  const alternativeAnswers = current?.answers.slice(1) ?? []
  const speechLocale = current ? getSpeechLocaleByLanguage(current.language) : 'en-US'

  if (!current) {
    return (
      <div className="glass-card study-card rounded-2xl p-6 text-center text-slate-600">
        Для выбранных фильтров фразы не найдены.
      </div>
    )
  }

  const moveNext = (result: PracticeResult) => {
    onRegisterResult(current.id, result)
    next()
  }

  const secondaryTranslationLabel = current.language === 'tr' ? 'EN' : 'TR'
  const secondaryTranslations =
    current.language === 'tr'
      ? (current.translations.en ?? current.translations.tr)
      : current.translations.tr

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
          Карточка {currentRound}/{totalRounds}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
            {getScenarioLabelRu(current.scenario)}
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
            {getLevelLabelRu(current.level)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={toggleRandomOrder}
          tone={randomOrder ? 'primary' : 'secondary'}
          size="sm"
        >
          Случайный порядок: {randomOrder ? 'ВКЛ' : 'ВЫКЛ'}
        </Button>
      </div>

      <div className="glass-card study-card rounded-2xl p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Гость
        </p>
        <GuestLine
          key={current.id}
          text={current.guest}
          hintRu={current.guestHintRu}
          emotion={current.guestEmotion}
          language={current.language}
          role={current.guestRole}
          onSpeak={() => speak(current.guest, speechLocale)}
          textClassName="readable-copy mt-3 text-2xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
        />
      </div>

      <Timer
        secondsLeft={secondsLeft}
        totalSeconds={revealAfterSeconds}
        isRevealed={showAnswer}
      />

      {showAnswer ? (
        <div className="glass-card study-card rounded-2xl border-cyan-200/80 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Официант
          </p>

          <div className="mt-3 flex items-start gap-2">
            <p className="readable-copy text-xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              {primaryAnswer}
            </p>
            <SpeakIconButton
              onSpeak={() => speak(primaryAnswer, speechLocale)}
              label="Озвучить фразу официанта"
            />
          </div>

          {alternativeAnswers.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {alternativeAnswers.map((answer) => (
                <span
                  key={answer}
                  className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-semibold text-cyan-800"
                >
                  {answer}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 space-y-2 rounded-xl border border-cyan-100 bg-white p-3 text-sm text-slate-600">
            <p>
              RU:{' '}
              <span className="font-medium text-slate-800">
                {current.translations.ru.join(' / ')}
              </span>
            </p>
            <p>
              {secondaryTranslationLabel}:{' '}
              <span className="font-medium text-slate-800">
                {secondaryTranslations.join(' / ')}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <p className="readable-copy text-base font-medium text-slate-600 sm:text-lg">
          Сначала подумайте. Ответ появится через {revealAfterSeconds} сек.
        </p>
      )}

      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        {!showAnswer ? (
          <Button
            onClick={revealNow}
            tone="secondary"
            fullOnMobile
          >
            Показать ответ
          </Button>
        ) : null}

        {showAnswer ? (
          <>
            <Button
              onClick={() => moveNext('confident')}
              tone="success"
              fullOnMobile
            >
              Знаю + дальше
            </Button>

            <Button
              onClick={() => moveNext('needsReview')}
              tone="warning"
              fullOnMobile
            >
              Повторить + дальше
            </Button>
          </>
        ) : null}

        <Button
          onClick={() => moveNext('unrated')}
          tone="primary"
          fullOnMobile
        >
          Дальше
        </Button>
      </div>

      <p className="text-sm text-slate-500">
        Настройки и прогресс автоматически сохраняются в браузере.
      </p>
    </div>
  )
}
