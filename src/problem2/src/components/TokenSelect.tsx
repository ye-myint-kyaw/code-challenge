import type { Token } from '../types'
import { formatUsdPrice } from '../utils/formatters'

interface TokenSelectProps {
  label: string
  tokens: Token[]
  value: string
  onChange: (symbol: string) => void
}

export function TokenSelect({ label, tokens, value, onChange }: TokenSelectProps) {
  const selectedToken = tokens.find((token) => token.symbol === value) ?? tokens[0]

  return (
    <label className="flex min-w-[150px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-[var(--text-strong)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] max-sm:w-full">
      <span className="sr-only">{label}</span>
      {selectedToken ? (
        <img
          key={selectedToken.symbol}
          className="size-[30px] shrink-0 rounded-full"
          src={selectedToken.iconUrl}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
      <select
        className="w-fit border-0 bg-transparent font-extrabold text-[var(--text-strong)] focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none max-sm:w-full max-sm:max-w-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {tokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbol} - {formatUsdPrice(token.price)}
          </option>
        ))}
      </select>
    </label>
  )
}
