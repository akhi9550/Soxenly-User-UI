import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/wishlist`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
        return;
      }

      if (response.ok) {
        setWishlist(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [navigate]);

  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/wishlist?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== id));
        setActionMessage({ text: "Removed from wishlist", type: "success" });
      }
    } catch (err) {
      setActionMessage({ text: "Error removing item", type: "error" });
    }
    setTimeout(() => setActionMessage({ text: "", type: "" }), 5000);
  };

  const handleAddToCart = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setActionMessage({ text: "Please login to manage cart", type: "error" });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 5000);
      return;
    }

    try {
      // Get product details to pick a default size
      const prodRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/products/details?id=${id}`);
      const prodData = await prodRes.json();
      
      if (!prodRes.ok || !prodData.data || !prodData.data.variants || prodData.data.variants.length === 0) {
        setActionMessage({ text: "Product details not available", type: "error" });
        return;
      }

      // Pick first variant with stock, or just the first one if all out of stock (backend will handle out of stock error)
      const variant = prodData.data.variants.find(v => v.stock > 0) || prodData.data.variants[0];
      const size = variant.size;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart?product_id=${id}&size=${size}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Automatically remove from wishlist after successful add to cart
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/wishlist?id=${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        setWishlist(wishlist.filter(item => item.id !== id));
        setActionMessage({ text: "Added to cart", type: "success", isCart: true });
      } else {
        const data = await response.json();
        setActionMessage({ text: data.error || "Failed to add to cart", type: "error" });
      }
    } catch (err) {
      setActionMessage({ text: "Error adding to cart", type: "error" });
    }
    setTimeout(() => setActionMessage({ text: "", type: "" }), 5000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-display uppercase tracking-widest animate-pulse">Loading Wishlist...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 relative min-h-screen">
      {actionMessage.text && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 border font-display text-xs uppercase tracking-widest transition-all flex items-center gap-4
          ${actionMessage.type === 'success' ? 'bg-soxenly-green border-soxenly-beige text-soxenly-cream' : 'bg-white border-soxenly-beige text-red-600'}
          animate-slideUp`}>
          <span>{actionMessage.text}</span>
          {actionMessage.isCart && (
            <Link to="/cart" className="whitespace-nowrap border-b border-white hover:text-neutral-300 pb-0.5">
              Go to Cart →
            </Link>
          )}
        </div>
      )}

      <h1 className="font-serif text-4xl lg:text-5xl text-soxenly-green border-b border-soxenly-beige pb-8 mb-12">Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 border border-soxenly-beige border-dashed">
          <p className="font-display uppercase tracking-widest text-neutral-500 mb-6">Your wishlist is empty</p>
          <Link to="/shop" className="inline-block bg-soxenly-green text-soxenly-cream px-8 py-4 font-display uppercase text-sm font-bold hover:bg-white hover:text-soxenly-green border border-soxenly-beige transition-colors">
            Explore Gear
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="group border border-soxenly-beige relative bg-white flex flex-col transition-all duration-300">
              <Link to={`/product/${product.id}`} className="aspect-[4/5] bg-neutral-100 overflow-hidden block border-b border-soxenly-beige relative">
                {product.image && product.image[0] ? (
                  <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image[0]}`} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-neutral-400">NO IMAGE</div>
                )}
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold uppercase text-sm tracking-widest truncate pr-4">{product.name}</h3>
                  <p className="font-display font-bold">₹{product.price}</p>
                </div>
                <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full py-2 bg-soxenly-green text-soxenly-cream border border-soxenly-beige font-display text-xs uppercase tracking-wider hover:bg-white hover:text-soxenly-green transition-colors"
                  >
                    Add Cart
                  </button>
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="w-full py-2 bg-white text-soxenly-green border border-soxenly-beige font-display text-xs uppercase tracking-wider hover:bg-red-600 hover:text-soxenly-cream hover:border-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
