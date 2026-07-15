interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="grid gap-3.5 p-7 max-sm:p-5" role="alert">
      <p className="m-0 font-black text-[var(--text-strong)]">Could not load token prices.</p>
      <p className="m-0 text-[var(--text-muted)]">{message}</p>
      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface-strong)] px-5 font-black text-[var(--accent-strong)] transition hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  )
}
