const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

export function formatUsdPrice(value: number) {
  if (!Number.isFinite(value)) {
    return 'Unavailable'
  }

  if (value > 999_999) {
    return compactUsdFormatter.format(value)
  }

  if (value > 0 && value < 0.01) {
    return `$${value.toPrecision(3)}`
  }

  return usdFormatter.format(value)
}

export function formatTokenAmount(value: number) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  if (Math.abs(value) >= 1_000_000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 4,
    }).format(value)
  }

  if (Math.abs(value) >= 1) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(value)
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
  }).format(value)
}

export function formatRate(value: number) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
  }

  if (value >= 1) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value)
  }

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }).format(value)
}
