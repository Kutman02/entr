import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type ButtonTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'soft'
  | 'danger'

type ButtonSize = 'sm' | 'md' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ButtonTone
  size?: ButtonSize
  fullOnMobile?: boolean
}

const toneClasses: Record<ButtonTone, string> = {
  primary:
    'border-cyan-600 bg-cyan-600 text-white hover:border-cyan-700 hover:bg-cyan-700',
  secondary:
    'border-slate-300 bg-white/80 text-slate-700 hover:border-cyan-400 hover:text-cyan-700',
  success:
    'border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700',
  warning:
    'border-amber-500 bg-amber-500 text-white hover:border-amber-600 hover:bg-amber-600',
  soft:
    'border-emerald-300 bg-emerald-50/90 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100',
  danger:
    'border-rose-500 bg-rose-500 text-white hover:border-rose-600 hover:bg-rose-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-xs sm:text-sm',
  md: 'min-h-10 px-4 text-sm',
  icon: 'h-9 w-9 p-0 text-sm',
}

export default function Button({
  tone = 'secondary',
  size = 'md',
  fullOnMobile = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-semibold tracking-[0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
        toneClasses[tone],
        sizeClasses[size],
        fullOnMobile ? 'w-full sm:w-auto' : null,
        className,
      )}
      {...props}
    />
  )
}
