"use client"

import { useState, use } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OTPInput from "@/components/otp-input"

export default function ReturnOTPPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
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
      const response = await fetch(`/api/bookings/${resolvedParams.id}/verify-return`, {
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
        description: "Return verified! Thanks for renting with us.",
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
          <h1 className="text-2xl font-bold mb-2">Return Verified!</h1>
          <p className="text-muted-foreground mb-6">Transaction completed successfully. Thank you for renting!</p>
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
          <h1 className="text-4xl font-bold mb-2">Return Verification</h1>
          <p className="text-muted-foreground">Enter the 6-digit OTP from the lender to verify camera return</p>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Enter Return OTP Code</h2>
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                The lender will generate a new OTP for the return. Enter it below to finalize your rental.
              </p>

              <OTPInput value={otp} onChange={setOtp} />

              <Button onClick={handleVerifyOTP} disabled={isVerifying || otp.length !== 6} className="w-full" size="lg">
                {isVerifying ? "Verifying..." : "Verify Return"}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">Before you proceed:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Ensure the camera is in good condition</li>
              <li>Check all accessories are included</li>
              <li>The lender will inspect the camera</li>
              <li>Both verify the OTP to finalize</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  )
}
