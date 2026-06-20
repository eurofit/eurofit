"use client"

import { CITIES } from "@/const/cities"
import { Button } from "@eurofit/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@eurofit/ui/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@eurofit/ui/components/popover"
import { cn } from "@eurofit/ui/lib/utils"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import * as React from "react"

type CityCommandProps = {
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  id?: string
  "aria-invalid"?: boolean
  disabled?: boolean
}

export function CityCommand({
  value,
  onValueChange,
  onBlur,
  id,
  "aria-invalid": ariaInvalid,
  disabled,
}: CityCommandProps) {
  const [open, setOpen] = React.useState(false)

  function handleSelect(city: string) {
    onValueChange(city === value ? "" : city)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          size="lg"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          onBlur={onBlur}
          className="w-full justify-between font-normal"
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || "Search city or town..."}
          </span>
          <ChevronsUpDownIcon className="shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search city or town..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {CITIES.map((city) => (
                <CommandItem key={city} value={city} onSelect={handleSelect}>
                  {city}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
