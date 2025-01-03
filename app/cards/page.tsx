import { Suspense } from 'react'
import { CardsContent } from './cards-content'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function CardsPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CardsContent />
    </Suspense>
  )
}

