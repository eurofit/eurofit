import Image from "next/image"

export default function AdminLogo() {
  return (
    <>
      <div className="dark:hidden">
        <Image
          src="/logos/logo-dark.png"
          alt="Eurofit"
          width={140}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="hidden dark:block">
        <Image
          src="/logos/logo-light.png"
          alt="Eurofit"
          width={140}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>
    </>
  )
}
