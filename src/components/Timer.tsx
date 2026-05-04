interface TimerProps {
	secondsLeft: number
	totalSeconds: number
	isRevealed: boolean
}

export default function Timer({
	secondsLeft,
	totalSeconds,
	isRevealed,
}: TimerProps) {
	const progress = isRevealed
		? 100
		: ((totalSeconds - secondsLeft) / totalSeconds) * 100

	return (
		<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
			<div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
				<span>{isRevealed ? 'Answer is visible' : 'Auto reveal in'}</span>
				<span>{isRevealed ? '0s' : `${secondsLeft}s`}</span>
			</div>

			<progress
				className="h-2 w-full overflow-hidden rounded-full bg-slate-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-cyan-600 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-cyan-600"
				value={Math.min(100, Math.max(0, progress))}
				max={100}
			/>
		</div>
	)
}

