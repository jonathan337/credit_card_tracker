import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a response early
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req: request, res })
    
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    
    // For API routes, return JSON error
    if (request.url.includes('/api/')) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }

    // For page routes, redirect to error page
    return NextResponse.redirect(new URL('/error', request.url))
  }
}

// Update matcher to exclude api routes that don't need auth
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

