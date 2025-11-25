import { Card } from "@/components/ui/card"
import { Shield, Calendar, Zap, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure OTP Verification",
    description:
      "Both renter and lender verify with a 6-digit OTP at pickup and return for complete transaction security.",
  },
  {
    icon: Calendar,
    title: "Easy Booking System",
    description: "Intuitive calendar interface to check availability, book cameras, and manage your rental schedule.",
  },
  {
    icon: Zap,
    title: "Instant Wallet",
    description: "Manage payments, view transaction history, and track your wallet balance in real-time.",
  },
  {
    icon: Users,
    title: "Direct Connection",
    description: "Rent directly from verified lenders—no middleman, just transparent pricing and honest transactions.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Rencam?</h2>
          <p className="text-xl text-muted-foreground">Everything you need for secure, transparent camera rentals</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
