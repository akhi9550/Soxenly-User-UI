import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImageLocal from "../assets/hero.png";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/category`);
        const catData = await catRes.json();
        if (catRes.ok) setCategories(catData.data || []);

        const newRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/products/new?count=4`);
        const newData = await newRes.json();
        if (newRes.ok) setNewArrivals(newData.data || []);

        const bannerRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/banner`);
        const bannerData = await bannerRes.json();
        if (bannerRes.ok) setBanners(bannerData.data || []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    fetchData();
  }, []);

  const heroBanner = banners[0];

  const getImageUrl = (path) => {
    if (!path) return heroImageLocal;
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (path.includes("/uploads/")) {
      return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}/uploads${cleanPath}`;
  };

  return (
    <div className="font-sans text-soxenly-charcoal bg-soxenly-cream overflow-x-hidden" data-testid="home-page">
      {/* Announcement Bar */}
      <div className="bg-soxenly-green text-soxenly-cream py-2 overflow-hidden whitespace-nowrap" data-testid="marquee">
        <div className="inline-block animate-marquee font-display text-[10px] uppercase tracking-[0.4em] font-medium">
          <span className="px-12">Engineered Comfort • Conscious Choice • Soft on You • Gentle on Earth • </span>
          <span className="px-12">Engineered Comfort • Conscious Choice • Soft on You • Gentle on Earth • </span>
          <span className="px-12">Engineered Comfort • Conscious Choice • Soft on You • Gentle on Earth • </span>
          <span className="px-12">Engineered Comfort • Conscious Choice • Soft on You • Gentle on Earth • </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Soxenly Hero"
            className="w-full h-full object-cover"
            src={heroImageLocal}
            data-testid="hero-image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soxenly-cream/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 text-xs font-display uppercase tracking-[0.3em] text-soxenly-leaf font-bold">
              {heroBanner?.subtitle1 || "The Everyday Reimagined"}
            </span>
            <h1 className="font-serif text-6xl lg:text-8xl leading-tight mb-8 text-soxenly-green">
              Engineered <br />
              <span className="italic">Comfort.</span>
            </h1>
            <p className="text-lg lg:text-xl text-soxenly-charcoal/80 mb-10 max-w-lg leading-relaxed">
              Something so small shouldn’t leave such a large footprint. 
              Soxenly reimagines the essential with sustainability at its core.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="bg-soxenly-green text-soxenly-cream px-10 py-5 font-display uppercase text-xs tracking-widest font-bold hover:bg-soxenly-leaf transition-all duration-300 text-center"
              >
                Shop Collection
              </Link>
              <Link
                to="/story"
                className="border border-soxenly-green text-soxenly-green px-10 py-5 font-display uppercase text-xs tracking-widest font-bold hover:bg-soxenly-green hover:text-soxenly-cream transition-all duration-300 text-center"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="story" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl lg:text-5xl text-soxenly-green mb-8">
                Why Soxenly Exists
              </h2>
              <div className="space-y-6 text-soxenly-charcoal/80 leading-relaxed text-lg">
                <p>
                  We wear socks every day. But we rarely think about them. Behind this simple essential is an unseen impact—millions of pairs discarded, synthetic fibers shedding microplastics.
                </p>
                <p>
                  Soxenly was built on a simple idea: <strong>Comfort shouldn’t come at a cost to the planet.</strong>
                </p>
                <p>
                  Socks are one of the most replaced items in your wardrobe. Which means they’re also one of the easiest places to make a better choice.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] bg-soxenly-beige overflow-hidden">
                <img src="/images/story/img1.png" alt="Organic Cotton Field" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] bg-soxenly-cream overflow-hidden mt-12">
                <img src="/images/story/happy_feet.png" alt="Comfortable Socks" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-y border-soxenly-beige">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-soxenly-cream border border-soxenly-beige rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-soxenly-leaf transition-colors duration-500">
                <svg className="w-8 h-8 text-soxenly-leaf group-hover:text-soxenly-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="font-display uppercase tracking-widest text-sm font-bold mb-4">Organic Materials</h3>
              <p className="text-sm text-soxenly-charcoal/60 leading-relaxed">Thoughtfully sourced organic cotton and bamboo fibers for all-day breathability.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-soxenly-cream border border-soxenly-beige rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-soxenly-leaf transition-colors duration-500">
                <svg className="w-8 h-8 text-soxenly-leaf group-hover:text-soxenly-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="font-display uppercase tracking-widest text-sm font-bold mb-4">Built to Last</h3>
              <p className="text-sm text-soxenly-charcoal/60 leading-relaxed">Durable construction that withstands the test of time, reducing waste and replacement.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-soxenly-cream border border-soxenly-beige rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-soxenly-leaf transition-colors duration-500">
                <svg className="w-8 h-8 text-soxenly-leaf group-hover:text-soxenly-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
              <h3 className="font-display uppercase tracking-widest text-sm font-bold mb-4">Zero Plastic</h3>
              <p className="text-sm text-soxenly-charcoal/60 leading-relaxed">Minimal, plastic-free packaging that is as gentle on the earth as it is on your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-display uppercase tracking-[0.3em] text-soxenly-leaf font-bold">/// Featured</span>
              <h2 className="font-serif text-5xl text-soxenly-green mt-2">Latest Arrivals</h2>
            </div>
            <Link to="/shop" className="text-xs font-display uppercase tracking-[0.2em] border-b border-soxenly-green pb-1 text-soxenly-green font-bold hover:text-soxenly-leaf transition-colors">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-white mb-6 relative shadow-sm group-hover:shadow-md transition-shadow">
                  {product.image && product.image.length > 0 ? (
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={`${import.meta.env.VITE_API_BASE_URL}${product.image[0]}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-display text-neutral-400 uppercase tracking-widest">Natural Blend</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-soxenly-green px-3 py-1 text-[10px] font-display uppercase tracking-widest font-bold">New</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base uppercase tracking-wider text-soxenly-charcoal group-hover:text-soxenly-leaf transition-colors">{product.name}</h3>
                  <p className="text-[11px] font-display uppercase tracking-widest text-soxenly-charcoal/40 font-medium">{product.category_name}</p>
                  <p className="font-serif text-lg text-soxenly-green">₹{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto / Full Width Callout */}
      <section className="bg-soxenly-green text-soxenly-cream py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
           <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M100 20C100 20 120 60 180 80C120 100 100 140 100 140C100 140 80 100 20 80C80 60 100 20 100 20Z" fill="currentColor"/>
           </svg>
        </div>
        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="font-serif text-5xl lg:text-7xl mb-8 leading-tight">
            Soft on You. <br />
            <span className="italic">Gentle on Earth.</span>
          </h2>
          <p className="text-lg lg:text-xl text-soxenly-cream/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            We don’t treat sustainability as a feature. We build around it. 
            From materials to manufacturing, every decision is made to reduce impact.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-soxenly-cream text-soxenly-green px-12 py-5 font-display uppercase text-xs tracking-widest font-bold hover:bg-white transition-all duration-300"
          >
            Explore Conscious Choices
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-soxenly-cream">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-5xl text-soxenly-green">Collections</h2>
            <p className="hidden md:block text-[10px] font-display uppercase tracking-[0.3em] font-black text-soxenly-leaf">
              Curated Essentials
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/shop"
                className="relative group h-[400px] overflow-hidden"
              >
                {cat.image ? (
                  <img
                    alt={cat.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    src={getImageUrl(cat.image)}
                  />
                ) : (
                  <div className="w-full h-full bg-soxenly-beige flex items-center justify-center font-display text-xs uppercase tracking-[0.3em] text-soxenly-leaf font-bold">
                    {cat.category}
                  </div>
                )}
                <div className="absolute inset-0 bg-soxenly-green/20 group-hover:bg-soxenly-green/40 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="font-serif text-3xl text-soxenly-cream mb-2">{cat.category}</h3>
                  <p className="text-[10px] text-soxenly-cream/80 font-display uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Collection →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer-like Trust Section */}
      <section className="py-12 bg-soxenly-beige/30 border-t border-soxenly-beige">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40">
            <span className="font-display text-[10px] uppercase tracking-[0.4em] font-bold">Organic Cotton</span>
            <span className="font-display text-[10px] uppercase tracking-[0.4em] font-bold">Bamboo Fiber</span>
            <span className="font-display text-[10px] uppercase tracking-[0.4em] font-bold">Plastic Free</span>
            <span className="font-display text-[10px] uppercase tracking-[0.4em] font-bold">Durable Knit</span>
          </div>
        </div>
      </section>
    </div>
  );
}

