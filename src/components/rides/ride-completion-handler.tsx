// src/components/rides/ride-completion-handler.tsx
'use client'

import { useState, useEffect } from 'react'
import { RatingModal } from '@/components/rating/rating-modal'
import { StarDisplay } from '@/components/rating/star-display'

interface RideCompletionHandlerProps {
  rideId: string
  driverName?: string
  driverImage?: string
  rideDetails?: {
    pickup: string
    dropoff: string
    fare: string
    duration: string
  }
  onComplete?: () => void
}

export function RideCompletionHandler({
  rideId,
  driverName,
  driverImage,
  rideDetails,
  onComplete
}: RideCompletionHandlerProps) {
  const [showRating, setShowRating] = useState(false)
  const [hasRating, setHasRating] = useState(false)
  const [existingRating, setExistingRating] = useState<number | null>(null)

  useEffect(() => {
    checkExistingRating()
  }, [rideId])

  const checkExistingRating = async () => {
    try {
      const response = await fetch(`/api/ratings/${rideId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.exists) {
          setHasRating(true)
          setExistingRating(data.rating)
        }
      }
    } catch (error) {
      console.error('Failed to check rating:', error)
    }
  }

  const handleRatingSubmitted = () => {
    setHasRating(true)
    onComplete?.()
  }

  // Auto-show rating modal after ride completion
  useEffect(() => {
    if (!hasRating) {
      const timer = setTimeout(() => {
        setShowRating(true)
      }, 2000) // Show after 2 seconds
      return () => clearTimeout(timer)
    }
  }, [hasRating])

  return (
    <>
      {/* Ride Completion Card */}
      <div 
        className="p-4 rounded-2xl border"
        style={{
          backgroundColor: 'rgba(0,212,255,0.05)',
          borderColor: 'rgba(0,212,255,0.2)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold" style={{ color: '#F0F4FF' }}>
            Ride Completed
          </h3>
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(0,255,148,0.1)',
              color: '#00FF94',
            }}
          >
            Completed
          </div>
        </div>

        {hasRating && existingRating ? (
          <div>
            <p className="text-sm mb-2" style={{ color: '#6B7A99' }}>
              Your rating:
            </p>
            <StarDisplay rating={existingRating} size="lg" showValue />
          </div>
        ) : (
          <button
            onClick={() => setShowRating(true)}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: '#00D4FF',
              color: '#0F1423',
            }}
          >
            Rate Your Experience
          </button>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        rideId={rideId}
        driverName={driverName}
        driverImage={driverImage}
        rideDetails={rideDetails}
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onSubmitted={handleRatingSubmitted}
      />
    </>
  )
}