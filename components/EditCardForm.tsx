import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/hooks/useCards'

interface EditCardFormProps {
  onClose: () => void
  onUpdateCard: (card: Card) => void
  card: Card
}

export default function EditCardForm({ onClose, onUpdateCard, card }: EditCardFormProps) {
  const [cardNumber, setCardNumber] = useState(card.cardNumber)
  const [cardholderName, setCardholderName] = useState(card.cardholderName)
  const [dueDate, setDueDate] = useState(card.dueDate)
  const [ttdLimit, setTtdLimit] = useState(card.ttdLimit.toString())
  const [usdLimit, setUsdLimit] = useState(card.usdLimit.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateCard({
      ...card,
      cardNumber,
      cardholderName,
      dueDate,
      ttdLimit: parseFloat(ttdLimit),
      usdLimit: parseFloat(usdLimit)
    })
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
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
          </div>
          <DialogFooter>
            <Button type="submit">Update Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

