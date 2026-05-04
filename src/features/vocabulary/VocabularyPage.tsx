import { Fragment, useCallback, useMemo, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import {
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiShuffle,
} from 'react-icons/fi'
import Button from '../../components/ui/Button'
import { vocabularyEntries } from '../../data/phrases'
import { getScenarioLabelRu } from '../../utils/phraseMeta'

type VocabularyLanguageFilter = 'all' | 'en' | 'tr'

const languageFilterOptions: Array<{
  value: VocabularyLanguageFilter
  label: string
}> = [
  { value: 'all', label: 'Все языки' },
  { value: 'en', label: 'EN -> RU/TR' },
  { value: 'tr', label: 'TR -> RU' },
]

const sourceLanguageLabels: Record<'en' | 'tr', string> = {
  en: 'Английский',
  tr: 'Турецкий',
}

export default function VocabularyPage() {
  const [languageFilter, setLanguageFilter] =
    useState<VocabularyLanguageFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  const [randomEntryId, setRandomEntryId] = useState<string | null>(null)

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return vocabularyEntries.filter((entry) => {
      const languageMatches =
        languageFilter === 'all' || entry.sourceLanguage === languageFilter

      if (!languageMatches) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      return (
        entry.term.toLowerCase().includes(normalizedSearch) ||
        entry.translationRu.toLowerCase().includes(normalizedSearch) ||
        entry.translationTr.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [languageFilter, searchQuery])

  const randomEntry = useMemo(() => {
    if (!randomEntryId) {
      return null
    }

    return (
      filteredEntries.find((entry) => entry.id === randomEntryId) ??
      filteredEntries[0] ??
      null
    )
  }, [filteredEntries, randomEntryId])

  const highlightedEntryId = randomEntry?.id ?? null

  const pickRandomWord = useCallback(() => {
    if (filteredEntries.length === 0) {
      setRandomEntryId(null)
      setExpandedEntryId(null)
      return
    }

    if (filteredEntries.length === 1) {
      const singleEntry = filteredEntries[0]
      setRandomEntryId(singleEntry.id)
      setExpandedEntryId(singleEntry.id)
      return
    }

    const candidateEntries = filteredEntries.filter(
      (entry) => entry.id !== highlightedEntryId,
    )
    const fallbackEntry = filteredEntries[0]
    const nextEntry =
      candidateEntries[Math.floor(Math.random() * candidateEntries.length)] ??
      fallbackEntry

    setRandomEntryId(nextEntry.id)
    setExpandedEntryId(nextEntry.id)
  }, [filteredEntries, highlightedEntryId])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            <Balancer>Словарь</Balancer>
          </h2>
          <p className="readable-copy mt-1 text-sm text-slate-600 sm:text-base">
            Таблица слов и коротких фраз, собранная автоматически из ваших JSON.
            Нажмите на строку, чтобы раскрыть перевод на русский и турецкий.
          </p>
        </div>

        <p className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
          {filteredEntries.length} записей
        </p>
      </div>

      <section className="glass-card study-card rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {languageFilterOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setLanguageFilter(option.value)}
              tone={languageFilter === option.value ? 'primary' : 'secondary'}
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>

        <label className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2">
          <FiSearch className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Поиск: apple, merhaba, яблоко..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
          />
        </label>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <Button
            onClick={pickRandomWord}
            tone="primary"
            fullOnMobile
            disabled={filteredEntries.length === 0}
          >
            <FiShuffle className="h-4 w-4" aria-hidden="true" />
            Случайное слово
          </Button>

          <Button
            onClick={pickRandomWord}
            tone="secondary"
            fullOnMobile
            disabled={filteredEntries.length < 2}
          >
            Следующее случайное
          </Button>
        </div>

        {randomEntry ? (
          <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
              Сейчас случайное
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">{randomEntry.term}</p>
            <p className="mt-1 text-sm text-slate-700">
              RU: <span className="font-medium">{randomEntry.translationRu}</span>
            </p>
            <p className="text-sm text-slate-700">
              TR: <span className="font-medium">{randomEntry.translationTr}</span>
            </p>
          </div>
        ) : null}
      </section>

      <section className="glass-card study-card overflow-hidden rounded-2xl p-2 sm:p-3">
        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl bg-white/70 p-5 text-center text-slate-600">
            По текущему фильтру ничего не найдено. Попробуйте сбросить поиск или
            выбрать Все языки.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-3 py-2">Слово</th>
                  <th className="px-3 py-2">Язык</th>
                  <th className="px-3 py-2">Сценарий</th>
                </tr>
              </thead>

              <tbody>
                {filteredEntries.map((entry) => {
                  const isExpanded = expandedEntryId === entry.id
                  const isRandom = highlightedEntryId === entry.id

                  return (
                    <Fragment key={entry.id}>
                      <tr
                        className={`align-top transition ${
                          isRandom
                            ? 'bg-cyan-50/80'
                            : isExpanded
                            ? 'bg-slate-100/80'
                            : 'hover:bg-white/70'
                        }`}
                      >
                        <td className="border-t border-slate-200/80 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedEntryId((previousId) =>
                                previousId === entry.id ? null : entry.id,
                              )
                            }}
                            className="flex w-full items-center justify-between gap-2 text-left"
                          >
                            <span className="font-semibold text-slate-900">
                              {entry.term}
                            </span>
                            {isExpanded ? (
                              <FiChevronUp
                                className="h-4 w-4 shrink-0 text-slate-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <FiChevronDown
                                className="h-4 w-4 shrink-0 text-slate-500"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </td>

                        <td className="border-t border-slate-200/80 px-3 py-2 text-sm text-slate-700">
                          <span className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-semibold">
                            {sourceLanguageLabels[entry.sourceLanguage]}
                          </span>
                        </td>

                        <td className="border-t border-slate-200/80 px-3 py-2 text-sm font-medium text-slate-700">
                          {getScenarioLabelRu(entry.scenario)}
                        </td>
                      </tr>

                      {isExpanded ? (
                        <tr>
                          <td colSpan={3} className="border-t border-slate-200/60 px-3 pb-3 pt-1">
                            <div className="rounded-xl border border-cyan-100 bg-white/80 p-3">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Русский
                                  </p>
                                  <p className="readable-copy mt-1 text-sm font-medium text-slate-800">
                                    {entry.translationRu}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Турецкий
                                  </p>
                                  <p className="readable-copy mt-1 text-sm font-medium text-slate-800">
                                    {entry.translationTr}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
