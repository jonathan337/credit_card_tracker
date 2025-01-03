import { Suspense } from 'react'
import { HeaderContent } from './HeaderContent'
import { LoadingScreen } from './LoadingScreen'

export function Header() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HeaderContent />
    </Suspense>
  )
}

