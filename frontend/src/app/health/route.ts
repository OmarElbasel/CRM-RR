import { NextResponse } from 'next/server'

/**
 * Public health check endpoint.
 * Used by Railway health probes.
 * No authentication required.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'rawaj-frontend',
      version: '1.0.0',
    },
    { status: 200 },
  )
}
