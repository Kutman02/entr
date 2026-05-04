import { useCallback, useMemo } from 'react'
import { STORAGE_KEYS } from '../../../constants/storageKeys'
import { levels, phraseLanguages, phrases, scenarios } from '../../../data/phrases'
import { useLocalStorageState } from '../../../hooks/useLocalStorageState'
import type {
  DifficultyLevel,
  PhraseLanguage,
  Scenario,
} from '../../../types/phrase'
import type {
  PracticeProgressState,
  PracticeResult,
} from '../../../types/progress'
import {
  createInitialPracticeProgress,
  getConfidenceRate,
  getNeedsReviewPhraseCount,
  registerPracticeResult,
} from '../../../utils/practiceProgress'

export type ReactionWindow = 2 | 3
export type ScenarioFilter = 'all' | Scenario
export type LevelFilter = 'all' | DifficultyLevel
export type LanguageFilter = 'all' | PhraseLanguage

const languageLabels: Record<PhraseLanguage, string> = {
  en: 'English 🇬🇧',
  tr: 'Turkish 🇹🇷',
}

export const languageOptions: Array<{ value: LanguageFilter; label: string }> = [
  { value: 'all', label: 'All languages' },
  ...phraseLanguages.map((language) => ({
    value: language,
    label: languageLabels[language],
  })),
]

export const scenarioOptions: Array<{ value: ScenarioFilter; label: string }> = [
  { value: 'all', label: 'All scenarios' },
  ...scenarios.map((scenario) => ({
    value: scenario,
    label: scenario,
  })),
]

export const levelOptions: Array<{ value: LevelFilter; label: string }> = [
  { value: 'all', label: 'All levels' },
  ...levels.map((level) => ({
    value: level,
    label: level,
  })),
]

export const reactionOptions: Array<{ value: ReactionWindow; label: string }> = [
  { value: 2, label: '2 sec' },
  { value: 3, label: '3 sec' },
]

export const usePracticeDashboard = () => {
  const [activeScenario, setActiveScenario] = useLocalStorageState<ScenarioFilter>(
    STORAGE_KEYS.practiceScenario,
    'all',
  )
  const [activeLevel, setActiveLevel] = useLocalStorageState<LevelFilter>(
    STORAGE_KEYS.practiceLevel,
    'all',
  )
  const [activeLanguage, setActiveLanguage] =
    useLocalStorageState<LanguageFilter>(
      STORAGE_KEYS.practiceLanguage,
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
      const matchesLanguage =
        activeLanguage === 'all' || phrase.language === activeLanguage

      return matchesScenario && matchesLevel && matchesLanguage
    })
  }, [activeScenario, activeLevel, activeLanguage])

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

  return {
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
  }
}
