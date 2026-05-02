import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-soxenly-cream flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-soxenly-beige p-10 md:p-16 rounded-sm shadow-sm max-w-lg w-full text-center">
        {/* SUCCESS ICON */}
        <div className="w-20 h-20 bg-soxenly-beige/20 text-soxenly-leaf rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-soxenly-green mb-2">Order Confirmed!</h1>
        <p className="text-soxenly-charcoal/70 mb-8 font-display uppercase tracking-widest text-[10px] font-bold">Thank you for your purchase</p>

        {/* ORDER DETAILS */}
        <div className="bg-soxenly-cream rounded-sm p-6 mb-8 border border-soxenly-beige">
          <div className="flex justify-between items-center mb-4 border-b border-soxenly-beige/50 pb-4">
            <span className="text-soxenly-charcoal/50 text-[10px] uppercase font-bold tracking-widest">Order ID</span>
            <span className="text-soxenly-green font-serif text-xl">#{orderId || "..."}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-soxenly-charcoal/50 text-[10px] uppercase font-bold tracking-widest">Status</span>
            <span className="text-soxenly-leaf font-display font-bold text-[10px] tracking-widest uppercase bg-soxenly-beige/30 px-3 py-1.5">Confirmed</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-4">
          <Link 
            to="/orders" 
            className="block w-full bg-soxenly-green text-soxenly-cream py-4 font-display font-bold text-[10px] uppercase tracking-widest hover:bg-soxenly-leaf transition-colors shadow-sm"
          >
            Track My Order
          </Link>
          <Link 
            to="/shop" 
            className="block w-full bg-white text-soxenly-green border border-soxenly-beige py-4 font-display font-bold text-[10px] uppercase tracking-widest hover:bg-soxenly-cream transition-all"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-soxenly-charcoal/50 uppercase tracking-widest font-display font-bold">
          A confirmation email is on its way to you.
        </p>
      </div>
    </div>
  );
}
