"use client"
import { useTheme } from "@payloadcms/ui"
import Image from "next/image"

export default function AdminLogo() {
  const { theme } = useTheme()

  const src =
    theme === "dark" ? "/logos/logo-light.png" : "/logos/logo-dark.png"

  return (
    <Image
      src={src}
      alt="Eurofit"
      width={140}
      height={40}
      style={{ objectFit: "contain" }}
    />
  )
}
