'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Navigation } from './Navigation'
import { usePathname } from 'next/navigation'

export function Header() {
  const { user, signOut, loading } = useAuth()
  const pathname = usePathname()

  return (
    <header>
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold">
            Credit Card Forex Tracker
          </Link>
          <nav>
            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
      <Navigation />
    </header>
  )
}

