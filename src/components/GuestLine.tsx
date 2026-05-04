import { useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import type { GuestEmotion } from '../types/phrase'
import { getEmotionMeta } from '../utils/guestEmotion'
import SpeakIconButton from './SpeakIconButton'

interface GuestLineProps {
  text: string
  hintRu: string
  emotion: GuestEmotion
  textClassName?: string
  hintClassName?: string
  containerClassName?: string
  onSpeak?: () => void
}

export default function GuestLine({
  text,
  hintRu,
  emotion,
  textClassName,
  hintClassName,
  containerClassName,
  onSpeak,
}: GuestLineProps) {
  const [showHint, setShowHint] = useState(false)
  const emotionView = getEmotionMeta(emotion)

  return (
    <div className={containerClassName}>
      <div className="flex items-start gap-2">
        <span className="text-2xl leading-none" aria-hidden="true">
          {emotionView.emoji}
        </span>

        <p className={textClassName ?? 'text-2xl font-bold text-slate-900'}>{text}</p>

        {onSpeak ? (
          <SpeakIconButton
            onSpeak={onSpeak}
            label="Play guest phrase"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
          />
        ) : null}

        <button
          type="button"
          onClick={() => setShowHint((previousState) => !previousState)}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-800 transition hover:bg-amber-200"
          aria-label="Show Russian hint"
          title="Показать подсказку на русском"
        >
          <FiInfo className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Тон клиента: {emotionView.labelRu}
      </p>

      {showHint ? (
        <p
          className={
            hintClassName ??
            'mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900'
          }
        >
          RU: {hintRu}
        </p>
      ) : null}
    </div>
  )
}
