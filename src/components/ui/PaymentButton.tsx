"use client";

export default function PaymentButton() {
  return (
    <button
      onClick={async () => {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 500,
            userId: "demo-user",
          }),
        });

        const data = await res.json();

        alert(
          data.payment.status === "success"
            ? "🎉 Payment Successful"
            : "❌ Payment Failed"
        );
      }}
      className="btn btn-primary w-full"
    >
      Pay Now (Test)
    </button>
  );
}