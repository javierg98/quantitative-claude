'use client'

const SECTIONS = [
  { id: 'gdp', label: 'GDP' },
  { id: 'unemployment', label: 'Unemployment' },
  { id: 'inflation', label: 'Inflation' },
  { id: 'consumer', label: 'Consumer' },
  { id: 'housing', label: 'Housing' },
  { id: 'equity', label: 'Equity' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'forex', label: 'Forex' },
  { id: 'trade', label: 'Trade' },
]

export function SectionNav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg whitespace-nowrap transition-colors"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
