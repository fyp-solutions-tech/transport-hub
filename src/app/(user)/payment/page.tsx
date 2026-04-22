"use client";

import { useEffect, useState } from "react";
import {
  MdPayment,
  MdPhoneAndroid,
  MdCreditCard,
  MdAccountBalance,
  MdCheckCircle,
  MdAdd,
  MdClose,
  MdHistory,
} from "react-icons/md";
import { toast } from "sonner";

interface Transaction {
  id: string;
  fare: number | null;
  createdAt: string;
  status: string;
  vehicleType: string | null;
  paymentMethod: string | null;
  loanAmount: number | null;
  pickupAddress: string;
  dropoffAddress: string;
}

interface PaymentMethodItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  bg: string;
}

const ADD_METHODS = [
  { id: "jazzcash", label: "JazzCash", color: "text-red-500" },
  { id: "easypaisa", label: "Easypaisa", color: "text-green-500" },
  { id: "googlepay", label: "Google Pay", color: "text-blue-500" },
  { id: "paypal", label: "PayPal", color: "text-indigo-500" },
];

export default function PaymentPage() {
  const [defaultMethod, setDefaultMethod] = useState("cash");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const methods: PaymentMethodItem[] = [
    {
      id: "cash",
      label: "Cash",
      description: "Pay driver directly",
      icon: <MdAccountBalance className="text-2xl text-success" />,
      bg: "bg-success/10",
    },
    {
      id: "loan",
      label: "Loan",
      description: "Pay later with interest",
      icon: <MdPhoneAndroid className="text-2xl text-warning" />,
      bg: "bg-warning/10",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      description: "Visa •••• 1234",
      icon: <MdCreditCard className="text-2xl text-info" />,
      bg: "bg-info/10",
    },
  ];

  useEffect(() => {
    // Load default method from localStorage
    const saved = localStorage.getItem("defaultPaymentMethod");
    if (saved) setDefaultMethod(saved);

    // Fetch transactions (completed rides)
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/rides?status=completed");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = (methodId: string) => {
    setDefaultMethod(methodId);
    localStorage.setItem("defaultPaymentMethod", methodId);
    const label = methods.find((m) => m.id === methodId)?.label || methodId;
    toast.success(`${label} set as default payment method`);
  };

  const handleAddMethod = () => {
    toast.info("This feature is coming soon!", { duration: 2500 });
    setShowAddModal(false);
  };

  const outstandingBalance = transactions
    .filter((t) => t.loanAmount && t.loanAmount > 0)
    .reduce((sum, t) => sum + (t.loanAmount || 0), 0);

  return (
    <>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment</h1>
          <p className="text-base-content/60 mt-1">
            Manage your payment methods
          </p>
        </div>

        {/* Outstanding balance */}
        <div className="card bg-primary text-primary-content shadow-lg">
          <div className="card-body flex-row items-center gap-4">
            <MdPayment className="text-4xl opacity-80" />
            <div>
              <p className="text-sm opacity-75">Outstanding Balance</p>
              <p className="text-3xl font-bold">
                Rs {outstandingBalance.toLocaleString()}
              </p>
            </div>
            <button
              id="pay-now-btn"
              className="btn btn-sm bg-primary-content text-primary ml-auto"
              disabled={outstandingBalance === 0}
              onClick={() =>
                toast.info("Payment processing coming soon!")
              }
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <h2 className="text-base font-semibold mb-3">Saved Methods</h2>
          <div className="space-y-3">
            {methods.map((m) => (
              <div
                key={m.id}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="card-body flex-row items-center gap-4 py-4 px-5">
                  <div
                    className={`w-11 h-11 rounded-xl ${m.bg} flex items-center justify-center`}
                  >
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{m.label}</p>
                    <p className="text-sm text-base-content/60">
                      {m.description}
                    </p>
                  </div>
                  {defaultMethod === m.id ? (
                    <div className="flex items-center gap-1 text-success text-sm font-medium">
                      <MdCheckCircle />
                      <span>Default</span>
                    </div>
                  ) : (
                    <button
                      id={`set-default-${m.id}`}
                      onClick={() => handleSetDefault(m.id)}
                      className="btn btn-ghost btn-xs"
                    >
                      Set default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            id="add-payment-method-btn"
            onClick={() => setShowAddModal(true)}
            className="btn btn-outline btn-primary btn-block mt-4 gap-2"
          >
            <MdAdd className="text-lg" />
            Add Payment Method
          </button>
        </div>

        {/* Transaction history */}
        <div>
          <h2 className="text-base font-semibold mb-3">Recent Transactions</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="card bg-base-100 border border-base-200 shadow-sm"
                >
                  <div className="card-body p-4 flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                      <MdHistory className="text-success text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {tx.pickupAddress.split(",")[0]} →{" "}
                        {tx.dropoffAddress.split(",")[0]}
                      </p>
                      <p className="text-xs text-base-content/50">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {tx.vehicleType} ·{" "}
                        <span className="capitalize">
                          {tx.paymentMethod || "cash"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">
                        Rs {tx.fare?.toLocaleString()}
                      </p>
                      {tx.loanAmount && tx.loanAmount > 0 && (
                        <span className="badge badge-xs badge-warning">
                          Loan
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-base-100 border border-base-200">
              <div className="card-body items-center py-12 text-center">
                <MdPayment className="text-5xl text-base-content/20 mb-3" />
                <p className="text-base-content/60 font-medium">
                  No transactions yet
                </p>
                <p className="text-sm text-base-content/40">
                  Your payment history will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Add Payment Method Modal ═══════════════════ */}
      {showAddModal && (
        <div
          className="modal modal-open modal-bottom sm:modal-middle"
          style={{ zIndex: 100 }}
        >
          <div className="modal-box">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
            >
              <MdClose className="text-lg" />
            </button>
            <h3 className="font-bold text-lg mb-4">Add Payment Method</h3>

            <div className="grid grid-cols-2 gap-3">
              {ADD_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={handleAddMethod}
                  className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-base-200 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <MdPayment className={`text-3xl ${m.color}`} />
                  <span className="font-semibold text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowAddModal(false)}
          />
        </div>
      )}
    </>
  );
}
