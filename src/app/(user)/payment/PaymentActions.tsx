"use client";

import { MdAdd, MdAddCard } from "react-icons/md";
import { toast } from "sonner";

export function AddPaymentButton({ isFab = false }: { isFab?: boolean }) {
  const handleAdd = () => {
    toast.success("Redirecting to secure payment portal to add card...");
  };

  if (isFab) {
    return (
      <button 
        onClick={handleAdd}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
      >
        <MdAddCard className="text-2xl" />
      </button>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
    >
      <MdAdd className="text-lg" />
      Add Card
    </button>
  );
}

export function AddFundsButton() {
  const handleAdd = () => {
    toast.success("Add Funds functionality initialized...");
  };

  return (
    <button 
      onClick={handleAdd}
      className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg text-sm transition-colors"
    >
      + Add Funds (Cash)
    </button>
  );
}
