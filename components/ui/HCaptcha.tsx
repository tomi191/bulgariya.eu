'use client'

import HCaptchaReact from '@hcaptcha/react-hcaptcha'

interface HCaptchaProps {
  onVerify: (token: string) => void
}

export default function HCaptcha({ onVerify }: HCaptchaProps) {
  return (
    <div className="flex justify-center my-4">
      <HCaptchaReact
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
        onVerify={onVerify}
        size="compact"
        theme="light"
      />
    </div>
  )
}
