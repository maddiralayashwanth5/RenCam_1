"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

interface BookingCalendarProps {
  cameraId: string
  pricePerDay: number
  selectedDates: { from: Date | undefined; to: Date | undefined }
  onDatesChange: (dates: { from: Date | undefined; to: Date | undefined }) => void
}

export default function BookingCalendar({ cameraId, pricePerDay, selectedDates, onDatesChange }: BookingCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date())

  const handleDateClick = (date: Date) => {
    if (!selectedDates.from) {
      onDatesChange({ from: date, to: undefined })
    } else if (!selectedDates.to && date > selectedDates.from) {
      onDatesChange({ from: selectedDates.from, to: date })
    } else {
      onDatesChange({ from: date, to: undefined })
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Select Dates</h3>

      <div className="mb-6 flex justify-center">
        <Calendar
          mode="range"
          selected={{
            from: selectedDates.from,
            to: selectedDates.to,
          }}
          onSelect={(range: any) => {
            onDatesChange({
              from: range?.from,
              to: range?.to,
            })
          }}
          disabled={(date) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return date < today
          }}
        />
      </div>

      {selectedDates.from && selectedDates.to && (
        <div className="space-y-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Booking Period</p>
            <p className="font-semibold">
              {selectedDates.from.toLocaleDateString()} to {selectedDates.to.toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      )}
    </Card>
  )
}
