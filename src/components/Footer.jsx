import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/category`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching footer categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer
      className="bg-white border-t border-soxenly-beige mt-20"
      data-testid="footer"
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="block mb-6">
            <img src="/logo.png" alt="Soxenly Logo" className="h-10 w-auto object-contain" />
          </Link>
          <p className="font-serif italic text-lg text-soxenly-charcoal/90 leading-relaxed mt-6 max-w-xs">
            Engineered Comfort. Conscious Choice. Soft on You. Gentle on Earth.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="w-8 h-8 rounded-full bg-soxenly-cream border border-soxenly-beige flex items-center justify-center text-soxenly-green hover:bg-soxenly-green hover:text-soxenly-cream transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-soxenly-cream border border-soxenly-beige flex items-center justify-center text-soxenly-green hover:bg-soxenly-green hover:text-soxenly-cream transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-serif text-xl text-soxenly-green mb-6">
            Shop
          </h4>
          <ul className="space-y-4 text-sm text-soxenly-charcoal/60">
            <li><Link to="/shop" className="hover:text-soxenly-leaf transition-colors">All Products</Link></li>
            {categories.slice(0, 4).map((cat) => (
              <li key={cat.ID}>
                <Link to="/shop" className="hover:text-soxenly-leaf transition-colors capitalize">
                  {cat.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-xl text-soxenly-green mb-6">
            Sustainability
          </h4>
          <ul className="space-y-4 text-sm text-soxenly-charcoal/60">
            <li><Link to="/story" className="hover:text-soxenly-leaf transition-colors">Our Story</Link></li>
            <li><Link to="/materials" className="hover:text-soxenly-leaf transition-colors">Materials</Link></li>
            <li><Link to="/manufacturing" className="hover:text-soxenly-leaf transition-colors">Manufacturing</Link></li>
            <li><Link to="/impact" className="hover:text-soxenly-leaf transition-colors">Environmental Impact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-xl text-soxenly-green mb-6">
            Join the Movement
          </h4>
          <p className="font-serif italic text-sm text-soxenly-charcoal/80 mb-6 leading-relaxed">
            Stay updated on new conscious drops and sustainability efforts.
          </p>
          <div className="flex">
            <input
              className="flex-1 bg-soxenly-cream border-b border-soxenly-beige px-0 py-3 text-sm focus:outline-none focus:border-soxenly-leaf transition-colors"
              placeholder="Email address"
              data-testid="footer-email-input"
            />
            <button
              className="text-soxenly-green font-display text-xs uppercase tracking-widest font-bold ml-4 border-b border-soxenly-green hover:text-soxenly-leaf hover:border-soxenly-leaf transition-all"
              data-testid="footer-subscribe-btn"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 border-t border-soxenly-beige flex flex-col md:flex-row justify-between items-center text-[10px] font-display uppercase tracking-widest text-soxenly-charcoal/40 font-bold gap-4">
        <span>© {new Date().getFullYear()} SOXENLY — ALL RIGHTS RESERVED.</span>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-soxenly-green">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-soxenly-green">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

