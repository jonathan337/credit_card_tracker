'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddTransactionForm from './AddTransactionForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useCards } from '@/hooks/useCards'
import { useTransactions } from '@/hooks/useTransactions'

export default function TransactionHistory() {
  const { cards, isLoading: cardsLoading } = useCards()
  const { transactions, addTransaction, isLoading: transactionsLoading } = useTransactions()
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  if (cardsLoading || transactionsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Transaction History</h2>
        <Button onClick={() => setShowAddTransaction(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Card</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {cards.find(c => c.id === transaction.card_id)?.card_number.slice(-4) || 'N/A'}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddTransaction && (
        <AddTransactionForm
          onClose={() => setShowAddTransaction(false)}
          onAddTransaction={addTransaction}
        />
      )}
    </div>
  )
}

