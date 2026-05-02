import { MdExpandMore, MdQuiz } from "react-icons/md";

const FAQS = [
  {
    question: "How do I update my payment information?",
    answer: "You can update your banking details in the 'Earnings' tab under 'Payout Settings'. Changes usually take 24-48 hours to be verified by our security team before being applied to your next payout."
  },
  {
    question: "What should I do if a rider leaves an item behind?",
    answer: "Please use the 'Ride History' tab, select the specific trip, and click 'Found an Item'. This allows us to contact the passenger while keeping your personal information private."
  },
  {
    question: "How are my performance ratings calculated?",
    answer: "Your rating is a rolling average of your last 500 completed trips. We exclude ratings from rides where the passenger experienced technical issues unrelated to your service."
  },
  {
    question: "When do I receive my weekly earnings?",
    answer: "Weekly earnings are processed every Monday at 4:00 AM local time. Funds typically arrive in your bank account between Tuesday and Thursday depending on your bank's processing speed."
  },
  {
    question: "How do I handle an emergency during a ride?",
    answer: "For immediate danger, always call local emergency services first. Within the app, use the 'Safety Shield' icon to alert our 24/7 security dispatch team who can monitor your location in real-time."
  }
];

export default function SupportFAQ() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <MdQuiz className="text-primary text-2xl" />
        <h2 className="text-xl font-bold text-base-content">Frequently Asked Questions</h2>
      </div>
      <div className="flex flex-col gap-4">
        {FAQS.map((faq, index) => (
          <details
            key={index}
            className="group bg-base-100 rounded shadow-[0_8px_30px_rgba(37,99,235,0.04)] overflow-hidden border border-base-300 transition-all duration-300"
          >
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <span className="font-bold text-base-content">{faq.question}</span>
              <MdExpandMore className="text-2xl transition-transform duration-300 group-open:rotate-180 text-base-content/40" />
            </summary>
            <div className="px-6 pb-6 text-base-content/60 text-sm border-t border-base-200 pt-4 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
