'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CardOverview from '@/components/CardOverview'
import TransactionHistory from '@/components/TransactionHistory'

export default function Cards() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading) return null

  if (!user) return null

  return (
    <main className="container px-4 py-8">
      <div className="space-y-8">
        <CardOverview />
        <TransactionHistory />
      </div>
    </main>
  )
}

