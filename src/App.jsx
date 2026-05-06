import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Orders from "./pages/Orders";
import Story from "./pages/Story";
import Materials from "./pages/Materials";
import Manufacturing from "./pages/Manufacturing";
import Impact from "./pages/Impact";
import Profile from "./pages/Profile";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./context/NotificationContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
  return (
    <NotificationProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ScrollToTop />
          <div className="App min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-neutral-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<Success />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/story" element={<Story />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/manufacturing" element={<Manufacturing />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </NotificationProvider>
  );
}
