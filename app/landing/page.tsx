"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Shield, Calendar, Wallet, Users, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-600 font-bold text-2xl">
            Rencam
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/demo-auth")}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => router.push("/demo-auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-blue-600">Rent Professional</span>
            <br />
            <span className="text-purple-300">Cameras</span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Connect with verified lenders, book premium photography equipment,
            <br />and bring your creative vision to life—all without the high cost of
            ownership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => router.push("/demo-auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Browse Cameras
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/demo-auth")}
              className="border-gray-300"
            >
              Become a Lender
            </Button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <div className="bg-gray-100 rounded-lg p-8 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                <Image src="/placeholder.svg" alt="Camera" width={32} height={32} />
              </div>
              <p className="text-gray-400">Camera showcase image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Why Choose Rencam?</h2>
            <p className="text-gray-600">Everything you need for secure, transparent camera rentals</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Secure OTP Verification</h3>
              <p className="text-gray-600 text-sm">
                Both renter and lender verify with a 6-digit OTP at pickup and return for complete transaction security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Easy Booking System</h3>
              <p className="text-gray-600 text-sm">
                Intuitive calendar interface to check availability, book cameras, and manage your rental schedule.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Instant Wallet</h3>
              <p className="text-gray-600 text-sm">
                Manage payments, view transaction history, and track your wallet balance in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Direct Connection</h3>
              <p className="text-gray-600 text-sm">
                Rent directly from verified lenders —no middleman, just transparent pricing and honest transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How Rencam Works</h2>
            <p className="text-gray-600">Six simple steps to rent professional cameras</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Browse & Book</h3>
              <p className="text-gray-600 text-sm">
                Search for cameras by category, check availability, and book your preferred equipment.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Confirm Details</h3>
              <p className="text-gray-600 text-sm">
                Review rental dates, pricing, and lender information. Secure payment through your wallet.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">OTP Pickup</h3>
              <p className="text-gray-600 text-sm">
                Meet the lender in person. Both of you verify a 6-digit OTP to confirm the exchange.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                4
              </div>
              <h3 className="font-bold mb-2">Enjoy Your Shoot</h3>
              <p className="text-gray-600 text-sm">
                Use the camera during your rental period. Take amazing photos and videos.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                5
              </div>
              <h3 className="font-bold mb-2">OTP Return</h3>
              <p className="text-gray-600 text-sm">
                Return the camera to the lender. Both verify the OTP again to finalize the rental.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                6
              </div>
              <h3 className="font-bold mb-2">Leave Feedback</h3>
              <p className="text-gray-600 text-sm">
                Rate your experience and help build a trusted community of photographers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Loved by Photographers</h2>
            <p className="text-gray-600">Join thousands of creators who trust Rencam</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">
                "Rencam made it so easy to try high-end cameras before investing. The OTP verification gave me peace of mind!"
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-bold">Sarah Chen</p>
                  <p className="text-gray-600 text-sm">Photographer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">
                "Great platform. Found amazing equipment at fair prices. The lender was responsive and professional."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-bold">Mike Johnson</p>
                  <p className="text-gray-600 text-sm">Camera Enthusiast</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">
                "Love being able to rent specialized cameras for specific projects. Saved me thousands compared to buying."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-bold">Emma Rodriguez</p>
                  <p className="text-gray-600 text-sm">Content Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Ready to Start Renting?</h2>
          <p className="text-gray-600 mb-8">
            Join Rencam today and access premium camera equipment on your terms.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => router.push("/demo-auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Get Started as Renter
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/demo-auth")}
              className="border-gray-300"
            >
              List Your Cameras
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-blue-600 font-bold text-xl">
                Rencam
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                The camera rental platform for photographers
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="/demo-auth" className="text-gray-600 hover:text-gray-900 text-sm">
                About
              </Link>
              <Link href="/demo-auth" className="text-gray-600 hover:text-gray-900 text-sm">
                How It Works
              </Link>
              <Link href="/demo-auth" className="text-gray-600 hover:text-gray-900 text-sm">
                Support
              </Link>
              <Link href="/demo-auth" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Rencam. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
