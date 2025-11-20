'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Vote } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function VoteForm({ onVoteSubmit }: { onVoteSubmit: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    email: '',
  })
  const [vote, setVote] = useState<'for' | 'against' | null>(null)
  const [loading, setLoading] = useState(false)
  const [userIP, setUserIP] = useState<string>('')

  useEffect(() => {
    fetchUserIP()
  }, [])

  const fetchUserIP = async () => {
    try {
      const response = await fetch('/api/get-ip')
      const data = await response.json()
      setUserIP(data.ip)
    } catch (error) {
      console.error('Error fetching IP:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Моля, въведете вашето име.')
      return
    }

    if (!formData.city.trim()) {
      toast.error('Моля, въведете вашия град.')
      return
    }

    if (!validateEmail(formData.email)) {
      toast.error('Моля, въведете валиден имейл адрес.')
      return
    }

    if (!vote) {
      toast.error('Моля, изберете един от вариантите.')
      return
    }

    setLoading(true)
    try {
      const { data: emailCheck } = await supabase
        .from('votes')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .limit(1)

      if (emailCheck && emailCheck.length > 0) {
        toast.error('Вече сте гласували с този имейл адрес!')
        setLoading(false)
        return
      }

      if (userIP && userIP !== 'unknown') {
        const { data: ipCheck } = await supabase
          .from('votes')
          .select('id')
          .eq('ip_address', userIP)
          .limit(1)

        if (ipCheck && ipCheck.length > 0) {
          toast.error('Вече е гласувано от този IP адрес. Моля, опитайте по-късно.')
          setLoading(false)
          return
        }
      }

      const { error } = await supabase
        .from('votes')
        .insert([
          {
            name: formData.name,
            city: formData.city,
            email: formData.email.toLowerCase(),
            vote: vote,
            ip_address: userIP,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          },
        ])

      if (error) {
        console.error('Supabase error:', error)
        toast.error('Възникна грешка при записване на гласа.')
        return
      }

      toast.success('Вашият глас е записан! Благодарим ви! 🇧🇬')
      setFormData({ name: '', city: '', email: '' })
      setVote(null)
      onVoteSubmit()
    } catch (error) {
      console.error('Error submitting vote:', error)
      toast.error('Възникна непредвидена грешка.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Гласувайте</h2>
          <p className="text-sm text-gray-500">Изразете своето мнение</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <Vote className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
          Име *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Вашето име"
          className="form-input"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
          Град *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Вашия град"
          className="form-input"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
          Имейл адрес *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email@example.com"
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-gray-700">Вашето мнение *</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setVote('for')}
            disabled={loading}
            className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border ${
              vote === 'for'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            За Еврото
          </button>
          <button
            type="button"
            onClick={() => setVote('against')}
            disabled={loading}
            className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border ${
              vote === 'against'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <XCircle className="w-5 h-5" />
            Против
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-lg transition-all hover:bg-blue-700 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Записване...' : 'Гласувай'}
      </button>

      <p className="text-xs text-gray-500 text-center pt-2">
        Не събираме лични данни. Гласуването е анонимно.
      </p>
    </form>
  )
}
