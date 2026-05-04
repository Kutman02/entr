import type {
  PhraseProgressStats,
  PracticeProgressState,
  PracticeResult,
} from '../types/progress'

export const createInitialPracticeProgress = (): PracticeProgressState => ({
  totalSeen: 0,
  totalConfident: 0,
  totalNeedsReview: 0,
  totalUnrated: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastTrainedAt: null,
  byPhraseId: {},
})

const createPhraseProgressStats = (): PhraseProgressStats => ({
  seen: 0,
  confident: 0,
  needsReview: 0,
  unrated: 0,
  lastResult: 'unrated',
  lastUpdatedAt: new Date(0).toISOString(),
})

export const registerPracticeResult = (
  previousProgress: PracticeProgressState,
  phraseId: number,
  result: PracticeResult,
): PracticeProgressState => {
  const now = new Date().toISOString()
  const phraseKey = String(phraseId)
  const previousPhraseStats =
    previousProgress.byPhraseId[phraseKey] ?? createPhraseProgressStats()

  const nextPhraseStats: PhraseProgressStats = {
    ...previousPhraseStats,
    seen: previousPhraseStats.seen + 1,
    confident:
      previousPhraseStats.confident + (result === 'confident' ? 1 : 0),
    needsReview:
      previousPhraseStats.needsReview + (result === 'needsReview' ? 1 : 0),
    unrated: previousPhraseStats.unrated + (result === 'unrated' ? 1 : 0),
    lastResult: result,
    lastUpdatedAt: now,
  }

  const nextCurrentStreak = result === 'confident'
    ? previousProgress.currentStreak + 1
    : result === 'needsReview'
      ? 0
      : previousProgress.currentStreak

  return {
    ...previousProgress,
    totalSeen: previousProgress.totalSeen + 1,
    totalConfident: previousProgress.totalConfident + (result === 'confident' ? 1 : 0),
    totalNeedsReview:
      previousProgress.totalNeedsReview + (result === 'needsReview' ? 1 : 0),
    totalUnrated: previousProgress.totalUnrated + (result === 'unrated' ? 1 : 0),
    currentStreak: nextCurrentStreak,
    bestStreak: Math.max(previousProgress.bestStreak, nextCurrentStreak),
    lastTrainedAt: now,
    byPhraseId: {
      ...previousProgress.byPhraseId,
      [phraseKey]: nextPhraseStats,
    },
  }
}

export const getConfidenceRate = (progress: PracticeProgressState): number => {
  if (progress.totalSeen === 0) {
    return 0
  }

  return Math.round((progress.totalConfident / progress.totalSeen) * 100)
}

export const getNeedsReviewPhraseCount = (
  progress: PracticeProgressState,
): number => {
  return Object.values(progress.byPhraseId).filter(
    (stats) => stats.needsReview > stats.confident,
  ).length
}

export const getNeedsReviewPhraseIds = (
  progress: PracticeProgressState,
): Set<number> => {
  const ids = Object.entries(progress.byPhraseId)
    .filter(([, stats]) => stats.needsReview > stats.confident)
    .map(([phraseId]) => Number(phraseId))

  return new Set(ids)
}
