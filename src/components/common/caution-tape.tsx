import { cn, tv } from '@/lib/styling'

const cautionTapeVariants = tv({
  slots: {
    root: 'pointer-events-none select-none shadow-md',
    stripes:
      'bg-[repeating-linear-gradient(-45deg,theme(colors.neutral.900)_0_6px,theme(colors.amber.400)_6px_12px)]',
    band: 'overflow-hidden whitespace-nowrap bg-amber-400 text-center font-bold uppercase text-neutral-900',
  },
  variants: {
    size: {
      sm: { stripes: 'h-1.5', band: 'py-1 text-[10px] tracking-[0.25em]' },
      lg: {
        stripes: 'h-2.5',
        band: 'py-2 text-sm tracking-[0.3em] sm:text-base',
      },
    },
  },
  defaultVariants: { size: 'sm' },
})

interface CautionTapeProps {
  label: string
  size?: 'sm' | 'lg'
  // how many times the label repeats along the band
  repeat?: number
  className?: string
}

export function CautionTape({
  label,
  size,
  repeat = 1,
  className,
}: CautionTapeProps) {
  const { root, stripes, band } = cautionTapeVariants({ size })
  return (
    <div className={cn(root(), className)}>
      <div className={stripes()} />
      <div className={band()}>
        {Array.from({ length: repeat }, () => label).join('  •  ')}
      </div>
      <div className={stripes()} />
    </div>
  )
}
