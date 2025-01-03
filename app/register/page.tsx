import { Suspense } from 'react'
import { RegisterForm } from './register-form'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center flex-grow bg-gray-50">
      <Suspense fallback={<LoadingScreen />}>
        <RegisterForm />
      </Suspense>
    </main>
  )
}

