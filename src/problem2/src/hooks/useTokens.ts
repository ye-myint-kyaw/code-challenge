import { useCallback, useEffect, useState } from 'react'
import { fetchTokenPrices } from '../services/tokenService'
import type { Token } from '../types'

interface TokenState {
  tokens: Token[]
  isLoading: boolean
  error: string
}

export function useTokens() {
  const [state, setState] = useState<TokenState>({
    tokens: [],
    isLoading: true,
    error: '',
  })
  const [requestId, setRequestId] = useState(0)

  const reload = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: '' }))
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchTokenPrices(controller.signal)
      .then((tokens) => {
        setState({
          tokens,
          isLoading: false,
          error: ''
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState((current) => ({
          ...current,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unable to load token prices.',
        }))
      })

    return () => controller.abort()
  }, [requestId])

  return { ...state, reload }
}
