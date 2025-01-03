'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Credit Card Forex Tracker</h1>
        <p className="text-lg mb-8">Track your credit card forex spending and payment due dates</p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">Register</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

