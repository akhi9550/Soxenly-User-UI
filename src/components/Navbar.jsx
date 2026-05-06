import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const token = localStorage.getItem("token");
  const { cartCount } = useCart();

  const getNavClass = (targetPath) => {
    const baseClass =
      "uppercase text-[10px] tracking-[0.3em] font-display font-bold px-4 py-2 transition-all duration-300 ";
    if (
      path === targetPath ||
      (targetPath === "/shop" && path.startsWith("/shop"))
    ) {
      return baseClass + "text-soxenly-green border-b border-soxenly-green";
    }
    return baseClass + "text-soxenly-charcoal/60 hover:text-soxenly-green";
  };

  return (
    <header
      className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-soxenly-beige"
      data-testid="navbar"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-12 h-20">
        <Link
          className="flex items-center gap-2 group"
          data-testid="brand-link"
          to="/"
        >
          <img src="/logo.png" alt="Soxenly Logo" className="h-12 w-auto object-contain" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-4">
          <Link
            data-testid="nav-home"
            className={getNavClass("/")}
            to="/"
          >
            Home
          </Link>
          <Link
            data-testid="nav-shop"
            className={getNavClass("/shop")}
            to="/shop"
          >
            Shop
          </Link>
          <Link
            data-testid="nav-orders"
            className={getNavClass("/orders")}
            to="/orders"
          >
            Orders
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            className="text-soxenly-charcoal/80 hover:text-soxenly-green transition-colors"
            data-testid="wishlist-icon-link"
            to="/wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </Link>
          <Link
            className="text-soxenly-charcoal/80 hover:text-soxenly-green transition-colors relative group/cart"
            data-testid="cart-icon-link"
            to="/cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] text-center">
                {cartCount}
              </span>
            )}
          </Link>
          {token ? (
            <Link
              className="text-soxenly-charcoal/80 hover:text-soxenly-green transition-colors"
              data-testid="profile-icon-link"
              to="/profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </Link>
          ) : (
            <Link
              className="hidden md:inline-block bg-soxenly-green text-soxenly-cream px-6 py-2.5 text-[10px] uppercase tracking-widest font-display font-bold hover:bg-soxenly-leaf transition-colors shadow-sm"
              data-testid="login-link"
              to="/login"
            >
              Sign In
            </Link>
          )}
          <button className="md:hidden text-soxenly-green" data-testid="mobile-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

