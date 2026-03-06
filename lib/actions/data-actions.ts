'use server'

import {
  getGdpSection,
  getUnemploymentSection,
  getInflationSection,
  getConsumerSection,
  getHousingSection,
  getEquitySection,
  getCommoditiesSection,
  getBondsSection,
  getForexSection,
  getTradeSection,
} from '@/lib/data/aggregator'

export async function fetchDashboardSection(section: string) {
  switch (section) {
    case 'gdp': return getGdpSection()
    case 'unemployment': return getUnemploymentSection()
    case 'inflation': return getInflationSection()
    case 'consumer': return getConsumerSection()
    case 'housing': return getHousingSection()
    case 'equity': return getEquitySection()
    case 'commodities': return getCommoditiesSection()
    case 'bonds': return getBondsSection()
    case 'forex': return getForexSection()
    case 'trade': return getTradeSection()
    default: throw new Error(`Unknown section: ${section}`)
  }
}
