import type { Tab } from '../types'

interface ToolbarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function Toolbar({ activeTab, onTabChange }: ToolbarProps) {
  return (
    <div className="border-b border-[var(--border)] p-3.5 max-sm:p-3">
      <div
        className="grid grid-cols-2 gap-1 rounded-lg border border-[var(--border)] bg-[var(--field-bg)] p-1"
        role="tablist"
        aria-label="Currency tools"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'swap'}
          className={`min-h-10 rounded-md border-0 font-extrabold transition focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none ${
            activeTab === 'swap'
              ? 'bg-linear-to-br from-[var(--accent)] to-[var(--accent-strong)] text-white shadow-[0_8px_24px_rgba(139,53,246,0.26)]'
              : 'bg-transparent text-[var(--text)]'
          }`}
          onClick={() => onTabChange('swap')}
        >
          Swap
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'rates'}
          className={`min-h-10 rounded-md border-0 font-extrabold transition focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none ${
            activeTab === 'rates'
              ? 'bg-linear-to-br from-[var(--accent)] to-[var(--accent-strong)] text-white shadow-[0_8px_24px_rgba(139,53,246,0.26)]'
              : 'bg-transparent text-[var(--text)]'
          }`}
          onClick={() => onTabChange('rates')}
        >
          Rates
        </button>
      </div>
    </div>
  )
}
