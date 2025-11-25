"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function CameraHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Rent Professional Cameras
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with verified lenders, book premium photography equipment, and bring your creative vision to life—all
          without the high cost of ownership.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/browse">
            <Button size="lg" className="text-base">
              Browse Cameras
            </Button>
          </Link>
          <Link href="/auth/signup?role=lender">
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Become a Lender
            </Button>
          </Link>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl">
          <Image src="/placeholder.svg?key=3h44l" alt="Professional cameras" fill className="object-cover" />
        </div>
      </div>
    </section>
  )
}
