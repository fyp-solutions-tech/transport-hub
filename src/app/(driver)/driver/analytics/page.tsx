// src/app/driver/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MdDownload, MdTrendingUp, MdTrendingDown, MdAccessTime, MdWarning } from 'react-icons/md'
import { toast } from 'sonner'

interface AnalyticsData {
  overview: {
    today: { trips: number; revenue: number }
    week: { trips: number; revenue: number }
    month: { trips: number; revenue: number }
    total: { trips: number; revenue: number }
    avgRating: number
    delayedTrips: number
    delayedPercentage: number
  }
  charts: {
    hourlyDistribution: number[]
    vehicleDistribution: Record<string, number>
    weeklyRevenue: { day: string; revenue: number; trips: number }[]
  }
  recentRides: {
    id: string
    pickup: string
    dropoff: string
    fare: number
    rating: number
    vehicleType: string
    duration: number
    actualDuration: number
    isDelayed: boolean
    date: string
  }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('week')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/analytics/export')
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ride-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Report exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!data) return null

  const maxHourlyValue = Math.max(...data.charts.hourlyDistribution, 1)
  const maxWeeklyRevenue = Math.max(...data.charts.weeklyRevenue.map(d => d.revenue), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-base-content/60 mt-1">Track your performance and earnings</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn btn-primary gap-2"
        >
          {exporting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <MdDownload className="text-lg" />
          )}
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trips */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <p className="text-sm text-base-content/60">Total Trips</p>
            <p className="text-3xl font-bold text-primary">{data.overview.total.trips}</p>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <MdTrendingUp />
              <span>+{data.overview.month.trips} this month</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <p className="text-sm text-base-content/60">Total Revenue</p>
            <p className="text-3xl font-bold text-success">PKR {data.overview.total.revenue.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <MdTrendingUp />
              <span>PKR {data.overview.month.revenue.toLocaleString()} this month</span>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <p className="text-sm text-base-content/60">Avg Rating</p>
            <p className="text-3xl font-bold text-warning">
              {data.overview.avgRating > 0 ? data.overview.avgRating.toFixed(1) : '—'}
            </p>
            <div className="flex items-center gap-1 text-xs text-base-content/50 mt-1">
              <span>From {data.overview.total.trips} trips</span>
            </div>
          </div>
        </div>

        {/* Delayed Trips */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <p className="text-sm text-base-content/60">Delayed Trips</p>
            <p className="text-3xl font-bold text-error">{data.overview.delayedTrips}</p>
            <div className="flex items-center gap-1 text-xs text-error mt-1">
              <MdWarning />
              <span>{data.overview.delayedPercentage}% of total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base mb-4">Weekly Revenue</h3>
            <div className="flex items-end gap-2 h-40">
              {data.charts.weeklyRevenue.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium">
                    PKR {day.revenue > 0 ? (day.revenue / 1000).toFixed(1) + 'k' : '0'}
                  </span>
                  <div 
                    className="w-full bg-primary/20 rounded-t-lg transition-all duration-300 hover:bg-primary/40"
                    style={{ 
                      height: `${(day.revenue / maxWeeklyRevenue) * 100}%`,
                      minHeight: day.revenue > 0 ? '4px' : '2px'
                    }}
                  />
                  <span className="text-xs text-base-content/50">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base mb-4">Peak Hours</h3>
            <div className="flex items-end gap-1 h-40">
              {data.charts.hourlyDistribution.map((count, hour) => (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium">{count > 0 ? count : ''}</span>
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      count > 0 ? 'bg-accent/60 hover:bg-accent' : 'bg-base-200'
                    }`}
                    style={{ 
                      height: `${(count / maxHourlyValue) * 100}%`,
                      minHeight: '2px'
                    }}
                  />
                  {hour % 3 === 0 && (
                    <span className="text-[10px] text-base-content/50">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Distribution & Recent Rides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Distribution */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base mb-4">Vehicle Distribution</h3>
            <div className="space-y-3">
              {Object.entries(data.charts.vehicleDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm capitalize w-20">{type}</span>
                  <progress 
                    className="progress progress-primary flex-1" 
                    value={count} 
                    max={data.overview.total.trips}
                  />
                  <span className="text-sm font-medium w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Today's Earnings</span>
                <span className="font-semibold text-success">PKR {data.overview.today.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Today's Trips</span>
                <span className="font-semibold">{data.overview.today.trips}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Week</span>
                <span className="font-semibold">PKR {data.overview.week.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Month</span>
                <span className="font-semibold">PKR {data.overview.month.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg per Trip</span>
                <span className="font-semibold">
                  PKR {data.overview.total.trips > 0 
                    ? Math.round(data.overview.total.revenue / data.overview.total.trips).toLocaleString() 
                    : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Rides Table */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-6">
          <h3 className="card-title text-base mb-4">Recent Rides</h3>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Fare</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentRides.map((ride) => (
                  <tr key={ride.id} className="hover">
                    <td className="text-xs">
                      {new Date(ride.date).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="text-xs max-w-[200px] truncate">
                        {ride.pickup} → {ride.dropoff}
                      </div>
                    </td>
                    <td className="font-medium">PKR {ride.fare}</td>
                    <td className="text-xs">
                      {ride.actualDuration || ride.duration || '—'} min
                      {ride.isDelayed && (
                        <span className="badge badge-error badge-xs ml-1">Delayed</span>
                      )}
                    </td>
                    <td>
                      {ride.rating ? (
                        <span className="text-warning">{'★'.repeat(ride.rating)}</span>
                      ) : (
                        <span className="text-base-content/30">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-xs ${
                        ride.isDelayed ? 'badge-error' : 'badge-success'
                      }`}>
                        {ride.isDelayed ? 'Delayed' : 'On Time'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}