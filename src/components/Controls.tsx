export interface ControlOption<T extends string | number> {
	value: T
	label: string
}

interface ControlsProps<T extends string | number> {
	label: string
	options: Array<ControlOption<T>>
	value: T
	onChange: (value: T) => void
}

export default function Controls<T extends string | number>({
	label,
	options,
	value,
	onChange,
}: ControlsProps<T>) {
	return (
		<div className="flex flex-wrap items-center gap-2" aria-label={label}>
			{options.map((option) => {
				const active = option.value === value

				return (
					<button
						key={String(option.value)}
						type="button"
						onClick={() => onChange(option.value)}
						className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
							active
								? 'border-cyan-600 bg-cyan-600 text-white'
								: 'border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700'
						}`}
					>
						{option.label}
					</button>
				)
			})}
		</div>
	)
}

