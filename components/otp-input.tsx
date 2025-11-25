"use client"

import type React from "react"

import { useRef } from "react"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
}

export default function OTPInput({ value, onChange }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return

    const newValue = (value + val).slice(0, 6)
    const digits = newValue.split("")

    // Pad with empty strings
    while (digits.length < 6) {
      digits.push("")
    }

    const newOTP = digits.slice(0, 6).join("")
    onChange(newOTP)

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && index > 0 && !value[index]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const digits = value.split("")
  while (digits.length < 6) {
    digits.push("")
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-2xl font-bold"
        />
      ))}
    </div>
  )
}
