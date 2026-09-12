# RiceConnect v2

Rice supply chain platform connecting farmers and millers in Iloilo, Philippines.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 5.22
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## Getting Started

```bash
cd rice-connect-next
npm install
cp .env.example .env
# Fill in Supabase credentials
npx prisma generate
npx prisma db push
npm run dev
```

## Project Structure

```
rice-connect-next/
├── prisma/              # Prisma schema + migrations
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (auth)/      # Login, Register
│   │   └── (protected)/ # Farmer, Miller, Admin dashboards
│   ├── components/ui/   # Shared UI components
│   ├── hooks/           # React hooks
│   ├── lib/             # Utilities (prisma, supabase, payment, etc.)
│   ├── stores/          # Zustand state
│   └── types/           # TypeScript types
```

## In-Scope Modules

- **Auth:** Login, Registration (Farmer/Miller roles)
- **Farmer:** Harvest listings, marketplace, wallet, market prices
- **Miller:** Marketplace, rice stock, wallet, deliveries, market prices
- **Admin:** Dashboard, user management, market prices, transactions

## Deferred Modules

- Retailer
- Driver
- Analytics/Reports
