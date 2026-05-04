import { useState } from 'react'
import type { GuestEmotion } from '../types/phrase'
import { getEmotionMeta } from '../utils/guestEmotion'

interface GuestLineProps {
  text: string
  hintRu: string
  emotion: GuestEmotion
  textClassName?: string
  hintClassName?: string
  containerClassName?: string
}

export default function GuestLine({
  text,
  hintRu,
  emotion,
  textClassName,
  hintClassName,
  containerClassName,
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

        <button
          type="button"
          onClick={() => setShowHint((previousState) => !previousState)}
          className="ml-auto rounded-full border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
          aria-label="Show Russian hint"
          title="Показать подсказку на русском"
        >
          💡
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
