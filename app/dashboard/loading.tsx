export default function DashboardLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="animate-pulse space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((j) => (
                <div key={j} className="bg-white rounded-xl border border-gray-200 p-4 h-64">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-2 bg-gray-100 rounded"></div>
                    <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-100 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
