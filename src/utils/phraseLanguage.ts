import type { PhraseLanguage } from '../types/phrase'

type PhraseLanguageMeta = {
  flag: string
  code: string
  labelRu: string
  speechLocale: string
}

const languageMeta: Record<PhraseLanguage, PhraseLanguageMeta> = {
  en: {
    flag: '🇬🇧',
    code: 'EN',
    labelRu: 'английский',
    speechLocale: 'en-US',
  },
  tr: {
    flag: '🇹🇷',
    code: 'TR',
    labelRu: 'турецкий',
    speechLocale: 'tr-TR',
  },
}

export const getPhraseLanguageMeta = (language: PhraseLanguage) => {
  return languageMeta[language]
}

export const getSpeechLocaleByLanguage = (language: PhraseLanguage) => {
  return languageMeta[language].speechLocale
}
