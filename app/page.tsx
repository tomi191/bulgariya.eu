'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabase'
import { getDeviceFingerprint } from '@/lib/fingerprint'
import toast from 'react-hot-toast'

const BULGARIA_POPULATION = 6_688_836

type Step = 'welcome' | 'voting' | 'info' | 'results'

export default function Home() {
  const [step, setStep] = useState<Step>('welcome')
  const [vote, setVote] = useState<'for' | 'against' | null>(null)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [voteStats, setVoteStats] = useState({ for: 0, against: 0 })
  const [totalVotes, setTotalVotes] = useState(0)

  const handleVote = (voteChoice: 'for' | 'against') => {
    setVote(voteChoice)
    setStep('info')
  }

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('vote')

      if (!error && data) {
        const forCount = data.filter(v => v.vote === 'for').length
        const againstCount = data.filter(v => v.vote === 'against').length
        setVoteStats({ for: forCount, against: againstCount })
        setTotalVotes(data.length)
      }
    }

    fetchStats()

    const subscription = supabase
      .channel('votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !city.trim() || !email.trim() || !vote) {
      toast.error('Попълнете всички полета!')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Невалидна имейл адрес!')
      return
    }

    setLoading(true)

    try {
      const deviceFingerprint = await getDeviceFingerprint()

      const { data: emailCheck } = await supabase
        .from('votes')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1)

      if (emailCheck && emailCheck.length > 0) {
        toast.error('Този имейл адрес вече е гласувал!')
        setLoading(false)
        return
      }

      const { data: fingerprintCheck } = await supabase
        .from('votes')
        .select('id')
        .eq('device_fingerprint', deviceFingerprint)
        .limit(1)

      if (fingerprintCheck && fingerprintCheck.length > 0) {
        toast.error('На това устройство вече е гласувано!')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('votes').insert({
        name: name.trim(),
        city: city.trim(),
        email: email.toLowerCase(),
        vote: vote,
        device_fingerprint: deviceFingerprint,
      })

      if (error) {
        throw error
      }

      setStep('results')
      toast.success('Вашият глас е записан! 🇧🇬')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Грешка при гласуване!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* Welcome Screen */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl text-center"
          >
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-2 text-black">Национален референдум</h1>
              <h2 className="text-2xl font-light text-gray-700 mb-4">
                България в Еврозоната?
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Референдум за приемане на еврото като официална валута на България от 01.01.2026
              </p>
              <div className="border border-gray-300 rounded-lg p-3 mb-8 bg-gray-50">
                <p className="text-xs text-gray-700">
                  Анонимна и защитена анкета. Всеки избор се брои.
                </p>
              </div>

              <button
                onClick={() => setStep('voting')}
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition mb-8"
              >
                Начало на гласуване
              </button>
            </div>

            {/* Live Results */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-6">Текущи резултати</h3>

              <div className="border border-gray-300 rounded-lg p-8 bg-white mb-6">
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-2">Участвали в анкетата</p>
                  <p className="text-4xl font-bold text-black">
                    {totalVotes}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    от {(BULGARIA_POPULATION).toLocaleString('bg-BG')} българи ({((totalVotes / BULGARIA_POPULATION) * 100).toFixed(3)}%)
                  </p>
                </div>

                <div className="mb-8">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'За', value: voteStats.for },
                      { name: 'Против', value: voteStats.against }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value) => value} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db' }} />
                      <Bar dataKey="value" fill="#1f2937" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">За Еврото</p>
                    <p className="text-3xl font-bold text-black">{voteStats.for}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {totalVotes > 0 ? ((voteStats.for / totalVotes) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Против Еврото</p>
                    <p className="text-3xl font-bold text-black">{voteStats.against}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {totalVotes > 0 ? ((voteStats.against / totalVotes) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-3 justify-center mb-8">
              <button
                onClick={() => {
                  const text = `Вече ${totalVotes} българи гласуват! За: ${voteStats.for} (${totalVotes > 0 ? ((voteStats.for / totalVotes) * 100).toFixed(1) : 0}%) | Против: ${voteStats.against} (${totalVotes > 0 ? ((voteStats.against / totalVotes) * 100).toFixed(1) : 0}%) 🇧🇬`
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`, 'facebook-share', 'width=600,height=400')
                }}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition"
              >
                Сподели във Facebook
              </button>
              <button
                onClick={() => {
                  const text = `Вече ${totalVotes} българи гласуват! За: ${voteStats.for} | Protiv: ${voteStats.against} 🇧🇬`
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, 'twitter-share', 'width=600,height=400')
                }}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition"
              >
                Сподели в X
              </button>
            </div>
          </motion.div>
        )}

        {/* Voting Screen */}
        {step === 'voting' && (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md text-center"
          >
            <button
              onClick={() => setStep('welcome')}
              className="absolute top-4 left-4 text-gray-600 hover:text-black text-2xl"
            >
              ←
            </button>

            <div className="mt-16">
              <h1 className="text-3xl font-bold mb-8 text-black">Вашия избор</h1>
              <p className="text-gray-600 mb-12 text-base">
                Съгласни ли сте България да приеме еврото като официална валута?
              </p>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote('for')}
                  className="w-full bg-black hover:bg-gray-900 text-white font-bold py-6 px-6 rounded-lg transition text-lg"
                >
                  За Еврото
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote('against')}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-6 px-6 rounded-lg transition text-lg"
                >
                  Против Еврото
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Screen */}
        {step === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md"
          >
            <button
              onClick={() => setStep('voting')}
              className="mb-6 text-gray-600 hover:text-black text-2xl"
            >
              ←
            </button>

            <h1 className="text-3xl font-bold mb-2 text-black">Потвърждение</h1>
            <p className="text-gray-600 mb-8 text-sm">
              Попълнете вашите данни, за да завършите гласуването.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Вашето име"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
                disabled={loading}
                required
              />

              <input
                type="text"
                placeholder="Вашия град"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
                disabled={loading}
                required
              />

              <input
                type="email"
                placeholder="Вашата имейл адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
                disabled={loading}
                required
              />

              <div className="border border-gray-300 rounded-lg p-4 my-6 bg-gray-50">
                <p className="text-center font-bold text-black">
                  {vote === 'for' ? 'За Еврото' : 'Против Еврото'}
                </p>
              </div>

              <p className="text-xs text-gray-500 text-center">
                След потвърждение, вашият глас не може да бъде променен.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                {loading ? 'Обработка...' : 'Потвърди'}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep('voting')}
                disabled={loading}
                className="w-full border border-gray-300 hover:bg-gray-50 text-black font-bold py-3 px-6 rounded-lg transition bg-white"
              >
                Назад
              </button>
            </form>
          </motion.div>
        )}

        {/* Results Screen */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl text-center"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4 text-black">Резултати</h1>
              <p className="text-gray-600 mb-8">
                Вашият глас е записан. {vote === 'for' ? 'За Еврото' : 'Против Еврото'}
              </p>

              <div className="border border-gray-300 rounded-lg p-8 bg-white">
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-2">Участвали в анкетата</p>
                  <p className="text-4xl font-bold text-black">
                    {totalVotes}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    от {(BULGARIA_POPULATION).toLocaleString('bg-BG')} ({((totalVotes / BULGARIA_POPULATION) * 100).toFixed(3)}%)
                  </p>
                </div>

                <div className="mb-8">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'За', value: voteStats.for },
                      { name: 'Против', value: voteStats.against }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value) => value} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db' }} />
                      <Bar dataKey="value" fill="#1f2937" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">За Еврото</p>
                    <p className="text-3xl font-bold text-black">{voteStats.for}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {totalVotes > 0 ? ((voteStats.for / totalVotes) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Protiv Еврото</p>
                    <p className="text-3xl font-bold text-black">{voteStats.against}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {totalVotes > 0 ? ((voteStats.against / totalVotes) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center mt-6">
                Резултатите се обновяват в реално време.
              </p>
            </div>

            <button
              onClick={() => {
                setStep('welcome')
                setVote(null)
                setName('')
                setCity('')
                setEmail('')
              }}
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Начало
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500 max-w-2xl px-4">
        <p>
          Дисклеймер: Това е неофициална анкета за събиране на общественото мнение.
          Не е официален референдум и не е регистрирана при държавни органи.
        </p>
      </footer>
    </main>
  )
}
