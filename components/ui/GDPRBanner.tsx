'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'

export default function GDPRBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = Cookies.get('gdpr_consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const giveConsent = () => {
    Cookies.set('gdpr_consent', 'true', { expires: 365 })
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
        <p className="mb-2 md:mb-0 text-center md:text-left">
          Сайтът използва &quot;бисквитки&quot;, за да осигури по-добро потребителско изживяване. Продължавайки, Вие се съгласявате с нашата{' '}
          <a href="#" className="underline font-semibold text-blue-400 hover:text-blue-300">
            Политика за поверителност
          </a>.
        </p>
        <button
          onClick={giveConsent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors font-semibold"
        >
          Разбрах
        </button>
      </div>
    </motion.div>
  )
}