import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

export default function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
        return;
      }

      if (response.ok && data.data) {
        setCartData(data.data);
      } else {
        setCartData({ Cart: [], TotalPrice: 0 });
      }
    } catch (err) {
      console.error("Error fetching cart", err);
      setCartData({ Cart: [], TotalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  const handleRemove = async (productId, size) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart?product_id=${productId}&size=${size}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        showNotification("Removed from cart");
        fetchCart(); // Refresh cart to get updated totals
      }
    } catch (err) {
      showNotification("Error removing item", "error");
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart/empty`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        showNotification("Cart cleared");
        fetchCart();
      }
    } catch (err) {
      showNotification("Error clearing cart", "error");
    }
  };

  const handleIncrement = async (productId, size) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart/updatequantityadd?product_id=${productId}&size=${size}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchCart();
      } else {
        const data = await response.json();
        showNotification(data.error || "Cannot add more", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecrement = async (productId, size, currentQuantity) => {
    if (currentQuantity <= 1) {
      handleRemove(productId, size);
      return;
    }
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart/updatequantityless?product_id=${productId}&size=${size}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-display uppercase tracking-widest animate-pulse">Loading Cart...</div>;
  }

  const cartItems = cartData?.Cart || [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 relative min-h-screen">

      <h1 className="font-serif text-4xl lg:text-5xl text-soxenly-green border-b border-soxenly-beige pb-8 mb-12">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border border-soxenly-beige border-dashed">
          <p className="font-display uppercase tracking-widest text-neutral-500 mb-6">Your cart is empty</p>
          <Link to="/shop" className="inline-block bg-soxenly-green text-soxenly-cream px-8 py-4 font-display uppercase text-sm font-bold hover:bg-white hover:text-soxenly-green border border-soxenly-beige transition-colors">
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display uppercase text-xs tracking-widest">{cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''}</span>
              <button onClick={handleClearCart} className="font-display uppercase text-xs tracking-widest text-red-600 hover:text-soxenly-cream transition-colors underline decoration-2 underline-offset-4">
                Clear Cart
              </button>
            </div>
            
            {cartItems.map((item, idx) => (
              <div key={idx} className="border border-soxenly-beige bg-white p-6 flex flex-col sm:flex-row gap-6 relative group">
                <Link to={`/product/${item.product_id}`} className="block sm:w-32 sm:h-40 bg-neutral-100 border border-soxenly-beige shrink-0 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_API_BASE_URL}${item.image}`} 
                      alt={item.product_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-xs uppercase tracking-widest text-neutral-400">VIEW</div>
                  )}
                </Link>
                
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start pr-8">
                    <Link to={`/product/${item.product_id}`}>
                      <h3 className="font-display font-bold uppercase text-lg tracking-widest hover:underline decoration-2 underline-offset-4">{item.product_name}</h3>
                      <p className="text-xs font-display uppercase tracking-widest text-neutral-500 mt-1">Size: {item.size}</p>
                    </Link>
                    <p className="text-xl font-bold tracking-tight text-soxenly-green tabular-nums">₹{item.total_price}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center border border-soxenly-beige bg-white">
                      <button 
                        onClick={() => handleDecrement(item.product_id, item.size, item.quantity)}
                        className="w-10 h-10 flex items-center justify-center font-display text-lg hover:bg-soxenly-green hover:text-soxenly-cream transition-colors border-r border-soxenly-beige"
                      >-</button>
                      <span className="w-12 h-10 flex items-center justify-center font-display font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrement(item.product_id, item.size)}
                        className="w-10 h-10 flex items-center justify-center font-display text-lg hover:bg-soxenly-green hover:text-soxenly-cream transition-colors border-l border-soxenly-beige"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.product_id, item.size)}
                      className="absolute top-6 right-6 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="border border-soxenly-beige bg-neutral-50 p-8 sticky top-24">
              <h2 className="font-display uppercase tracking-widest font-bold text-xl mb-8 pb-4 border-b border-soxenly-beige">Order Summary</h2>
              
              <div className="space-y-4 mb-8 font-display uppercase text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                   <span className="font-bold tracking-tight tabular-nums">₹{cartData?.TotalPrice || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={cartData?.TotalPrice >= 399 ? "text-green-600 font-bold" : "text-neutral-500"}>
                    {cartData?.TotalPrice >= 399 ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-t border-soxenly-beige pt-4 mb-8 font-display">
                <span className="uppercase tracking-widest font-bold">Total</span>
                 <span className="text-3xl font-bold tracking-tighter tabular-nums text-soxenly-green">₹{cartData?.TotalPrice || 0}</span>
              </div>
              
              <Link to="/checkout" className="block w-full py-5 text-center bg-soxenly-green text-soxenly-cream font-display uppercase tracking-[0.2em] font-black text-sm border border-soxenly-beige hover:bg-white hover:text-soxenly-green transition-all">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
