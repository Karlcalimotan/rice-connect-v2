const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function run() {
  try {
    await p.$executeRawUnsafe('ALTER TABLE ledger_entries ADD CONSTRAINT ledger_amount_positive CHECK (amount > 0)')
    console.log('ledger_entries CHECK added')
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ledger_entries CHECK already exists')
    } else {
      console.error('ledger_entries:', e.message)
    }
  }
  try {
    await p.$executeRawUnsafe('ALTER TABLE bookings ADD CONSTRAINT bookings_non_negative CHECK (total_weight_kg >= 0 AND estimated_sacks >= 0)')
    console.log('bookings CHECK added')
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('bookings CHECK already exists')
    } else {
      console.error('bookings:', e.message)
    }
  }
  await p.$disconnect()
}
run()
