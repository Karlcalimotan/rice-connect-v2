import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-xl font-bold text-white">R</div>
          <span className="text-xl font-bold text-gray-900">RiceConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Register
          </Link>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Connecting Rice Farmers
            <br />
            <span className="text-gray-500">Directly to Millers</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            RiceConnect is a transparent rice marketplace that connects Iloilo&apos;s farmers and millers.
            List your harvest, find buyers, and get paid fairly — all in one platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="border-t bg-gray-50">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-16 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🌾</div>
              <h3 className="text-lg font-semibold text-gray-900">For Farmers</h3>
              <p className="mt-2 text-sm text-gray-600">
                List your harvest, set your price, and connect directly with millers in your area.
                No middlemen, fair prices.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🏭</div>
              <h3 className="text-lg font-semibold text-gray-900">For Millers</h3>
              <p className="mt-2 text-sm text-gray-600">
                Browse available palay, express interest, manage your inventory,
                and sell finished rice to retailers.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">Market Transparency</h3>
              <p className="mt-2 text-sm text-gray-600">
                Real-time market prices for Iloilo. Know what your rice is worth
                before you sell.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Built for Iloilo&apos;s Rice Supply Chain</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Covering 44 municipalities from Iloilo City to Sara. RiceConnect understands
              the local geography and ensures efficient logistics with distance-based delivery fees.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">44</div>
                <div className="text-sm text-gray-600">Municipalities</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Marketplace</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">Live</div>
                <div className="text-sm text-gray-600">Market Prices</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">Secure</div>
                <div className="text-sm text-gray-600">Payments</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 py-8 text-center text-sm text-gray-500">
        <p>RiceConnect v2 &mdash; Enactus PH 2026</p>
        <p className="mt-1">Syntaxure Labs</p>
      </footer>
    </div>
  )
}
