import { LocalBusiness, Organization, WebSite, WithContext } from "schema-dts"
import { site } from "./site"

// --- Organization (repeatable across site) ---
export const organization: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  alternateName: ["Eurofit", "Eurofit Kenya", "Eurofit Supplements"],
  url: site.url,
  logo: `${site.url}/logo.png`,
  description:
    "Eurofit also known as Eurofit Health & Beauty LTD is Kenya’s leading supplier of authentic European supplements, sports nutrition, and vitamins products for retail and wholesale.",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.contact.phone.text.replace(" ", ""),
      contactType: "customer service",
      email: site.contact.email.text,
      availableLanguage: ["English"],
      areaServed: "KE",
    },
  ],
  sameAs: site.socialLinks.map((s) => s.href),
}

// --- WebSite (search action) ---
export const website: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  alternateName: [
    site.legalName,
    "Eurofit Supplements Shop",
    "Eurofit Sports Nutrition Shop in Kenya",
  ],
  publisher: { "@id": `${site.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/search?q={search_term_string}`,
    // @ts-expect-error for google
    "query-input": "required name=search_term_string",
  },
}

// --- Local Business (Store) ---
export const localBusiness: WithContext<LocalBusiness> = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${site.url}/#store`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  telephone: site.contact.phone.text.replace(/\s+/g, ""),
  email: site.contact.email.text,
  description:
    "Physical and online store for sports nutrition, supplements, and vitamins. Wholesale and retail orders available and acceptable.",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.fullAddress,
    postOfficeBoxNumber: site.address.postalAddress,
    addressLocality: site.address.city,
    addressRegion: site.address.county,
    postalCode: site.address.postalCode,
    addressCountry: site.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.274672,
    longitude: 36.8437572,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  sameAs: site.socialLinks.map((s) => s.href),
  paymentAccepted: ["Cash", "M-Pesa", "Bank Transfer"],
  currenciesAccepted: "KES",
  hasMap: "https://maps.app.goo.gl/GBruweVx6PBugsuB6",
  priceRange: "$$",
  image: `${site.url}/logo.png`,
  logo: `${site.url}/logo.png`,
}
