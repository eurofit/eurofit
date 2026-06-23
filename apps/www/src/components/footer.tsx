import { site } from "@/const/site"
import { slugify } from "@/lib/utils/slugify"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import Link from "next/link"
import { getPayload } from "payload"
import CurrentYear from "./current-year"
import { Logo } from "./logo"

async function getFooter() {
  "use cache"
  cacheLife("days")
  cacheTag("footer")

  const payload = await getPayload({
    config,
  })

  const footer = await payload.findGlobal({
    slug: "footer",
  })

  return footer
}

export async function Footer() {
  const footer = await getFooter()

  return (
    <footer
      className="no-italic relative w-full border-t px-6 py-12 md:py-16"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="flex grow flex-wrap items-start justify-between gap-10">
        {/* Brand Section */}
        <div className="flex flex-col items-start gap-4">
          <div>
            <Logo className="text-xl font-bold" />
            <p className="max-w-xs text-sm text-muted-foreground">
              {footer.tagline}
            </p>
          </div>

          <address className="max-w-sm text-sm text-muted-foreground not-italic">
            Seventh St, Eastleigh, <br />
            Nairobi, Kenya
          </address>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-foreground">
            {site.socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="group transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon aria-hidden="true" />
                <span className="sr-only">Visit us on {name}</span>
              </a>
            ))}
          </div>
        </div>

        <nav className="grid grow grid-cols-3 gap-6 md:mx-auto md:flex md:flex-wrap md:items-start md:justify-evenly">
          {footer.nav.map(({ label, links, id }) => (
            <section key={id} className="grid gap-2">
              <h2 id={slugify(label)} className="text-sm font-semibold">
                {label}
              </h2>
              {links?.map(({ label, url, id }) => (
                <Link
                  key={id}
                  href={url}
                  className="animated-underline w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
                  prefetch={false}
                >
                  {label}
                </Link>
              ))}
            </section>
          ))}
        </nav>

        {/* <Newsletter /> */}
      </div>

      {/* Bottom Section */}
      <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 text-xs text-muted-foreground sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <p>
            © <CurrentYear /> {site.name.toUpperCase()}. All Rights Reserved.
          </p>
          <p className="hidden sm:block" aria-hidden="true">
            |
          </p>
          <p>VAT: EU123456789</p>
        </div>
        <nav
          className="flex flex-wrap justify-center gap-x-4 gap-y-2"
          aria-label="Legal"
        >
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
    </footer>
  )
}
