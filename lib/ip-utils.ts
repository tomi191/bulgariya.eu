import { NextRequest } from 'next/server'

export function getClientIp(request: NextRequest): string {
  // Check X-Forwarded-For header (for proxy/CDN)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Check X-Real-IP header (for nginx proxy)
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Check CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip')
  if (cfIP) {
    return cfIP
  }

  // Fallback
  return '0.0.0.0'
}
