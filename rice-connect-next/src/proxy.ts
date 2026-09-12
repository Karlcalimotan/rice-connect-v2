import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const roleDashboard: Record<string, string> = {
  FARMER: '/farmer/harvest',
  MILLER: '/miller/marketplace',
  ADMIN: '/admin/dashboard',
}

const protectedPrefixes = ['/farmer', '/miller', '/admin', '/profile', '/analytics', '/dashboard']
const guestOnlyPaths = ['/login', '/register', '/forgot-password', '/reset-password']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  const isGuestOnly = guestOnlyPaths.some((p) => pathname.startsWith(p))

  // Protected routes — require authentication
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Guest-only routes — redirect to role dashboard if logged in
  if (isGuestOnly && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const dashboard =
      (profile?.role && roleDashboard[profile.role]) || '/farmer/harvest'
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
