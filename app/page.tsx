import { Suspense } from 'react'
import { HomeContent } from './home-content'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeContent />
    </Suspense>
  )
}

