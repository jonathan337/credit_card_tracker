'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash } from 'lucide-react'
import AddCardForm from './AddCardForm'
import EditCardForm from './EditCardForm'
import { DeleteCardDialog } from './DeleteCardDialog'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCards } from '@/hooks/useCards'
import { Card as CardType } from '@/types/database'

export default function CardOverview() {
  const { cards, isLoading, error, addCard, editCard, deleteCard } = useCards()
  const [showAddCard, setShowAddCard] = useState(false)
  const [editingCard, setEditingCard] = useState<CardType | null>(null)
  const [deletingCard, setDeletingCard] = useState<CardType | null>(null)

  if (isLoading) {
    return <div>Loading cards...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  const groupedCards = cards.reduce((acc, card) => {
    if (!acc[card.cardholder_name]) {
      acc[card.cardholder_name] = []
    }
    acc[card.cardholder_name].push(card)
    return acc
  }, {} as Record<string, CardType[]>)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Cards Overview</h2>
        <Button onClick={() => setShowAddCard(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Card
        </Button>
      </div>
      {Object.entries(groupedCards).map(([cardholderName, cards]) => (
        <Card key={cardholderName} className="mb-4">
          <CardHeader>
            <CardTitle>{cardholderName}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {cards.map(card => (
                <li key={card.id} className="mb-2 flex justify-between items-center">
                  <span>**** **** **** {card.card_number.slice(-4)}</span>
                  <div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingCard(card)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeletingCard(card)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
      {showAddCard && (
        <AddCardForm 
          onClose={() => setShowAddCard(false)} 
          onAddCard={addCard}
        />
      )}
      {editingCard && (
        <EditCardForm
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onEditCard={editCard}
        />
      )}
      {deletingCard && (
        <DeleteCardDialog
          isOpen={!!deletingCard}
          onClose={() => setDeletingCard(null)}
          onConfirm={() => {
            deleteCard(deletingCard.id)
            setDeletingCard(null)
          }}
          cardNumber={deletingCard.card_number}
        />
      )}
    </div>
  )
}

