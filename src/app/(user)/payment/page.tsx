import { MdPayment, MdPhoneAndroid, MdCreditCard, MdAccountBalance, MdCheckCircle, MdAdd } from "react-icons/md";

const methods = [
  {
    id: "cash",
    label: "Cash",
    description: "Pay driver directly",
    icon: <MdAccountBalance className="text-2xl text-success" />,
    bg: "bg-success/10",
    isDefault: true,
  },
  {
    id: "bkash",
    label: "bKash",
    description: "**** 4821",
    icon: <MdPhoneAndroid className="text-2xl text-pink-500" />,
    bg: "bg-pink-50",
    isDefault: false,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa •••• 1234",
    icon: <MdCreditCard className="text-2xl text-info" />,
    bg: "bg-info/10",
    isDefault: false,
  },
];

export default function PaymentPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment</h1>
        <p className="text-base-content/60 mt-1">Manage your payment methods</p>
      </div>

      {/* Outstanding balance */}
      <div className="card bg-primary text-primary-content shadow-lg">
        <div className="card-body flex-row items-center gap-4">
          <MdPayment className="text-4xl opacity-80" />
          <div>
            <p className="text-sm opacity-75">Outstanding Balance</p>
            <p className="text-3xl font-bold">৳0.00</p>
          </div>
          <button id="pay-now-btn" className="btn btn-sm bg-primary-content text-primary ml-auto" disabled>
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
                <div className={`w-11 h-11 rounded-xl ${m.bg} flex items-center justify-center`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{m.label}</p>
                  <p className="text-sm text-base-content/60">{m.description}</p>
                </div>
                {m.isDefault ? (
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <MdCheckCircle />
                    <span>Default</span>
                  </div>
                ) : (
                  <button id={`set-default-${m.id}`} className="btn btn-ghost btn-xs">
                    Set default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          id="add-payment-method-btn"
          className="btn btn-outline btn-primary btn-block mt-4 gap-2"
        >
          <MdAdd className="text-lg" />
          Add Payment Method
        </button>
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="text-base font-semibold mb-3">Recent Transactions</h2>
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body items-center py-12 text-center">
            <MdPayment className="text-5xl text-base-content/20 mb-3" />
            <p className="text-base-content/60 font-medium">No transactions yet</p>
            <p className="text-sm text-base-content/40">
              Your payment history will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
