import { Card } from "@/components/ui/card"

const steps = [
  {
    number: "1",
    title: "Browse & Book",
    description: "Search for cameras by category, check availability, and book your preferred equipment.",
  },
  {
    number: "2",
    title: "Confirm Details",
    description: "Review rental dates, pricing, and lender information. Secure payment through your wallet.",
  },
  {
    number: "3",
    title: "OTP Pickup",
    description: "Meet the lender in person. Both of you verify a 6-digit OTP to confirm the exchange.",
  },
  {
    number: "4",
    title: "Enjoy Your Shoot",
    description: "Use the camera during your rental period. Take amazing photos and videos.",
  },
  {
    number: "5",
    title: "OTP Return",
    description: "Return the camera to the lender. Both verify the OTP again to finalize the rental.",
  },
  {
    number: "6",
    title: "Leave Feedback",
    description: "Rate your experience and help build a trusted community of photographers.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How Rencam Works</h2>
          <p className="text-xl text-muted-foreground">Six simple steps to rent professional cameras</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <Card className="p-6 h-full">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
