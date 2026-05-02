"use client";

import { useState } from "react";
import { MdChatBubble } from "react-icons/md";
import { toast } from "sonner";

export default function SupportFeedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback) {
      toast.error("Please enter your feedback");
      return;
    }
    toast.success("Thank you for your feedback!");
    setFeedback("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <MdChatBubble className="text-primary text-2xl" />
        <h2 className="text-xl font-bold text-base-content">App Feedback</h2>
      </div>
      <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-8 flex flex-col gap-4">
        <p className="text-sm text-base-content/70 font-medium">Help us improve your experience. Tell us what's working and what's not.</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="textarea textarea-bordered w-full rounded-xl border-primary/20 bg-base-100/50 focus:bg-base-100 text-base-content focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
          placeholder="Share your suggestions..."
          rows={4}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="btn btn-primary bg-base-100 text-primary border-primary/20 hover:bg-primary hover:text-primary-content transition-all active:scale-95 font-bold rounded-xl"
        >
          Submit Feedback
        </button>
        <div className="mt-4 flex items-center gap-3">
          <div className="avatar-group -space-x-3 rtl:space-x-reverse">
            <div className="avatar border-2 border-base-100">
              <div className="w-8">
                <img src="https://i.pravatar.cc/100?u=1" alt="Driver" />
              </div>
            </div>
            <div className="avatar border-2 border-base-100">
              <div className="w-8">
                <img src="https://i.pravatar.cc/100?u=2" alt="Driver" />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-base-content/40 leading-tight font-bold uppercase tracking-wider">Join 400+ drivers who shared feedback this month</p>
        </div>
      </div>
    </div>
  );
}
