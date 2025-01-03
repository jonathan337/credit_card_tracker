import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      throw new Error('No code provided')
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      throw error
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    
    // Redirect to login page with error
    const baseUrl = new URL(request.url).origin
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, baseUrl)
    )
  }
}

