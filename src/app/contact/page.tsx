// src/app/contact/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

type Status = "idle" | "loading" | "success" | "error";

const contactInfo = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email us",
    value: "hello@transporthub.io",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Call us",
    value: "+1 (800) 555-0192",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Visit us",
    value: "123 Transit Ave, City Hub",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

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
            <li><Link href="/about" className="rounded-lg text-base-content/70 hover:text-base-content">About</Link></li>
            <li><Link href="/contact" className="rounded-lg font-medium text-base-content">Contact</Link></li>
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
      <section className="relative overflow-hidden bg-base-100 py-16 px-6">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, oklch(35.519% 0.032 262.988) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="badge badge-primary badge-outline mb-6 py-3 px-4">Get in touch</div>
          <h1 className="text-5xl font-bold text-base-content leading-tight mb-4 tracking-tight">
            We'd love to{" "}
            <span className="text-primary">hear from you.</span>
          </h1>
          <p className="text-base-content/60 text-lg leading-relaxed">
            Have a question about routes, want to partner with us, or just want to say hello? Fill out the form and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

          {/* Contact info sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {contactInfo.map((c) => (
              <div key={c.label} className="card bg-base-100 border border-base-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                    <svg className={`w-5 h-5 ${c.color}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">{c.label}</p>
                    <p className="text-sm font-medium text-base-content">{c.value}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Office hours */}
            <div className="card bg-base-200/60 border border-base-200 rounded-2xl p-5">
              <p className="text-xs text-base-content/50 uppercase tracking-wider mb-3">Office hours</p>
              <div className="flex flex-col gap-2">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between items-center">
                    <span className="text-xs text-base-content/70">{h.day}</span>
                    <span className={`text-xs font-medium ${h.hours === "Closed" ? "text-error" : "text-primary"}`}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time badge */}
            <div className="flex items-center gap-3 px-4 py-3 bg-success/10 border border-success/20 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
              <p className="text-sm text-success font-medium">Average response time: under 2 hours</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="card bg-base-100 border border-base-200 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-base-content">Message sent!</h2>
                <p className="text-base-content/60">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn btn-outline btn-primary rounded-xl mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="card bg-base-100 border border-base-200 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-base-content mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                        First name
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="input input-bordered w-full rounded-xl focus:input-primary text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                        Last name
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="input input-bordered w-full rounded-xl focus:input-primary text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                      Email address
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="input input-bordered w-full rounded-xl focus:input-primary text-sm"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      className="textarea textarea-bordered w-full rounded-xl focus:textarea-primary text-sm resize-none leading-relaxed"
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div role="alert" className="alert alert-error rounded-xl py-3">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <span className="text-sm">{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn btn-primary rounded-xl w-full"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Sending...
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </form>
              </div>
            )}
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
