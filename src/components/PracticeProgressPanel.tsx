import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import type { PracticeProgressState } from '../types/progress'
import Button from './ui/Button'

interface PracticeProgressPanelProps {
  progress: PracticeProgressState
  confidenceRate: number
  needsReviewPhrases: number
  onResetProgress: () => void
}

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

const formatDateTime = (iso: string | null): string => {
  if (!iso) {
    return 'Тренировок пока не было'
  }

  return new Date(iso).toLocaleString('ru-RU')
}

export default function PracticeProgressPanel({
  progress,
  confidenceRate,
  needsReviewPhrases,
  onResetProgress,
}: PracticeProgressPanelProps) {
  const [isOpen, setIsOpen] = useLocalStorageState<boolean>(
    STORAGE_KEYS.practiceProgressOpen,
    false,
    { validate: isBoolean },
  )

  return (
    <section className="glass-card rounded-2xl border-emerald-200/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          onClick={() => setIsOpen((previousState) => !previousState)}
          tone="secondary"
          size="sm"
          className="w-full justify-between sm:w-auto"
          aria-expanded={isOpen}
        >
          Ваш прогресс (сохраняется автоматически)
          {isOpen ? (
            <FiChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <FiChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>

        {isOpen ? (
          <Button
            onClick={onResetProgress}
            tone="soft"
            size="sm"
          >
            Сбросить прогресс
          </Button>
        ) : null}
      </div>

      {isOpen ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
            <MetricCard label="Просмотрено" value={progress.totalSeen} />
            <MetricCard label="Уверенно" value={progress.totalConfident} />
            <MetricCard label="На повтор" value={needsReviewPhrases} />
            <MetricCard label="Уверенность" value={`${confidenceRate}%`} />
            <MetricCard label="Серия" value={progress.currentStreak} />
          </div>

          <p className="mt-3 text-xs font-medium text-emerald-900/80">
            Лучшая серия: {progress.bestStreak}. Последняя тренировка: {formatDateTime(progress.lastTrainedAt)}
          </p>
        </>
      ) : null}
    </section>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-emerald-900">{value}</p>
    </div>
  )
}
