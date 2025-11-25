"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  category: string
  onCategoryChange: (category: string) => void
  priceRange: number[]
  onPriceChange: (range: number[]) => void
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "dslr", label: "DSLR" },
  { value: "mirrorless", label: "Mirrorless" },
  { value: "vintage", label: "Vintage" },
  { value: "action", label: "Action" },
  { value: "film", label: "Film" },
]

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: SearchFiltersProps) {
  return (
    <Card className="p-6 h-fit sticky top-24">
      <h3 className="font-bold text-lg mb-6">Filters</h3>

      <div className="space-y-6">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Camera model..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="category" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            Price per Day: ₹{priceRange[0]} - ₹{priceRange[1]}
          </Label>
          <Slider value={priceRange} onValueChange={onPriceChange} min={0} max={10000} step={500} className="mt-4" />
        </div>
      </div>
    </Card>
  )
}
