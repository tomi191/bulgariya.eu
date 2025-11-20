'use client'

import { motion } from 'framer-motion'
import { MessageSquareText } from 'lucide-react'

// Placeholder for Live Activity (to be implemented with real-time data later)
export default function LiveActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🔔 Активност на живо</h3>
            <p className="text-sm text-gray-500">Последни гласувания</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <MessageSquareText className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="space-y-4 text-center text-gray-600">
          <p>
            Тук скоро ще видите последните анонимни гласувания на живо!
          </p>
          <p className="text-xs">
            (Функционалността предстои)
          </p>
        </div>
      </div>
    </motion.div>
  )
}