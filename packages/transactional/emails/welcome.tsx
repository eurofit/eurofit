import { EmailButton } from "@eurofit/transactional/email-button"
import { EmailLayout } from "@eurofit/transactional/layout"
import { render, Section, Text } from "react-email"

type WelcomeEmailProps = {
  firstName?: string | null
  baseUrl: string
}

const WelcomeEmail = ({ firstName, baseUrl }: WelcomeEmailProps) => {
  return (
    <EmailLayout
      baseUrl={baseUrl}
      preview="Your Eurofit account is verified — welcome aboard!"
    >
      <Section className="px-6">
        <Text>Hi {firstName ?? "there"},</Text>

        <Text>
          Your email is verified and your Eurofit account is ready to go.
          Welcome to Kenya&apos;s home for sports nutrition, supplements, and
          vitamins.
        </Text>

        <Text>
          Explore top brands and find everything you need to fuel your training
          — for both retail and wholesale.
        </Text>

        <EmailButton href={baseUrl}>Start shopping</EmailButton>

        <Text>
          Questions or need a hand? Just reply to this email and our team will
          be happy to help.
        </Text>

        <Text>
          Warm regards,
          <br />
          <strong>The Eurofit Team</strong>
        </Text>
      </Section>
    </EmailLayout>
  )
}

export function generateWelcomeEmailHTML(props: WelcomeEmailProps) {
  return render(<WelcomeEmail {...props} />)
}

export function generateWelcomeEmailText(props: WelcomeEmailProps) {
  return render(<WelcomeEmail {...props} />, { plainText: true })
}

WelcomeEmail.PreviewProps = {
  firstName: "John",
  baseUrl: "https://eurofit.co.ke",
} satisfies WelcomeEmailProps

export default WelcomeEmail
