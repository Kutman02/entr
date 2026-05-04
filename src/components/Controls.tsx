import Button from './ui/Button'

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
		<div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap" aria-label={label}>
			{options.map((option) => {
				const active = option.value === value

				return (
					<Button
						key={String(option.value)}
						onClick={() => onChange(option.value)}
						tone={active ? 'primary' : 'secondary'}
						size="md"
						fullOnMobile
						className="justify-center"
					>
						{option.label}
					</Button>
				)
			})}
		</div>
	)
}

