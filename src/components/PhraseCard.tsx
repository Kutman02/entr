import type { Phrase } from '../types/phrase'
import { getLevelLabelRu, getScenarioLabelRu } from '../utils/phraseMeta'
import { getSpeechLocaleByLanguage } from '../utils/phraseLanguage'
import { speak } from '../utils/speech'
import GuestLine from './GuestLine'
import SpeakIconButton from './SpeakIconButton'

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
	const speechLocale = getSpeechLocaleByLanguage(phrase.language)
	const secondaryTranslationLabel = phrase.language === 'tr' ? 'EN' : 'TR'
	const secondaryTranslations =
		phrase.language === 'tr'
			? (phrase.translations.en ?? phrase.translations.tr)
			: phrase.translations.tr

	return (
		<article className="glass-card study-card rounded-2xl p-4 sm:p-5">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
						{getScenarioLabelRu(phrase.scenario)}
					</p>
					<span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
						{getLevelLabelRu(phrase.level)}
					</span>
				</div>

				<span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-700">
					Карточка
				</span>
			</div>

			<div className="mt-3 space-y-2">
				<p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
					Клиент говорит вам
				</p>
				<GuestLine
					text={phrase.guest}
					hintRu={phrase.guestHintRu}
					emotion={phrase.guestEmotion}
					language={phrase.language}
					role={phrase.guestRole}
					textClassName="readable-copy text-xl font-bold text-slate-900 sm:text-2xl"
					onSpeak={() => speak(phrase.guest, speechLocale)}
				/>
			</div>

			<div className="mt-4 space-y-2">
				<p className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700">
					Ваш ответ клиенту
				</p>
				<div className="flex items-start gap-2">
					<p className="readable-copy text-lg font-semibold text-slate-900 sm:text-xl">
						{primaryAnswer}
					</p>
					<SpeakIconButton
						onSpeak={() => speak(primaryAnswer, speechLocale)}
						label="Озвучить фразу официанта"
					/>
				</div>

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
				<div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600">
					<p>
						RU:{' '}
						<span className="font-medium text-slate-800">
							{phrase.translations.ru.join(' / ')}
						</span>
					</p>
					<p>
						{secondaryTranslationLabel}:{' '}
						<span className="font-medium text-slate-800">
							{secondaryTranslations.join(' / ')}
						</span>
					</p>
				</div>
			) : null}
		</article>
	)
}

