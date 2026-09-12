const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
  console.log('Seeding database...')

  // 1. Seed municipalities
  const municipalities = [
    'Ajuy', 'Alimodian', 'Anilao', 'Badiangan', 'Balasan', 'Banate',
    'Barotac Nuevo', 'Barotac Viejo', 'Batad', 'Bingawan', 'Cabatuan',
    'Calinog', 'Carles', 'Concepcion', 'Dingle', 'Dueñas', 'Dumangas',
    'Estancia', 'Guimbal', 'Igbaras', 'Iloilo City', 'Janiuay', 'Lambunao',
    'Leganes', 'Lemery', 'Maasin', 'Mina', 'Miagao', 'New Lucena',
    'Oton', 'Pavia', 'Passi City', 'Pototan', 'San Dionisio', 'San Enrique',
    'San Joaquin', 'San Miguel', 'San Rafael', 'Santa Barbara', 'Sara',
    'Tigbauan', 'Tubungan', 'Zarraga',
  ]

  for (let i = 0; i < municipalities.length; i++) {
    await prisma.municipality.upsert({
      where: { name: municipalities[i] },
      update: {},
      create: { name: municipalities[i], distanceIndex: i },
    })
  }
  console.log(`  Seeded ${municipalities.length} municipalities`)

  // 2. Seed market prices
  const varieties = ['IR 64', 'NSIC Rc 222', 'NSIC Rc 160', 'PSB Rc 82']
  const basePrices = { 'IR 64': 28, 'NSIC Rc 222': 30, 'NSIC Rc 160': 27, 'PSB Rc 82': 29 }

  const now = new Date()
  for (let dayOffset = 7; dayOffset >= 0; dayOffset--) {
    const date = new Date(now)
    date.setDate(date.getDate() - dayOffset)
    const dateStr = date.toISOString().split('T')[0]

    for (const variety of varieties) {
      const base = basePrices[variety]
      const fluctuation = (Math.random() - 0.5) * 4
      const price = Math.round((base + fluctuation) * 100) / 100

      await prisma.marketPrice.create({
        data: {
          riceVariety: variety,
          pricePerKg: price,
          marketRegion: 'Iloilo',
          priceDate: new Date(dateStr),
        },
      })
    }
  }
  console.log('  Seeded 8 days of market prices')

  // 3. Create demo farmer user (if not exists)
  const farmerEmail = 'farmer-demo@riceconnect.ph'
  const existingFarmer = await prisma.user.findFirst({ where: { email: farmerEmail } })
  let farmerId = existingFarmer?.id

  if (!farmerId) {
    console.log('  NOTE: Demo users require Supabase Auth. Create them via the register page.')
    console.log('  Skipping user creation - seed market prices and municipalities only.')
  }

  // 4. Create sample harvest batches if farmer exists
  if (farmerId) {
    const harvestData = [
      { riceVariety: 'IR 64', numberOfBags: 20, totalWeight: 1000, pricePerKg: 28, status: 'available' },
      { riceVariety: 'NSIC Rc 222', numberOfBags: 15, totalWeight: 750, pricePerKg: 30, status: 'available' },
      { riceVariety: 'PSB Rc 82', numberOfBags: 25, totalWeight: 1250, status: 'unsold' },
    ]

    for (const batch of harvestData) {
      const existing = await prisma.harvestBatch.findFirst({
        where: { userId: farmerId, riceVariety: batch.riceVariety, status: batch.status },
      })
      if (!existing) {
        await prisma.harvestBatch.create({
          data: {
            userId: farmerId,
            riceVariety: batch.riceVariety,
            numberOfBags: batch.numberOfBags,
            totalWeight: batch.totalWeight,
            pricePerKg: batch.pricePerKg || null,
            harvestDate: new Date(),
            status: batch.status,
            deliveryStatus: 'Pending',
            deliveryType: 'palay',
          },
        })
      }
    }
    console.log('  Seeded harvest batches')

    // Create wallet
    await prisma.wallet.upsert({
      where: { userId: farmerId },
      update: {},
      create: { userId: farmerId, balance: 0 },
    })
  }

  console.log('Seed complete!')
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
