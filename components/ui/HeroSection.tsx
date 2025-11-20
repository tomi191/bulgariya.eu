'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto py-10 px-4 text-center">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Приемане на Еврото в България?
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-base md:text-lg text-gray-600 mb-4">Включете се в националната анкета!</p>
          <a
            href="https://www.facebook.com/BYLGARI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Към Facebook страницата
          </a>
        </motion.div>
      </div>
    </header>
  )
}