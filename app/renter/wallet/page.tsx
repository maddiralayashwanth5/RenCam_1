"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "booking_charge" | "refund"
  amount: number
  description: string
  created_at: string
}

export default function WalletPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [depositAmount, setDepositAmount] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "renter")) {
      router.push("/auth/login")
    }
  }, [mounted, loading, user, router])

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDepositing(true)

    try {
      toast({
        title: "Success",
        description: "Funds added to your wallet!",
      })
      setDepositAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsDepositing(false)
    }
  }

  if (!mounted || loading || !user) {
    return <div />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground mb-8">Manage your account balance</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-8 col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Current Balance</h2>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
            <p className="text-5xl font-bold text-primary mb-8">${user.wallet_balance || 0}</p>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Add Funds</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button type="submit" disabled={isDepositing || !depositAmount}>
                {isDepositing ? "Processing..." : "Add to Wallet"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Deposited</p>
                  <p className="font-bold">$500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="font-bold">$250</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{tx.type.replace("_", " ")}</p>
                    <p className="text-sm text-muted-foreground">{tx.description}</p>
                  </div>
                  <p className={`font-bold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
