import { useCallback, useMemo, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import CollapsibleFilters from '../../components/CollapsibleFilters'
import Controls from '../../components/Controls'
import PhraseCard from '../../components/PhraseCard'
import Button from '../../components/ui/Button'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import { phraseLanguages, phrases, scenarios } from '../../data/phrases'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import type { PhraseLanguage, Scenario } from '../../types/phrase'
import type { PracticeProgressState } from '../../types/progress'
import { getScenarioLabelRu } from '../../utils/phraseMeta'
import {
	createInitialPracticeProgress,
	getNeedsReviewPhraseIds,
} from '../../utils/practiceProgress'

type LearnFilter = 'all' | Scenario
type LearnLanguageFilter = 'all' | PhraseLanguage

const languageLabels: Record<PhraseLanguage, string> = {
	en: 'Английский 🇬🇧',
	tr: 'Турецкий 🇹🇷',
}

const languageOptions: Array<{ value: LearnLanguageFilter; label: string }> = [
	{ value: 'all', label: 'Все языки' },
	...phraseLanguages.map((language) => ({
		value: language,
		label: languageLabels[language],
	})),
]

const filterOptions: Array<{ value: LearnFilter; label: string }> = [
	{ value: 'all', label: 'Все сценарии' },
	...scenarios.map((scenario) => ({
		value: scenario,
		label: getScenarioLabelRu(scenario),
	})),
]

export default function LearnPage() {
	const [activeFilter, setActiveFilter] = useState<LearnFilter>('all')
	const [randomPhraseId, setRandomPhraseId] = useState<number | null>(null)
	const [activeLanguage, setActiveLanguage] = useLocalStorageState<LearnLanguageFilter>(
		STORAGE_KEYS.learnLanguage,
		'all',
	)
	const [reviewOnly, setReviewOnly] = useLocalStorageState<boolean>(
		STORAGE_KEYS.learnReviewOnly,
		false,
	)
	const [progress] = useLocalStorageState<PracticeProgressState>(
		STORAGE_KEYS.practiceProgress,
		createInitialPracticeProgress,
	)

	const needsReviewIds = useMemo(() => {
		return getNeedsReviewPhraseIds(progress)
	}, [progress])

	const visiblePhrases = useMemo(() => {
		return phrases.filter((phrase) => {
			const scenarioMatches =
				activeFilter === 'all' || phrase.scenario === activeFilter
			const languageMatches =
				activeLanguage === 'all' || phrase.language === activeLanguage
			const reviewMatches = !reviewOnly || needsReviewIds.has(phrase.id)

			return scenarioMatches && languageMatches && reviewMatches
		})
	}, [activeFilter, activeLanguage, reviewOnly, needsReviewIds])

	const selectedLanguageLabel = useMemo(() => {
		return (
			languageOptions.find((option) => option.value === activeLanguage)?.label ??
			'Все языки'
		)
	}, [activeLanguage])

	const selectedScenarioLabel = useMemo(() => {
		return (
			filterOptions.find((option) => option.value === activeFilter)?.label ??
			'Все сценарии'
		)
	}, [activeFilter])

	const filtersSummary = `${selectedLanguageLabel} • ${selectedScenarioLabel} • ${
		reviewOnly ? 'Только на повтор' : 'Все фразы'
	}`

	const pickRandomPhrase = useCallback(() => {
		if (visiblePhrases.length === 0) {
			setRandomPhraseId(null)
			return
		}

		if (visiblePhrases.length === 1) {
			setRandomPhraseId(visiblePhrases[0].id)
			return
		}

		const availableIds = visiblePhrases
			.map((phrase) => phrase.id)
			.filter((id) => id !== randomPhraseId)
		const fallbackId = visiblePhrases[0].id
		const nextId =
			availableIds[Math.floor(Math.random() * availableIds.length)] ?? fallbackId

		setRandomPhraseId(nextId)
	}, [randomPhraseId, visiblePhrases])

	const isRandomMode = randomPhraseId !== null
	const randomPhrase = useMemo(() => {
		if (!isRandomMode) {
			return null
		}

		return (
			visiblePhrases.find((phrase) => phrase.id === randomPhraseId) ??
			visiblePhrases[0] ??
			null
		)
	}, [isRandomMode, randomPhraseId, visiblePhrases])

	const phrasesToRender = isRandomMode
		? randomPhrase
			? [randomPhrase]
			: []
		: visiblePhrases

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
					<Balancer>Режим изучения</Balancer>
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					<p className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
						{visiblePhrases.length} фраз
					</p>
					<Button
						onClick={pickRandomPhrase}
						tone="primary"
						size="sm"
						disabled={visiblePhrases.length === 0}
					>
						{isRandomMode ? 'Следующая случайная' : 'Случайная карточка'}
					</Button>
					{isRandomMode ? (
						<Button
							onClick={() => setRandomPhraseId(null)}
							tone="secondary"
							size="sm"
						>
							Показать список
						</Button>
					) : null}
				</div>
			</div>

			<CollapsibleFilters
				storageKey={STORAGE_KEYS.learnFiltersOpen}
				summary={filtersSummary}
			>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						Режим повторения
					</p>
					<Button
						onClick={() => setReviewOnly((previous) => !previous)}
						tone={reviewOnly ? 'warning' : 'secondary'}
						size="sm"
					>
						Только на повтор: {reviewOnly ? 'ВКЛ' : 'ВЫКЛ'}
					</Button>
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						Язык
					</p>
					<Controls
						label="Фильтр по языку фраз"
						options={languageOptions}
						value={activeLanguage}
						onChange={setActiveLanguage}
					/>
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						Сценарий
					</p>
					<Controls
						label="Фильтр по сценарию"
						options={filterOptions}
						value={activeFilter}
						onChange={setActiveFilter}
					/>
				</div>
			</CollapsibleFilters>

			<div className={isRandomMode ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
				{phrasesToRender.map((phrase) => (
					<PhraseCard key={phrase.id} phrase={phrase} />
				))}
			</div>
		</div>
	)
}

