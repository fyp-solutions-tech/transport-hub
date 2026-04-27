// src/app/about/page.tsx
// Place this file at: src/app/about/page.tsx

import Link from "next/link";

const stats = [
  { num: "2019", label: "Year founded" },
  { num: "42", label: "Active routes" },
  { num: "320+", label: "Buses tracked" },
  { num: "50K+", label: "Daily commuters" },
];

const values = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Speed & reliability",
    desc: "Every second counts for a commuter. We obsess over accuracy so you never miss your bus.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    title: "Full transparency",
    desc: "No hidden delays, no vague ETAs. We show you exactly where your bus is, always.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Built for everyone",
    desc: "Accessible, multilingual, and designed for all riders — from daily commuters to first-time users.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const team = [
  { name: "Sarah Al-Rashid", role: "CEO & Co-founder", initials: "SA", color: "bg-primary/20 text-primary" },
  { name: "Daniel Park", role: "CTO & Co-founder", initials: "DP", color: "bg-secondary/20 text-secondary" },
  { name: "Nadia Hussain", role: "Head of Product", initials: "NH", color: "bg-accent/20 text-accent" },
  { name: "Marcus Webb", role: "Lead Engineer", initials: "MW", color: "bg-primary/20 text-primary" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 font-sans">

      {/* ── NAVBAR ── */}
      <div className="navbar bg-base-100 border-b border-base-200 px-6 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-content" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-base-content tracking-tight">TransportHub</span>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 text-sm">
            <li><Link href="/" className="rounded-lg text-base-content/70 hover:text-base-content">Home</Link></li>
            <li><Link href="/routes" className="rounded-lg text-base-content/70 hover:text-base-content">Routes</Link></li>
            <li><Link href="/schedules" className="rounded-lg text-base-content/70 hover:text-base-content">Schedules</Link></li>
            <li><Link href="/about" className="rounded-lg font-medium text-base-content">About</Link></li>
            <li><Link href="/contact" className="rounded-lg text-base-content/70 hover:text-base-content">Contact</Link></li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <div className="badge badge-success gap-1.5 py-3 px-3 hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-success-content animate-pulse" />
            <span className="text-success-content text-xs font-medium">Live tracking</span>
          </div>
          <Link href="/auth/login" className="btn btn-primary btn-sm rounded-lg">Get started</Link>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-base-100 py-20 px-6">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, oklch(35.519% 0.032 262.988) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="badge badge-primary badge-outline mb-6 py-3 px-4">Our story</div>
          <h1 className="text-5xl lg:text-6xl font-bold text-base-content leading-tight mb-6 tracking-tight">
            Moving cities{" "}
            <span className="text-primary">forward,</span>{" "}
            one route at a time.
          </h1>
          <p className="text-base-content/60 text-lg leading-relaxed max-w-2xl mx-auto">
            TransportHub was founded with a single belief: public transport should be simple, reliable, and transparent. We built the platform we wished existed when we were daily commuters.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-base-200 bg-base-200/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-base-200">
          {stats.map((s) => (
            <div key={s.label} className="py-8 px-6 text-center">
              <p className="text-4xl font-bold text-primary mb-1">{s.num}</p>
              <p className="text-sm text-base-content/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="badge badge-primary badge-outline mb-4">Our mission</div>
            <h2 className="text-4xl font-bold text-base-content mb-6 leading-tight">
              We believe every commuter deserves to know{" "}
              <span className="text-primary">exactly when their bus arrives.</span>
            </h2>
            <p className="text-base-content/60 leading-relaxed mb-4">
              Public transit is the backbone of great cities. Yet for decades, commuters have been left guessing — staring down empty streets with no idea when their bus would come.
            </p>
            <p className="text-base-content/60 leading-relaxed mb-8">
              We changed that. Using real-time GPS telemetry, intelligent scheduling algorithms, and a platform designed obsessively around simplicity, we've made the daily commute less stressful for over 50,000 riders.
            </p>
            <Link href="/contact" className="btn btn-primary rounded-xl px-8">Work with us</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "GPS precision", value: "< 15m", sub: "average location accuracy" },
              { title: "Update frequency", value: "30s", sub: "live data refresh rate" },
              { title: "Uptime", value: "99.97%", sub: "platform availability" },
              { title: "Cities covered", value: "8", sub: "and growing fast" },
            ].map((m) => (
              <div key={m.title} className="card bg-base-200/60 border border-base-200 rounded-2xl p-5">
                <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">{m.title}</p>
                <p className="text-3xl font-bold text-primary mb-1">{m.value}</p>
                <p className="text-xs text-base-content/50">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-base-200/40 border-y border-base-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge badge-primary badge-outline mb-4">Our values</div>
            <h2 className="text-4xl font-bold text-base-content">What drives everything we build</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card bg-base-100 border border-base-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-5`}>
                  <svg className={`w-6 h-6 ${v.color}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-base-content mb-3">{v.title}</h3>
                <p className="text-sm text-base-content/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge badge-primary badge-outline mb-4">The team</div>
            <h2 className="text-4xl font-bold text-base-content mb-4">Built by people who ride buses</h2>
            <p className="text-base-content/60 max-w-lg mx-auto">Our team combines expertise in transit operations, engineering, and design — all united by the daily commute.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((t) => (
              <div key={t.name} className="card bg-base-100 border border-base-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl ${t.color} flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                  {t.initials}
                </div>
                <h3 className="font-semibold text-base-content mb-1">{t.name}</h3>
                <p className="text-sm text-base-content/50">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "28px 28px" }} />
          <div className="relative">
            <h2 className="text-4xl font-bold text-primary-content mb-4">Ready to join thousands of smarter commuters?</h2>
            <p className="text-primary-content/70 mb-8 text-lg">Start tracking your routes today — no account needed to get started.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/auth/signup" className="btn btn-neutral rounded-xl px-8">Get started free</Link>
              <Link href="/contact" className="btn btn-outline btn-neutral rounded-xl px-8 text-primary-content border-primary-content/30 hover:bg-primary-content/10">Contact us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-base-200 bg-base-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <svg className="w-3 h-3 text-primary-content" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-base-content">TransportHub</span>
          </div>
          <p className="text-xs text-base-content/40">© 2026 TransportHub. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "API", "Contact"].map((l) => (
              <Link key={l} href="#" className="text-xs text-base-content/50 hover:text-primary transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
