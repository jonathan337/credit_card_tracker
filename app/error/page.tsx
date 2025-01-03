'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  useEffect(() => {
    // Log the error to your error tracking service
    console.error('Server-side error occurred')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We apologize, but something went wrong on our end. Please try again later.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            Go Home
          </Button>
          <Button
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

