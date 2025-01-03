'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChevronDown, ChevronRight, PencilIcon, TrashIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCards } from '@/hooks/useCards'
import { useTransactions } from '@/hooks/useTransactions'
import AddTransactionForm from '@/components/AddTransactionForm'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import EditTransactionForm from '@/components/EditTransactionForm'
import { DeleteTransactionDialog } from '@/components/DeleteTransactionDialog'

interface Transaction {
  id: string;
  card_id: string;
  type: 'purchase' | 'payment';
  amount: number;
  description: string;
  date: string;
}


export function DashboardClient() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { cards = [], isLoading: cardsLoading, error: cardsError } = useCards()
  const { transactions = [], addTransaction, deleteTransaction, isLoading: transactionsLoading, error: transactionsError } = useTransactions()
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [expandedCardholders, setExpandedCardholders] = useState<string[]>([])
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const forexStats = useMemo(() => {
    if (!cards?.length) return { totalLimit: 0, utilized: 0, utilizationPercentage: 0 }
    
    const totalLimit = cards.reduce((sum, card) => sum + card.usd_limit, 0)
    // Fix: Ensure we're properly filtering by user_id and counting purchases
    const utilized = transactions
      .filter(t => cards.some(c => c.id === t.card_id)) // Only count transactions for our cards
      .reduce((sum, t) => {
        return t.type === 'purchase' ? sum + t.amount : sum
      }, 0)
    const utilizationPercentage = (utilized / totalLimit) * 100

    return {
      totalLimit,
      utilized,
      utilizationPercentage: Math.min(utilizationPercentage, 100)
    }
  }, [cards, transactions])

  const cardholderUtilization = useMemo(() => {
    if (!cards?.length) return {}

    const utilization = cards.reduce((acc, card) => {
      // Fix: Ensure we're properly filtering transactions for each card
      const cardTransactions = transactions.filter(t => t.card_id === card.id)
      const utilized = cardTransactions.reduce((sum, t) => {
        return t.type === 'purchase' ? sum + t.amount : sum
      }, 0)
      const utilizationPercentage = (utilized / card.usd_limit) * 100

      const cardData = {
        ...card,
        utilized,
        utilizationPercentage: Math.min(utilizationPercentage, 100),
        remainingLimit: card.usd_limit - utilized,
        cycle_date: card.cycle_date || 1, // Provide default value if cycle_date is null
        daysUntilReset: card.cycle_date ? calculateDaysUntilReset(card.cycle_date) : null
      }

      if (!acc[card.cardholder_name]) {
        acc[card.cardholder_name] = []
      }
      acc[card.cardholder_name].push(cardData)
      return acc
    }, {} as Record<string, typeof cards>)

    // Calculate totals for each cardholder
    Object.keys(utilization).forEach(cardholder => {
      const cardholderCards = utilization[cardholder]
      const totalLimit = cardholderCards.reduce((sum, card) => sum + card.usd_limit, 0)
      const totalUtilized = cardholderCards.reduce((sum, card) => {
        // Fix: Don't skip the total card, but ensure we're not double counting
        return card.id.includes('total') ? sum : sum + card.utilized
      }, 0)
      const totalUtilizationPercentage = (totalUtilized / totalLimit) * 100

      utilization[cardholder].unshift({
        id: `${cardholder}-total`,
        cardholder_name: cardholder,
        card_number: 'Total',
        usd_limit: totalLimit,
        utilized: totalUtilized,
        utilizationPercentage: Math.min(totalUtilizationPercentage, 100),
        remainingLimit: totalLimit - totalUtilized,
        cycle_date: cardholderCards[0]?.cycle_date || 1,
        daysUntilReset: Math.min(...cardholderCards.filter(card => card.daysUntilReset !== null).map(card => card.daysUntilReset || 30))
      } as typeof cardholderCards[0])
    })

    return utilization
  }, [cards, transactions])

  const toggleCardholderExpansion = (cardholderName: string) => {
    setExpandedCardholders(prev => 
      prev.includes(cardholderName)
        ? prev.filter(name => name !== cardholderName)
        : [...prev, cardholderName]
    )
  }

  if (authLoading || cardsLoading || transactionsLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-[200px] bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (cardsError || transactionsError) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {cardsError?.message || transactionsError?.message || 'Failed to load dashboard data'}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </Alert>
      </div>
    )
  }

  if (!user) return null

  return (
    <main className="container px-4 py-8 bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowAddTransaction(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Forex Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${forexStats.totalLimit.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forex Utilized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${forexStats.utilized.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Forex Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-full bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-300 to-green-500"
                style={{ width: `${forexStats.utilizationPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                ${forexStats.utilized.toFixed(2)} used
              </span>
              <span>
                {forexStats.utilizationPercentage.toFixed(1)}% of ${forexStats.totalLimit.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 mb-8">
        {Object.entries(cardholderUtilization).map(([cardholderName, cards]) => (
          <Collapsible 
            key={cardholderName}
            open={expandedCardholders.includes(cardholderName)}
            onOpenChange={() => toggleCardholderExpansion(cardholderName)}
          >
            <Card>
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <CardTitle className="flex justify-between items-center cursor-pointer">
                    <span>{cardholderName}</span>
                    {expandedCardholders.includes(cardholderName) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CardTitle>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-6">
                    {cards.map((card, index) => (
                      <div 
                        key={card.id} 
                        className={`${
                          index === 0 
                            ? 'bg-muted p-4 rounded-lg border-2 border-primary mb-6' 
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`${index === 0 ? 'text-lg font-bold' : 'font-medium'}`}>
                            {index === 0 ? 'Total' : `**** ${card.card_number.slice(-4)}`}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {card.utilizationPercentage.toFixed(1)}% used
                          </span>
                        </div>
                        <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-300 to-green-500"
                            style={{ width: `${card.utilizationPercentage}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                          <div>
                            <div className="text-muted-foreground">Used</div>
                            <div className="font-medium">${card.utilized.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Remaining</div>
                            <div className="font-medium">${card.remainingLimit.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total Limit</div>
                            <div className="font-medium">${card.usd_limit.toFixed(2)}</div>
                          </div>
                          {card.daysUntilReset && (
                            <div>
                              <div className="text-muted-foreground">Days Until Reset</div>
                              <div className="font-medium">{card.daysUntilReset}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions?.length ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map(transaction => {
                const card = cards?.find(c => c.id === transaction.card_id)
                return (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {card ? `${card.cardholder_name} (**** ${card.card_number.slice(-4)})` : 'Unknown Card'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className={`font-medium ${transaction.type === 'payment' ? 'text-green-600' : ''}`}>
                          {transaction.type === 'payment' ? '-' : ''}${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTransaction(transaction)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingTransaction(transaction)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No transactions yet
            </div>
          )}
        </CardContent>
      </Card>

      {showAddTransaction && (
        <AddTransactionForm
          onClose={() => setShowAddTransaction(false)}
          onAddTransaction={(transaction) => {
            addTransaction(transaction)
            setShowAddTransaction(false)
          }}
        />
      )}

      {editingTransaction && (
        <EditTransactionForm
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onEditTransaction={(transaction) => {
            // Placeholder for editTransaction function.  Needs to be implemented elsewhere.
            editTransaction(transaction)
            setEditingTransaction(null)
          }}
        />
      )}
      {deletingTransaction && (
        <DeleteTransactionDialog
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={async () => {
            if (deletingTransaction) {
              await deleteTransaction(deletingTransaction.id)
              setDeletingTransaction(null)
            }
          }}
          transactionDescription={deletingTransaction.description}
        />
      )}
    </main>
  )
}

function calculateDaysUntilReset(cycleDate: number): number {
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let resetDate = new Date(currentYear, currentMonth, cycleDate)

  // If we've passed the cycle date this month, look to next month
  if (currentDay > cycleDate) {
    resetDate = new Date(currentYear, currentMonth + 1, cycleDate)
  }

  const timeDiff = resetDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// Placeholder function. Needs to be implemented elsewhere based on your backend/data handling.
const editTransaction = (transaction: Transaction) => {
  console.log("Transaction to edit:", transaction);
  // Implement your transaction editing logic here.  This might involve a fetch call to update the transaction on your backend.
}

