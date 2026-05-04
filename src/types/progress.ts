export type PracticeResult = 'confident' | 'needsReview' | 'unrated'

export interface PhraseProgressStats {
  seen: number
  confident: number
  needsReview: number
  unrated: number
  lastResult: PracticeResult
  lastUpdatedAt: string
}

export interface PracticeProgressState {
  totalSeen: number
  totalConfident: number
  totalNeedsReview: number
  totalUnrated: number
  currentStreak: number
  bestStreak: number
  lastTrainedAt: string | null
  byPhraseId: Record<string, PhraseProgressStats>
}
