import { useMemo } from 'react'
import Controls from '../../components/Controls'
import PracticeProgressPanel from '../../components/PracticeProgressPanel'
import PracticeTrainer from './components/PracticeTrainer'
import {
  languageOptions,
  levelOptions,
  reactionOptions,
  scenarioOptions,
  usePracticeDashboard,
} from './hooks/usePracticeDashboard'

export default function PracticePage() {
  const {
    activeScenario,
    setActiveScenario,
    activeLevel,
    setActiveLevel,
    activeLanguage,
    setActiveLanguage,
    reactionWindow,
    setReactionWindow,
    randomOrderPref,
    setRandomOrderPref,
    progress,
    confidenceRate,
    needsReviewPhrases,
    filteredPhrases,
    registerResult,
    resetProgress,
  } = usePracticeDashboard()

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
          Language
        </p>
        <Controls
          label="Filter practice language"
          options={languageOptions}
          value={activeLanguage}
          onChange={setActiveLanguage}
        />
      </div>

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
