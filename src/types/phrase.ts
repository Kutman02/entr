export type Scenario =
  | 'greeting'
  | 'seating'
  | 'drink'
  | 'food'
  | 'service'
  | 'direction'
  | 'problem'
  | 'understanding'
  | 'closing'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type PhraseLanguage = 'en' | 'tr'

export type GuestEmotion =
  | 'polite'
  | 'neutral'
  | 'conflict'
  | 'confused'
  | 'grateful'

export interface Phrase {
  id: number
  scenario: Scenario
  level: DifficultyLevel
  language: PhraseLanguage
  guest: string
  guestHintRu: string
  guestEmotion: GuestEmotion
  guestRole?: string
  answers: string[]
  translations: {
    ru: string[]
    tr: string[]
    en?: string[]
  }
}

export interface DialogueTurn {
  speaker: 'guest' | 'waiter'
  text: string
}

export interface DialogueScenario {
  id: number
  title: string
  scenario: Scenario
  turns: DialogueTurn[]
}