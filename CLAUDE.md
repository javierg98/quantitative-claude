# Economic Outlook Dashboard — Agent Grounding Document

**IMPORTANT: This file is read by automated Claude Code agents. Follow all conventions strictly.**

## Project Purpose

A self-improving macroeconomics dashboard at `/home/claude/macro-dashboard/` built with Next.js 14 App Router. It displays 10 sections of economic data, generates AI insights, and can autonomously improve itself.

## Directory Conventions

- `app/` — Next.js App Router pages and API routes
- `components/charts/` — One subdirectory per dashboard section
- `components/panels/` — One panel component per section (assembles charts)
- `components/ui/` — Shared UI primitives
- `lib/data/` — API clients (one file per source)
- `lib/cache/` — Two-tier caching (unstable_cache + JSON files)
- `lib/agent/` — Claude Code subprocess wrapper and log reader
- `lib/actions/` — Next.js server actions
- `lib/types/` — Shared TypeScript types
- `data/cache/` — JSON cache files (gitignored)
- `data/insights/` — Generated insight JSON files (gitignored)
- `data/agent-logs/` — Claude Code session logs (gitignored)
- `.claude/prompts/` — Agent prompt files
- `worktrees/` — Git worktrees for agent isolation (gitignored)
  - `worktrees/improve/` — Used by improve agent
  - `worktrees/heal/` — Used by heal agent

## Worktree Rules

- Agents MUST operate in their assigned worktree, not the main directory
- Each worktree maps to a feature/fix branch
- After PR is merged, delete the worktree branch

## TypeScript Rules

- Strict mode enabled — NO `any` types
- All component props must be typed with interfaces
- All chart components must be wrapped in `<ChartWrapper>`
- Use `z.infer<typeof Schema>` for API response types
- All server actions must be in `lib/actions/`

## 10 Dashboard Sections

### 1. GDP Growth Rate
- Charts: `GdpGrowthChart`, `GdpHistoricalChart`, `GdpProjectionsChart`
- Series: `GDP`, `A191RL1Q225SBEA` (FRED), BEA `T10101`
- Panel: `GdpPanel`

### 2. Unemployment
- Charts: `UnemploymentRateChart`, `UnemploymentByRegionChart`, `UnemploymentByIndustryChart`
- Series: `UNRATE`, state-level series, `PAYEMS` (FRED), BLS `LNS14000000`
- Panel: `UnemploymentPanel`

### 3. Inflation Trends
- Charts: `CpiTrendChart`, `InflationHistoricalChart`, `InflationForecastChart`, `InflationForecastExtendedChart`
- Series: `CPIAUCSL`, `CPILFESL`, `PCEPI`, `PPIFIS` (FRED)
- Panel: `InflationPanel`

### 4. Consumer Confidence
- Charts: `ConsumerConfidenceChart`, `ConsumerSentimentHistoryChart`, `ConsumerConfidenceForecastChart`
- Series: `UMCSENT`, `CONCCONF` (FRED)
- Panel: `ConsumerConfidencePanel`

### 5. Housing Market
- Charts: `HousingPriceIndexChart`, `HousingRegionalChart`, `HousingStartsChart`, `HousingForecastChart`
- Series: `CSUSHPISA`, `MSPUS`, `HOUST` (FRED), Zillow ZHVI
- Panel: `HousingPanel`

### 6. Equity Markets
- Charts: `EquityPerformanceChart`, `EquityHistoricalChart`, `VixChart`, `EquityForecastChart`
- Tickers: `^GSPC`, `^IXIC`, `^RUT`, `^DJI`, `^VIX` (Yahoo Finance)
- Panel: `EquityPanel`

### 7. Commodities
- Charts: `CommodityPricesChart`, `CommodityHistoricalChart`, `CommodityForecastChart`
- Tickers: `CL=F`, `GC=F`, `SI=F`, `NG=F`, `ZC=F`, `ZW=F` (Yahoo Finance)
- Panel: `CommoditiesPanel`

### 8. Bond Yield Curve
- Charts: `YieldCurveSnapshotChart`, `YieldCurveHistoryChart`, `BondYieldComparisonChart`, `YieldCurveForecastChart`
- Series: `DGS1MO`, `DGS3MO`, `DGS6MO`, `DGS1`, `DGS2`, `DGS5`, `DGS10`, `DGS20`, `DGS30`, `T10Y2Y` (FRED)
- Panel: `BondYieldPanel`

### 9. Foreign Exchange
- Charts: `ForexRatesChart`, `ForexHistoricalChart`, `ForexForecastChart`
- Pairs: EUR/USD, USD/JPY, GBP/USD, USD/CNY (Alpha Vantage + Yahoo Finance)
- Panel: `ForexPanel`

### 10. Trade Balance
- Charts: `TradeBalanceChart`, `ExportsImportsChart`, `TradeForecastChart`
- Series: `BOPGSTB` (FRED), BEA `T40101`
- Panel: `TradeBalancePanel`

## Chart Component Pattern

Every chart component MUST follow this pattern:

```tsx
'use client'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MyChartProps {
  data: MyDataType[]
  isLoading?: boolean
  error?: string
}

export function MyChart({ data, isLoading, error }: MyChartProps) {
  return (
    <ChartWrapper title="Chart Title" isLoading={isLoading} error={error}>
      <ResponsiveContainer width="100%" height={300}>
        {/* chart content */}
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
```

## Self-Improvement Rules

1. Always read `CLAUDE.md` first
2. Read 2-3 existing chart components in the same section as a pattern reference before writing new ones
3. Follow the exact chart component pattern above
4. After writing a new component, update `components/charts/index.ts` to export it
5. Run `npm run type-check` and `npm run build` after changes
6. Commit format: `feat(charts): add ComponentName`
7. Append to the `## Improvement History` section below

## Self-Healing Rules

1. NEVER touch `.env.local` or any credentials file
2. NEVER auto-fix 401/403 errors — surface them in admin UI instead
3. Always run `npm test` before committing a fix
4. For 429 errors: increase TTL constants, do not retry aggressively
5. For 404 errors: check official API docs via WebFetch before changing URLs

## Improvement History

<!-- Agent appends here after each successful run -->
- 2026-03-06 Added GdpForecastChart, UnemploymentForecastChart and forecasting infrastructure: introduced agent, prompts, data utils, admin UI, and chart exports
