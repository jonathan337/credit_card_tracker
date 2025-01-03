import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'

    if (!code) {
      throw new Error('No code provided')
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      throw error
    }

    // Redirect to the intended destination or dashboard
    return NextResponse.redirect(new URL(redirect, requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    
    // Clear any existing session cookies
    const response = NextResponse.redirect(
      new URL('/login?error=Authentication failed', new URL(request.url).origin)
    )
    response.cookies.delete('supabase-auth-token')
    return response
  }
}

