import { useMemo, useState } from 'react'
import type { Token } from '../types'
import { formatRate, formatUsdPrice } from '../utils/formatters'
import { TokenSelect } from './TokenSelect'

interface RatesTabProps {
  tokens: Token[]
}

const POPULAR_QUOTES = ['USD', 'USDC', 'WBTC', 'ETH', 'ATOM', 'OSMO', 'SWTH', 'GMX']

export function RatesTab({ tokens }: RatesTabProps) {
  const [baseSymbol, setBaseSymbol] = useState(findToken(tokens, 'USD')?.symbol ?? tokens[0]?.symbol ?? '')
  const [quoteSymbol, setQuoteSymbol] = useState(findToken(tokens, 'ETH')?.symbol ?? tokens[1]?.symbol ?? '')
  const baseToken = findToken(tokens, baseSymbol) ?? tokens[0]
  const quoteToken = findToken(tokens, quoteSymbol) ?? tokens[1] ?? tokens[0]

  const rows = useMemo(() => {
    if (!baseToken) {
      return []
    }

    const popularRows = POPULAR_QUOTES.map((symbol) => findToken(tokens, symbol)).filter(
      (token): token is Token => token !== undefined && token.symbol !== baseToken.symbol,
    )
    const fallbackRows = tokens.filter(
      (token) => token.symbol !== baseToken.symbol && !popularRows.some((row) => row.symbol === token.symbol),
    )

    return [...popularRows, ...fallbackRows].slice(0, 8)
  }, [baseToken, tokens])

  if (!baseToken || !quoteToken) {
    return <p className="p-7 text-[var(--text-muted)]">No priced tokens available.</p>
  }

  return (
    <section className="animate-[panel-in_220ms_ease_both] p-5 max-sm:p-3">
      <div className="grid grid-cols-2 items-end gap-3 max-sm:grid-cols-1">
        <div>
          <span className="mb-2 block text-sm font-extrabold text-[var(--text-muted)]">Base</span>
          <TokenSelect label="Base token" tokens={tokens} value={baseToken.symbol} onChange={setBaseSymbol} />
        </div>
        <div>
          <span className="mb-2 block text-sm font-extrabold text-[var(--text-muted)]">Quote</span>
          <TokenSelect label="Quote token" tokens={tokens} value={quoteToken.symbol} onChange={setQuoteSymbol} />
        </div>
      </div>

      <div className="my-4 grid gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[linear-gradient(135deg,var(--accent-soft),transparent_60%),var(--field-bg)] p-[18px]">
        <span className="text-[var(--text-muted)]">1 {baseToken.symbol}</span>
        <strong className="text-3xl leading-tight text-[var(--text-strong)]">
          {formatRate(baseToken.price / quoteToken.price)} {quoteToken.symbol}
        </strong>
        <small className="text-[var(--text-muted)]">{formatUsdPrice(baseToken.price)} USD reference price</small>
      </div>

      <table className="w-full overflow-hidden rounded-lg border border-separate border-spacing-0 border-[var(--border)]">
        <thead>
          <tr>
            <th
              className="bg-[var(--surface-soft)] px-3.5 py-3 text-left text-xs font-black text-[var(--text-muted)] uppercase"
              scope="col"
            >
              Market
            </th>
            <th
              className="bg-[var(--surface-soft)] px-3.5 py-3 text-right text-xs font-black text-[var(--text-muted)] uppercase"
              scope="col"
            >
              Rate
            </th>
            <th
              className="bg-[var(--surface-soft)] px-3.5 py-3 text-right text-xs font-black text-[var(--text-muted)] uppercase max-sm:hidden"
              scope="col"
            >
              USD
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((token) => (
            <tr key={token.symbol}>
              <th
                className="border-t border-[var(--border)] px-3.5 py-3 text-left text-sm font-medium text-[var(--text)]"
                scope="row"
              >
                <span className="flex items-center gap-2 font-extrabold text-[var(--text-strong)]">
                  <img
                    className="size-[26px] rounded-full"
                    src={token.iconUrl}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                  {token.symbol}
                </span>
              </th>
              <td className="border-t border-[var(--border)] px-3.5 py-3 text-right text-sm font-medium text-[var(--text)]">
                {formatRate(baseToken.price / token.price)} {token.symbol}
              </td>
              <td className="border-t border-[var(--border)] px-3.5 py-3 text-right text-sm font-medium text-[var(--text)] max-sm:hidden">
                {formatUsdPrice(token.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function findToken(tokens: Token[], symbol: string) {
  return tokens.find((token) => token.symbol.toUpperCase() === symbol.toUpperCase())
}
