'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Transaction } from '@/types/database'
import { useCards } from '@/hooks/useCards'

interface EditTransactionFormProps {
  transaction: Transaction
  onClose: () => void
  onEditTransaction: (transaction: Partial<Transaction>) => void
}

export default function EditTransactionForm({ transaction, onClose, onEditTransaction }: EditTransactionFormProps) {
  const { cards, isLoading } = useCards()
  const [cardId, setCardId] = useState(transaction.card_id)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [date, setDate] = useState(transaction.date)
  const [description, setDescription] = useState(transaction.description)
  const [type, setType] = useState<'purchase' | 'payment'>(transaction.type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEditTransaction({
      id: transaction.id,
      card_id: cardId,
      amount: parseFloat(amount),
      date,
      description,
      type
    })
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card" className="text-right">
                Card
              </Label>
              <div className="col-span-3">
                <Select onValueChange={setCardId} value={cardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a card" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading cards...
                      </SelectItem>
                    ) : cards.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No cards available
                      </SelectItem>
                    ) : (
                      cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.cardholder_name} (**** {card.card_number.slice(-4)})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setType(value as 'purchase' | 'payment')} value={type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

