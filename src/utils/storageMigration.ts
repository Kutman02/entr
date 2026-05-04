import rawScenarios from '../data/categories.json'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { DEFAULT_APP_MODE, type AppMode } from '../constants/navigation'
import { createInitialPracticeProgress } from './practiceProgress'
import type {
  PhraseProgressStats,
  PracticeProgressState,
  PracticeResult,
} from '../types/progress'

const STORAGE_SCHEMA_VERSION_KEY = 'waiter-trainer:storage-schema-version'
const STORAGE_BUILD_ID_KEY = 'waiter-trainer:storage-build-id'
const CURRENT_STORAGE_SCHEMA_VERSION = 1

let hasRunStorageMigration = false

const allowedScenarios = new Set<string>(rawScenarios as string[])
const allowedLevels = new Set(['easy', 'medium', 'hard'])
const allowedLanguages = new Set(['en', 'tr'])
const allowedResults = new Set<PracticeResult>([
  'confident',
  'needsReview',
  'unrated',
])
const allowedModes = new Set<AppMode>(['learn', 'practice', 'simulation'])

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const toSafeCount = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0
  }

  return Math.floor(value)
}

const readJson = (key: string): unknown | null => {
  try {
    const rawValue = window.localStorage.getItem(key)

    if (rawValue === null) {
      return null
    }

    return JSON.parse(rawValue) as unknown
  } catch {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore remove failures.
    }

    return null
  }
}

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write failures.
  }
}

const normalizeProgressStats = (value: unknown): PhraseProgressStats | null => {
  if (!isRecord(value)) {
    return null
  }

  const lastResult = allowedResults.has(value.lastResult as PracticeResult)
    ? (value.lastResult as PracticeResult)
    : 'unrated'

  return {
    seen: toSafeCount(value.seen),
    confident: toSafeCount(value.confident),
    needsReview: toSafeCount(value.needsReview),
    unrated: toSafeCount(value.unrated),
    lastResult,
    lastUpdatedAt:
      typeof value.lastUpdatedAt === 'string'
        ? value.lastUpdatedAt
        : new Date(0).toISOString(),
  }
}

const normalizePracticeProgress = (value: unknown): PracticeProgressState => {
  const fallback = createInitialPracticeProgress()

  if (!isRecord(value)) {
    return fallback
  }

  const byPhraseIdSource = isRecord(value.byPhraseId) ? value.byPhraseId : {}
  const byPhraseId: Record<string, PhraseProgressStats> = {}

  for (const [phraseId, stats] of Object.entries(byPhraseIdSource)) {
    if (!/^\d+$/.test(phraseId)) {
      continue
    }

    const normalizedStats = normalizeProgressStats(stats)

    if (normalizedStats) {
      byPhraseId[phraseId] = normalizedStats
    }
  }

  return {
    totalSeen: toSafeCount(value.totalSeen),
    totalConfident: toSafeCount(value.totalConfident),
    totalNeedsReview: toSafeCount(value.totalNeedsReview),
    totalUnrated: toSafeCount(value.totalUnrated),
    currentStreak: toSafeCount(value.currentStreak),
    bestStreak: toSafeCount(value.bestStreak),
    lastTrainedAt:
      typeof value.lastTrainedAt === 'string' || value.lastTrainedAt === null
        ? value.lastTrainedAt
        : null,
    byPhraseId,
  }
}

const normalizeAppMode = (value: unknown): AppMode => {
  if (typeof value === 'string' && allowedModes.has(value as AppMode)) {
    return value as AppMode
  }

  return DEFAULT_APP_MODE
}

const normalizeScenarioFilter = (value: unknown): string => {
  if (value === 'all') {
    return value
  }

  if (typeof value === 'string' && allowedScenarios.has(value)) {
    return value
  }

  return 'all'
}

const normalizeLevelFilter = (value: unknown): string => {
  if (value === 'all') {
    return value
  }

  if (typeof value === 'string' && allowedLevels.has(value)) {
    return value
  }

  return 'all'
}

const normalizeLanguageFilter = (value: unknown): string => {
  if (value === 'all') {
    return value
  }

  if (typeof value === 'string' && allowedLanguages.has(value)) {
    return value
  }

  return 'all'
}

const normalizeReactionWindow = (value: unknown): number => {
  return value === 2 || value === 3 ? value : 3
}

const normalizeBoolean = (value: unknown, fallback = false): boolean => {
  return typeof value === 'boolean' ? value : fallback
}

const sanitizeKey = <T,>(
  key: string,
  normalize: (value: unknown) => T,
  fallback: T,
) => {
  const rawValue = readJson(key)

  if (rawValue === null) {
    writeJson(key, fallback)
    return
  }

  writeJson(key, normalize(rawValue))
}

export const runStorageMigration = () => {
  if (hasRunStorageMigration || typeof window === 'undefined') {
    return
  }

  hasRunStorageMigration = true

  sanitizeKey(STORAGE_KEYS.appMode, normalizeAppMode, DEFAULT_APP_MODE)
  sanitizeKey(STORAGE_KEYS.practiceScenario, normalizeScenarioFilter, 'all')
  sanitizeKey(STORAGE_KEYS.practiceLevel, normalizeLevelFilter, 'all')
  sanitizeKey(STORAGE_KEYS.practiceLanguage, normalizeLanguageFilter, 'all')
  sanitizeKey(STORAGE_KEYS.practiceReactionWindow, normalizeReactionWindow, 3)
  sanitizeKey(STORAGE_KEYS.practiceRandomOrder, (value) => normalizeBoolean(value), false)
  sanitizeKey(STORAGE_KEYS.learnLanguage, normalizeLanguageFilter, 'all')
  sanitizeKey(STORAGE_KEYS.learnReviewOnly, (value) => normalizeBoolean(value), false)
  sanitizeKey(
    STORAGE_KEYS.practiceProgress,
    normalizePracticeProgress,
    createInitialPracticeProgress(),
  )

  try {
    window.localStorage.setItem(
      STORAGE_SCHEMA_VERSION_KEY,
      String(CURRENT_STORAGE_SCHEMA_VERSION),
    )
    window.localStorage.setItem(STORAGE_BUILD_ID_KEY, __APP_BUILD_ID__)
  } catch {
    // Ignore write failures.
  }
}
