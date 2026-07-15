export function LoadingState() {
  return (
    <div className="grid gap-3.5 p-7 max-sm:p-5" role="status">
      <div className="h-[18px] w-5/12 overflow-hidden rounded-lg bg-[var(--surface-soft)] after:block after:h-full after:w-5/12 after:animate-[shimmer_1.2s_infinite] after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent" />
      <div className="h-[104px] overflow-hidden rounded-lg bg-[var(--surface-soft)] after:block after:h-full after:w-5/12 after:animate-[shimmer_1.2s_infinite] after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent" />
      <div className="h-16 overflow-hidden rounded-lg bg-[var(--surface-soft)] after:block after:h-full after:w-5/12 after:animate-[shimmer_1.2s_infinite] after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent" />
    </div>
  )
}
