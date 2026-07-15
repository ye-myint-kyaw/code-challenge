export type Theme = 'light' | 'dark'

export type Tab = 'swap' | 'rates'

export interface Token {
  symbol: string
  price: number
  iconUrl: string
}

export interface SwapReceipt {
  id: string
  fromAmount: string
  fromSymbol: string
  toAmount: string
  toSymbol: string
  rate: string
  createdAt: string
}
