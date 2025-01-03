import { Suspense } from 'react'
import { DashboardContent } from './dashboard-content'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DashboardContent />
    </Suspense>
  )
}

