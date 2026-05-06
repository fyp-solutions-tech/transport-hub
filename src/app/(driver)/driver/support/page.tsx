// src/app/(driver)/driver/support/page.tsx
import { requireRole } from "@/lib/session";
import SupportFAQ from "@/components/ui/driver/support/SupportFAQ";
import SupportForm from "@/components/ui/driver/support/SupportForm";
import SupportFeedback from "@/components/ui/driver/support/SupportFeedback";
import { 
  MdLibraryBooks, 
  MdAutoGraph, 
  MdArrowForward, 
  MdVerifiedUser, 
  MdStars, 
  MdMinorCrash,
  MdChat
} from "react-icons/md";
import Link from "next/link";

export default async function SupportPage() {
  const { session } = await requireRole("DRIVER");
  const user = session.user;
  const firstName = user.name.split(" ")[0];

  const knowledgeHub = [
    {
      title: "Maximizing Earnings",
      desc: "Discover heatmaps and peak hour strategies to increase your weekly income by up to 25%.",
      icon: <MdAutoGraph className="text-primary text-2xl" />,
    },
    {
      title: "Safety Protocols",
      desc: "Essential guide on passenger interaction, vehicle maintenance, and incident reporting.",
      icon: <MdVerifiedUser className="text-primary text-2xl" />,
    },
    {
      title: "Gold Tier Perks",
      desc: "Learn about your exclusive benefits, including fuel discounts and priority airport pickups.",
      icon: <MdStars className="text-primary text-2xl" />,
    },
    {
      title: "Insurance Coverage",
      desc: "Details on how TransportHub protects you and your vehicle during every phase of a trip.",
      icon: <MdMinorCrash className="text-primary text-2xl" />,
    },
  ];

  return (
    <main className="pb-16 space-y-12">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-base-content tracking-tight">Driver Support</h1>
        <p className="text-lg text-base-content/60 max-w-2xl">
          How can we help you today, {firstName}? Find quick answers or get in touch with our dedicated support team.
        </p>
      </div>

      {/* Main Grid: FAQ & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: FAQ Section */}
        <div className="lg:col-span-7">
          <SupportFAQ />
        </div>

        {/* Right: Contact Support Form */}
        <div className="lg:col-span-5">
          <SupportForm />
        </div>
      </div>

      {/* Bottom Section: Help Resources & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-base-200">
        {/* Help Resources */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-8">
            <MdLibraryBooks className="text-primary text-2xl" />
            <h2 className="text-xl font-bold text-base-content">Knowledge Hub</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knowledgeHub.map((item: any, i) => (
              <Link
                key={i}
                href="#"
                className="group bg-base-200/50 p-6 rounded-2xl hover:bg-base-100 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-primary/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-base-100 rounded-xl text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    {item.icon}
                  </div>
                  <MdArrowForward className="text-base-content/20 group-hover:text-primary transition-colors text-xl" />
                </div>
                <h4 className="font-bold text-base-content mb-2">{item.title}</h4>
                <p className="text-xs text-base-content/50 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="lg:col-span-4">
          <SupportFeedback />
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group">
          <MdChat className="text-3xl" />
          <span className="absolute right-full mr-4 bg-base-content text-base-100 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with Support
          </span>
        </button>
      </div>
    </main>
  );
}
