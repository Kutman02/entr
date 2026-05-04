import type { Phrase } from '../types/phrase'
import GuestLine from './GuestLine'

interface PhraseCardProps {
	phrase: Phrase
	showTranslations?: boolean
}

export default function PhraseCard({
	phrase,
	showTranslations = true,
}: PhraseCardProps) {
	const primaryAnswer = phrase.answers[0] ?? ''
	const alternativeAnswers = phrase.answers.slice(1)

	return (
		<article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
			<div className="flex flex-wrap items-center gap-2">
				<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
					{phrase.scenario}
				</p>
				<span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
					{phrase.level}
				</span>
			</div>

			<div className="mt-3 space-y-2">
				<p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
					Guest
				</p>
				<GuestLine
					text={phrase.guest}
					hintRu={phrase.guestHintRu}
					emotion={phrase.guestEmotion}
					textClassName="text-2xl font-bold text-slate-900"
				/>
			</div>

			<div className="mt-4 space-y-2">
				<p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700">
					Waiter
				</p>
				<p className="text-xl font-semibold text-slate-900">{primaryAnswer}</p>

				{alternativeAnswers.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{alternativeAnswers.map((answer) => (
							<span
								key={answer}
								className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800"
							>
								{answer}
							</span>
						))}
					</div>
				) : null}
			</div>

			{showTranslations ? (
				<div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
					<p>
						RU:{' '}
						<span className="font-medium text-slate-800">
							{phrase.translations.ru.join(' / ')}
						</span>
					</p>
					<p>
						TR:{' '}
						<span className="font-medium text-slate-800">
							{phrase.translations.tr.join(' / ')}
						</span>
					</p>
				</div>
			) : null}
		</article>
	)
}

