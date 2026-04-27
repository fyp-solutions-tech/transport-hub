// src/components/rating/driver-rating-section.tsx
'use client'

import { useState } from 'react'
import { MdStar, MdStarBorder, MdTrendingUp } from 'react-icons/md'

interface DriverRatingSectionProps {
  avgRating: number
  totalRatings: number
  totalTrips: number
}

export function DriverRatingSection({ avgRating, totalRatings, totalTrips }: DriverRatingSectionProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getRatingLevel = (rating: number) => {
    if (rating === 0) return { label: 'No Ratings Yet', badge: 'badge-ghost' }
    if (rating >= 4.8) return { label: 'Elite Driver', badge: 'badge-info' }
    if (rating >= 4.5) return { label: 'Top Rated', badge: 'badge-success' }
    if (rating >= 4.0) return { label: 'Reliable', badge: 'badge-primary' }
    return { label: 'Standard', badge: 'badge-warning' }
  }

  const level = getRatingLevel(avgRating)

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-lg">Your Ratings</h2>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Show Less' : 'Show More'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">
              {avgRating > 0 ? avgRating.toFixed(1) : '—'}
            </div>
            <div className="flex justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">
                  {star <= Math.round(avgRating) ? (
                    <MdStar className="text-warning" />
                  ) : (
                    <MdStarBorder className="text-base-content/30" />
                  )}
                </span>
              ))}
            </div>
            <span className={`badge ${level.badge} badge-sm`}>
              {level.label}
            </span>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Total Ratings</div>
              <div className="stat-value text-lg">{totalRatings}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Total Trips</div>
              <div className="stat-value text-lg">{totalTrips}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Rating Rate</div>
              <div className="stat-value text-lg">
                {totalTrips > 0 ? `${Math.round((totalRatings / totalTrips) * 100)}%` : '—'}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Trend</div>
              <div className="stat-value text-lg flex items-center gap-1">
                <MdTrendingUp className="text-success" />
                <span className="text-sm">—</span>
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold mb-3">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-xs font-medium">{star}</span>
                  <MdStar className="text-warning text-xs" />
                </div>
                <progress 
                  className="progress progress-warning flex-1" 
                  value={0} 
                  max="100"
                />
                <span className="text-xs text-base-content/50 w-8 text-right">0</span>
              </div>
            ))}
            
            {totalRatings === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-base-content/50">No ratings yet</p>
                <p className="text-xs text-base-content/40 mt-1">
                  Ratings will appear here after riders review your trips
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}