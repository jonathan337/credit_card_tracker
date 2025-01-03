'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || ''

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {from ? `The page "${from}" could not be found.` : 'The requested page could not be found.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/')}
          >
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

