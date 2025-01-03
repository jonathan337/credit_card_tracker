import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/auth/callback']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { pathname } = new URL(request.url)

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()

    // Handle authentication for protected routes
    const isPublicRoute = publicRoutes.includes(pathname)
    const isAuthRoute = pathname.startsWith('/auth/')
    const isApiRoute = pathname.startsWith('/api/')

    // Don't redirect API routes or auth callback routes
    if (isApiRoute || isAuthRoute) {
      return res
    }

    // Redirect authenticated users away from public routes
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users to login from protected routes
    if (!session && !isPublicRoute) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    
    // Don't redirect on API routes
    if (request.url.includes('/api/')) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }

    // Clear cookies and redirect to login on critical errors
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('supabase-auth-token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

