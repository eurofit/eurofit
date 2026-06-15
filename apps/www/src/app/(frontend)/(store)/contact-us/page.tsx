import { ContactCard } from "@/components/contact/contact-cards"
import { ContactForm } from "@/components/contact/contact-form"
import { Whatsapp } from "@/components/icons/whatsapp"
import { Mail, MapPin, Phone } from "lucide-react"
import type { Metadata } from "next"

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
    description: `Seventh Street, Eastleigh\nNairobi 8047-00610, Kenya`,
    cta: {
      label: "Get Directions",
      href: "https://share.google/BJvKY66P3AJkdnMWo",
      external: true,
      btn: true,
    },
  },
]

export const metadata: Metadata = {
  title: "Contact Us",

  description: "Get in touch with our team for any inquiries or support.",
}

export default function ContactUs() {
  return (
    <div className="container mx-auto max-w-5xl p-6 pb-16">
      <hgroup className="mx-auto flex max-w-3xl flex-col items-center space-y-2 text-center">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Reach us
        </span>
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
          Speak With our Friendly team
        </h1>
        <p className="max-w-lg text-lg text-pretty text-muted-foreground">
          Have a question about products, bulk orders, delivery, or
          partnerships? Our Nairobi team is ready to help. Fill in the form or
          contact us directly below.
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
