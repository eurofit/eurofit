import * as React from "react"

export function useInView(threshold = 0.1) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    const node =
      ref && typeof ref !== "function"
        ? ref.current
        : (
            ref as React.RefCallback<HTMLElement> & {
              current?: HTMLElement | null
            }
          )?.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [ref, threshold])

  return { ref, isInView }
}
