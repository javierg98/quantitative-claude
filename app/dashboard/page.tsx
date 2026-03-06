import { Suspense } from 'react'
import { SectionNav } from '@/components/ui/SectionNav'
import { GdpPanel } from '@/components/panels/GdpPanel'
import { UnemploymentPanel } from '@/components/panels/UnemploymentPanel'
import { InflationPanel } from '@/components/panels/InflationPanel'
import { ConsumerConfidencePanel } from '@/components/panels/ConsumerConfidencePanel'
import { HousingPanel } from '@/components/panels/HousingPanel'
import { EquityPanel } from '@/components/panels/EquityPanel'
import { CommoditiesPanel } from '@/components/panels/CommoditiesPanel'
import { BondYieldPanel } from '@/components/panels/BondYieldPanel'
import { ForexPanel } from '@/components/panels/ForexPanel'
import { TradeBalancePanel } from '@/components/panels/TradeBalancePanel'

function PanelSkeleton({ title }: { title: string }) {
  return (
    <section className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 h-64 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-2 bg-gray-100 rounded w-full mt-2"></div>
            <div className="h-2 bg-gray-100 rounded w-3/4 mt-2"></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  return (
    <>
      <SectionNav />
      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Economic Outlook Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Live macroeconomic data across 10 key indicators — updated automatically
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Data sources: FRED, BLS, BEA, Yahoo Finance, Alpha Vantage, Zillow
          </div>
        </div>

        <Suspense fallback={<PanelSkeleton title="GDP Growth Rate" />}>
          <GdpPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Unemployment" />}>
          <UnemploymentPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Inflation Trends" />}>
          <InflationPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Consumer Confidence" />}>
          <ConsumerConfidencePanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Housing Market" />}>
          <HousingPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Equity Markets" />}>
          <EquityPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Commodities" />}>
          <CommoditiesPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Bond Yield Curve" />}>
          <BondYieldPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Foreign Exchange" />}>
          <ForexPanel />
        </Suspense>

        <Suspense fallback={<PanelSkeleton title="Trade Balance" />}>
          <TradeBalancePanel />
        </Suspense>
      </main>
    </>
  )
}
