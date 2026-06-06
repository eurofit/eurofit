"use client"

import { verifyEmail as verifyEmailAction } from "@/actions/auth/verify-email"
import verified from "@/assets/illustrations/verified.png"
import { Button, buttonVariants } from "@eurofit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { Spinner } from "@eurofit/ui/components/spinner"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"

export function VerifyEmail() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const {
    mutate: verifyEmail,
    isPending,
    isError,
    data,
  } = useMutation({
    mutationKey: [token].filter(Boolean),
    mutationFn: async (t: string) => {
      const result = await verifyEmailAction(t)
      if (!result.success) throw new Error(result.message)
      return result.data
    },
  })

  const calledRef = React.useRef(false)

  React.useEffect(() => {
    if (!token || calledRef.current) return
    calledRef.current = true
    verifyEmail(token)
  }, [token, verifyEmail])

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="size-6 text-green-600" aria-hidden />
          </div>
          <CardTitle className="text-center text-xl">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/resend-verification")}
          >
            Resend Verification Email
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-6 text-destructive" aria-hidden />
          </div>
          <CardTitle className="text-center text-xl">
            Link Expired or Already Used
          </CardTitle>
          <CardDescription className="text-center">
            This link may have expired or your email is already verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => router.push("/resend-verification")}
          >
            Get a New Link
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (data) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-6 flex size-32 items-center justify-center text-muted-foreground">
          <Image src={verified} fill alt="Verified" sizes="128px" />
        </div>
        <h3 className="text-2xl font-semibold text-balance">
          You&apos;re All Set!
        </h3>
        <p className="mt-1 text-center text-balance text-muted-foreground">
          Thank you for verifying your email.
        </p>
        <Link className={buttonVariants({ className: "mt-4" })} href="/login">
          Sign In →
        </Link>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex max-w-sm flex-col items-center gap-2">
        <Spinner className="size-8" />
        <h3 className="text-xl font-semibold text-balance">Verifying…</h3>
        <p className="text-sm text-balance text-muted-foreground">
          This won&apos;t take long.
        </p>
      </div>
    )
  }

  return null
}
