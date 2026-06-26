"use client"

import { FieldLabel, useField } from "@payloadcms/ui"
import type { LucideIcon } from "lucide-react"
import { icons, X } from "lucide-react"
import type { TextFieldClientComponent } from "payload"
import { useCallback, useMemo, useState } from "react"

const ALL_ICON_NAMES = Object.keys(icons)
const MAX_VISIBLE = 20

export const IconPicker: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const { filtered, totalMatches } = useMemo(() => {
    const q = search.toLowerCase()
    const matches = q
      ? ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(q))
      : ALL_ICON_NAMES
    return {
      filtered: matches.slice(0, MAX_VISIBLE),
      totalMatches: matches.length,
    }
  }, [search])

  const handleSelect = useCallback(
    (name: string) => {
      setValue(name)
      setIsOpen(false)
      setSearch("")
    },
    [setValue]
  )

  const SelectedIcon = value
    ? (icons[value as keyof typeof icons] as LucideIcon | undefined)
    : undefined

  return (
    <div className="field-type text">
      <FieldLabel label={field?.label} path={path} required={field?.required} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full max-w-xs items-center gap-2 rounded border border-gray-300 px-3 py-2 text-left text-sm hover:bg-gray-50"
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon size={16} />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-gray-400">Select an icon…</span>
          )}
        </button>
        {value && (
          <button
            type="button"
            aria-label="Clear icon"
            onClick={() => {
              setValue("")
              setSearch("")
            }}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {SelectedIcon && (
        <div className="mt-2 flex items-center gap-4 text-gray-500">
          <SelectedIcon size={16} />
          <SelectedIcon size={24} />
          <SelectedIcon size={32} />
        </div>
      )}

      {isOpen && (
        <div className="mt-2 max-w-xs rounded border border-gray-200 bg-white p-3 shadow-sm">
          <input
            autoFocus
            type="search"
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
          <div className="grid grid-cols-8 gap-1">
            {filtered.map((name) => {
              const Icon = icons[name as keyof typeof icons] as LucideIcon
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => handleSelect(name)}
                  className={`flex items-center justify-center rounded p-1.5 hover:bg-gray-100 ${
                    value === name ? "bg-blue-50 ring-2 ring-blue-500" : ""
                  }`}
                >
                  <Icon size={18} />
                </button>
              )
            })}
          </div>
          {totalMatches > MAX_VISIBLE && (
            <p className="mt-2 text-xs text-gray-400">
              Showing first 20 — type to narrow results
            </p>
          )}
        </div>
      )}
    </div>
  )
}
