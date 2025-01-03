'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddCardForm from './AddCardForm'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCards } from '@/hooks/useCards'
import { Card as CardType } from '@/types/database'

export default function CardOverview() {
  const { cards, loading, error, addCard } = useCards()
  const [showAddCard, setShowAddCard] = useState(false)

  if (loading) {
    return <div>Loading cards...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
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
                <li key={card.id} className="mb-2">
                  **** **** **** {card.card_number.slice(-4)}
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
    </div>
  )
}

