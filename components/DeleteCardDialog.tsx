import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteCardDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  cardNumber: string
}

export function DeleteCardDialog({ isOpen, onClose, onConfirm, cardNumber }: DeleteCardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete Card</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete the card ending in {cardNumber.slice(-4)}?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

