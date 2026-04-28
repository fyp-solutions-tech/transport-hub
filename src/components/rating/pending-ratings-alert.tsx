// src/components/rating/pending-ratings-alert.tsx
'use client'

import { useState, useEffect } from 'react'
import { MdStar, MdClose } from 'react-icons/md'

export function PendingRatingsAlert() {
  const [pendingCount, setPendingCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    fetchPendingCount()
  }, [])

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/ratings/pending')
      if (response.ok) {
        const data = await response.json()
        setPendingCount(data.rides?.length || 0)
      }
    } catch (error) {
      console.error('Failed to fetch pending ratings:', error)
    }
  }

  if (!isVisible || pendingCount === 0) return null

  return (
    <div className="alert alert-warning shadow-lg">
      <MdStar className="text-xl" />
      <div className="flex-1">
        <h3 className="font-bold text-sm">Pending Ratings</h3>
        <p className="text-xs opacity-80">
          You have {pendingCount} ride{pendingCount > 1 ? 's' : ''} waiting for your rating
        </p>
      </div>
      <div className="flex-none gap-2">
        <button 
          className="btn btn-sm btn-warning"
          onClick={() => {
            window.location.href = '/driver/ratings'
          }}
        >
          Rate Now
        </button>
        <button 
          className="btn btn-sm btn-ghost"
          onClick={() => setIsVisible(false)}
        >
          <MdClose />
        </button>
      </div>
    </div>
  )
}