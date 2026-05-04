import { FiVolume2 } from 'react-icons/fi'

interface SpeakIconButtonProps {
  onSpeak: () => void
  label: string
  className?: string
}

export default function SpeakIconButton({
  onSpeak,
  label,
  className,
}: SpeakIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onSpeak}
      aria-label={label}
      title={label}
      className={
        className ??
        'inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700'
      }
    >
      <FiVolume2 className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
