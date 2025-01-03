'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
    },
    {
      href: '/cards',
      label: 'Card Management',
    },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === route.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

