import rawScenarios from './categories.json'
import rawPhrases from './phrases.json'
import type {
  DifficultyLevel,
  GuestEmotion,
  Phrase,
  Scenario,
} from '../types/phrase'

type RawPhrase = {
  id: number
  scenario: string
  level: string
  guest: string
  guestHintRu: string
  guestEmotion?: string
  answers: string[]
  translations: {
    ru: string[]
    tr: string[]
  }
}

const allowedScenarios: Scenario[] = [
  'greeting',
  'seating',
  'drink',
  'food',
  'service',
  'direction',
  'problem',
  'understanding',
  'closing',
]

const allowedLevels: DifficultyLevel[] = ['easy', 'medium', 'hard']
const allowedGuestEmotions: GuestEmotion[] = [
  'polite',
  'neutral',
  'conflict',
  'confused',
  'grateful',
]

const isScenario = (value: string): value is Scenario => {
  return allowedScenarios.includes(value as Scenario)
}

const isDifficultyLevel = (value: string): value is DifficultyLevel => {
  return allowedLevels.includes(value as DifficultyLevel)
}

const isGuestEmotion = (value: string): value is GuestEmotion => {
  return allowedGuestEmotions.includes(value as GuestEmotion)
}

const inferEmotionFromScenario = (scenario: Scenario): GuestEmotion => {
  if (scenario === 'problem') {
    return 'conflict'
  }

  if (scenario === 'understanding') {
    return 'confused'
  }

  if (scenario === 'closing') {
    return 'grateful'
  }

  return 'polite'
}

const normalizeTextList = (values: string[]): string[] => {
  return values.map((value) => value.trim()).filter(Boolean)
}

export const scenarios: Scenario[] = (rawScenarios as string[]).map(
  (scenario, index) => {
    if (!isScenario(scenario)) {
      throw new Error(`Invalid scenario at categories.json[${index}]: ${scenario}`)
    }

    return scenario
  },
)

export const levels: DifficultyLevel[] = allowedLevels

export const phrases: Phrase[] = (rawPhrases as RawPhrase[]).map((phrase, index) => {
  if (!isScenario(phrase.scenario)) {
    throw new Error(`Invalid phrase scenario at phrases.json[${index}]`)
  }

  if (!isDifficultyLevel(phrase.level)) {
    throw new Error(`Invalid phrase level at phrases.json[${index}]`)
  }

  const guestHintRu = phrase.guestHintRu?.trim()

  if (!guestHintRu) {
    throw new Error(`Missing guestHintRu at phrases.json[${index}]`)
  }

  let guestEmotion = inferEmotionFromScenario(phrase.scenario)

  if (phrase.guestEmotion) {
    if (!isGuestEmotion(phrase.guestEmotion)) {
      throw new Error(`Invalid guestEmotion at phrases.json[${index}]`)
    }

    guestEmotion = phrase.guestEmotion
  }

  const normalizedAnswers = normalizeTextList(phrase.answers)
  const ruTranslations = normalizeTextList(phrase.translations.ru)
  const trTranslations = normalizeTextList(phrase.translations.tr)

  if (normalizedAnswers.length === 0) {
    throw new Error(`Missing answers at phrases.json[${index}]`)
  }

  if (ruTranslations.length === 0 || trTranslations.length === 0) {
    throw new Error(`Missing translations at phrases.json[${index}]`)
  }

  return {
    id: phrase.id,
    scenario: phrase.scenario,
    level: phrase.level,
    guest: phrase.guest,
    guestHintRu,
    guestEmotion,
    answers: normalizedAnswers,
    translations: {
      ru: ruTranslations,
      tr: trTranslations,
    },
  }
})

const phraseByGuestText = new Map(
  phrases.map((phrase) => [phrase.guest.trim().toLowerCase(), phrase]),
)

export const getPhraseByGuestText = (text: string) => {
  return phraseByGuestText.get(text.trim().toLowerCase())
}
