// src/components/rating/rating-history.tsx
'use client'

import { useState, useEffect } from 'react'
import { StarDisplay } from './star-display'

interface RatingHistory {
  id: string
  rideId: string
  rating: number
  comment: string
  categories: string[]
  driverName: string
  pickup: string
  dropoff: string
  fare: string
  createdAt: string
}

export function RatingHistory() {
  const [ratings, setRatings] = useState<RatingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')

  useEffect(() => {
    fetchRatings()
  }, [])

  const fetchRatings = async () => {
    try {
      const response = await fetch('/api/ratings/history')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setRatings(data.ratings)
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRatings = ratings
    .filter(r => !filter || r.rating === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest': return b.rating - a.rating
        case 'lowest': return a.rating - b.rating
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0'

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
    percentage: ratings.length > 0 
      ? (ratings.filter(r => r.rating === star).length / ratings.length) * 100 
      : 0
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div 
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#00D4FF', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div 
        className="p-6 rounded-2xl border"
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#F0F4FF' }}>
          Your Rating Overview
        </h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1" style={{ color: '#00D4FF' }}>
              {averageRating}
            </div>
            <StarDisplay rating={parseFloat(averageRating)} size="sm" />
            <p className="text-xs mt-1" style={{ color: '#6B7A99' }}>
              {ratings.length} ratings
            </p>
          </div>
          
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs w-4" style={{ color: '#6B7A99' }}>{star}</span>
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: star >= 4 ? '#00D4FF' : star >= 3 ? '#FFB800' : '#FF3B30'
                    }}
                  />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: '#6B7A99' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {[null, 5, 4, 3, 2, 1].map(star => (
            <button
              key={star ?? 'all'}
              onClick={() => setFilter(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200`}
              style={{
                backgroundColor: filter === star ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.02)',
                color: filter === star ? '#00D4FF' : '#6B7A99',
                border: `1px solid ${filter === star ? '#00D4FF' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {star === null ? 'All' : `${'★'.repeat(star)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        {(['recent', 'highest', 'lowest'] as const).map(option => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200"
            style={{
              backgroundColor: sortBy === option ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.02)',
              color: sortBy === option ? '#00D4FF' : '#6B7A99',
              border: `1px solid ${sortBy === option ? '#00D4FF' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Rating List */}
      <div className="space-y-3">
        {filteredRatings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: '#6B7A99' }}>No ratings found</p>
          </div>
        ) : (
          filteredRatings.map((rating) => (
            <div
              key={rating.id}
              className="p-4 rounded-xl border transition-all duration-200 hover:bg-white/[0.02]"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StarDisplay rating={rating.rating} size="sm" />
                    <span className="text-xs" style={{ color: '#6B7A99' }}>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#F0F4FF' }}>
                    {rating.pickup} → {rating.dropoff}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B7A99' }}>
                    Driver: {rating.driverName} • {rating.fare}
                  </p>
                </div>
              </div>

              {rating.categories.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {rating.categories.map(category => (
                    <span
                      key={category}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                      style={{
                        backgroundColor: 'rgba(0,212,255,0.1)',
                        color: '#00D4FF',
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {rating.comment && (
                <p className="text-sm mt-2 leading-relaxed" style={{ color: '#6B7A99' }}>
                  "{rating.comment}"
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}