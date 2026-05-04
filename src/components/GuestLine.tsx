import { useState } from 'react'
import type { GuestEmotion, PhraseLanguage } from '../types/phrase'
import { getGuestRoleLabelRu } from '../utils/guestRole'
import { getEmotionMeta } from '../utils/guestEmotion'
import { getPhraseLanguageMeta } from '../utils/phraseLanguage'
import SpeakIconButton from './SpeakIconButton'

interface GuestLineProps {
  text: string
  hintRu: string
  emotion: GuestEmotion
  language?: PhraseLanguage
  role?: string
  textClassName?: string
  hintClassName?: string
  containerClassName?: string
  onSpeak?: () => void
}

export default function GuestLine({
  text,
  hintRu,
  emotion,
  language,
  role,
  textClassName,
  hintClassName,
  containerClassName,
  onSpeak,
}: GuestLineProps) {
  const [showHint, setShowHint] = useState(false)
  const emotionView = getEmotionMeta(emotion)
  const languageView = language ? getPhraseLanguageMeta(language) : null
  const roleLabel = role ? getGuestRoleLabelRu(role) : null

  return (
    <div className={containerClassName}>
      {roleLabel ? (
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
          Клиент обращается к: {roleLabel}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <button
            type="button"
            onClick={() => setShowHint((previousState) => !previousState)}
            aria-label={
              showHint
                ? 'Скрыть перевод реплики клиента'
                : 'Показать перевод реплики клиента'
            }
            title={
              showHint
                ? 'Скрыть перевод реплики клиента'
                : 'Показать перевод реплики клиента'
            }
            className={`readable-copy min-w-0 flex-1 ${
              textClassName ?? 'text-xl font-bold text-slate-900 sm:text-2xl'
            } cursor-pointer text-left transition hover:text-slate-700`}
          >
            {text}
          </button>

          {onSpeak ? (
            <SpeakIconButton
              onSpeak={onSpeak}
              label="Озвучить фразу гостя"
              className="h-8 w-8"
            />
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          {languageView ? (
            <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
              {languageView.flag} {languageView.code}
            </span>
          ) : null}

          <span className="text-2xl leading-none" aria-hidden="true">
            {emotionView.emoji}
          </span>
        </div>
      </div>

      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Тон клиента: {emotionView.labelRu}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Нажмите на реплику клиента, чтобы показать или скрыть перевод.
      </p>

      {showHint ? (
        <p
          className={
            hintClassName ??
            'readable-copy mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900'
          }
        >
          RU: {hintRu}
        </p>
      ) : null}
    </div>
  )
}
