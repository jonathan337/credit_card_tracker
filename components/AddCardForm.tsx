import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/types/database'

interface AddCardFormProps {
  onClose: () => void
  onAddCard: (card: Omit<Card, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  card?: Card | null;
}

export default function AddCardForm({ onClose, onAddCard, card }: AddCardFormProps) {
  const [cardNumber, setCardNumber] = useState(card?.card_number ?? '')
  const [cardholderName, setCardholderName] = useState(card?.cardholder_name ?? '')
  const [dueDate, setDueDate] = useState(card?.due_date?.toString() ?? '')
  const [ttdLimit, setTtdLimit] = useState((card?.ttd_limit ?? 0).toString())
  const [usdLimit, setUsdLimit] = useState((card?.usd_limit ?? 0).toString())
  const [cycleDate, setCycleDate] = useState(card?.cycle_date?.toString() ?? '1')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onAddCard({
        card_number: cardNumber,
        cardholder_name: cardholderName,
        due_date: dueDate,
        ttd_limit: parseFloat(ttdLimit),
        usd_limit: parseFloat(usdLimit),
        cycle_date: parseInt(cycleDate, 10)
      })
      onClose()
    } catch (error) {
      console.error('Error adding card:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardholderName" className="text-right">
                Cardholder Name
              </Label>
              <Input
                id="cardholderName"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ttdLimit" className="text-right">
                TTD Limit
              </Label>
              <Input
                id="ttdLimit"
                type="number"
                value={ttdLimit}
                onChange={(e) => setTtdLimit(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usdLimit" className="text-right">
                USD Limit
              </Label>
              <Input
                id="usdLimit"
                type="number"
                value={usdLimit}
                onChange={(e) => setUsdLimit(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cycleDate" className="text-right">
                Cycle Date
              </Label>
              <Input
                id="cycleDate"
                type="number"
                value={cycleDate}
                onChange={(e) => setCycleDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

