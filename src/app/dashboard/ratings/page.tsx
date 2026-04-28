// src/app/dashboard/ratings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { StarDisplay } from '@/components/rating/star-display'
import { RatingHistory } from '@/components/rating/rating-history'

// If you haven't created these components yet, use this simplified version:

export default function RatingsPage() {
  const [ratings, setRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [])

  const fetchRatings = async () => {
    try {
      const response = await fetch('/api/ratings/history')
      if (response.ok) {
        const data = await response.json()
        setRatings(data.ratings || [])
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-warning" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Ratings</h1>
        <p className="text-base-content/60 mt-1">See what riders say about your trips</p>
      </div>

      {/* Rating Overview Card */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-warning">{avgRating}</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-xl">
                    {star <= Math.round(Number(avgRating)) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <p className="text-sm text-base-content/50 mt-1">
                {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter((r: any) => r.rating === star).length
                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-4">{star}</span>
                    <span className="text-warning text-xs">★</span>
                    <progress 
                      className="progress progress-warning flex-1" 
                      value={percentage} 
                      max="100"
                    />
                    <span className="text-xs text-base-content/50 w-6">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      {ratings.length === 0 ? (
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
              <span className="text-3xl">⭐</span>
            </div>
            <p className="font-medium text-base-content/60">No ratings yet</p>
            <p className="text-sm text-base-content/40 mt-1">
              Ratings from riders will appear here after they review your trips
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {ratings.map((rating: any) => (
            <div key={rating.id} className="card bg-base-100 border border-base-200 shadow-sm">
              <div className="card-body p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary/10 text-primary rounded-full w-10">
                        <span className="text-sm font-semibold">
                          {rating.riderName?.charAt(0) || 'R'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{rating.riderName || 'Rider'}</p>
                      <p className="text-xs text-base-content/50">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        className={`text-lg ${star <= rating.rating ? 'text-warning' : 'text-base-content/20'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {rating.categories?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {rating.categories.map((cat: string) => (
                      <span key={cat} className="badge badge-info badge-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {rating.comment && (
                  <div className="bg-base-200 p-3 rounded-lg mt-2">
                    <p className="text-sm italic">"{rating.comment}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}