import { site } from "@/const/site"
import { slugify } from "@/lib/utils/slugify"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { getPayload } from "payload"
import CurrentYear from "./current-year"
import { Logo } from "./logo"

async function getFooter() {
  "use cache"
  cacheLife("days")
  cacheTag("footer")

  const payload = await getPayload({ config })
  const footer = await payload.findGlobal({ slug: "footer" })
  return footer
}

function VisaIcon() {
  return (
    <div
      className="flex h-8 w-14 items-center justify-center rounded-md border border-border bg-[#1A1F71]"
      role="img"
      aria-label="Visa"
    >
      <span className="text-[11px] font-black tracking-tight text-white italic">
        VISA
      </span>
    </div>
  )
}

function MastercardIcon() {
  return (
    <div
      className="flex h-8 w-14 items-center justify-center rounded-md border border-border bg-[#252525]"
      role="img"
      aria-label="Mastercard"
    >
      <div className="relative flex items-center">
        <div className="h-[18px] w-[18px] rounded-full bg-[#EB001B]" />
        <div className="-ml-2 h-[18px] w-[18px] rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    </div>
  )
}

function MPesaIcon() {
  return (
    <div
      className="flex h-8 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-black"
      role="img"
      aria-label="M-PESA"
    >
      <Image
        src="/logos/mpesa.png"
        alt="M-PESA"
        width={56}
        height={28}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

function BankTransferIcon() {
  return (
    <div
      className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3"
      role="img"
      aria-label="Bank Transfer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
        aria-hidden="true"
      >
        <rect x="3" y="10" width="18" height="11" rx="2" />
        <path d="M3 10L12 3l9 7" />
        <line x1="12" y1="10" x2="12" y2="21" />
        <line x1="7" y1="14" x2="7" y2="21" />
        <line x1="17" y1="14" x2="17" y2="21" />
      </svg>
      <span className="text-[9px] font-semibold tracking-wide text-muted-foreground">
        Bank Transfer
      </span>
    </div>
  )
}

export async function Footer() {
  const footer = await getFooter()

  return (
    <footer
      className="no-italic relative w-full border-t bg-muted/30 px-6 py-12 md:py-16"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl">
        <div className="flex grow flex-wrap items-start justify-between gap-10">
          {/* Brand Section */}
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-2">
              <Logo className="text-xl font-bold" />
              <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
                {footer.tagline}
              </p>
            </div>

            <address className="text-sm leading-relaxed text-muted-foreground not-italic">
              Seventh St, Eastleigh,
              <br />
              Nairobi, Kenya
            </address>

            {/* Social Links */}
            <div className="flex items-center gap-3 text-muted-foreground">
              {site.socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="transition-colors hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon aria-hidden="true" />
                  <span className="sr-only">Visit us on {name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="grid grow grid-cols-3 gap-6 md:mx-auto md:flex md:flex-wrap md:items-start md:justify-evenly">
            {footer.nav.map(({ label, links, id }) => (
              <section key={id} className="grid gap-3">
                <h3
                  id={slugify(label)}
                  className="text-xs font-semibold tracking-wider text-foreground uppercase"
                >
                  {label}
                </h3>
                <ul className="grid list-none gap-2 p-0">
                  {links?.map(({ label, url, id }) => (
                    <li key={id}>
                      <Link
                        href={url}
                        className="animated-underline w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
                        prefetch={false}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: copyright + legal */}
          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
            <p>
              © <CurrentYear /> {site.name.toUpperCase()}. All rights reserved.
            </p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Legal">
              {footer.legalLinks.map(({ url, label }) => (
                <Link
                  key={url}
                  href={url}
                  className="transition-colors hover:text-primary"
                  prefetch={false}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Payment methods */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">We accept:</span>
            <div className="flex flex-wrap items-center gap-2">
              <VisaIcon />
              <MastercardIcon />
              <MPesaIcon />
              <BankTransferIcon />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
