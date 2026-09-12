export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">RiceConnect</h1>
          <p className="mt-2 text-sm text-gray-600">
            Connecting farmers and millers in Iloilo
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
