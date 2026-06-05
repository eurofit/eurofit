"use client"

import { Button } from "@eurofit/ui/components/button"
import { Input } from "@eurofit/ui/components/input"
import { cn } from "@eurofit/ui/lib/utils"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"

type PasswordInputProps = React.ComponentPropsWithRef<"input"> & {
  showPassword?: boolean
  onShowPasswordChange?: (show: boolean) => void
}

function PasswordInput({
  showPassword = false,
  onShowPasswordChange,
  ref,
  className,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(showPassword)

  const handleToggle = () => {
    const next = !show
    setShow(next)
    onShowPasswordChange?.(next)
  }

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute inset-y-0 right-0 px-3 py-2 hover:bg-transparent"
        onClick={handleToggle}
      >
        {show ? (
          <Eye className="size-4" aria-hidden="true" />
        ) : (
          <EyeClosed className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {show ? "Hide password" : "Show password"}
        </span>
      </Button>
      <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
    </div>
  )
}

export { PasswordInput }
