'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-bold">{`${label}`}</p>
        <p className="text-sm" style={{ color: payload[0].color }}>{`Гласове: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function ResultsChart() {
  const [stats, setStats] = useState({ for: 0, against: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const subscription = supabase
      .channel('votes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('votes').select('vote')
      if (error) {
        console.error('Error fetching stats:', error)
        return
      }
      const forCount = data?.filter((v: any) => v.vote === 'for').length || 0
      const againstCount = data?.filter((v: any) => v.vote === 'against').length || 0
      setStats({ for: forCount, against: againstCount })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'За Еврото', value: stats.for, fill: '#16a34a' /* green-600 */ },
    { name: 'Против Еврото', value: stats.against, fill: '#dc2626' /* red-600 */ },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Графични резултати</h2>
            <p className="text-sm text-gray-500">Данните се актуализират в реално време</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  )
}
