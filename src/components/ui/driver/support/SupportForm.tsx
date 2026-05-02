"use client";

import { useState } from "react";
import { MdSend } from "react-icons/md";
import { toast } from "sonner";

export default function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Support request sent successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] p-8 border border-base-300 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-base-content mb-1">Contact Support</h2>
        <p className="text-xs text-base-content/50 uppercase tracking-wider font-bold">Average response time: 2 hours</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-base-content/70">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="select select-bordered w-full rounded focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-base-100"
          >
            <option value="">Select a topic</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Account Access">Account Access</option>
            <option value="Vehicle Information">Vehicle Information</option>
            <option value="App Technical Support">App Technical Support</option>
            <option value="Safety Concern">Safety Concern</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-base-content/70">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea textarea-bordered w-full rounded focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none bg-base-100"
            placeholder="Describe your issue in detail..."
            rows={6}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full font-bold rounded shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <MdSend className="text-lg" />
              Send Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
