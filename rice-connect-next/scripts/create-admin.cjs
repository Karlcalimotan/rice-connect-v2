require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@prisma/client')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@riceconnect.com'
const ADMIN_PASSWORD = 'admin123'

async function main() {
  console.log('Creating admin account...')

  // 1. Create auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already') || error.message.includes('already been registered')) {
      console.log(`  Auth user ${ADMIN_EMAIL} already exists, fetching ID...`)
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      if (listError) {
        console.error('  Failed to list users:', listError.message)
        process.exit(1)
      }
      const existing = users.users.find((u) => u.email === ADMIN_EMAIL)
      if (existing) {
        console.log(`  Found auth user: ${existing.id}`)
        await upsertProfile(existing.id)
      } else {
        console.error('  Could not find auth user by email')
        process.exit(1)
      }
      return
    }
    console.error('  Auth error:', error.message)
    process.exit(1)
  }

  console.log(`  Auth user created: ${data.user.id}`)

  // 2. Create profile
  await upsertProfile(data.user.id)

  console.log('\nAdmin account ready!')
  console.log(`  Email:    ${ADMIN_EMAIL}`)
  console.log(`  Password: ${ADMIN_PASSWORD}`)
}

async function upsertProfile(userId) {
  const existing = await prisma.user.findUnique({ where: { id: userId } })
  if (existing) {
    console.log('  Profile already exists, updating role to ADMIN...')
    await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } })
  } else {
    console.log('  Creating profile with ADMIN role...')
    await prisma.user.create({
      data: {
        id: userId,
        email: ADMIN_EMAIL,
        firstName: 'Admin',
        lastName: 'RiceConnect',
        contact: '09000000000',
        role: 'ADMIN',
        province: 'Iloilo',
      },
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
