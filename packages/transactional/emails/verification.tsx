import { EmailButton } from "@eurofit/transactional/email-button"
import { EmailLayout } from "@eurofit/transactional/layout"
import { render, Section, Text } from "react-email"

type VerificationEmailProps = {
  token?: string
  firstName?: string
  baseUrl: string
}

const VerificationEmail = ({
  firstName,
  token,
  baseUrl,
}: VerificationEmailProps) => {
  const verificationLink = `${baseUrl}/verify-email?token=${token}`

  return (
    <EmailLayout
      baseUrl={baseUrl}
      preview="Verify your email to activate your Eurofit account"
    >
      <Section className="px-6">
        <Text>Hi {firstName ?? "there"},</Text>

        <Text>
          Welcome to Eurofit! One last step — please verify your email address
          to activate your account.
        </Text>

        <EmailButton href={verificationLink}>Verify Email Address</EmailButton>

        <Text>
          If the button doesn&apos;t work, copy and paste this link into your
          browser: {verificationLink}
        </Text>

        <Text>
          If you didn&apos;t create an account with us, you can safely ignore
          this email.
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

export function generateVerificationEmailHTML(props: VerificationEmailProps) {
  return render(<VerificationEmail {...props} />)
}

export function generateVerificationEmailText(props: VerificationEmailProps) {
  return render(<VerificationEmail {...props} />, { plainText: true })
}

VerificationEmail.PreviewProps = {
  token: "example-token",
  firstName: "John",
  baseUrl: "https://eurofit.co.ke",
} satisfies VerificationEmailProps

export default VerificationEmail
