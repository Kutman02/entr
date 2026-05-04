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
  guestRole?: string
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
    ...(phrase.guestRole ? { guestRole: phrase.guestRole } : {}),
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

export interface VocabularyEntry {
  id: string
  term: string
  sourceLanguage: PhraseLanguage
  scenario: Scenario
  translationRu: string
  translationTr: string
}

type VocabularySeed = {
  id: string
  term: string
  sourceLanguage: PhraseLanguage
  scenario: Scenario
  ruVariants: Set<string>
  trVariants: Set<string>
}

const normalizeVocabularyText = (value: string) => {
  return value
    .replace(/[.,!?;:]+$/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

const isLikelyVocabularyTerm = (value: string) => {
  const normalized = normalizeVocabularyText(value)

  if (!normalized || normalized.length < 2 || normalized.length > 48) {
    return false
  }

  return normalized.split(' ').length <= 4
}

const vocabularyMap = new Map<string, VocabularySeed>()

const addVocabularyEntry = ({
  term,
  sourceLanguage,
  scenario,
  translationRu,
  translationTr,
}: {
  term: string
  sourceLanguage: PhraseLanguage
  scenario: Scenario
  translationRu: string
  translationTr: string
}) => {
  const normalizedTerm = normalizeVocabularyText(term)

  if (!isLikelyVocabularyTerm(normalizedTerm)) {
    return
  }

  const normalizedRu = normalizeVocabularyText(translationRu)
  const normalizedTr = normalizeVocabularyText(translationTr)
  const key = `${sourceLanguage}:${normalizedTerm.toLowerCase()}`
  const existing = vocabularyMap.get(key)

  if (existing) {
    if (normalizedRu) {
      existing.ruVariants.add(normalizedRu)
    }

    if (normalizedTr) {
      existing.trVariants.add(normalizedTr)
    }

    return
  }

  const ruVariants = new Set<string>()
  const trVariants = new Set<string>()

  if (normalizedRu) {
    ruVariants.add(normalizedRu)
  }

  if (normalizedTr) {
    trVariants.add(normalizedTr)
  }

  if (sourceLanguage === 'tr') {
    trVariants.add(normalizedTerm)
  }

  vocabularyMap.set(key, {
    id: key,
    term: normalizedTerm,
    sourceLanguage,
    scenario,
    ruVariants,
    trVariants,
  })
}

phrases.forEach((phrase) => {
  const getRuByIndex = (index: number) => {
    return (
      phrase.translations.ru[index] ??
      phrase.translations.ru[0] ??
      phrase.guestHintRu
    )
  }

  const getEnByIndex = (index: number) => {
    if (phrase.language === 'en') {
      return phrase.guest
    }

    return phrase.translations.en?.[index] ?? phrase.translations.en?.[0] ?? ''
  }

  const registerTerm = (term: string, index: number) => {
    const translationRu = getRuByIndex(index)
    const translationTr =
      phrase.language === 'tr'
        ? normalizeVocabularyText(term)
        : phrase.translations.tr[index] ?? phrase.translations.tr[0] ?? ''
    const translationEn = getEnByIndex(index)

    if (phrase.language === 'en') {
      addVocabularyEntry({
        term,
        sourceLanguage: 'en',
        scenario: phrase.scenario,
        translationRu,
        translationTr,
      })

      addVocabularyEntry({
        term: translationTr,
        sourceLanguage: 'tr',
        scenario: phrase.scenario,
        translationRu,
        translationTr,
      })

      return
    }

    addVocabularyEntry({
      term,
      sourceLanguage: 'tr',
      scenario: phrase.scenario,
      translationRu,
      translationTr: term,
    })

    addVocabularyEntry({
      term: translationEn,
      sourceLanguage: 'en',
      scenario: phrase.scenario,
      translationRu,
      translationTr,
    })
  }

  registerTerm(phrase.guest, 0)
  phrase.answers.forEach((answer, index) => {
    registerTerm(answer, index)
  })
})

export const vocabularyEntries: VocabularyEntry[] = Array.from(
  vocabularyMap.values(),
)
  .map((entry) => {
    const ruList = Array.from(entry.ruVariants)
    const trList = Array.from(entry.trVariants)

    return {
      id: entry.id,
      term: entry.term,
      sourceLanguage: entry.sourceLanguage,
      scenario: entry.scenario,
      translationRu: ruList.join(' / '),
      translationTr: trList.join(' / '),
    }
  })
  .sort((left, right) => {
    return left.term.localeCompare(right.term, 'ru', { sensitivity: 'base' })
  })
