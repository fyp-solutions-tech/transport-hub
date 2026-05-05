import { requireRole } from "@/lib/session";
import SupportContent from "./SupportContent";
import { MdQuiz, MdMail, MdLibraryBooks, MdMenuBook, MdVerifiedUser, MdPhone, MdChat, MdSentimentVerySatisfied, MdSentimentNeutral, MdSentimentVeryDissatisfied } from "react-icons/md";

export const metadata = { title: "Support Center | Skyline Hub" };

export default async function SupportPage() {
  await requireRole("USER");

  const faqs = [
    { q: "How do I track my ride in real-time?", a: "Open your Dashboard and select 'Active Rides'. You will see a live map view with the driver's current location, estimated time of arrival, and vehicle details." },
    { q: "What is the cancellation policy?", a: "Cancellations made within 2 minutes of booking are free. Late cancellations may incur a small fee to compensate our drivers for their time and fuel." },
    { q: "Can I add multiple stops to my journey?", a: "Yes, you can add up to 3 intermediate stops when booking your ride. Click the '+' icon next to the destination field in the booking screen." },
    { q: "How do I request a tax invoice?", a: "Invoices are automatically emailed to you. You can also download them manually from the 'Payments' tab by selecting the specific ride in your history." },
    { q: "How do I change my payment method?", a: "Go to your Profile → Payment Preferences, where you can add, remove, or set your default payment method for all future rides." },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="text-center space-y-4 pt-4">
        <h1 className="text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111c2d]">
          How can we help you today?
        </h1>
        <p className="text-[18px] text-[#434655] max-w-2xl mx-auto leading-relaxed">
          Access 24/7 passenger support, explore our help guides, or reach out to our dedicated concierge team.
        </p>
      </section>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* FAQ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <MdQuiz className="text-blue-600 text-3xl" />
            <h2 className="text-[24px] font-semibold text-[#111c2d]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] overflow-hidden border border-slate-50">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                    <span className="text-[14px] font-semibold text-[#111c2d]">{faq.q}</span>
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-blue-600 select-none">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-[16px] text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-5"><SupportContent /></div></div>

      {/* Knowledge Base + Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Knowledge Base */}
        <div className="space-y-6">
          <h3 className="text-[24px] font-semibold text-[#111c2d] flex items-center gap-2">
            <MdLibraryBooks className="text-blue-600" />
            Knowledge Base
          </h3>
          <div className="space-y-4">
            {[
              { icon: MdMenuBook, title: "Passenger Guide 2024", sub: "Complete walkthrough of the Hub features." },
              { icon: MdVerifiedUser, title: "Safety Protocols", sub: "Our commitment to your security." },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="group bg-white p-6 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#111c2d]">{title}</h4>
                  <p className="text-[12px] text-[#434655]">{sub}</p>
                </div>
                <span className="material-symbols-outlined ml-auto text-slate-300 group-hover:text-blue-600 transition-colors">chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-blue-600/5 rounded-xl p-8 border border-blue-600/10">
          <h3 className="text-[24px] font-semibold text-[#111c2d] mb-2">How are we doing?</h3>
          <p className="text-[16px] text-[#434655] mb-6">Your feedback drives the evolution of Skyline Hub. Help us improve the journey.</p>
          <div className="space-y-4">
            <textarea
              rows={4}
              placeholder="Tell us about your recent experience..."
              className="w-full bg-white border border-slate-200 rounded-lg p-4 text-[16px] focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { icon: MdSentimentVerySatisfied, color: "text-yellow-500" },
                  { icon: MdSentimentNeutral, color: "text-slate-400" },
                  { icon: MdSentimentVeryDissatisfied, color: "text-slate-400" },
                ].map(({ icon: Icon, color }, i) => (
                  <button key={i} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-colors">
                    <Icon className={`text-xl ${color}`} />
                  </button>
                ))}
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-[#263143] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 space-y-2">
          <h4 className="text-[24px] font-semibold text-white">Emergency Assistance</h4>
          <p className="text-blue-200 text-[16px]">On an active trip and need immediate help?</p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <a href="tel:1122" className="bg-red-600 text-white px-8 py-3 rounded-full text-[14px] font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
            <MdPhone className="text-lg" /> Call SOS
          </a>
          <button className="bg-white/10 text-white px-8 py-3 rounded-full text-[14px] font-semibold backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
            <MdChat className="text-lg" /> Chat Now
          </button>
        </div>
      </div>
    </div>
  );
}
