import * as React from "react"

export function useMounted(): () => boolean {
  const mountedRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const isMounted = React.useCallback(() => mountedRef.current, [])

  return isMounted
}
