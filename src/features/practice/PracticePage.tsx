import { useMemo } from 'react'
import Balancer from 'react-wrap-balancer'
import CollapsibleFilters from '../../components/CollapsibleFilters'
import Controls from '../../components/Controls'
import PracticeProgressPanel from '../../components/PracticeProgressPanel'
import { STORAGE_KEYS } from '../../constants/storageKeys'
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

  const selectedLanguageLabel = useMemo(() => {
    return (
      languageOptions.find((option) => option.value === activeLanguage)?.label ??
      'Все языки'
    )
  }, [activeLanguage])

  const selectedScenarioLabel = useMemo(() => {
    return (
      scenarioOptions.find((option) => option.value === activeScenario)?.label ??
      'Все сценарии'
    )
  }, [activeScenario])

  const selectedLevelLabel = useMemo(() => {
    return (
      levelOptions.find((option) => option.value === activeLevel)?.label ??
      'Все уровни'
    )
  }, [activeLevel])

  const selectedReactionLabel = useMemo(() => {
    return (
      reactionOptions.find((option) => option.value === reactionWindow)?.label ??
      `${reactionWindow} сек`
    )
  }, [reactionWindow])

  const filtersSummary = `${selectedLanguageLabel} • ${selectedScenarioLabel} • ${selectedLevelLabel} • ${selectedReactionLabel}`

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        <Balancer>Режим практики</Balancer>
      </h2>

      <PracticeProgressPanel
        progress={progress}
        confidenceRate={confidenceRate}
        needsReviewPhrases={needsReviewPhrases}
        onResetProgress={resetProgress}
      />

      <CollapsibleFilters
        storageKey={STORAGE_KEYS.practiceFiltersOpen}
        summary={filtersSummary}
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Язык
          </p>
          <Controls
            label="Фильтр практики по языку"
            options={languageOptions}
            value={activeLanguage}
            onChange={setActiveLanguage}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Сценарий
          </p>
          <Controls
            label="Фильтр практики по сценарию"
            options={scenarioOptions}
            value={activeScenario}
            onChange={setActiveScenario}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Уровень
          </p>
          <Controls
            label="Фильтр практики по уровню"
            options={levelOptions}
            value={activeLevel}
            onChange={setActiveLevel}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Окно реакции
          </p>
          <Controls
            label="Выбор времени реакции"
            options={reactionOptions}
            value={reactionWindow}
            onChange={setReactionWindow}
          />
        </div>
      </CollapsibleFilters>

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
