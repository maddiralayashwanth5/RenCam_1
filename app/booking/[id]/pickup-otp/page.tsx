"use client"

import { useState, use } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Lock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OTPInput from "@/components/otp-input"

export default function PickupOTPPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const resolvedParams = use(params)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [step, setStep] = useState<"input" | "verified">("input")

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch(`/api/bookings/${resolvedParams.id}/verify-pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Verification Failed",
          description: data.error || "Invalid OTP",
          variant: "destructive",
        })
        return
      }

      setStep("verified")
      toast({
        title: "Success",
        description: "Pickup verified! Enjoy your rental.",
      })

      setTimeout(() => {
        router.push("/renter/bookings")
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (step === "verified") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Pickup Verified!</h1>
          <p className="text-muted-foreground mb-6">Your booking is now active. Enjoy your rental period!</p>
          <p className="text-sm text-muted-foreground">Redirecting to bookings...</p>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Pickup Verification</h1>
          <p className="text-muted-foreground">Enter the 6-digit OTP provided by the lender</p>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Enter OTP Code</h2>
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                Get the 6-digit code from the lender and enter it below. This code will be generated and shared with
                both you and the lender.
              </p>

              <OTPInput value={otp} onChange={setOtp} />

              <Button onClick={handleVerifyOTP} disabled={isVerifying || otp.length !== 6} className="w-full" size="lg">
                {isVerifying ? "Verifying..." : "Verify Pickup"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-blue-900 dark:text-blue-200 mb-2">How it works</p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Lender generates a unique 6-digit OTP</li>
                  <li>• Both you and lender enter the same OTP</li>
                  <li>• Pickup is verified on blockchain</li>
                  <li>• Rental period officially begins</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
