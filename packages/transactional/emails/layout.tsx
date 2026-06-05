import React from "react"
import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email"

const NAV_LINKS = [
  { href: "/brands", label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/contact-us", label: "Contact" },
  { href: "/about-us", label: "About" },
]

type EmailLayoutProps = Readonly<{
  children: React.ReactNode
  preview: string
  baseUrl: string
  headContent?: React.ReactNode
}>

export function EmailLayout({
  children,
  preview,
  baseUrl,
  headContent,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              fontFamily: {
                sans: ["DM Sans", "Verdana", "sans-serif"],
              },
            },
          },
        }}
      >
        <Head>
          <Font
            fontFamily="DM Sans"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://cdn.jsdelivr.net/fontsource/fonts/dm-sans:vf@latest/latin-wght-normal.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          {headContent}
        </Head>
        <Body className="font-sans">
          <Preview>{preview}</Preview>
          <Container>
            <EmailHeader baseUrl={baseUrl} />
            {children}
            <EmailFooter baseUrl={baseUrl} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

function EmailHeader({ baseUrl }: { baseUrl: string }) {
  return (
    <Section className="my-6 px-4 py-6">
      <Row>
        <Column align="center">
          <span className="logo light">
            <Img
              alt="Eurofit"
              height="28"
              src={`${baseUrl}/logos/logo-light.png`}
            />
          </span>
          <span className="logo dark" style={{ display: "none" }}>
            <Img
              alt="Eurofit"
              height="28"
              src={`${baseUrl}/logos/logo-dark.png`}
            />
          </span>
        </Column>
      </Row>

      <Row className="mt-6">
        <Column align="center">
          <table role="presentation">
            <tr>
              {NAV_LINKS.map(({ href, label }) => (
                <td key={href} className="px-2">
                  <Link
                    className="text-gray-600 [text-decoration:none]"
                    href={`${baseUrl}${href}`}
                  >
                    {label}
                  </Link>
                </td>
              ))}
            </tr>
          </table>
        </Column>
      </Row>
    </Section>
  )
}

function EmailFooter({ baseUrl }: { baseUrl: string }) {
  return (
    <Section className="mt-10 py-6 text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <span className="logo light">
              <Img
                alt="Eurofit"
                height="20"
                src={`${baseUrl}/logos/logo-light.png`}
              />
            </span>
            <span className="logo dark" style={{ display: "none" }}>
              <Img
                alt="Eurofit"
                height="20"
                src={`${baseUrl}/logos/logo-dark.png`}
              />
            </span>
          </td>
        </tr>
        <tr className="w-full">
          <td align="center">
            <Text className="mt-1 mb-0 text-[16px] leading-6 text-gray-500">
              European Fitness, African Strength
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row className="table-cell h-11 w-14 align-bottom">
              <Column className="pr-4">
                <Link href="https://www.tiktok.com/@eurofitltd">
                  <Img
                    alt="Eurofit on TikTok"
                    height="24"
                    src={`${baseUrl}/logos/tiktok.png`}
                    width="24"
                  />
                </Link>
              </Column>
              <Column className="pr-4">
                <Link href="https://www.instagram.com/eurofitltd">
                  <Img
                    alt="Eurofit on Instagram"
                    height="24"
                    src={`${baseUrl}/logos/instagram.png`}
                    width="24"
                  />
                </Link>
              </Column>
              <Column className="pr-4">
                <Link href="https://www.x.com/eurofitltd">
                  <Img
                    alt="Eurofit on X"
                    height="24"
                    src={`${baseUrl}/logos/x.png`}
                    width="24"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://www.facebook.com/eurofitltd">
                  <Img
                    alt="Eurofit on Facebook"
                    height="24"
                    src={`${baseUrl}/logos/facebook.png`}
                    width="24"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="my-2 leading-6 font-semibold text-gray-500">
              Seventh Street, Eastleigh, Nairobi, Kenya
            </Text>
            <Text className="mt-1 mb-0 leading-6 font-semibold text-gray-500">
              info@eurofit.co.ke | +254 110 990 660
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  )
}
