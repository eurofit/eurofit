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

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
            maxWidth: "20rem",
            padding: "0.375rem 0.75rem",
            background: "var(--theme-input-bg)",
            border: "1px solid var(--theme-border-color)",
            borderRadius: "var(--style-radius-m)",
            color: "var(--theme-text)",
            fontSize: "var(--font-body-size)",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon size={16} />
              <span>{value}</span>
            </>
          ) : (
            <span style={{ color: "var(--theme-text-dim)" }}>
              Select an icon…
            </span>
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.375rem",
              background: "var(--theme-input-bg)",
              border: "1px solid var(--theme-border-color)",
              borderRadius: "var(--style-radius-m)",
              color: "var(--theme-text)",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: "0.5rem",
            maxWidth: "20rem",
            padding: "0.75rem",
            background: "var(--theme-elevation-100)",
            border: "1px solid var(--theme-border-color)",
            borderRadius: "var(--style-radius-m)",
            boxShadow: "var(--theme-shadow-m)",
          }}
        >
          <input
            autoFocus
            type="search"
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field__input"
            style={{ marginBottom: "0.5rem", width: "100%" }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "0.25rem",
            }}
          >
            {filtered.map((name) => {
              const Icon = icons[name as keyof typeof icons] as LucideIcon
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => handleSelect(name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.375rem",
                    borderRadius: "var(--style-radius-s)",
                    background:
                      value === name
                        ? "var(--theme-success-100)"
                        : "transparent",
                    border:
                      value === name
                        ? "2px solid var(--theme-success)"
                        : "2px solid transparent",
                    color: "var(--theme-text)",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={18} />
                </button>
              )
            })}
          </div>
          {totalMatches > MAX_VISIBLE && (
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--theme-text-dim)",
              }}
            >
              Showing first 20 — type to narrow results
            </p>
          )}
        </div>
      )}
    </div>
  )
}
