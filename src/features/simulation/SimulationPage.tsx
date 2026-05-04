import { useMemo, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import CollapsibleFilters from '../../components/CollapsibleFilters'
import GuestLine from '../../components/GuestLine'
import SpeakIconButton from '../../components/SpeakIconButton'
import Button from '../../components/ui/Button'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import { getPhraseByGuestText } from '../../data/phrases'
import { dialogues } from '../../data/dialogues'
import { getScenarioLabelRu } from '../../utils/phraseMeta'
import { getSpeechLocaleByLanguage } from '../../utils/phraseLanguage'
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
			<div className="flex flex-wrap items-start justify-between gap-3">
				<h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
					<Balancer>Режим симуляции</Balancer>
				</h2>
				<p className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
					{getScenarioLabelRu(scenario.scenario)}
				</p>
			</div>

			<CollapsibleFilters
				storageKey={STORAGE_KEYS.simulationFiltersOpen}
				summary={`Текущий диалог: ${scenario.title}`}
			>
				<label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
					Сценарий диалога
					<select
						value={scenarioIndex}
						onChange={(event) => handleScenarioChange(Number(event.target.value))}
						className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-base text-slate-800 sm:w-auto"
					>
						{dialogues.map((dialogue, index) => (
							<option key={dialogue.id} value={index}>
								{dialogue.title}
							</option>
						))}
					</select>
				</label>
			</CollapsibleFilters>

			<div className="glass-card study-card rounded-2xl p-4 sm:p-5">
				<p className="readable-copy mb-4 text-lg font-semibold text-slate-900">{scenario.title}</p>

				<div className="space-y-3">
					{shownTurns.map((turn, index) => {
						const isGuest = turn.speaker === 'guest'

						return (
							<div
								key={`${turn.speaker}-${index}`}
								className={`max-w-[96%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[92%] ${
									isGuest
										? 'mr-auto bg-white/90 text-slate-900'
										: 'ml-auto bg-cyan-700 text-white'
								}`}
							>
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">
									{isGuest ? 'Гость' : 'Официант'}
								</p>
								{isGuest ? (
									<GuestMessage text={turn.text} />
								) : (
									<div className="mt-2 flex items-start gap-2">
										<p className="readable-copy text-lg font-semibold sm:text-xl">
											{turn.text}
										</p>
										<SpeakIconButton
											onSpeak={() => speak(turn.text, 'en-US')}
											label="Озвучить реплику официанта"
										/>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
				{!scenarioFinished ? (
					<Button
						onClick={nextTurn}
						tone="primary"
						fullOnMobile
					>
						Следующая реплика
					</Button>
				) : (
					<Button
						onClick={nextScenario}
						tone="primary"
						fullOnMobile
					>
						Следующий диалог
					</Button>
				)}

				<Button
					onClick={restartScenario}
					tone="secondary"
					fullOnMobile
				>
					Начать заново
				</Button>
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
		return (
			<div className="mt-2 flex items-start gap-2">
				<p className="readable-copy text-lg font-semibold sm:text-xl">{text}</p>
				<SpeakIconButton
					onSpeak={() => speak(text, 'en-US')}
					label="Озвучить реплику гостя"
				/>
			</div>
		)
	}

	return (
		<GuestLine
			text={text}
			hintRu={phrase.guestHintRu}
			emotion={phrase.guestEmotion}
			language={phrase.language}
			role={phrase.guestRole}
			onSpeak={() => speak(text, getSpeechLocaleByLanguage(phrase.language))}
			containerClassName="mt-2"
			textClassName="text-lg font-semibold text-slate-900 sm:text-xl"
			hintClassName="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900"
		/>
	)
}

