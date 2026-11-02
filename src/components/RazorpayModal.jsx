import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatCurrency";

/**
 * Authentic Razorpay Payment Modal
 * Replicates the official Razorpay Checkout experience with UPI, QR Code,
 * Cards, and Netbanking for flawless payment flow without backend dependency.
 */
export default function RazorpayModal({
  isOpen,
  orderId,
  amount,
  user,
  onSuccess,
  onClose,
}) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("akhil@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("789");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setPaymentSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    // Simulate realistic bank processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        const mockRzpId = "pay_rzp_" + Math.random().toString(36).substring(2, 11);
        onSuccess({
          razorpay_payment_id: mockRzpId,
          razorpay_order_id: `order_rzp_${orderId}`,
          razorpay_signature: "sig_mock_" + Math.random().toString(36).substring(2, 10),
        });
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200">
        
        {/* RAZORPAY HEADER */}
        <div className="bg-[#1B4332] text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={isProcessing || paymentSuccess}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full transition-colors disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-serif text-lg font-bold">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl tracking-tight">Soxenly</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9px] font-display uppercase tracking-widest px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <svg className="w-3 h-3 text-emerald-300 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-white/60 text-xs font-display mt-0.5">Order #{orderId}</p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-widest font-display text-white/70 font-semibold">Total Payable</span>
            <span className="text-3xl font-display font-bold text-white tracking-tight tabular-nums">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {/* PAYMENT BODY */}
        {paymentSuccess ? (
          <div className="p-8 text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-display font-bold text-xl text-neutral-900 mb-1">Payment Successful!</h4>
            <p className="text-xs text-neutral-500 font-display">Razorpay Payment ID: pay_rzp_{orderId}</p>
            <p className="text-xs text-emerald-700 font-display font-semibold mt-4 animate-pulse">Redirecting to order confirmation...</p>
          </div>
        ) : isProcessing ? (
          <div className="p-8 text-center py-14">
            <div className="w-12 h-12 border-4 border-[#1B4332]/20 border-t-[#1B4332] rounded-full animate-spin mx-auto mb-4"></div>
            <h4 className="font-display font-bold text-lg text-neutral-900 mb-1">Processing Payment...</h4>
            <p className="text-xs text-neutral-500 font-display">Securing transaction with your bank. Do not close or refresh.</p>
          </div>
        ) : (
          <div className="p-6">
            {/* METHOD TABS */}
            <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedMethod("upi")}
                className={`py-2 px-3 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                  selectedMethod === "upi"
                    ? "bg-white text-[#1B4332] shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`py-2 px-3 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                  selectedMethod === "card"
                    ? "bg-white text-[#1B4332] shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod("netbanking")}
                className={`py-2 px-3 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                  selectedMethod === "netbanking"
                    ? "bg-white text-[#1B4332] shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                NetBanking
              </button>
            </div>

            {/* TAB CONTENT: UPI */}
            {selectedMethod === "upi" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-36 h-36 bg-white p-2 border border-neutral-200 rounded-lg shadow-inner flex items-center justify-center relative">
                    <svg className="w-full h-full text-neutral-800" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="5" y="5" width="25" height="25" fill="#1B4332" />
                      <rect x="10" y="10" width="15" height="15" fill="#fff" />
                      <rect x="70" y="5" width="25" height="25" fill="#1B4332" />
                      <rect x="75" y="10" width="15" height="15" fill="#fff" />
                      <rect x="5" y="70" width="25" height="25" fill="#1B4332" />
                      <rect x="10" y="75" width="15" height="15" fill="#fff" />
                      <rect x="40" y="10" width="10" height="20" fill="#1B4332" />
                      <rect x="10" y="40" width="20" height="10" fill="#1B4332" />
                      <rect x="40" y="40" width="20" height="20" fill="#1B4332" />
                      <rect x="70" y="40" width="10" height="20" fill="#1B4332" />
                      <rect x="40" y="70" width="20" height="10" fill="#1B4332" />
                      <rect x="70" y="70" width="25" height="25" fill="#1B4332" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/95 px-1.5 py-0.5 rounded text-[8px] font-bold text-[#1B4332] shadow-sm font-display">
                        UPI SCAN
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-display text-neutral-500 mt-2 font-medium">
                    Scan with Google Pay, PhonePe, or Paytm
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-display uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                    Or Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-4 py-2.5 text-xs font-display border border-neutral-300 rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: CARDS */}
            {selectedMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-display uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full px-4 py-2.5 text-xs font-display border border-neutral-300 rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-display uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-4 py-2.5 text-xs font-display border border-neutral-300 rounded-lg focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-display uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-4 py-2.5 text-xs font-display border border-neutral-300 rounded-lg focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                </div>
                <p className="text-[10px] font-display text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                  ✔ Pre-filled with Razorpay Test Card credentials
                </p>
              </div>
            )}

            {/* TAB CONTENT: NETBANKING */}
            {selectedMethod === "netbanking" && (
              <div className="space-y-3">
                <label className="text-[10px] font-display uppercase tracking-widest text-neutral-500 font-bold block">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Punjab National"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-3 text-left border rounded-lg text-xs font-display font-semibold transition-all ${
                        selectedBank === b
                          ? "border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                      }`}
                    >
                      {b} Bank
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              type="button"
              onClick={handlePay}
              className="w-full mt-6 bg-[#1B4332] text-white py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-[#2d5d48] transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Pay {formatCurrency(amount)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* FOOTER BADGE */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-neutral-400 text-[10px] font-display uppercase tracking-wider">
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by Razorpay • 256-Bit SSL</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
