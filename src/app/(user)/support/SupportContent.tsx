"use client";

import { useState } from "react";
import { MdMail, MdSentimentVerySatisfied, MdSentimentNeutral, MdSentimentVeryDissatisfied, MdInfo } from "react-icons/md";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SupportContent() {
  const [subject, setSubject] = useState("Technical Issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Please enter a message");

    setIsSubmitting(true);
    try {
      await api.post("/support/ticket", {
        subject,
        message,
        category: subject,
      });
      toast.success("Support ticket created! We will get back to you soon.");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-8 border border-slate-50">
      <div className="flex items-center gap-3 mb-8">
        <MdMail className="text-blue-600 text-3xl" />
        <h2 className="text-[24px] font-semibold text-[#111c2d]">Direct Support</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[14px] font-semibold text-[#434655]">Subject</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#f9f9ff] border-none rounded-lg p-3 text-[16px] focus:ring-2 focus:ring-blue-600 transition-all outline-none"
          >
            <option>Technical Issue</option>
            <option>Billing Inquiry</option>
            <option>Lost and Found</option>
            <option>Feedback & Suggestions</option>
            <option>Safety Concern</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-[14px] font-semibold text-[#434655]">Message</label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue in detail..."
            className="w-full bg-[#f9f9ff] border-none rounded-lg p-4 text-[16px] focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none"
          />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <MdInfo className="text-sm" />
          Response time is typically under 15 minutes.
        </div>
        <button 
          disabled={isSubmitting}
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-[14px] font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
