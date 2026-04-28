// app/page.tsx
import Link from 'next/link';
import PaymentButton from '@/components/ui/PaymentButton';
import type { Metadata } from 'next';
import { NotificationBellWrapper } from '@/components/navigation/notification-bell-wrapper';

export const metadata: Metadata = {
  title: 'TransportHub - Real-time Bus Tracking',
  description: 'Track every bus in real time. A unified platform for live bus tracking, intelligent scheduling, and commuter alerts.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen font-['Space_Grotesk',sans-serif] overflow-x-hidden" style={{ backgroundColor: '#080C14', color: '#F0F4FF' }}>

      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav
        className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-5 border-b sticky top-0 backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(8,12,20,0.95)',
          borderColor: 'rgba(255,255,255,0.06)'
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <div
            className="relative w-7 h-7 sm:w-[34px] sm:h-[34px] rounded-lg flex items-center justify-center"
            style={{ border: '1px solid #00D4FF' }}
          >
            <div
              className="absolute inset-[-1px] rounded-lg"
              style={{ backgroundColor: 'rgba(0,212,255,0.12)' }}
            />
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-[1]"
              style={{ stroke: '#00D4FF' }}
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="font-['Syne',sans-serif] text-sm sm:text-base font-extrabold tracking-[0.05em] hidden sm:inline" style={{ color: '#F0F4FF' }}>
            TRANSPORT<span style={{ color: '#00D4FF' }}>HUB</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex gap-6 xl:gap-10 list-none">
          {[
            { href: '/routes', label: 'Routes' },
            { href: '/schedules', label: 'Schedules' },
            { href: '/track', label: 'Track' },
            { href: '/operators', label: 'Operators' },
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] no-underline tracking-[0.03em] transition-colors duration-200 hover:text-[#00D4FF]"
                style={{ color: '#6B7A99' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-[20px] border"
            style={{
              color: '#00FF94',
              borderColor: 'rgba(0,255,148,0.2)',
              backgroundColor: 'rgba(0,255,148,0.1)'
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ backgroundColor: '#00FF94' }} />
            <span className="hidden sm:inline">System online</span>
            <span className="sm:hidden">Online</span>
          </div>

          {/* Notification Bell */}
          <NotificationBellWrapper />

          <Link
            href="/auth/login"
            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-[13px] font-semibold tracking-[0.03em] transition-opacity duration-200 hover:opacity-85 no-underline whitespace-nowrap"
            style={{ backgroundColor: '#00D4FF', color: '#080C14' }}
          >
            Launch app
          </Link>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-1.5" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 sm:w-8 h-px" style={{ backgroundColor: '#00D4FF' }} />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: '#00D4FF' }}>
              Next-gen transit intelligence
            </span>
          </div>

          <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.1] mb-4 sm:mb-6" style={{ color: '#F0F4FF' }}>
            Track every bus.<br />
            <span style={{ color: '#00D4FF' }}>In real time.</span><br />
            <span style={{ color: '#8896B3' }}>Every city.</span>
          </h1>

          <p className="text-sm sm:text-[15px] leading-[1.8] mb-6 sm:mb-10 max-w-[440px]" style={{ color: '#6B7A99' }}>
            A unified platform for live bus tracking, intelligent scheduling, and commuter alerts — engineered for the cities of tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
            <Link
              href="/track"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-md text-sm font-semibold tracking-[0.02em] transition-opacity duration-200 hover:opacity-85 no-underline text-center"
              style={{ backgroundColor: '#00D4FF', color: '#080C14' }}
            >
              Track your route
            </Link>
            <Link
              href="/routes"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm tracking-[0.02em] transition-colors duration-200 hover:border-[#00D4FF] no-underline border text-center"
              style={{ color: '#F0F4FF', borderColor: 'rgba(255,255,255,0.12)' }}
            >
              View live map
            </Link>
          </div>
        </div>

        {/* Right Panel - Live Card */}
        <div
          className="order-1 lg:order-2 rounded-xl sm:rounded-2xl overflow-hidden border w-full"
          style={{ backgroundColor: '#0D1320', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          {/* Panel Header */}
          <div
            className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 border-b"
            style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="flex gap-1 sm:gap-1.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#28C840' }} />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase" style={{ color: '#6B7A99' }}>
              Live dispatch — Zone 4
            </span>
            <span
              className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded tracking-[0.06em] border hidden sm:inline"
              style={{
                color: '#00FF94',
                backgroundColor: 'rgba(0,255,148,0.1)',
                borderColor: 'rgba(0,255,148,0.15)'
              }}
            >
              ● LIVE
            </span>
          </div>

          {/* Mini Map */}
          <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3" style={{ backgroundColor: '#080C14' }}>
            <svg viewBox="0 0 340 150" className="w-full rounded-lg sm:rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <rect width="340" height="150" fill="#080C14" rx="10" />
              {/* Grid lines */}
              <line x1="0" y1="50" x2="340" y2="50" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="100" x2="340" y2="100" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              <line x1="85" y1="0" x2="85" y2="150" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              <line x1="170" y1="0" x2="170" y2="150" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              <line x1="255" y1="0" x2="255" y2="150" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              {/* Routes */}
              <polyline points="20,75 85,50 170,75 255,50 320,75" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
              <polyline points="20,110 85,110 170,50 255,110 320,50" fill="none" stroke="rgba(0,255,148,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Stops */}
              {[{ cx: 20, cy: 75 }, { cx: 85, cy: 50 }, { cx: 170, cy: 75 }, { cx: 255, cy: 50 }, { cx: 320, cy: 75 }].map((s, i) => (
                <circle key={`c-${i}`} cx={s.cx} cy={s.cy} r="3" fill="rgba(0,212,255,0.4)" />
              ))}
              {[{ cx: 85, cy: 110 }, { cx: 170, cy: 50 }, { cx: 255, cy: 110 }].map((s, i) => (
                <circle key={`g-${i}`} cx={s.cx} cy={s.cy} r="3" fill="rgba(0,255,148,0.4)" />
              ))}
              {/* Buses with glow */}
              <rect x="108" y="67" width="40" height="18" rx="5" fill="#00D4FF" filter="url(#glow)" />
              <text x="128" y="80" textAnchor="middle" fill="#080C14" fontSize="9" fontWeight="700" fontFamily="Space Grotesk,sans-serif">B — 12</text>
              <rect x="188" y="42" width="40" height="18" rx="5" fill="#00FF94" filter="url(#glow)" />
              <text x="208" y="55" textAnchor="middle" fill="#080C14" fontSize="9" fontWeight="700" fontFamily="Space Grotesk,sans-serif">G — 04</text>
              {/* Labels */}
              <text x="60" y="93" textAnchor="middle" fill="rgba(107,122,153,0.8)" fontSize="8" fontFamily="Space Grotesk,sans-serif">Central</text>
              <text x="200" y="93" textAnchor="middle" fill="rgba(107,122,153,0.8)" fontSize="8" fontFamily="Space Grotesk,sans-serif">Station</text>
              <text x="300" y="93" textAnchor="middle" fill="rgba(107,122,153,0.8)" fontSize="8" fontFamily="Space Grotesk,sans-serif">Airport</text>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* Route Cards */}
          <div className="flex flex-col gap-1.5 sm:gap-2 p-2.5 sm:p-4">
            {[
              { code: 'B12', name: 'Central → Airport', stops: '6 stops · 14.2 km', eta: '3 min', progress: 85, color: '#00D4FF', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.2)' },
              { code: 'G04', name: 'University → Market', stops: '4 stops · 8.7 km', eta: '7 min', progress: 55, color: '#00FF94', bg: 'rgba(0,255,148,0.1)', border: 'rgba(0,255,148,0.2)' },
              { code: 'A07', name: 'Station → City Hall', stops: '5 stops · 11.1 km', eta: '12 min', progress: 30, color: '#FFB800', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.2)' },
            ].map((route) => (
              <div
                key={route.code}
                className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 cursor-default border"
                style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[10px] sm:text-[11px] font-semibold shrink-0 border"
                  style={{ backgroundColor: route.bg, borderColor: route.border, color: route.color }}
                >
                  {route.code}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs font-medium mb-0.5 truncate" style={{ color: '#F0F4FF' }}>{route.name}</p>
                  <p className="text-[10px] sm:text-[11px] truncate" style={{ color: '#6B7A99' }}>{route.stops}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] sm:text-[13px] font-semibold" style={{ color: '#00D4FF' }}>{route.eta}</p>
                  <div className="w-8 sm:w-10 h-[3px] rounded-sm mt-1 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-sm" style={{ width: `${route.progress}%`, backgroundColor: route.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="relative z-[1] grid grid-cols-2 lg:grid-cols-4 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {[
          { num: '42', label: 'Active routes' },
          { num: '320+', label: 'Buses tracked' },
          { num: '98.4%', label: 'On-time accuracy' },
          { num: '24/7', label: 'Live coverage' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 text-center relative overflow-hidden group border-r last:border-r-0"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {/* Hover glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)' }}
            />
            <p className="font-['Syne',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1 tracking-[-0.02em]" style={{ color: '#00D4FF' }}>
              {stat.num}
            </p>
            <p className="text-[11px] sm:text-[13px] tracking-[0.02em]" style={{ color: '#6B7A99' }}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="relative z-[1] py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 sm:w-6 h-px" style={{ backgroundColor: '#00D4FF' }} />
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: '#00D4FF' }}>
            Core capabilities
          </span>
        </div>

        <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-10 sm:mb-14 leading-[1.2]" style={{ color: '#F0F4FF' }}>
          Built for the modern <span style={{ color: '#6B7A99' }}>commuter.</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-xl sm:rounded-2xl overflow-hidden border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { num: '01', title: 'Real-time ETAs', desc: 'Live arrival countdowns updated every 30 seconds from GPS telemetry.', color: '#00D4FF', icon: 'M12 6v6l4 2m4-2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { num: '02', title: 'Live bus location', desc: 'Watch every bus move on the map in real time — pinpoint precision.', color: '#00FF94', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            { num: '03', title: 'Smart alerts', desc: 'Notifications that adapt to your commute pattern — arrive at the right moment.', color: '#FFB800', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.999L15 17zm0 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { num: '04', title: 'Route intelligence', desc: 'Multi-leg journey planning with transfers, walk times, and live disruptions.', color: '#00D4FF', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
            { num: '05', title: 'Full timetables', desc: 'Complete schedules for weekday, weekend and holiday service periods.', color: '#00FF94', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { num: '06', title: 'Operator dashboard', desc: 'Full fleet visibility and control for transit operators and city managers.', color: '#FFB800', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          ].map((feature, idx) => (
            <div
              key={feature.num}
              className="p-5 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200 hover:bg-[#111827] cursor-default"
              style={{ backgroundColor: '#0D1320' }}
            >
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.12), transparent)' }} />
              <div className="font-['Syne',sans-serif] text-[10px] sm:text-[11px] font-bold mb-4 sm:mb-5 tracking-[0.1em] opacity-50" style={{ color: '#6B7A99' }}>
                {feature.num}
              </div>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center mb-3 sm:mb-4"
                style={{ borderColor: `${feature.color}30` }}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5] fill-none" stroke={feature.color} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-[13px] sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: '#F0F4FF' }}>{feature.title}</h3>
              <p className="text-[11px] sm:text-xs leading-[1.7]" style={{ color: '#6B7A99' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="relative z-[1] py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left - Steps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 sm:w-6 h-px" style={{ backgroundColor: '#00D4FF' }} />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: '#00D4FF' }}>
              How it works
            </span>
          </div>

          <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 leading-[1.2]" style={{ color: '#F0F4FF' }}>
            Up and running<br />
            <span style={{ color: '#6B7A99' }}>in seconds.</span>
          </h2>

          <p className="text-sm leading-[1.8] mb-8 sm:mb-10 max-w-[380px]" style={{ color: '#6B7A99' }}>
            No setup, no downloads. Open the platform and you're already tracking.
          </p>

          <div className="flex flex-col">
            {[
              { step: 1, title: 'Search your route', desc: 'Find any route by number, stop name, or destination in seconds.' },
              { step: 2, title: 'Watch it live', desc: 'Your bus appears on the map with a precise GPS-powered ETA.' },
              { step: 3, title: 'Get notified', desc: 'Receive a push alert before your bus reaches your stop.' },
              { step: 4, title: 'Board on time', desc: 'Walk out exactly when needed. Never miss a bus again.' },
            ].map((item, index, arr) => (
              <div key={item.step} className="flex gap-4 sm:gap-5 pb-5 sm:pb-6 relative last:pb-0">
                {index < arr.length - 1 && (
                  <div className="absolute left-[15px] sm:left-[16px] top-8 bottom-0 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                )}
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-[10px] sm:text-xs font-semibold shrink-0 relative z-[1]"
                  style={{ color: '#00D4FF', borderColor: 'rgba(255,255,255,0.12)', backgroundColor: '#111827' }}
                >
                  {item.step}
                </div>
                <div className="pt-0.5">
                  <h4 className="text-[13px] sm:text-sm font-medium mb-1" style={{ color: '#F0F4FF' }}>{item.title}</h4>
                  <p className="text-[11px] sm:text-xs leading-[1.65]" style={{ color: '#6B7A99' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Terminal */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden border" style={{ backgroundColor: '#0D1320', borderColor: 'rgba(255,255,255,0.12)' }}>
          <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 border-b" style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex gap-1 sm:gap-1.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#28C840' }} />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.06em] ml-1" style={{ color: '#6B7A99' }}>
              transit-hub — dispatch feed
            </span>
          </div>
          <div className="p-4 sm:p-6 font-['Space_Grotesk',monospace] text-[10px] sm:text-xs leading-[1.8] sm:leading-[2] overflow-x-auto">
            <div className="flex gap-2 items-start">
              <span style={{ color: '#6B7A99' }}>$</span>
              <span style={{ color: '#00D4FF' }}>connect</span>
              <span style={{ color: '#F0F4FF' }}>--zone=4 --live</span>
            </div>
            <div className="flex gap-2 items-start">
              <span style={{ color: '#00FF94' }}>✓ Connected to dispatch server</span>
            </div>
            <div className="flex gap-2 items-start">
              <span style={{ color: '#6B7A99' }}>Streaming 42 active routes...</span>
            </div>
            <div className="h-1.5 sm:h-2" />
            {[
              { id: 'B12', name: 'Central → Airport', eta: '3min', color: '#00FF94' },
              { id: 'G04', name: 'University → Market', eta: '7min', color: '#FFB800' },
              { id: 'A07', name: 'Station → City Hall', eta: '12min', color: '#FFB800' },
              { id: 'R02', name: 'Harbor → North Gate', eta: '18min', color: '#6B7A99' },
            ].map((route) => (
              <div key={route.id} className="flex gap-2 items-start flex-wrap sm:flex-nowrap">
                <span style={{ color: '#00D4FF' }}>[{route.id}]</span>
                <span style={{ color: '#F0F4FF' }} className="truncate">{route.name}</span>
                <span className="sm:ml-auto" style={{ color: route.color }}>ETA {route.eta}</span>
              </div>
            ))}
            <div className="h-1.5 sm:h-2" />
            <div className="flex gap-2 items-start">
              <span style={{ color: '#6B7A99' }}>Alert:</span>
              <span style={{ color: '#FFB800' }}>B12 approaching stop 4 of 6</span>
            </div>
            <div className="flex gap-2 items-start">
              <span style={{ color: '#6B7A99' }}>$</span>
              <span className="inline-block w-1.5 sm:w-2 h-3 sm:h-3.5 animate-blink align-middle ml-0.5" style={{ backgroundColor: '#00D4FF' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="rounded-2xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between relative overflow-hidden border" style={{ backgroundColor: '#0D1320', borderColor: 'rgba(255,255,255,0.12)' }}>
          <div className="absolute -top-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%)' }} />

          <div className="relative text-center lg:text-left">
            <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl lg:text-[30px] font-extrabold mb-3 leading-[1.2]" style={{ color: '#F0F4FF' }}>
              Ready to never miss<br className="hidden sm:block" />a bus again?
            </h2>
            <p className="text-sm leading-[1.7] max-w-[480px]" style={{ color: '#6B7A99' }}>
              Join thousands of commuters tracking their city's transit network in real time. Free forever for riders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 relative w-full sm:w-auto">
            <Link
              href="/track"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-md text-sm font-semibold tracking-[0.02em] transition-opacity duration-200 hover:opacity-85 text-center no-underline whitespace-nowrap flex-1 sm:flex-initial"
              style={{ backgroundColor: '#00D4FF', color: '#080C14' }}
            >
              Start tracking free
            </Link>
            <Link
              href="/routes"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm tracking-[0.02em] transition-colors duration-200 hover:border-[#00D4FF] text-center no-underline whitespace-nowrap flex-1 sm:flex-initial border"
              style={{ color: '#F0F4FF', borderColor: 'rgba(255,255,255,0.12)' }}
            >
              View all routes
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ Payment Section ═══════════════════ */}
      <section className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#F0F4FF' }}>Test Payment System</h2>
            <p className="text-sm" style={{ color: '#6B7A99' }}>Fake payment flow using API + Prisma</p>
          </div>

          <div className="rounded-xl sm:rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: '#0D1320', borderColor: 'rgba(255,255,255,0.12)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm sm:text-base" style={{ color: '#6B7A99' }}>Demo Product</span>
              <span className="text-lg sm:text-xl font-bold" style={{ color: '#00D4FF' }}>$500</span>
            </div>

            <PaymentButton />

            <p className="text-[10px] sm:text-xs text-center mt-3" style={{ color: '#6B7A99' }}>
              This is a simulated payment (no real transactions)
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
        className="relative z-[1] px-4 sm:px-6 lg:px-10 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span className="font-['Syne',sans-serif] text-xs sm:text-[13px] font-extrabold tracking-[0.05em]" style={{ color: '#F0F4FF' }}>
            TRANSPORT<span style={{ color: '#00D4FF' }}>HUB</span>
          </span>
          <span className="text-[10px] sm:text-xs" style={{ color: '#6B7A99' }}>
            © 2026 TransportHub. All rights reserved.
          </span>
        </div>

        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          {['Privacy', 'Terms', 'API', 'Contact'].map((link) => (
            <Link
              key={link}
              href="#"
              className="text-[10px] sm:text-xs no-underline transition-colors duration-200 hover:text-[#00D4FF]"
              style={{ color: '#6B7A99' }}
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="text-[10px] sm:text-[11px] tracking-[0.06em]" style={{ color: '#6B7A99' }}>
          v2.4.1 · System nominal
        </div>
      </footer>
    </div>
  );
}