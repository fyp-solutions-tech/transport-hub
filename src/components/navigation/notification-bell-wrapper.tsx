// src/components/navigation/notification-bell-wrapper.tsx
'use client'

import dynamic from 'next/dynamic'

const NotificationBell = dynamic(
  () => import('@/components/navigation/notification-bell').then(mod => ({ default: mod.NotificationBell })),
  { 
    ssr: false,
    loading: () => (
      <div className="relative p-1.5 sm:p-2" role="status" aria-label="Loading notifications">
        <svg 
          className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-pulse" 
          fill="none" 
          stroke="#6B7A99" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="sr-only">Loading notifications...</span>
      </div>
    )
  }
)

export function NotificationBellWrapper() {
  return <NotificationBell />
}