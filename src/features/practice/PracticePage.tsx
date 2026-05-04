import { useCallback, useMemo } from 'react'
import Controls from '../../components/Controls'
import GuestLine from '../../components/GuestLine'
import PracticeProgressPanel from '../../components/PracticeProgressPanel'
import Timer from '../../components/Timer'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import { levels, phrases, scenarios } from '../../data/phrases'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { usePractice } from '../../hooks/usePractice'
import type { DifficultyLevel, Phrase, Scenario } from '../../types/phrase'
import type { PracticeProgressState, PracticeResult } from '../../types/progress'
import {
  createInitialPracticeProgress,
  getConfidenceRate,
  getNeedsReviewPhraseCount,
  registerPracticeResult,
} from '../../utils/practiceProgress'
import { speak } from '../../utils/speech'

type ReactionWindow = 2 | 3
type ScenarioFilter = 'all' | Scenario
type LevelFilter = 'all' | DifficultyLevel

const scenarioOptions: Array<{ value: ScenarioFilter; label: string }> = [
  { value: 'all', label: 'All scenarios' },
  ...scenarios.map((scenario) => ({
    value: scenario,
    label: scenario,
  })),
]

const levelOptions: Array<{ value: LevelFilter; label: string }> = [
  { value: 'all', label: 'All levels' },
  ...levels.map((level) => ({
    value: level,
    label: level,
  })),
]

const reactionOptions: Array<{ value: ReactionWindow; label: string }> = [
  { value: 2, label: '2 sec' },
  { value: 3, label: '3 sec' },
]

export default function PracticePage() {
  const [activeScenario, setActiveScenario] = useLocalStorageState<ScenarioFilter>(
    STORAGE_KEYS.practiceScenario,
    'all',
  )
  const [activeLevel, setActiveLevel] = useLocalStorageState<LevelFilter>(
    STORAGE_KEYS.practiceLevel,
    'all',
  )
  const [reactionWindow, setReactionWindow] = useLocalStorageState<ReactionWindow>(
    STORAGE_KEYS.practiceReactionWindow,
    3,
  )
  const [randomOrderPref, setRandomOrderPref] = useLocalStorageState<boolean>(
    STORAGE_KEYS.practiceRandomOrder,
    false,
  )
  const [progress, setProgress] = useLocalStorageState<PracticeProgressState>(
    STORAGE_KEYS.practiceProgress,
    createInitialPracticeProgress,
  )

  const filteredPhrases = useMemo(() => {
    return phrases.filter((phrase) => {
      const matchesScenario =
        activeScenario === 'all' || phrase.scenario === activeScenario
      const matchesLevel = activeLevel === 'all' || phrase.level === activeLevel

      return matchesScenario && matchesLevel
    })
  }, [activeScenario, activeLevel])

  const confidenceRate = useMemo(() => {
    return getConfidenceRate(progress)
  }, [progress])

  const needsReviewPhrases = useMemo(() => {
    return getNeedsReviewPhraseCount(progress)
  }, [progress])

  const registerResult = useCallback(
    (phraseId: number, result: PracticeResult) => {
      setProgress((previousProgress) =>
        registerPracticeResult(previousProgress, phraseId, result),
      )
    },
    [setProgress],
  )

  const resetProgress = useCallback(() => {
    setProgress(createInitialPracticeProgress())
  }, [setProgress])

  const practiceKey = useMemo(() => {
    const ids = filteredPhrases.map((phrase) => phrase.id).join('-')
    return `${ids}-${reactionWindow}`
  }, [filteredPhrases, reactionWindow])

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Practice Mode</h2>

      <PracticeProgressPanel
        progress={progress}
        confidenceRate={confidenceRate}
        needsReviewPhrases={needsReviewPhrases}
        onResetProgress={resetProgress}
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Scenario
        </p>
        <Controls
          label="Filter practice scenario"
          options={scenarioOptions}
          value={activeScenario}
          onChange={setActiveScenario}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Level
        </p>
        <Controls
          label="Filter practice level"
          options={levelOptions}
          value={activeLevel}
          onChange={setActiveLevel}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Reaction window
        </p>
        <Controls
          label="Select reaction window"
          options={reactionOptions}
          value={reactionWindow}
          onChange={setReactionWindow}
        />
      </div>

      <PracticeTrainer
        key={practiceKey}
        phraseList={filteredPhrases}
        revealAfterSeconds={reactionWindow}
        initialRandomOrder={randomOrderPref}
        onRandomOrderChange={setRandomOrderPref}
        onRegisterResult={registerResult}
      />
    </div>
  )
}

interface PracticeTrainerProps {
  phraseList: Phrase[]
  revealAfterSeconds: number
  initialRandomOrder: boolean
  onRandomOrderChange: (nextRandomOrder: boolean) => void
  onRegisterResult: (phraseId: number, result: PracticeResult) => void
}

function PracticeTrainer({
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

        <button
          type="button"
          onClick={() => speak(current.guest, 'en-US')}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
        >
          Play Guest
        </button>

        {showAnswer ? (
          <button
            type="button"
            onClick={() => speak(primaryAnswer, 'en-US')}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
          >
            Play Waiter
          </button>
        ) : null}
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
          <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-4xl">{primaryAnswer}</p>

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
              TR:{' '}
              <span className="font-medium text-slate-800">
                {current.translations.tr.join(' / ')}
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
