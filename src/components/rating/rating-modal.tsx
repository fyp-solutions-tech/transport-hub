// src/components/rating/rating-modal.tsx
'use client'

import { useState, useEffect, useRef } from 'react'

interface RatingModalProps {
  rideId: string
  driverName?: string
  driverImage?: string
  rideDetails?: {
    pickup: string
    dropoff: string
    fare: string
    duration: string
  }
  isOpen: boolean
  onClose: () => void
  onSubmitted: () => void
}

interface RatingCategory {
  id: string
  label: string
  icon: string
}

const ratingCategories: RatingCategory[] = [
  { id: 'punctuality', label: 'Punctuality', icon: '⏰' },
  { id: 'cleanliness', label: 'Cleanliness', icon: '✨' },
  { id: 'driving', label: 'Safe Driving', icon: '🛡️' },
  { id: 'navigation', label: 'Navigation', icon: '🗺️' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'value', label: 'Value for Money', icon: '💎' },
]

export function RatingModal({
  rideId,
  driverName = 'Driver',
  driverImage,
  rideDetails,
  isOpen,
  onClose,
  onSubmitted
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          rating,
          comment,
          categories: selectedCategories,
        })
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSubmitted(true)
      setTimeout(() => {
        onSubmitted()
        onClose()
      }, 2000)
    } catch (error) {
      setError('Failed to submit rating. Please try again.')
      console.error('Failed to submit rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getRatingEmoji = (star: number) => {
    if (hoverRating >= star || (!hoverRating && rating >= star)) {
      return '★'
    }
    return '☆'
  }

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return 'Tap to rate'
    }
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return '#FF3B30'
      case 2: return '#FF9500'
      case 3: return '#FFCC00'
      case 4: return '#34C759'
      case 5: return '#00D4FF'
      default: return '#6B7A99'
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget && !submitted) onClose()
        }}
      >
        {/* Modal */}
        <div 
          ref={modalRef}
          className={`
            ${isMobile 
              ? 'w-full rounded-t-3xl max-h-[90vh] overflow-y-auto'
              : 'w-full max-w-lg rounded-3xl mx-4 max-h-[90vh] overflow-y-auto'
            }
            shadow-2xl animate-slide-up
          `}
          style={{
            backgroundColor: 'rgba(15, 20, 35, 0.99)',
            borderColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Mobile drag handle */}
          {isMobile && (
            <div className="flex justify-center pt-4 pb-2 sticky top-0 z-10" style={{ backgroundColor: 'rgba(15,20,35,0.99)' }}>
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>
          )}

          {!submitted ? (
            <>
              {/* Header */}
              <div className="px-6 pt-4 pb-6 text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#F0F4FF' }}>
                  Rate Your Ride
                </h2>
                <p className="text-sm" style={{ color: '#6B7A99' }}>
                  How was your experience with {driverName}?
                </p>
              </div>

              {/* Stars */}
              <div className="px-6 pb-6">
                <div className="flex justify-center gap-2 sm:gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star)
                        setError('')
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-4xl sm:text-5xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                      style={{
                        color: hoverRating >= star || (!hoverRating && rating >= star)
                          ? getRatingColor(star)
                          : 'rgba(107,122,153,0.3)',
                        textShadow: (hoverRating >= star || (!hoverRating && rating >= star))
                          ? `0 0 20px ${getRatingColor(star)}40`
                          : 'none',
                      }}
                    >
                      {getRatingEmoji(star)}
                    </button>
                  ))}
                </div>
                <p 
                  className="text-center text-sm font-medium transition-all duration-200"
                  style={{ color: rating > 0 ? getRatingColor(rating) : '#6B7A99' }}
                >
                  {getRatingLabel(rating || hoverRating)}
                </p>
              </div>

              {/* Rating Categories */}
              <div className="px-6 pb-6">
                <h3 className="text-sm font-medium mb-3" style={{ color: '#F0F4FF' }}>
                  What stood out? (Optional)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ratingCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`
                        px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                        ${selectedCategories.includes(category.id)
                          ? 'border-2 shadow-lg'
                          : 'border hover:border-white/20'
                        }
                      `}
                      style={{
                        backgroundColor: selectedCategories.includes(category.id)
                          ? 'rgba(0,212,255,0.1)'
                          : 'rgba(255,255,255,0.02)',
                        borderColor: selectedCategories.includes(category.id)
                          ? '#00D4FF'
                          : 'rgba(255,255,255,0.06)',
                        color: selectedCategories.includes(category.id)
                          ? '#00D4FF'
                          : '#6B7A99',
                      }}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Section */}
              <div className="px-6 pb-6">
                <h3 className="text-sm font-medium mb-3" style={{ color: '#F0F4FF' }}>
                  Additional Comments (Optional)
                </h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl resize-none text-sm outline-none transition-all duration-200 focus:border-opacity-100"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F4FF',
                  }}
                />
                {/* Placeholder styling using CSS */}
                <style jsx>{`
                  textarea::placeholder {
                    color: #4A5568;
                    opacity: 1;
                  }
                  textarea:focus {
                    border-color: #00D4FF !important;
                    box-shadow: 0 0 0 2px rgba(0,212,255,0.1);
                  }
                `}</style>
                <p className="text-xs mt-1 text-right" style={{ color: '#4A5568' }}>
                  {comment.length}/500
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-center" style={{ color: '#FF3B30' }}>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="px-6 pb-6 sticky bottom-0 pt-2" style={{ backgroundColor: 'rgba(15,20,35,0.99)' }}>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className={`
                    w-full py-4 px-6 rounded-2xl text-base font-semibold transition-all duration-200
                    ${rating > 0 
                      ? 'hover:scale-[1.02] active:scale-[0.98]' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                  style={{
                    backgroundColor: rating > 0 ? '#00D4FF' : 'rgba(0,212,255,0.2)',
                    color: '#0F1423',
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Rating'
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 mt-2 text-sm rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: '#6B7A99' }}
                >
                  Skip
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ 
                  backgroundColor: 'rgba(0,212,255,0.1)',
                  animation: 'bounce 1s infinite'
                }}
              >
                <svg className="w-10 h-10" fill="none" stroke="#00D4FF" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#F0F4FF' }}>
                Thank You!
              </h2>
              <p className="text-sm text-center" style={{ color: '#6B7A99' }}>
                Your feedback helps us improve your experience.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}