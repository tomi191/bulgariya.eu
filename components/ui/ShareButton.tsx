'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Share2, Copy, Facebook, Twitter } from 'lucide-react'

export default function ShareButton({ stats }: { stats: { for: number; against: number } }) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const total = stats.for + stats.against
  const forPercentage = total > 0 ? Math.round((stats.for / total) * 100) : 0
  const againstPercentage = total > 0 ? Math.round((stats.against / total) * 100) : 0
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://bulgarya.eu';
  const shareText = `🇧🇬 Референдум за Еврото в България:\n\n✅ За: ${forPercentage}% (${stats.for} гласа)\n❌ Против: ${againstPercentage}% (${stats.against} гласа)\n\nА ти как ще гласуваш? Включи се тук:`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    toast.success('Текстът е копиран в буфера!')
    setShowShareMenu(false)
  }

  const openFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, 'facebook-share-dialog', 'width=550,height=400')
    setShowShareMenu(false)
  }

  const openTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, 'twitter-share-dialog', 'width=550,height=400')
    setShowShareMenu(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Сподели</h3>
          <p className="text-sm text-gray-500">Разпространи анкетата</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <Share2 className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Сподели резултатите
        </button>

        {showShareMenu && (
          <div 
            className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-2 z-10"
            onMouseLeave={() => setShowShareMenu(false)}
          >
            <button
              onClick={openFacebookShare}
              className="w-full text-sm bg-[#1877F2] hover:bg-opacity-90 text-white py-2 px-3 rounded-md transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Facebook className="w-4 h-4" />
              Сподели във Facebook
            </button>
            <button
              onClick={openTwitterShare}
              className="w-full text-sm bg-[#1DA1F2] hover:bg-opacity-90 text-white py-2 px-3 rounded-md transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Сподели в Twitter/X
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full text-sm bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-md transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Копирай текст за споделяне
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
