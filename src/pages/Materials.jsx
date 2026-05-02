import React from "react";
import { Link } from "react-router-dom";

export default function Materials() {
  return (
    <div className="bg-soxenly-cream min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/images/story/img4.png" 
          alt="Fabric Texture" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-soxenly-green/40 mix-blend-multiply"></div>
        <div className="relative z-10 text-center text-soxenly-cream px-6">
          <h1 className="font-serif text-5xl lg:text-7xl mb-4">Our Materials</h1>
          <p className="font-display uppercase tracking-[0.3em] text-sm font-bold">Rooted in Nature</p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl lg:text-4xl text-soxenly-green mb-8">
          We believe what you wear <br className="hidden md:block"/>should be as good for the earth as it is for you.
        </h2>
        <p className="text-lg text-soxenly-charcoal/80 leading-relaxed max-w-3xl mx-auto">
          Every thread matters. We’ve moved away from conventional, pesticide-heavy crops and microplastic-shedding synthetics. Instead, we’ve built our supply chain around two core, sustainable materials: Organic Cotton and Bamboo.
        </p>
      </section>

      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <img src="/images/story/img5.png" alt="Organic Cotton" className="w-full h-auto object-cover rounded-sm" />
          </div>
          <div>
            <h3 className="font-serif text-3xl text-soxenly-green mb-6">100% Organic Cotton</h3>
            <p className="text-soxenly-charcoal/80 mb-6 leading-relaxed">
              Conventional cotton is one of the most chemically intensive crops in the world. Our organic cotton is grown without synthetic pesticides or fertilizers, which means healthier soil, cleaner water, and safer conditions for farmers.
            </p>
            <ul className="space-y-3 font-display text-sm tracking-wide text-soxenly-charcoal/70 uppercase">
              <li>✓ 91% Less water used</li>
              <li>✓ 46% Less CO2 emissions</li>
              <li>✓ Zero toxic chemicals</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h3 className="font-serif text-3xl text-soxenly-green mb-6">Bamboo Fiber</h3>
            <p className="text-soxenly-charcoal/80 mb-6 leading-relaxed">
              Bamboo is a naturally regenerative plant that grows rapidly without the need for irrigation or pesticides. The resulting fiber is incredibly soft, naturally moisture-wicking, and antibacterial.
            </p>
            <ul className="space-y-3 font-display text-sm tracking-wide text-soxenly-charcoal/70 uppercase">
              <li>✓ Naturally antibacterial</li>
              <li>✓ Highly renewable resource</li>
              <li>✓ Superior breathability</li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <img src="/images/story/img8.png" alt="Bamboo" className="w-full h-auto object-cover rounded-sm" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <h2 className="font-serif text-3xl lg:text-4xl mb-8 text-soxenly-green">Experience the Difference</h2>
        <Link 
          to="/shop" 
          className="inline-block bg-soxenly-green text-soxenly-cream px-10 py-4 font-display uppercase text-xs tracking-widest font-bold hover:bg-soxenly-leaf transition-all duration-300"
        >
          Shop Sustainable Materials
        </Link>
      </section>
    </div>
  );
}
