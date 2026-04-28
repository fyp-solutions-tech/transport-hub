// src/components/rating/star-display.tsx
'use client'

interface StarDisplayProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  totalRatings?: number
}

export function StarDisplay({ 
  rating, 
  size = 'md', 
  showValue = false,
  totalRatings 
}: StarDisplayProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'text-sm'
      case 'lg': return 'text-2xl'
      default: return 'text-lg'
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${getSize()}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{ 
              color: star <= Math.round(rating) ? '#FFB800' : '#E5E7EB'
            }}
          >
            ★
          </span>
        ))}
      </div>
      {showValue && (
        <span className="text-sm ml-1 text-base-content">
          {rating.toFixed(1)}
        </span>
      )}
      {totalRatings !== undefined && (
        <span className="text-xs ml-1 text-base-content/50">
          ({totalRatings})
        </span>
      )}
    </div>
  )
}