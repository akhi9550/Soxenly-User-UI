import React from "react";
import { Link } from "react-router-dom";

export default function Impact() {
  return (
    <div className="bg-soxenly-cream min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/images/story/impact_bg.png" 
          alt="Eco Bamboo Forest" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-soxenly-green/40"></div>
        <div className="relative z-10 text-center text-soxenly-cream px-6">
          <h1 className="font-serif text-5xl lg:text-7xl mb-4">Environmental Impact</h1>
          <p className="font-display uppercase tracking-[0.3em] text-sm font-bold">Measuring What Matters</p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl lg:text-5xl text-soxenly-green mb-8">
          Every pair makes a difference.
        </h2>
        <p className="text-lg text-soxenly-charcoal/80 leading-relaxed max-w-3xl mx-auto">
          We believe in total accountability. By choosing Soxenly over conventional brands, you are directly contributing to a reduction in water usage, carbon emissions, and plastic pollution. Here is our impact to date.
        </p>
      </section>

      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-12 text-center border-t-4 border-soxenly-leaf shadow-sm">
            <h3 className="font-serif text-5xl text-soxenly-green mb-4">4M+</h3>
            <p className="font-display uppercase tracking-widest text-xs font-bold text-soxenly-charcoal/60 mb-4">Gallons of Water Saved</p>
            <p className="text-sm text-soxenly-charcoal/70">By exclusively using organic cotton, we significantly reduce the amount of water needed for cultivation.</p>
          </div>
          <div className="bg-white p-12 text-center border-t-4 border-soxenly-green shadow-sm">
            <h3 className="font-serif text-5xl text-soxenly-green mb-4">Zero</h3>
            <p className="font-display uppercase tracking-widest text-xs font-bold text-soxenly-charcoal/60 mb-4">Single-Use Plastics</p>
            <p className="text-sm text-soxenly-charcoal/70">From our supply chain to your doorstep, our packaging is 100% recycled and compostable.</p>
          </div>
          <div className="bg-white p-12 text-center border-t-4 border-soxenly-leaf shadow-sm">
            <h3 className="font-serif text-5xl text-soxenly-green mb-4">100%</h3>
            <p className="font-display uppercase tracking-widest text-xs font-bold text-soxenly-charcoal/60 mb-4">Carbon Neutral</p>
            <p className="text-sm text-soxenly-charcoal/70">We offset all emissions from our shipping and operations by investing in renewable energy projects.</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white px-6 lg:px-12 text-center border-t border-soxenly-beige">
        <h2 className="font-serif text-3xl lg:text-4xl text-soxenly-green mb-8">Join the Movement</h2>
        <p className="max-w-2xl mx-auto mb-12 text-soxenly-charcoal/80">
          Small daily choices add up to massive global change. Start from the ground up.
        </p>
        <Link 
          to="/shop" 
          className="inline-block bg-soxenly-green text-soxenly-cream px-10 py-4 font-display uppercase text-xs tracking-widest font-bold hover:bg-soxenly-leaf transition-all duration-300"
        >
          Shop Consciously
        </Link>
      </section>
    </div>
  );
}
