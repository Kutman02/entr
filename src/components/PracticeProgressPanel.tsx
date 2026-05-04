import type { PracticeProgressState } from '../types/progress'

interface PracticeProgressPanelProps {
  progress: PracticeProgressState
  confidenceRate: number
  needsReviewPhrases: number
  onResetProgress: () => void
}

const formatDateTime = (iso: string | null): string => {
  if (!iso) {
    return 'No training yet'
  }

  return new Date(iso).toLocaleString()
}

export default function PracticeProgressPanel({
  progress,
  confidenceRate,
  needsReviewPhrases,
  onResetProgress,
}: PracticeProgressPanelProps) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-emerald-900">Your progress (auto-saved)</h3>
        <button
          type="button"
          onClick={onResetProgress}
          className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          Reset progress
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
        <MetricCard label="Seen" value={progress.totalSeen} />
        <MetricCard label="Confident" value={progress.totalConfident} />
        <MetricCard label="Need review" value={needsReviewPhrases} />
        <MetricCard label="Confidence" value={`${confidenceRate}%`} />
        <MetricCard label="Streak" value={progress.currentStreak} />
      </div>

      <p className="mt-3 text-xs font-medium text-emerald-900/80">
        Best streak: {progress.bestStreak}. Last training: {formatDateTime(progress.lastTrainedAt)}
      </p>
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
