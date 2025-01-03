'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types/database'
import { useAuth } from './useAuth'

export function useTransactions() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        throw error
      }

      return (data || []).map(transaction => ({
        ...transaction,
        type: transaction.type as 'purchase' | 'payment'
      }))
    },
    enabled: !!user,
  })

  const addTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      console.log('Adding transaction:', transaction)
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ 
          ...transaction, 
          user_id: user.id,
          created_at: new Date().toISOString(),
          type: transaction.type // Explicitly include the type
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding transaction:', error)
        throw error
      }

      console.log('Added transaction:', data)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error) => {
      console.error('Mutation error:', error)
    }
  })

  const editTransaction = useMutation({
    mutationFn: async (transaction: Partial<Transaction>) => {
      if (!transaction.id) {
        throw new Error('Transaction ID is required')
      }

      console.log('Editing transaction:', transaction)
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...transaction,
          type: transaction.type // Explicitly include the type
        })
        .eq('id', transaction.id)
        .select()
        .single()

      if (error) {
        console.error('Error editing transaction:', error)
        throw error
      }

      console.log('Edited transaction:', data)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const deleteTransaction = useMutation({
    mutationFn: async (transactionId: string) => {
      if (!transactionId) {
        throw new Error('Transaction ID is required')
      }

      console.log('Deleting transaction:', transactionId)
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)

      if (error) {
        console.error('Error deleting transaction:', error)
        throw error
      }

      console.log('Deleted transaction:', transactionId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return {
    transactions,
    isLoading,
    error: error as Error | null,
    addTransaction: addTransaction.mutate,
    editTransaction: editTransaction.mutate,
    deleteTransaction: deleteTransaction.mutate,
  }
}

