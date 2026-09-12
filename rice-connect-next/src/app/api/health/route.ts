import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {},
    prisma: 'not tested',
    supabase: 'not tested',
  }

  const envVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ] as const

  const envStatus: Record<string, string> = {}
  for (const key of envVars) {
    const val = process.env[key]
    envStatus[key] = val ? `present (len=${val.length})` : 'MISSING'
  }
  result.env = envStatus

  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    result.prisma = 'connected'
  } catch (e: unknown) {
    result.prisma = e instanceof Error ? e.message : String(e)
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    result.supabase = error ? `error: ${error.message}` : `ok (user: ${data.user?.id ?? 'none'})`
  } catch (e: unknown) {
    result.supabase = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(result, { status: 200 })
}
