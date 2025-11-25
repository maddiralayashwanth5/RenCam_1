import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { mockTransactions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  History,
  TrendingUp,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

export default function RenterWallet() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter transactions for current user
  const userTransactions = mockTransactions.filter(t => t.user_id === user?.id)
  const recentTransactions = userTransactions.slice(0, 10)
  
  // Calculate transaction stats
  const totalDeposits = userTransactions
    .filter(t => ['deposit', 'refund'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = userTransactions
    .filter(t => ['withdrawal', 'booking_charge'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0)
  const currentBalance = user?.wallet_balance || 0

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (amount > 50000) {
      toast.error('Maximum deposit limit is ₹50,000')
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success(`₹${amount} deposited successfully!`)
      setDepositDialogOpen(false)
      setDepositAmount('')
      setIsProcessing(false)
      // In real app, this would update the user's wallet balance
    }, 2000)
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (amount > currentBalance) {
      toast.error('Insufficient balance')
      return
    }
    if (amount < 100) {
      toast.error('Minimum withdrawal amount is ₹100')
      return
    }

    setIsProcessing(true)
    
    // Simulate withdrawal processing
    setTimeout(() => {
      toast.success(`₹${amount} withdrawal initiated!`)
      setWithdrawDialogOpen(false)
      setWithdrawAmount('')
      setIsProcessing(false)
      // In real app, this would update the user's wallet balance
    }, 2000)
  }

  const handleLogout = () => {
    logout()
    navigate("/demo-auth")
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case 'booking_charge': return <Minus className="w-4 h-4 text-red-600" />
      case 'refund': return <Plus className="w-4 h-4 text-green-600" />
      default: return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return 'text-green-600'
      case 'withdrawal':
      case 'booking_charge':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Wallet</h1>
              <p className="text-sm text-muted-foreground">Manage your balance and transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <Button onClick={() => navigate("/demo-auth")}>Switch Role</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Balance Card */}
            <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="mb-4">
                <Wallet className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h2 className="text-sm text-muted-foreground mb-2">Current Balance</h2>
                <p className="text-5xl font-bold text-green-600 mb-4">₹{currentBalance.toLocaleString()}</p>
              </div>
              <div className="flex justify-center gap-4">
                <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Money
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Minus className="w-4 h-4" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ArrowDownLeft className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deposits</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalDeposits.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-red-600">₹{totalWithdrawals.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <History className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{userTransactions.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Transactions</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab("transactions")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {['deposit', 'refund'].includes(transaction.type) ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">All Transactions</h3>
              <div className="space-y-3">
                {userTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {['deposit', 'refund'].includes(transaction.type) ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Wallet Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-reload</p>
                    <p className="text-sm text-muted-foreground">Automatically add money when balance is low</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Payment Methods</p>
                    <p className="text-sm text-muted-foreground">Manage your saved payment methods</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about wallet transactions</p>
                  </div>
                  <Button variant="outline" size="sm">Settings</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Limits & Security</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Daily deposit limit:</span>
                  <span className="font-medium">₹50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily withdrawal limit:</span>
                  <span className="font-medium">₹25,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum withdrawal:</span>
                  <span className="font-medium">₹100</span>
                </div>
                <div className="flex justify-between">
                  <span>Withdrawal processing time:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Money to Wallet
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-green-600">₹{currentBalance.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount to Add</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="1"
                max="50000"
              />
              <p className="text-xs text-muted-foreground">
                Minimum: ₹1 • Maximum: ₹50,000 per day
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2000].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setDepositAmount(amount.toString())}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDepositDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount || parseFloat(depositAmount) <= 0}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Add Money'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="w-5 h-5" />
              Withdraw Money
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">₹{currentBalance.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="100"
                max={currentBalance.toString()}
              />
              <p className="text-xs text-muted-foreground">
                Minimum: ₹100 • Processing time: 1-2 business days
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setWithdrawDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
