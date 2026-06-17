import { ContactCard } from "@/components/contact/contact-cards"
import { ContactForm } from "@/components/contact/contact-form"
import { Whatsapp } from "@/components/icons/whatsapp"
import { JsonLd } from "@/components/json-ld"
import { site } from "@/const/site"
import { Mail, MapPin, Phone } from "lucide-react"
import type { Metadata } from "next"
import type { ContactPage, FAQPage, WithContext } from "schema-dts"

const metaDescription =
  "Contact Eurofit, Kenya's biggest supplier of authentic European supplements. Call or WhatsApp +254 110 990 666 or visit our Nairobi store. Retail & wholesale."

const contacts = [
  {
    icon: <Mail className="size-4" />,
    title: "Email Support",
    description: `Have a question about an order or product?
Send us an email and we’ll reply within 24 hours.`,
    cta: {
      label: "info@eurofit.co.ke",
      href: "mailto:info@eurofit.co.ke",
    },
  },
  {
    icon: <Phone className="size-4" />,
    title: "Call Us",
    description: `Want a quick answer?
Call us Monday–Saturday, 9 AM–6 PM (EAT).`,
    cta: {
      label: "+254 110 990 666",
      href: "tel:+254110990666",
    },
  },
  {
    icon: <Whatsapp className="size-4" />,
    title: "Whatsapp Support",
    description: `Have a question about an order or product or anything else?
Send us a WhatsApp message and we’ll reply within 24 hours.`,
    cta: {
      label: "+254 110 990 666",
      href: "https://wa.me/254110990666",
      external: true,
    },
  },
  {
    icon: <MapPin className="size-4" />,
    title: "Visit Our Store",
    description: `${site.address.line1}, ${site.address.line2}\n${site.address.city}, ${site.address.country}`,
    cta: {
      label: "Get Directions",
      href: site.address.href,
      external: true,
      btn: true,
    },
  },
]

export const metadata: Metadata = {
  title: { absolute: "Contact Us – Kenya Sports Nutrition Wholesale & Retail" },
  description: metaDescription,
  alternates: { canonical: `${site.url}/contact-us` },
  openGraph: {
    title: "Contact Eurofit | Kenya Sports Nutrition Wholesale & Retail",
    description: metaDescription,
    url: `${site.url}/contact-us`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Eurofit | Kenya Sports Nutrition Wholesale & Retail",
    description: metaDescription,
  },
}

const contactPageSchema: WithContext<ContactPage> = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${site.url}/contact-us#webpage`,
  url: `${site.url}/contact-us`,
  name: "Contact Us – Kenya Sports Nutrition Wholesale & Retail",
  description: metaDescription,
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact Us",
        item: `${site.url}/contact-us`,
      },
    ],
  },
}

const faqSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}/contact-us#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I contact Eurofit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `You can reach Eurofit by phone or WhatsApp on ${site.contact.phone.text}, by email at ${site.contact.email.text}, or by visiting our store on ${site.address.line1}, ${site.address.line2}, ${site.address.city}. We reply to messages within 24 hours.`,
      },
    },
    {
      "@type": "Question",
      name: "Where is Eurofit's store located in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Eurofit's store is on ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.country}.`,
      },
    },
    {
      "@type": "Question",
      name: "What are Eurofit's opening hours?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eurofit is open Monday to Saturday, 9 AM to 6 PM, and Sunday, 10 AM to 4 PM (EAT).",
      },
    },
    {
      "@type": "Question",
      name: "Does Eurofit offer wholesale prices for gyms and shops?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. Eurofit supplies gyms, shops, and distributors at wholesale prices. Message us on WhatsApp at ${site.contact.phone.text} for a bulk quote.`,
      },
    },
    {
      "@type": "Question",
      name: "Does Eurofit deliver supplements outside Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Eurofit delivers nationwide across Kenya — including Mombasa, Kisumu, Eldoret, and Nakuru — and the wider East Africa region.",
      },
    },
    {
      "@type": "Question",
      name: "Are Eurofit's supplements authentic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every product is 100% genuine, sourced directly from authorized European manufacturers.",
      },
    },
  ],
}

export default function ContactUs() {
  return (
    <div className="container mx-auto max-w-5xl p-6 pb-16">
      <JsonLd jsonLd={[contactPageSchema, faqSchema]} />
      <hgroup className="mx-auto flex max-w-3xl flex-col items-center space-y-2 text-center">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Reach us
        </span>
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
          Talk to Kenya&apos;s Biggest Supplement Supplier
        </h1>
        <p className="max-w-lg text-lg text-pretty text-muted-foreground">
          Questions about a product, a bulk gym order, delivery, or becoming a
          stockist? Our Nairobi team supplies authentic European supplements
          nationwide — and we reply within 24 hours.
        </p>
      </hgroup>
      <div className="mt-10 flex flex-wrap gap-10 max-md:flex-col">
        <div className="flex-1">
          <ContactsSection />
        </div>
        <div className="flex-1">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

function ContactsSection() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {contacts.map((card, i) => (
        <ContactCard key={i} {...card} />
      ))}
    </section>
  )
}
