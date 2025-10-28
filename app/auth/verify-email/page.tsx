"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleResendEmail = async () => {
    setIsResending(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        setMessage("No email found. Please sign up again.")
        return
      }

      // Note: Supabase doesn't have a direct resend verification API
      // Users need to sign up again or check their Supabase settings
      setMessage("If emails aren't being sent, please check your Supabase email configuration in the dashboard.")
    } catch (error) {
      console.error("[v0] Resend error:", error)
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We've sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Please check your email and click the verification link to activate your account. You can close this page
              once you've verified your email.
            </p>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Not receiving emails?</strong> Check your spam folder, or verify that email confirmation is
                enabled in your Supabase project settings. For development, you can disable email confirmation in
                Supabase Dashboard → Authentication → Settings → Email Auth.
              </AlertDescription>
            </Alert>

            {message && (
              <Alert>
                <AlertDescription className="text-xs">{message}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isResending}
            >
              {isResending ? "Checking..." : "Resend verification email"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
