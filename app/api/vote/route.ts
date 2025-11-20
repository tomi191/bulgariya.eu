import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isEmail, isLength, trim } from 'validator'
import { getClientIp } from '@/lib/ip-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Simple in-memory rate limiting (consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }

  if (limit.count >= 1) {
    return false
  }

  limit.count++
  return true
}

function validateInput(name: string, city: string, email: string) {
  // Trim and validate length
  const trimmedName = trim(name)
  const trimmedCity = trim(city)
  const trimmedEmail = trim(email.toLowerCase())

  if (!isLength(trimmedName, { min: 1, max: 100 })) {
    return { valid: false, error: 'Невалидно име' }
  }

  if (!isLength(trimmedCity, { min: 1, max: 100 })) {
    return { valid: false, error: 'Невалидно град' }
  }

  if (!isEmail(trimmedEmail)) {
    return { valid: false, error: 'Невалидна имейл адрес' }
  }

  return { valid: true, data: { name: trimmedName, city: trimmedCity, email: trimmedEmail } }
}

function sanitizeHTML(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return str.replace(/[&<>"']/g, (char) => map[char])
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const clientIp = getClientIp(request)

    // Rate limiting check
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Твърде много опити. Моля, опитайте отново за час.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, city, email, vote, deviceFingerprint, captchaToken: _ } = body

    // Validate required fields
    if (!name || !city || !email || !vote || !deviceFingerprint) {
      return NextResponse.json(
        { error: 'Липсват задължителни полета' },
        { status: 400 }
      )
    }

    // Validate vote choice
    if (vote !== 'for' && vote !== 'against') {
      return NextResponse.json(
        { error: 'Невалиден глас' },
        { status: 400 }
      )
    }

    // Validate input
    const validation = validateInput(name, city, email)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { name: cleanName, city: cleanCity, email: cleanEmail } = validation.data!

    // TODO: Verify CAPTCHA token with hCaptcha API
    // For now, we'll trust it since client-side validation passed
    // In production, always verify on backend

    // Check for duplicate email
    const { data: emailExists } = await supabase
      .from('votes')
      .select('id')
      .eq('email', cleanEmail)
      .limit(1)

    if (emailExists && emailExists.length > 0) {
      return NextResponse.json(
        { error: 'Този имейл адрес вече е гласувал!' },
        { status: 409 }
      )
    }

    // Check for duplicate device fingerprint
    const { data: fingerprintExists } = await supabase
      .from('votes')
      .select('id')
      .eq('device_fingerprint', deviceFingerprint)
      .limit(1)

    if (fingerprintExists && fingerprintExists.length > 0) {
      return NextResponse.json(
        { error: 'На това устройство вече е гласувано!' },
        { status: 409 }
      )
    }

    // Insert vote with service role
    const { error } = await supabase.from('votes').insert({
      name: sanitizeHTML(cleanName),
      city: sanitizeHTML(cleanCity),
      email: cleanEmail,
      vote: vote,
      device_fingerprint: deviceFingerprint,
      ip_address: clientIp,
      user_agent: request.headers.get('user-agent') || '',
    })

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: 'Грешка при записване на глас' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Вашият глас е записан!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Сървърна грешка' },
      { status: 500 }
    )
  }
}
