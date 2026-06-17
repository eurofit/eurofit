import { Facebook } from "@/components/icons/facebook"
import { Instagram } from "@/components/icons/instagram"
import { Tiktok } from "@/components/icons/tiktok"
import { Twitter } from "@/components/icons/twitter"
import { Whatsapp } from "@/components/icons/whatsapp"
import { Youtube } from "@/components/icons/youtube"
import { publicUrl } from "@/env.mjs"
import { cn } from "@eurofit/ui/lib/utils"
import { Mail } from "lucide-react"

export const site = {
  name: "EUROFIT",
  legalName: "Eurofit Health & Beauty LTD",
  url: publicUrl,
  description:
    "Eurofit is Kenya’s biggest supplier of sports nutrition, supplements, and vitamins for both retail and wholesale customers.",
  contact: {
    phone: {
      text: "+254 110 990 666",
      href: "tel:+254110990666",
    },
    whatsapp: "254110990666",
    email: {
      text: "info@eurofit.co.ke",
      href: "mailto:info@eurofit.co.ke",
    },
  },
  socialLinks: [
    {
      name: "Mail",
      href: "mailto:info@eurofit.co.ke",
      icon: ({ className, ...props }: React.ComponentProps<typeof Mail>) => (
        <Mail
          data-slot="mail"
          className={cn("size-4.5", className)}
          {...props}
        />
      ),
    },
    {
      name: "Whatsapp",
      href: "https://wa.me/254110990666",
      icon: ({
        className,
        ...props
      }: React.ComponentProps<typeof Whatsapp>) => (
        <Whatsapp
          data-slot="whatsapp"
          className={cn("size-4", className)}
          {...props}
        />
      ),
    },
    {
      name: "Tiktok",
      href: "https://www.tiktok.com/@eurofitltd",
      icon: ({ className, ...props }: React.ComponentProps<typeof Tiktok>) => (
        <Tiktok
          data-slot="tiktok"
          className={cn("size-4", className)}
          {...props}
        />
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/eurofitltd",
      icon: ({
        className,
        ...props
      }: React.ComponentProps<typeof Instagram>) => (
        <Instagram
          data-slot="instagram"
          className={cn("size-4", className)}
          {...props}
        />
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/eurofitltd",
      icon: ({
        className,
        ...props
      }: React.ComponentProps<typeof Facebook>) => (
        <Facebook
          data-slot="facebook"
          className={cn("size-4", className)}
          {...props}
        />
      ),
    },
    {
      name: "Twitter",
      href: "https://www.x.com/eurofitltd",
      icon: ({ className, ...props }: React.ComponentProps<typeof Twitter>) => (
        <Twitter
          data-slot="twitter"
          className={cn("size-4", className)}
          {...props}
        />
      ),
    },
    {
      name: "Youtube",
      href: "https://www.youtube.com/@eurofitltd",
      icon: ({ className, ...props }: React.ComponentProps<typeof Youtube>) => (
        <Youtube
          data-slot="youtube"
          className={cn("size-4.5", className)}
          {...props}
        />
      ),
    },
  ],
  address: {
    line1: "Seventh Street",
    line2: "Eastleigh",
    city: "Nairobi",
    county: "Nairobi County",
    countryCode: "KE",
    country: "Kenya",
    postalCode: "00610",
    postalAddress: "P.O BOX 8047-00610",
    fullAddress: "Seventh Street, Eastleigh, Nairobi, Kenya",
    href: "https://maps.app.goo.gl/3t3NuyRUker97fSN6",
  },
} as const
