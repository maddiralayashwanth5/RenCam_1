import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Camera, 
  Upload, 
  Plus, 
  Minus,
  ArrowLeft,
  Check
} from "lucide-react"
import { toast } from "sonner"

interface CameraSpec {
  key: string
  value: string
}

export default function AddCameraPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricePerDay: '',
    availableFrom: '',
    availableTo: '',
    imageUrl: ''
  })
  
  const [specs, setSpecs] = useState<CameraSpec[]>([
    { key: 'sensor', value: '' },
    { key: 'video', value: '' },
    { key: 'iso', value: '' },
    { key: 'fps', value: '' },
    { key: 'weight', value: '' }
  ])

  const categories = [
    'DSLR',
    'Mirrorless',
    'Action Camera',
    'Instant Camera',
    'Film Camera',
    'Compact Camera',
    'Gimbal Camera',
    'Drone Camera'
  ]

  const sampleImages = [
    'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&h=800&fit=crop&q=80'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    setSpecs(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ))
  }

  const addSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }])
  }

  const removeSpec = (index: number) => {
    if (specs.length > 1) {
      setSpecs(prev => prev.filter((_, i) => i !== index))
    }
  }

  const validateForm = () => {
    const required = ['name', 'description', 'category', 'pricePerDay', 'availableFrom', 'availableTo']
    const missing = required.filter(field => !formData[field as keyof typeof formData])
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`)
      return false
    }
    
    if (parseFloat(formData.pricePerDay) <= 0) {
      toast.error('Price per day must be greater than 0')
      return false
    }
    
    if (new Date(formData.availableFrom) >= new Date(formData.availableTo)) {
      toast.error('Available from date must be before available to date')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Camera added successfully!')
      setIsSubmitting(false)
      navigate('/lender/dashboard')
    }, 2000)
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/lender/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add New Camera</h1>
                <p className="text-sm text-muted-foreground">List your camera for rent</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Lender: {user?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Camera Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Canon EOS R5"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your camera, its features, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Pricing & Availability */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Pricing & Availability</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  placeholder="2500"
                  value={formData.pricePerDay}
                  onChange={(e) => handleInputChange('pricePerDay', e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From *</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availableTo">Available To *</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => handleInputChange('availableTo', e.target.value)}
                  min={formData.availableFrom || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Camera Image */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Camera Image</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sampleImages.map((imageUrl, index) => (
                  <div 
                    key={index}
                    className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      formData.imageUrl === imageUrl 
                        ? 'border-green-500 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Sample ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    {formData.imageUrl === imageUrl && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Select a sample image above, or add your own image URL below
              </p>
              <Input
                placeholder="Or paste your image URL here"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              />
            </div>
          </Card>

          {/* Specifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Specifications</h3>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="w-4 h-4 mr-2" />
                Add Spec
              </Button>
            </div>
            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    placeholder="e.g., sensor"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="e.g., 45MP Full-Frame"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {specs.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeSpec(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Preview */}
          {formData.name && formData.imageUrl && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Preview</h3>
              <div className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{formData.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{formData.category}</p>
                    <p className="text-lg font-bold text-green-600">₹{formData.pricePerDay}/day</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {formData.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/lender/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Adding Camera...' : 'Add Camera'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
