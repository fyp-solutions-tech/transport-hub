// src/components/rating/driver-rating-card.tsx
'use client'

import { StarDisplay } from './star-display'

interface DriverRatingCardProps {
  driverName: string
  driverImage?: string
  averageRating: number
  totalRides: number
  totalRatings: number
  recentComments?: string[]
  badges?: string[]
}

export function DriverRatingCard({
  driverName,
  driverImage,
  averageRating,
  totalRides,
  totalRatings,
  recentComments = [],
  badges = [],
}: DriverRatingCardProps) {
  const getRatingLevel = (rating: number) => {
    if (rating >= 4.8) return { label: 'Elite Driver', color: '#00D4FF' }
    if (rating >= 4.5) return { label: 'Top Rated', color: '#00FF94' }
    if (rating >= 4.0) return { label: 'Reliable', color: '#FFB800' }
    return { label: 'Standard', color: '#6B7A99' }
  }

  const level = getRatingLevel(averageRating)

  return (
    <div 
      className="p-4 rounded-2xl border"
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Driver Avatar */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 flex-shrink-0"
          style={{
            backgroundColor: 'rgba(0,212,255,0.1)',
            borderColor: 'rgba(0,212,255,0.3)',
            color: '#00D4FF',
          }}
        >
          {driverImage ? (
            <img src={driverImage} alt={driverName} className="w-full h-full rounded-full object-cover" />
          ) : (
            driverName.charAt(0)
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1" style={{ color: '#F0F4FF' }}>
            {driverName}
          </h3>
          <div 
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
            style={{
              backgroundColor: `${level.color}15`,
              color: level.color,
            }}
          >
            {level.label}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <StarDisplay rating={averageRating} size="sm" />
              <span className="text-sm font-semibold" style={{ color: '#F0F4FF' }}>
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs" style={{ color: '#6B7A99' }}>
              {totalRatings} ratings • {totalRides} rides
            </span>
          </div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {badges.map((badge, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-lg text-[10px] font-medium"
              style={{
                backgroundColor: 'rgba(0,255,148,0.1)',
                color: '#00FF94',
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium" style={{ color: '#6B7A99' }}>
            Recent Reviews
          </h4>
          {recentComments.map((comment, index) => (
            <p 
              key={index}
              className="text-sm italic leading-relaxed"
              style={{ color: '#8B9AB5' }}
            >
              "{comment}"
            </p>
          ))}
        </div>
      )}
    </div>
  )
}