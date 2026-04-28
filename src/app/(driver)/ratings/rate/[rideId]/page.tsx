// src/app/driver/ratings/rate/[rideId]/page.tsx
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MdStar, MdStarBorder, MdSend } from 'react-icons/md'

export default function RateRidePage() {
  const { rideId } = useParams()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          rating,
          comment,
          type: 'RIDER',
        })
      })
      
      setSubmitted(true)
      setTimeout(() => router.push('/driver/dashboard'), 2000)
    } catch (error) {
      console.error('Failed to submit rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-base-content/60 mt-2">Your rating has been submitted</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rate Your Rider</h1>
        <p className="text-base-content/60 mt-1">How was your experience?</p>
      </div>

      {/* Stars */}
      <div className="card bg-base-100 border border-base-200">
        <div className="card-body items-center py-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-5xl transition-all hover:scale-110"
              >
                {(hoverRating || rating) >= star ? (
                  <MdStar className="text-warning" />
                ) : (
                  <MdStarBorder className="text-base-content/30" />
                )}
              </button>
            ))}
          </div>
          <p className="text-sm text-base-content/60">
            {rating === 0 ? 'Tap to rate' : `You rated ${rating} star${rating > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Comment */}
      <div className="card bg-base-100 border border-base-200">
        <div className="card-body">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Additional Comments (Optional)</span>
              <span className="label-text-alt">{comment.length}/500</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="textarea textarea-bordered h-24"
              placeholder="Share your experience with this rider..."
              maxLength={500}
            />
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className="btn btn-warning w-full"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner" />
            Submitting...
          </>
        ) : (
          <>
            <MdSend />
            Submit Rating
          </>
        )}
      </button>
    </div>
  )
}