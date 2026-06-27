import type { TurnstileInstance } from "@marsidev/react-turnstile"
import * as React from "react"

const TOKEN_TIMEOUT_MS = 30_000

export function useTurnstileToken() {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const tokenRef = React.useRef("")
  const resolversRef = React.useRef<Array<(token: string) => void>>([])

  const drain = React.useCallback((token: string) => {
    resolversRef.current.forEach((fn) => fn(token))
    resolversRef.current = []
  }, [])

  const turnstileProps = React.useMemo(
    () => ({
      onSuccess: (token: string) => {
        tokenRef.current = token
        drain(token)
      },
      onExpire: () => {
        tokenRef.current = ""
      },
      onError: () => {
        tokenRef.current = ""
        drain("")
      },
    }),
    [drain]
  )

  const getToken = React.useCallback((): Promise<string> => {
    if (tokenRef.current) return Promise.resolve(tokenRef.current)

    return new Promise<string>((resolve) => {
      const onResolve = (token: string) => {
        clearTimeout(timer)
        resolve(token)
      }
      const timer = setTimeout(() => {
        resolversRef.current = resolversRef.current.filter(
          (fn) => fn !== onResolve
        )
        resolve("")
      }, TOKEN_TIMEOUT_MS)
      resolversRef.current.push(onResolve)
    })
  }, [])

  const reset = React.useCallback(() => {
    tokenRef.current = ""
    turnstileRef.current?.reset()
  }, [])

  return { turnstileRef, getToken, reset, turnstileProps }
}
