import React from "react";
import { Link } from "react-router-dom";

export default function Manufacturing() {
  return (
    <div className="bg-soxenly-cream min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/images/story/thread_spools.jpg" 
          alt="Thread Spools" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-soxenly-green/60 mix-blend-multiply"></div>
        <div className="relative z-10 text-center text-soxenly-cream px-6">
          <h1 className="font-serif text-5xl lg:text-7xl mb-4">Ethical Manufacturing</h1>
          <p className="font-display uppercase tracking-[0.3em] text-sm font-bold">Made with Care</p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl lg:text-5xl text-soxenly-green mb-8">
          A better product requires a <br/>better process.
        </h2>
        <p className="text-lg text-soxenly-charcoal/80 leading-relaxed">
          Sustainability isn't just about what a product is made of; it's about how it's made. We partner exclusively with factories that share our commitment to ethical labor practices, environmental stewardship, and zero-waste initiatives.
        </p>
      </section>

      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-10 border border-soxenly-beige hover:border-soxenly-green transition-colors duration-300">
            <h3 className="font-serif text-2xl text-soxenly-green mb-4">Fair Labor</h3>
            <p className="text-soxenly-charcoal/70 leading-relaxed text-sm">
              We ensure fair wages, safe working conditions, and reasonable hours for every worker in our supply chain. Our partners are strictly audited to meet global ethical standards.
            </p>
          </div>
          <div className="bg-white p-10 border border-soxenly-beige hover:border-soxenly-green transition-colors duration-300">
            <h3 className="font-serif text-2xl text-soxenly-green mb-4">Energy Efficient</h3>
            <p className="text-soxenly-charcoal/70 leading-relaxed text-sm">
              Our partner facilities are transitioning to renewable energy sources. Advanced knitting technology reduces energy consumption by 30% compared to traditional methods.
            </p>
          </div>
          <div className="bg-white p-10 border border-soxenly-beige hover:border-soxenly-green transition-colors duration-300">
            <h3 className="font-serif text-2xl text-soxenly-green mb-4">Closed-Loop Water</h3>
            <p className="text-soxenly-charcoal/70 leading-relaxed text-sm">
              The dyeing process is notoriously water-intensive. We utilize closed-loop systems that recycle up to 95% of water used, preventing toxic runoff into local ecosystems.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-soxenly-green text-soxenly-cream text-center">
        <h2 className="font-serif text-3xl lg:text-4xl mb-8">Transparency at Every Step</h2>
        <p className="max-w-2xl mx-auto mb-12 text-soxenly-cream/80">
          We believe you have the right to know exactly where and how your clothes are made.
        </p>
        <Link 
          to="/shop" 
          className="inline-block border border-soxenly-cream text-soxenly-cream px-10 py-4 font-display uppercase text-xs tracking-widest font-bold hover:bg-soxenly-cream hover:text-soxenly-green transition-all duration-300"
        >
          Shop Responsibly
        </Link>
      </section>
    </div>
  );
}
