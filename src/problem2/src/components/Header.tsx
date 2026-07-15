import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../types'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="mb-7 flex w-full max-w-[960px] items-center justify-between gap-4 max-sm:items-start">
      <div className="flex items-center gap-3.5">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase text-[var(--accent-strong)]">Fancy Form</p>
          <h1 className="text-4xl leading-none font-bold text-[var(--text-strong)] max-sm:text-3xl">Currency Swap</h1>
        </div>
      </div>

      <button
        type="button"
        className="grid size-11 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-strong)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)] focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
      </button>
    </header>
  )
}
