import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Photographer",
    content:
      "Rencam made it so easy to try high-end cameras before investing. The OTP verification gave me peace of mind!",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Mike Johnson",
    role: "Camera Enthusiast",
    content: "Great platform. Found amazing equipment at fair prices. The lender was responsive and professional.",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Emma Rodriguez",
    role: "Content Creator",
    content:
      "Love being able to rent specialized cameras for specific projects. Saved me thousands compared to buying.",
    avatar: "/placeholder-user.jpg",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Photographers</h2>
          <p className="text-xl text-muted-foreground">Join thousands of creators who trust Rencam</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="p-6">
              <p className="text-lg mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
