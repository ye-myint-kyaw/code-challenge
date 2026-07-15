import { ArrowDownUp, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { SwapReceipt, Token } from '../types'
import { formatRate, formatTokenAmount, formatUsdPrice } from '../utils/formatters'
import { TokenSelect } from './TokenSelect'

interface SwapTabProps {
  tokens: Token[]
}

interface SwapForm {
  amount: string
}

const DEFAULT_FROM = ['ETH', 'WBTC', 'ATOM', 'SWTH']
const DEFAULT_TO = ['USDC', 'USD', 'BUSD', 'ETH']

export function SwapTab({ tokens }: SwapTabProps) {
  const [fromSymbol, setFromSymbol] = useState(getDefaultToken(tokens, DEFAULT_FROM)?.symbol ?? '')
  const [toSymbol, setToSymbol] = useState(getDefaultToken(tokens, DEFAULT_TO, fromSymbol)?.symbol ?? '')
  const [amount, setAmount] = useState('1.25')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReversing, setIsReversing] = useState(false)
  const [receipt, setReceipt] = useState<SwapReceipt | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm<SwapForm>({
    mode: 'onChange',
    defaultValues: { amount: '1.25' },
  })

  const amountValue = Number(amount)
  const fromToken = findToken(tokens, fromSymbol) ?? tokens[0]
  const toToken = findToken(tokens, toSymbol) ?? tokens[1] ?? tokens[0]
  const rate = fromToken && toToken ? fromToken.price / toToken.price : 0
  const feeUsd = fromToken && Number.isFinite(amountValue) ? Math.min(14, Math.max(0.18, amountValue * fromToken.price * 0.0006)) : 0
  const receiveAmount = toToken && Number.isFinite(amountValue) ? Math.max(amountValue * rate - feeUsd / toToken.price, 0) : 0
  const amountFieldClass =
    'rounded-lg border bg-[var(--field-bg)] p-4 transition focus-within:border-[var(--border-strong)] focus-within:bg-[var(--surface-strong)]'
  const amountInputClass =
    'w-full min-w-0 border-0 bg-transparent text-3xl font-black text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none max-sm:text-2xl'

  useEffect(() => {
    void trigger('amount')
  }, [fromSymbol, toSymbol, trigger])

  function updateAmount(value: string) {
    const nextAmount = cleanAmount(value)

    setAmount(nextAmount)
    setValue('amount', nextAmount, { shouldDirty: true, shouldValidate: true })
    setReceipt(null)
  }

  function updateFromToken(symbol: string) {
    setFromSymbol(symbol)
    setReceipt(null)
  }

  function updateToToken(symbol: string) {
    setToSymbol(symbol)
    setReceipt(null)
  }

  function reverseTokens() {
    setFromSymbol(toSymbol)
    setToSymbol(fromSymbol)
    setReceipt(null)
    setIsReversing(true)
    window.setTimeout(() => setIsReversing(false), 300)
  }

  const submitSwap: SubmitHandler<SwapForm> = ({ amount }) => {
    if (!fromToken || !toToken) {
      return
    }

    setIsSubmitting(true)
    setReceipt(null)

    window.setTimeout(() => {
      setIsSubmitting(false)
      setReceipt({
        id: `SWP-${Date.now().toString(36).toUpperCase()}`,
        fromAmount: formatTokenAmount(Number(amount)),
        fromSymbol: fromToken.symbol,
        toAmount: formatTokenAmount(receiveAmount),
        toSymbol: toToken.symbol,
        rate: formatRate(rate),
        createdAt: new Date().toISOString(),
      })
    }, 1000)
  }

  if (!fromToken || !toToken) {
    return <p className="p-7 text-[var(--text-muted)]">No priced tokens available.</p>
  }

  return (
    <form className="animate-[panel-in_220ms_ease_both] p-5 max-sm:p-3" onSubmit={handleSubmit(submitSwap)} noValidate>
      <div className="grid gap-2">
        <div className={`${amountFieldClass} ${errors.amount ? 'border-[var(--danger)]' : 'border-[var(--border)]'}`}>
          <div className="mb-2.5 flex justify-between gap-3 text-sm text-[var(--text-muted)]">
            <label className="font-extrabold text-[var(--text)]" htmlFor="from-amount">
              You pay
            </label>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 max-sm:grid-cols-1">
            <input
              id="from-amount"
              className={amountInputClass}
              inputMode="decimal"
              placeholder="0.00"
              {...register('amount', {
                required: 'Enter an amount.',
                validate: {
                  positive: (value) => Number(value) > 0 || 'Amount must be greater than zero.',
                  differentToken: () => fromSymbol !== toSymbol || 'Choose two different currencies.',
                },
              })}
              value={amount}
              onChange={(event) => updateAmount(event.target.value)}
            />
            <TokenSelect label="From token" tokens={tokens} value={fromToken.symbol} onChange={updateFromToken} />
          </div>
          {errors.amount ? <p className="mt-2.5 text-sm font-bold text-[var(--danger)]">{errors.amount.message}</p> : null}
        </div>

        <button
          type="button"
          className="mx-auto -my-0.5 grid size-11 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--accent-strong)] shadow-[0_12px_28px_rgba(139,53,246,0.16)] transition hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-white focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none"
          onClick={reverseTokens}
          aria-label="Reverse swap direction"
        >
          <ArrowDownUp className={isReversing ? 'animate-[reverse-spin_360ms_ease]' : undefined} size={18} />
        </button>

        <div
          className={`${amountFieldClass} ${
            errors.amount?.message === 'Choose two different currencies.' ? 'border-[var(--danger)]' : 'border-[var(--border)]'
          }`}
        >
          <div className="mb-2.5 flex justify-between gap-3 text-sm text-[var(--text-muted)]">
            <label className="font-extrabold text-[var(--text)]" htmlFor="to-amount">
              You receive
            </label>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 max-sm:grid-cols-1">
            <input id="to-amount" className={amountInputClass} value={formatTokenAmount(receiveAmount)} readOnly />
            <TokenSelect label="To token" tokens={tokens} value={toToken.symbol} onChange={updateToToken} />
          </div>
        </div>
      </div>

      <dl className="my-4 grid gap-2.5 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-soft),transparent_38%)] p-3.5">
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--text-muted)]">Rate</dt>
          <dd className="m-0 text-right font-extrabold text-[var(--text-strong)]">
            1 {fromToken.symbol} = {formatRate(rate)} {toToken.symbol}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--text-muted)]">Network fee</dt>
          <dd className="m-0 text-right font-extrabold text-[var(--text-strong)]">{formatUsdPrice(feeUsd)}</dd>
        </div>
      </dl>

      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-0 bg-linear-to-br from-[var(--accent)] to-[var(--accent-strong)] font-black text-white shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-[rgba(139,53,246,0.24)] focus-visible:outline-none"
        disabled={Boolean(errors.amount) || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Confirming quote
          </>
        ) : (
          'Swap now'
        )}
      </button>

      {receipt ? (
        <div
          className="mt-3.5 grid animate-[receipt-in_240ms_ease_both] grid-cols-[auto_minmax(0,1fr)] gap-2.5 rounded-lg border border-[color-mix(in_srgb,var(--success),transparent_58%)] bg-[color-mix(in_srgb,var(--success),transparent_89%)] p-3.5 text-[var(--text)]"
          aria-live="polite"
        >
          <CheckCircle2 className="text-[var(--success)]" size={22} />
          <div className="grid gap-1">
            <strong className="text-[var(--text-strong)]">Swap request confirmed</strong>
            <span>
              {receipt.fromAmount} {receipt.fromSymbol} to {receipt.toAmount} {receipt.toSymbol}
            </span>
            <small className="text-[var(--text-muted)]">
              {receipt.id} - 1 {receipt.fromSymbol} = {receipt.rate} {receipt.toSymbol}
            </small>
          </div>
        </div>
      ) : null}
    </form>
  )
}

// Clean input by removing unnecessary inputs like text and characters (abc123=>123)
function cleanAmount(value: string) {
  const cleanValue = value.replace(/,/g, '').replace(/[^\d.]/g, '')
  const [wholeNumber, ...decimalParts] = cleanValue.split('.')

  if (decimalParts.length === 0) {
    return wholeNumber
  }

  return `${wholeNumber || '0'}.${decimalParts.join('')}`
}

function getDefaultToken(tokens: Token[], symbols: string[], avoidSymbol?: string) {
  return symbols
    .map((symbol) => findToken(tokens, symbol))
    .find((token): token is Token => token !== undefined && token.symbol !== avoidSymbol)
}

function findToken(tokens: Token[], symbol: string) {
  return tokens.find((token) => token.symbol.toUpperCase() === symbol.toUpperCase())
}
