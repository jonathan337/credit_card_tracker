import { Suspense } from 'react'
import { NotFoundContent } from './not-found-content'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function NotFoundPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <NotFoundContent />
    </Suspense>
  )
}

