import { FiVolume2 } from 'react-icons/fi'
import Button from './ui/Button'

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
    <Button
      onClick={onSpeak}
      aria-label={label}
      title={label}
      size="icon"
      tone="secondary"
      className={className ?? 'h-8 w-8'}
    >
      <FiVolume2 className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
