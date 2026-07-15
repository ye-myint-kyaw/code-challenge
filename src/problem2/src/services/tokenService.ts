import type { Token } from '../types'

const DEFAULT_TOKEN_API_URL = 'https://interview.switcheo.com/prices.json'
const DEFAULT_TOKEN_IMAGE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'

const PRIORITY_SYMBOLS = [
  'USD',
  'USDC',
  'BUSD',
  'WBTC',
  'ETH',
  'wstETH',
  'ATOM',
  'OSMO',
  'SWTH',
  'GMX',
  'OKB',
  'KUJI',
]

interface CandidateToken {
  symbol: string
  price: number
  date: string
  timestamp: number
  sourceIndex: number
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getTokenApiUrl() {
  return import.meta.env.VITE_TOKEN_API_URL || DEFAULT_TOKEN_API_URL
}

function getTokenImageBaseUrl() {
  return import.meta.env.VITE_TOKEN_IMAGE_URL || DEFAULT_TOKEN_IMAGE_URL
}

export function getTokenIconUrl(symbol: string) {
  return `${getTokenImageBaseUrl().replace(/\/$/, '')}/${encodeURIComponent(symbol)}.svg`
}

export function normalizeTokenPrices(data: unknown): Token[] {
  if (!Array.isArray(data)) {
    throw new Error('Price feed returned an unexpected payload.')
  }

  const byCurrency = new Map<string, CandidateToken>()

  data.forEach((record, sourceIndex) => {
    if (!isObject(record)) {
      return
    }

    const symbol = typeof record.currency === 'string' ? record.currency.trim() : ''
    const price = Number(record.price)
    const date = typeof record.date === 'string' ? record.date : ''
    const timestamp = Date.parse(date)

    if (!symbol || !Number.isFinite(price) || price <= 0 || !Number.isFinite(timestamp)) {
      return
    }

    const key = symbol.toUpperCase()
    const existing = byCurrency.get(key)
    const shouldReplace =
      !existing || timestamp > existing.timestamp || (timestamp === existing.timestamp && sourceIndex > existing.sourceIndex)

    if (shouldReplace) {
      byCurrency.set(key, { symbol, price, date, timestamp, sourceIndex })
    }
  })

  return [...byCurrency.values()]
    .map((token) => ({
      symbol: token.symbol,
      price: token.price,
      iconUrl: getTokenIconUrl(token.symbol),
    }))
    .sort(sortTokens)
}

// Data fetching
export async function fetchTokenPrices(signal?: AbortSignal): Promise<Token[]> {
  const response = await fetch(getTokenApiUrl(), { signal })

  if (!response.ok) {
    throw new Error(`Price feed responded with ${response.status}.`)
  }

  return normalizeTokenPrices(await response.json())
}

function getPriority(symbol: string) {
  const priority = PRIORITY_SYMBOLS.findIndex((item) => item.toUpperCase() === symbol.toUpperCase())
  return priority === -1 ? Number.POSITIVE_INFINITY : priority
}

function sortTokens(first: Token, second: Token) {
  const firstPriority = getPriority(first.symbol)
  const secondPriority = getPriority(second.symbol)

  if (firstPriority !== secondPriority) {
    return firstPriority - secondPriority
  }

  const firstHighValue = first.price >= 100 ? 0 : 1
  const secondHighValue = second.price >= 100 ? 0 : 1

  if (firstHighValue !== secondHighValue) {
    return firstHighValue - secondHighValue
  }

  return first.symbol.localeCompare(second.symbol, undefined, { sensitivity: 'base' })
}
