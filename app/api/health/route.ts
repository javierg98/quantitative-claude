import { NextResponse } from 'next/server'
import { getDataSourceHealth } from '@/lib/actions/health-actions'

export async function GET() {
  const health = await getDataSourceHealth()
  return NextResponse.json(health)
}
