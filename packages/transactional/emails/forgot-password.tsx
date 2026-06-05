import { EmailButton } from "@eurofit/transactional/email-button"
import { EmailLayout } from "@eurofit/transactional/layout"
import { render, Section, Text } from "react-email"

type ForgotPasswordEmailProps = {
  token?: string
  firstName?: string | null
  baseUrl: string
}

export default function ForgotPasswordEmail({
  baseUrl,
  token,
  firstName,
}: ForgotPasswordEmailProps) {
  const resetPasswordLink = `${baseUrl}/reset-password?token=${token}`

  return (
    <EmailLayout
      baseUrl={baseUrl}
      preview="Reset your Eurofit password — this link expires in 1 hour"
    >
      <Section className="px-6">
        <Text>Hi {firstName ?? "there"},</Text>

        <Text>
          We received a request to reset the password for your Eurofit account.
          Click the button below to create a new password.
        </Text>

        <EmailButton href={resetPasswordLink}>Reset Password</EmailButton>

        <Text>
          If the button doesn&apos;t work, copy and paste this link into your
          browser: {resetPasswordLink}
        </Text>

        <Text>
          This link is valid for <strong>1 hour</strong>. After that,
          you&apos;ll need to submit a new request.
        </Text>

        <Text>
          If you didn&apos;t request a password reset, you can safely ignore
          this email. Your password will not change.
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

export function generateForgotPasswordEmailHTML(
  props: ForgotPasswordEmailProps
) {
  return render(<ForgotPasswordEmail {...props} />)
}

ForgotPasswordEmail.PreviewProps = {
  token: "example-token",
  firstName: "John",
  baseUrl: "https://eurofit.co.ke",
} satisfies ForgotPasswordEmailProps
