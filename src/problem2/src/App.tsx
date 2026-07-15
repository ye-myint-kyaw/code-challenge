import { useState } from 'react'
import { ErrorState } from './components/ErrorState'
import { Header } from './components/Header'
import { LoadingState } from './components/LoadingState'
import { RatesTab } from './components/RatesTab'
import { SwapTab } from './components/SwapTab'
import { Toolbar } from './components/Toolbar'
import { useTheme } from './hooks/useTheme'
import { useTokens } from './hooks/useTokens'
import type { Tab } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('swap')
  const { theme, toggleTheme } = useTheme()
  const { tokens, isLoading, error, reload } = useTokens()

  return (
    <main className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-[linear-gradient(120deg,rgba(139,53,246,0.16),transparent_32%),linear-gradient(240deg,rgba(20,184,166,0.11),transparent_34%),var(--page-bg)] px-5 py-8 text-[var(--text-strong)] max-sm:px-3 max-sm:py-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
      />

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <section className="w-full max-w-[560px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-2xl">
        <Toolbar activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading && tokens.length === 0 ? (
          <LoadingState />
        ) : error && tokens.length === 0 ? (
          <ErrorState message={error} onRetry={reload} />
        ) : activeTab === 'swap' ? (
          <SwapTab tokens={tokens} />
        ) : (
          <RatesTab tokens={tokens} />
        )}
      </section>
    </main>
  )
}

export default App
