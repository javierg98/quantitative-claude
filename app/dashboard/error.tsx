'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Dashboard Error</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  )
}
