import { useMemo, useState } from 'react'
import Controls from '../../components/Controls'
import PhraseCard from '../../components/PhraseCard'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import { phrases, scenarios } from '../../data/phrases'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import type { Scenario } from '../../types/phrase'
import type { PracticeProgressState } from '../../types/progress'
import {
	createInitialPracticeProgress,
	getNeedsReviewPhraseIds,
} from '../../utils/practiceProgress'
import { speak } from '../../utils/speech'

type LearnFilter = 'all' | Scenario

const filterOptions: Array<{ value: LearnFilter; label: string }> = [
	{ value: 'all', label: 'All' },
	...scenarios.map((scenario) => ({
		value: scenario,
		label: scenario,
	})),
]

export default function LearnPage() {
	const [activeFilter, setActiveFilter] = useState<LearnFilter>('all')
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
			const reviewMatches = !reviewOnly || needsReviewIds.has(phrase.id)

			return scenarioMatches && reviewMatches
		})
	}, [activeFilter, reviewOnly, needsReviewIds])

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Learn Mode</h2>
				<div className="flex flex-wrap items-center gap-2">
					<p className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
						{visiblePhrases.length} phrases
					</p>
					<button
						type="button"
						onClick={() => setReviewOnly((previous) => !previous)}
						className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
							reviewOnly
								? 'border-amber-500 bg-amber-500 text-white'
								: 'border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:text-amber-700'
						}`}
					>
						Review only {reviewOnly ? 'ON' : 'OFF'}
					</button>
				</div>
			</div>

			<Controls
				label="Filter phrase scenario"
				options={filterOptions}
				value={activeFilter}
				onChange={setActiveFilter}
			/>

			<div className="grid gap-4 sm:grid-cols-2">
				{visiblePhrases.map((phrase) => (
					<div key={phrase.id} className="space-y-2">
						<PhraseCard phrase={phrase} />

						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => speak(phrase.guest, 'en-US')}
								className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
							>
								Play Guest
							</button>
							<button
								type="button"
								onClick={() => speak(phrase.answers[0] ?? '', 'en-US')}
								className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
							>
								Play Waiter
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

