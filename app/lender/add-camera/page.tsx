"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "DSLR",
  "Mirrorless",
  "Film Camera",
  "Action Camera",
  "Vintage",
  "Smartphone Rig",
  "Lens",
  "Lighting",
]

export default function AddCameraPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price_per_day: Number.parseFloat(formData.get("price_per_day") as string),
      specs: JSON.stringify({
        brand: formData.get("brand"),
        model: formData.get("model"),
        condition: formData.get("condition"),
      }),
    }

    try {
      const response = await fetch("/api/cameras/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create camera")

      toast({
        title: "Success",
        description: "Camera listing created!",
      })

      router.push("/lender/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">List Your Camera</h1>
          <p className="text-muted-foreground">Add a new camera to your inventory and start earning</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Camera Name *</Label>
                <Input id="name" name="name" placeholder="Canon EOS R5" required />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input id="brand" name="brand" placeholder="Canon" required />
              </div>

              <div>
                <Label htmlFor="model">Model *</Label>
                <Input id="model" name="model" placeholder="EOS R5" required />
              </div>

              <div>
                <Label htmlFor="price_per_day">Price per Day ($) *</Label>
                <Input
                  id="price_per_day"
                  name="price_per_day"
                  type="number"
                  min="5"
                  step="0.01"
                  placeholder="85.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select name="condition" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your camera, its features, and what comes in the package..."
                rows={5}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
