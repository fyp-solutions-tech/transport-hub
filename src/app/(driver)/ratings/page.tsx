// src/app/driver/ratings/page.tsx
import { requireRole } from "@/lib/session";
import { MdStar, MdRateReview, MdPerson } from "react-icons/md";

interface Rating {
  id: string
  riderName: string
  rating: number
  comment: string
  categories: string[]
  pickup: string
  dropoff: string
  fare: string
  date: string
}

export default async function DriverRatingsPage() {
  const { session } = await requireRole("DRIVER");
  
  // Fetch ratings from API
  // const ratings = await fetchDriverRatings(session.user.id)
  
  // Example data
  const ratings: Rating[] = [
    {
      id: '1',
      riderName: 'Ahmed Khan',
      rating: 5,
      comment: 'Excellent driver! Very professional and punctual.',
      categories: ['punctuality', 'cleanliness'],
      pickup: 'Central Station',
      dropoff: 'Algora Mall',
      fare: 'PKR 450',
      date: '2026-04-25',
    },
    {
      id: '2',
      riderName: 'Sara Ali',
      rating: 4,
      comment: 'Good ride, smooth driving.',
      categories: ['driving'],
      pickup: 'City Center',
      dropoff: 'Airport',
      fare: 'PKR 850',
      date: '2026-04-24',
    },
  ]

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Ratings</h1>
        <p className="text-base-content/60 mt-1">See what riders say about you</p>
      </div>

      {/* Rating Overview */}
      <div className="card bg-base-100 border border-base-200">
        <div className="card-body p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-warning">{avgRating}</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MdStar 
                    key={star}
                    className={`text-xl ${star <= Math.round(Number(avgRating)) ? 'text-warning' : 'text-base-content/20'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-base-content/50 mt-1">{ratings.length} ratings</p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter(r => r.rating === star).length
                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-4">{star}</span>
                    <MdStar className="text-warning text-xs" />
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

      {/* Rating List */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="card bg-base-100 border border-base-200">
            <div className="card-body items-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                <MdRateReview className="text-3xl text-base-content/30" />
              </div>
              <p className="font-medium text-base-content/60">No ratings yet</p>
              <p className="text-sm text-base-content/40 mt-1">
                Ratings from riders will appear here
              </p>
            </div>
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="card bg-base-100 border border-base-200">
              <div className="card-body p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary/10 text-primary rounded-full w-10">
                        <span className="text-sm font-semibold">
                          {rating.riderName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{rating.riderName}</p>
                      <p className="text-xs text-base-content/50">{rating.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <MdStar 
                        key={star}
                        className={`text-lg ${star <= rating.rating ? 'text-warning' : 'text-base-content/20'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                  <span>{rating.pickup}</span>
                  <span>→</span>
                  <span>{rating.dropoff}</span>
                  <span className="ml-auto font-semibold text-base-content">{rating.fare}</span>
                </div>

                {/* Categories */}
                {rating.categories.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {rating.categories.map(cat => (
                      <span key={cat} className="badge badge-info badge-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comment */}
                {rating.comment && (
                  <div className="bg-base-200 p-3 rounded-lg mt-2">
                    <p className="text-sm italic">"{rating.comment}"</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}