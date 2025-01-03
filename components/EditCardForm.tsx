import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/types/database'

interface EditCardFormProps {
  card: Card
  onClose: () => void
  onEditCard: (card: Partial<Card> & { id: string }) => void
}

export default function EditCardForm({ card, onClose, onEditCard }: EditCardFormProps) {
  const [cardNumber, setCardNumber] = useState(card.card_number)
  const [cardholderName, setCardholderName] = useState(card.cardholder_name)
  const [cycleDate, setCycleDate] = useState(card.cycle_date.toString())
  const [ttdLimit, setTtdLimit] = useState(card.ttd_limit.toString())
  const [usdLimit, setUsdLimit] = useState(card.usd_limit.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEditCard({
      id: card.id,
      card_number: cardNumber,
      cardholder_name: cardholderName,
      cycle_date: parseInt(cycleDate),
      ttd_limit: parseFloat(ttdLimit),
      usd_limit: parseFloat(usdLimit)
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
              <Label htmlFor="cycleDate" className="text-right">
                Cycle Date
              </Label>
              <Input
                id="cycleDate"
                type="number"
                min="1"
                max="31"
                value={cycleDate}
                onChange={(e) => setCycleDate(e.target.value)}
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
                step="0.01"
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
                step="0.01"
                value={usdLimit}
                onChange={(e) => setUsdLimit(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

