'use client'

import { useEffect, useState } from 'react'
import { checkSupabaseHealth } from '@/lib/supabase'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"

export function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const runHealthCheck = async () => {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const result = await checkSupabaseHealth()
      if (!result.ok) {
        throw new Error(result.error || 'Failed to connect to Supabase')
      }
      setStatus('success')
    } catch (err) {
      console.error('Health check failed:', err)
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to connect to Supabase')
    }
  }

  useEffect(() => {
    runHealthCheck()
  }, [])

  if (status === 'loading') {
    return (
      <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-2">
        <ReloadIcon className="h-4 w-4 animate-spin" />
        <p className="text-sm">Checking Supabase connection...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{errorMessage || 'Failed to connect to Supabase'}</p>
          <button
            onClick={runHealthCheck}
            className="text-sm underline hover:no-underline cursor-pointer"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-green-50 border-green-600">
      <AlertTitle>Connected</AlertTitle>
      <AlertDescription>Successfully connected to Supabase</AlertDescription>
    </Alert>
  )
}

