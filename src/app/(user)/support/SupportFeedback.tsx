"use client";

import { useState } from "react";
import { MdSentimentVerySatisfied, MdSentimentNeutral, MdSentimentVeryDissatisfied } from "react-icons/md";
import { toast } from "sonner";
import { api } from "@/lib/api";

const SENTIMENTS = [
  { id: "SATISFIED", icon: MdSentimentVerySatisfied, color: "text-yellow-500", hoverBg: "hover:bg-yellow-50", activeBg: "bg-yellow-100 border-yellow-400" },
  { id: "NEUTRAL", icon: MdSentimentNeutral, color: "text-slate-400", hoverBg: "hover:bg-slate-100", activeBg: "bg-slate-100 border-slate-400" },
  { id: "DISSATISFIED", icon: MdSentimentVeryDissatisfied, color: "text-slate-400", hoverBg: "hover:bg-red-50", activeBg: "bg-red-100 border-red-400" },
];

export default function SupportFeedback() {
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState("SATISFIED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter some feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/support/tickets", {
        subject: "General Feedback",
        message: `Sentiment: ${sentiment}\n\nFeedback: ${feedback}`,
        category: "Feedback & Suggestions",
      });
      toast.success("Thank you for your feedback!");
      setFeedback("");
      setSentiment("SATISFIED");
    } catch (err: any) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-600/5 rounded-xl p-8 border border-blue-600/10">
      <h3 className="text-[24px] font-semibold text-[#111c2d] mb-2">How are we doing?</h3>
      <p className="text-[16px] text-[#434655] mb-6">Your feedback drives the evolution of TransportHub. Help us improve the journey.</p>
      <div className="space-y-4">
        <textarea
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us about your recent experience..."
          className="w-full bg-white border border-slate-200 rounded-lg p-4 text-[16px] focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {SENTIMENTS.map(({ id, icon: Icon, color, hoverBg, activeBg }) => {
              const isActive = sentiment === id;
              return (
                <button 
                  key={id} 
                  onClick={() => setSentiment(id)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                    isActive ? activeBg : `border-slate-200 bg-white ${hoverBg}`
                  }`}
                >
                  <Icon className={`text-xl ${isActive ? color : "text-slate-400"}`} />
                </button>
              );
            })}
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
