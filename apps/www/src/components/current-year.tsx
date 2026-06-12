"use client"

export default function CurrentYear() {
  const year = new Date().getFullYear()
  return <span>{year}</span>
}
