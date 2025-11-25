import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

interface BookingCalendarProps {
  selectedDates: { from: Date | null; to: Date | null }
  onDatesChange: (dates: { from: Date | null; to: Date | null }) => void
}

export default function BookingCalendar({ selectedDates, onDatesChange }: BookingCalendarProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Select Dates</h3>
      <Calendar
        mode="range"
        selected={{
          from: selectedDates.from || undefined,
          to: selectedDates.to || undefined,
        }}
        onSelect={(range) => {
          if (range) {
            onDatesChange({
              from: range.from || null,
              to: range.to || null,
            })
          }
        }}
        disabled={(date) => date < new Date()}
        className="rounded-md border"
      />
      {selectedDates.from && selectedDates.to && (
        <div className="mt-4 space-y-3">
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
