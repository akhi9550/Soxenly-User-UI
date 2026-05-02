import React from "react";

export default function Story() {
  return (
    <div className="bg-soxenly-cream min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/images/story/story_bg.png" 
          alt="Artisanal Cotton Craft" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-soxenly-green/30"></div>
        <div className="relative z-10 text-center text-soxenly-cream px-6">
          <h1 className="font-serif text-5xl lg:text-7xl mb-6">Our Story</h1>
          <p className="font-display uppercase tracking-[0.3em] text-sm font-bold">Gentle on Earth. Soft on You.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl lg:text-5xl text-soxenly-green mb-12 text-center">
          A Simple Essential, <br />
          <span className="italic">Reimagined.</span>
        </h2>
        <div className="space-y-8 text-lg text-soxenly-charcoal/80 leading-relaxed">
          <p>
            Soxenly began with a realization: the most everyday items in our wardrobes are often the most overlooked in terms of impact. Every year, millions of pairs of socks are discarded, most made from synthetic fibers that shed microplastics into our oceans.
          </p>
          <p>
            We believed that something so small shouldn't leave such a large footprint. So we set out to create a better essential—one engineered for supreme comfort and built with total respect for the planet.
          </p>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-24 bg-white px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/story/img3.png" alt="Cotton" className="aspect-[4/5] object-cover rounded-sm shadow-sm" />
              <img src="/images/story/img8.png" alt="Bamboo" className="aspect-[4/5] object-cover rounded-sm shadow-sm mt-8" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-xs font-display uppercase tracking-widest text-soxenly-leaf font-bold mb-4 block">The Materials</span>
            <h2 className="font-serif text-4xl lg:text-5xl text-soxenly-green mb-8">Consciously Sourced</h2>
            <p className="text-soxenly-charcoal/70 mb-8 text-lg leading-relaxed">
              We exclusively use organic cotton and bamboo fibers. Not just for their softness, but for their low environmental impact. No pesticides, no plastic-heavy synthetics, just pure, breathable nature on your feet.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-soxenly-cream flex items-center justify-center shrink-0">
                  <span className="text-soxenly-green font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-bold text-soxenly-green mb-2">Organic Cotton</h4>
                  <p className="text-sm text-soxenly-charcoal/60">Grown without harmful chemicals, saving water and protecting biodiversity.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-soxenly-cream flex items-center justify-center shrink-0">
                  <span className="text-soxenly-green font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-bold text-soxenly-green mb-2">Bamboo Fiber</h4>
                  <p className="text-sm text-soxenly-charcoal/60">A highly renewable resource that provides natural moisture-wicking properties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h2 className="font-serif text-4xl text-soxenly-green mb-6">Designed for <br/><span className="italic">Durability.</span></h2>
            <p className="text-soxenly-charcoal/70 leading-relaxed">
              Sustainability also means quality. We engineer our socks with reinforced heels and toes, ensuring they last longer and stay out of landfills.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <img src="/images/story/img7.png" alt="Bamboo Detail" className="w-full h-80 object-cover rounded-sm shadow-sm" />
            <img src="/images/story/happy_feet.png" alt="Soxenly Socks" className="w-full h-80 object-cover rounded-sm shadow-sm" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-soxenly-green text-center text-soxenly-cream">
        <h2 className="font-serif text-4xl lg:text-6xl mb-12">Make a Better Choice.</h2>
        <a 
          href="/shop" 
          className="inline-block bg-soxenly-cream text-soxenly-green px-12 py-5 font-display uppercase text-xs tracking-widest font-bold hover:bg-soxenly-leaf hover:text-soxenly-cream transition-all duration-300"
        >
          Explore Collection
        </a>
      </section>
    </div>
  );
}
