import rawScenarios from './categories.json'
import type {
  DifficultyLevel,
  GuestEmotion,
  PhraseLanguage,
  Phrase,
  Scenario,
} from '../types/phrase'

type RawPhrase = {
  id: number
  scenario: string
  level: string
  language: string
  guest: string
  guestHintRu: string
  guestEmotion?: string
  answers?: string[]
  translations?: {
    ru?: string[]
    tr?: string[]
    en?: string[]
  }
}

type RawPhraseModuleMap = Record<string, RawPhrase[]>

const rawPhraseModules = import.meta.glob('./phrases/*/*.json', {
  eager: true,
  import: 'default',
}) as RawPhraseModuleMap

const rawPhrases = Object.entries(rawPhraseModules)
  .flatMap(([modulePath, modulePhrases]) => {
    return modulePhrases.map((phrase, index) => ({
      phrase,
      source: `${modulePath}[${index}]`,
    }))
  })
  .sort((left, right) => left.phrase.id - right.phrase.id)

if (rawPhrases.length === 0) {
  throw new Error('No phrases found. Add JSON files in src/data/phrases/<lang>/<scenario>.json')
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
const allowedLanguages: PhraseLanguage[] = ['en', 'tr']
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

const isPhraseLanguage = (value: string): value is PhraseLanguage => {
  return allowedLanguages.includes(value as PhraseLanguage)
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
export const phraseLanguages: PhraseLanguage[] = allowedLanguages

const usedIds = new Set<number>()

export const phrases: Phrase[] = rawPhrases.map(({ phrase, source }) => {
  if (usedIds.has(phrase.id)) {
    throw new Error(`Duplicate phrase id at ${source}: ${phrase.id}`)
  }

  usedIds.add(phrase.id)

  if (!isScenario(phrase.scenario)) {
    throw new Error(`Invalid phrase scenario at ${source}`)
  }

  if (!isDifficultyLevel(phrase.level)) {
    throw new Error(`Invalid phrase level at ${source}`)
  }

  if (!isPhraseLanguage(phrase.language)) {
    throw new Error(`Invalid phrase language at ${source}`)
  }

  const guestText = phrase.guest?.trim()

  if (!guestText) {
    throw new Error(`Missing guest text at ${source}`)
  }

  const guestHintRu = phrase.guestHintRu?.trim()

  if (!guestHintRu) {
    throw new Error(`Missing guestHintRu at ${source}`)
  }

  let guestEmotion = inferEmotionFromScenario(phrase.scenario)

  if (phrase.guestEmotion) {
    if (!isGuestEmotion(phrase.guestEmotion)) {
      throw new Error(`Invalid guestEmotion at ${source}`)
    }

    guestEmotion = phrase.guestEmotion
  }

  const normalizedAnswers = normalizeTextList(phrase.answers ?? [])
  const ruTranslations = normalizeTextList(phrase.translations?.ru ?? [])
  const trTranslations = normalizeTextList(phrase.translations?.tr ?? [])
  const enTranslations = normalizeTextList(phrase.translations?.en ?? [])

  if (normalizedAnswers.length === 0) {
    throw new Error(`Missing answers at ${source}`)
  }

  if (ruTranslations.length === 0 || trTranslations.length === 0) {
    throw new Error(`Missing translations at ${source}`)
  }

  if (phrase.language === 'tr' && enTranslations.length === 0) {
    throw new Error(`Missing EN translations for Turkish phrase at ${source}`)
  }

  return {
    id: phrase.id,
    scenario: phrase.scenario,
    level: phrase.level,
    language: phrase.language,
    guest: guestText,
    guestHintRu,
    guestEmotion,
    answers: normalizedAnswers,
    translations: {
      ru: ruTranslations,
      tr: trTranslations,
      ...(enTranslations.length > 0 ? { en: enTranslations } : {}),
    },
  }
})

const phraseByGuestText = new Map(
  phrases.map((phrase) => [phrase.guest.trim().toLowerCase(), phrase]),
)

export const getPhraseByGuestText = (text: string) => {
  return phraseByGuestText.get(text.trim().toLowerCase())
}
