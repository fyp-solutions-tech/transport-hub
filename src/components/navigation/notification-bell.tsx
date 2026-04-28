// src/components/navigation/notification-bell.tsx
'use client'

import { useState, useEffect, useRef } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate dropdown position on mobile to prevent cutting off
  useEffect(() => {
    if (isOpen && isMobile && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - buttonRect.bottom
      const dropdownHeight = Math.min(viewportHeight * 0.7, 500) // Max 70vh or 500px
      
      if (spaceBelow < 300) {
        // Position above the button if not enough space below
        setDropdownStyle({
          bottom: `${viewportHeight - buttonRect.top + 10}px`,
          top: 'auto',
          maxHeight: `${Math.min(buttonRect.top - 20, dropdownHeight)}px`,
        })
      } else {
        // Position below the button
        setDropdownStyle({
          top: `${buttonRect.bottom + 10}px`,
          bottom: 'auto',
          maxHeight: `${Math.min(spaceBelow - 20, dropdownHeight)}px`,
        })
      }
    }
  }, [isOpen, isMobile])

  // Prevent body scroll when mobile dropdown is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isMobile])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setUnreadCount(data.count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDropdown = async () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (newState) {
      await fetchNotifications()
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' })
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'RIDE_ACCEPTED': return { icon: '#00D4FF', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)' }
      case 'RIDE_STARTED': return { icon: '#00FF94', bg: 'rgba(0,255,148,0.1)', border: 'rgba(0,255,148,0.3)' }
      case 'RIDE_COMPLETED': return { icon: '#FFB800', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.3)' }
      default: return { icon: '#6B7A99', bg: 'rgba(107,122,153,0.1)', border: 'rgba(107,122,153,0.3)' }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RIDE_ACCEPTED':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      case 'RIDE_STARTED':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      case 'RIDE_COMPLETED':
        return <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l7-7m0 0l-3-3m3 3l7-7m-7 7l3 3" />
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative p-1.5 rounded-lg transition-colors hover:bg-white/5 touch-manipulation"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span 
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] sm:min-w-[16px] sm:h-[16px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
            style={{ backgroundColor: '#FF3B30', color: '#FFFFFF' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown */}
      {isOpen && (
        <div 
          className={`
            ${isMobile 
              ? 'fixed left-4 right-4 z-50 rounded-2xl'
              : 'absolute right-0 mt-2 w-96 rounded-xl'
            }
            border backdrop-blur-xl shadow-2xl overflow-hidden
          `}
          style={{
            backgroundColor: 'rgba(8,12,20,0.98)',
            borderColor: 'rgba(255,255,255,0.08)',
            ...(isMobile ? dropdownStyle : {}),
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <h3 className="text-base sm:text-sm font-semibold" style={{ color: '#F0F4FF' }}>
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm sm:text-xs font-medium hover:underline transition-colors"
                  style={{ color: '#00D4FF' }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5"
              >
                <svg className="w-5 h-5" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div 
                  className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: '#00D4FF', borderTopColor: 'transparent' }}
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="#6B7A99" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-base sm:text-sm" style={{ color: '#6B7A99' }}>No notifications yet</p>
                <p className="text-sm sm:text-xs mt-1" style={{ color: '#4A5568' }}>We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {notifications.map((notification) => {
                  const styles = getTypeStyles(notification.type)
                  return (
                    <button
                      key={notification.id}
                      onClick={() => {
                        if (!notification.read) markAsRead(notification.id)
                      }}
                      className={`w-full text-left px-4 py-4 sm:py-3 transition-colors hover:bg-white/[0.02] flex gap-3 items-start ${
                        !notification.read ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      {/* Type Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div 
                          className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border"
                          style={{ backgroundColor: styles.bg, borderColor: styles.border }}
                        >
                          <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke={styles.icon} strokeWidth="1.5" viewBox="0 0 24 24">
                            {getTypeIcon(notification.type)}
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p 
                            className={`text-base sm:text-sm truncate ${
                              !notification.read ? 'font-semibold' : ''
                            }`} 
                            style={{ color: '#F0F4FF' }}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span 
                              className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 mt-2"
                              style={{ backgroundColor: '#00D4FF' }} 
                            />
                          )}
                        </div>
                        <p 
                          className="text-sm sm:text-xs mt-1 leading-relaxed" 
                          style={{ color: '#6B7A99' }}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs sm:text-[11px] mt-1.5" style={{ color: '#4A5568' }}>
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div 
              className="px-4 py-3 sm:py-2.5 border-t text-center"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <span className="text-xs sm:text-[11px]" style={{ color: '#4A5568' }}>
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}