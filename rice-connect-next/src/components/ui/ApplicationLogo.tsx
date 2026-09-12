export default function ApplicationLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-lg bg-gray-900 text-white font-bold ${className}`}>
      R
    </div>
  )
}
