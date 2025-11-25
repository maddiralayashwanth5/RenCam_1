import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-20 px-4 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Renting?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join Rencam today and access premium camera equipment on your terms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup?role=renter">
            <Button size="lg" className="text-base">
              Get Started as Renter
            </Button>
          </Link>
          <Link href="/auth/signup?role=lender">
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              List Your Cameras
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
