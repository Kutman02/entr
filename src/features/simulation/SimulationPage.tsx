import { useMemo, useState } from 'react'
import GuestLine from '../../components/GuestLine'
import { getPhraseByGuestText } from '../../data/phrases'
import { dialogues } from '../../data/dialogues'
import { speak } from '../../utils/speech'

export default function SimulationPage() {
	const [scenarioIndex, setScenarioIndex] = useState(0)
	const [turnIndex, setTurnIndex] = useState(0)

	const scenario = dialogues[scenarioIndex]
	const shownTurns = useMemo(() => {
		return scenario.turns.slice(0, turnIndex + 1)
	}, [scenario, turnIndex])

	const scenarioFinished = turnIndex >= scenario.turns.length - 1

	const handleScenarioChange = (nextIndex: number) => {
		setScenarioIndex(nextIndex)
		setTurnIndex(0)
	}

	const nextTurn = () => {
		if (!scenarioFinished) {
			setTurnIndex((previousTurnIndex) => previousTurnIndex + 1)
		}
	}

	const nextScenario = () => {
		setScenarioIndex((previousScenarioIndex) => {
			return (previousScenarioIndex + 1) % dialogues.length
		})
		setTurnIndex(0)
	}

	const restartScenario = () => {
		setTurnIndex(0)
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Simulation Mode</h2>
				<p className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
					{scenario.scenario}
				</p>
			</div>

			<label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
				Dialogue scenario
				<select
					value={scenarioIndex}
					onChange={(event) => handleScenarioChange(Number(event.target.value))}
					className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-800 sm:w-auto"
				>
					{dialogues.map((dialogue, index) => (
						<option key={dialogue.id} value={index}>
							{dialogue.title}
						</option>
					))}
				</select>
			</label>

			<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
				<p className="mb-4 text-lg font-semibold text-slate-900">{scenario.title}</p>

				<div className="space-y-3">
					{shownTurns.map((turn, index) => {
						const isGuest = turn.speaker === 'guest'

						return (
							<div
								key={`${turn.speaker}-${index}`}
								className={`max-w-[92%] rounded-2xl px-4 py-3 shadow-sm ${
									isGuest
										? 'mr-auto bg-white text-slate-900'
										: 'ml-auto bg-cyan-700 text-white'
								}`}
							>
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">
									{isGuest ? 'Guest' : 'Waiter'}
								</p>
								{isGuest ? (
									<GuestMessage text={turn.text} />
								) : (
									<p className="mt-2 text-lg font-semibold sm:text-xl">{turn.text}</p>
								)}

								<button
									type="button"
									onClick={() => speak(turn.text, 'en-US')}
									className={`mt-3 rounded-full border px-3 py-1 text-xs font-semibold transition ${
										isGuest
											? 'border-slate-300 bg-slate-100 text-slate-700 hover:border-cyan-400 hover:text-cyan-700'
											: 'border-cyan-200 bg-cyan-600 text-white hover:bg-cyan-500'
									}`}
								>
									Play line
								</button>
							</div>
						)
					})}
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{!scenarioFinished ? (
					<button
						type="button"
						onClick={nextTurn}
						className="rounded-full border border-cyan-600 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
					>
						Next line
					</button>
				) : (
					<button
						type="button"
						onClick={nextScenario}
						className="rounded-full border border-cyan-600 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
					>
						Next dialogue
					</button>
				)}

				<button
					type="button"
					onClick={restartScenario}
					className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
				>
					Restart dialogue
				</button>
			</div>
		</div>
	)
}

interface GuestMessageProps {
	text: string
}

function GuestMessage({ text }: GuestMessageProps) {
	const phrase = getPhraseByGuestText(text)

	if (!phrase) {
		return <p className="mt-2 text-lg font-semibold sm:text-xl">{text}</p>
	}

	return (
		<GuestLine
			text={text}
			hintRu={phrase.guestHintRu}
			emotion={phrase.guestEmotion}
			containerClassName="mt-2"
			textClassName="text-lg font-semibold text-slate-900 sm:text-xl"
			hintClassName="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900"
		/>
	)
}

