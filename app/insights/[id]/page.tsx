import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Insight } from '@/lib/types/insights'

const INSIGHTS_DIR = path.join(process.cwd(), 'data', 'insights')

function loadInsight(id: string): Insight | null {
  try {
    const files = fs.readdirSync(INSIGHTS_DIR).filter((f) => f.endsWith('.json'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(INSIGHTS_DIR, file), 'utf-8')
      const insight = JSON.parse(raw) as Insight
      if (insight.id === id) return insight
    }
    return null
  } catch {
    return null
  }
}

const SIGNAL_COLORS = {
  positive: 'text-green-700 bg-green-50 border-green-100',
  negative: 'text-red-700 bg-red-50 border-red-100',
  neutral: 'text-gray-700 bg-gray-50 border-gray-100',
}

export default function InsightDetailPage({ params }: { params: { id: string } }) {
  const insight = loadInsight(params.id)
  if (!insight) notFound()

  return (
    <main className="max-w-screen-md mx-auto px-4 py-8">
      <Link href="/insights" className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Back to Insights
      </Link>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{insight.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          Generated {new Date(insight.generatedAt).toLocaleString()} · Data as of{' '}
          {new Date(insight.dataSnapshotDate).toLocaleDateString()}
        </p>

        <p className="text-lg text-gray-700 font-medium mb-6 border-l-4 border-blue-400 pl-4">
          {insight.summary}
        </p>

        {insight.keyMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {insight.keyMetrics.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg border px-4 py-3 ${SIGNAL_COLORS[m.signal]}`}
              >
                <p className="text-xs font-medium opacity-70">{m.name}</p>
                <p className="text-lg font-bold">{m.value}</p>
                {m.change && <p className="text-xs opacity-60">{m.change}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-sm prose-gray max-w-none mb-6">
          {insight.body.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 text-gray-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {insight.outlook && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">Outlook</h3>
            <p className="text-sm text-blue-700">{insight.outlook}</p>
          </div>
        )}

        {insight.riskFactors.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Risk Factors</h3>
            <ul className="space-y-1">
              {insight.riskFactors.map((risk, i) => (
                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="mt-1">•</span> {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </main>
  )
}
