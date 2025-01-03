'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card } from '@/types/database'
import { useAuth } from './useAuth'

export function useCards() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: cards = [], isLoading, error } = useQuery({
    queryKey: ['cards', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(card => ({
        ...card,
        daysUntilReset: card.cycle_date ? calculateDaysUntilReset(card.cycle_date) : null
      })) || []
    },
    enabled: !!user,
  })

  const addCard = useMutation({
    mutationFn: async (card: Omit<Card, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('cards')
        .insert([{ ...card, user_id: user?.id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', user?.id] })
    },
  })

  const editCard = useMutation({
    mutationFn: async (card: Partial<Card> & { id: string }) => {
      const { data, error } = await supabase
        .from('cards')
        .update(card)
        .eq('id', card.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', user?.id] })
    },
  })

  const deleteCard = useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', user?.id] })
    },
  })

  return {
    cards,
    isLoading,
    error: error as Error | null,
    addCard: addCard.mutate,
    editCard: editCard.mutate,
    deleteCard: deleteCard.mutate,
  }
}

function calculateDaysUntilReset(cycleDate: number): number {
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let resetDate = new Date(currentYear, currentMonth, cycleDate)

  if (currentDay > cycleDate) {
    resetDate = new Date(currentYear, currentMonth + 1, cycleDate)
  }

  const timeDiff = resetDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

