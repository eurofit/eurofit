import { useEffect, useState } from "react"

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const setOn = () => setValue(true)
  const setOff = () => setValue(false)
  const toggle = () => setValue((prev) => !prev)

  return {
    value,
    setValue,
    toggle,
    setOn,
    setOff,
  }
}
