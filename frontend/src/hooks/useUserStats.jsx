import { useState, useEffect } from 'react'

export function useUserStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard', { credentials: 'include' })
        if (!response.ok) throw new Error('Failed to fetch user stats')
        const data = await response.json()
        setStats(data.user_stats)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}