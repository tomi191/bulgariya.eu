import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Вземи IP адреса от различни заглавия
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfIp = request.headers.get('cf-connecting-ip')
    const xClientIp = request.headers.get('x-client-ip')

    const ip =
      (forwardedFor ? forwardedFor.split(',')[0] : null) ||
      realIp ||
      cfIp ||
      xClientIp ||
      'unknown'

    return NextResponse.json({ ip: (ip || 'unknown').trim() })
  } catch (error) {
    return NextResponse.json({ ip: 'unknown' }, { status: 500 })
  }
}
