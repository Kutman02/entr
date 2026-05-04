import GuestLine from '../../../components/GuestLine'
import SpeakIconButton from '../../../components/SpeakIconButton'
import Timer from '../../../components/Timer'
import { usePractice } from '../../../hooks/usePractice'
import type { Phrase } from '../../../types/phrase'
import type { PracticeResult } from '../../../types/progress'
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
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
        There are no phrases for this scenario and level.
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
          Card {currentRound}/{totalRounds}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
            {current.scenario}
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
            {current.level}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleRandomOrder}
          className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
            randomOrder
              ? 'border-cyan-600 bg-cyan-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700'
          }`}
        >
          Random {randomOrder ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Guest
        </p>
        <GuestLine
          key={current.id}
          text={current.guest}
          hintRu={current.guestHintRu}
          emotion={current.guestEmotion}
          language={current.language}
          role={current.guestRole}
          onSpeak={() => speak(current.guest, speechLocale)}
          textClassName="mt-3 text-3xl font-bold text-slate-900 sm:text-5xl"
        />
      </div>

      <Timer
        secondsLeft={secondsLeft}
        totalSeconds={revealAfterSeconds}
        isRevealed={showAnswer}
      />

      {showAnswer ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Waiter
          </p>

          <div className="mt-3 flex items-start gap-2">
            <p className="text-2xl font-bold text-slate-900 sm:text-4xl">{primaryAnswer}</p>
            <SpeakIconButton
              onSpeak={() => speak(primaryAnswer, speechLocale)}
              label="Play waiter phrase"
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
        <p className="text-lg font-medium text-slate-600">
          Think first. Answer appears in {revealAfterSeconds} seconds.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {!showAnswer ? (
          <button
            type="button"
            onClick={revealNow}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
          >
            Reveal Now
          </button>
        ) : null}

        {showAnswer ? (
          <>
            <button
              type="button"
              onClick={() => moveNext('confident')}
              className="rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Confident + Next
            </button>

            <button
              type="button"
              onClick={() => moveNext('needsReview')}
              className="rounded-full border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Repeat + Next
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => moveNext('unrated')}
          className="rounded-full border border-cyan-600 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          Next
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Settings and progress are saved automatically in your browser.
      </p>
    </div>
  )
}
