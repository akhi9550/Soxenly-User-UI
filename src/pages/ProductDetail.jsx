import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/products/details?id=${id}`);
        const data = await response.json();
        if (response.ok) {
          const productData = data.data;
          setProduct(productData);
          if (productData.image && productData.image.length > 0) {
            setMainImage(productData.image[0]);
          }

          // Fetch related products from the same category
          const relatedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/products?count=4&category=${productData.category_name}`);
          const relatedData = await relatedResponse.json();
          if (relatedResponse.ok) {
            // Filter out current product
            const filtered = (relatedData.data || []).filter(p => p.id !== parseInt(id)).slice(0, 4);
            setRelatedProducts(filtered);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setActionMessage({ text: "Please login to add items to cart", type: "error" });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3000);
      return;
    }

    if (!selectedSize) {
      setActionMessage({ text: "Please select a size first", type: "error" });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/cart?product_id=${id}&size=${selectedSize}&quantity=${quantity}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        setActionMessage({ text: "Session expired. Please log in again.", type: "error" });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      if (response.ok) {
        setActionMessage({ text: "Product added to cart successfully!", type: "success", isCart: true });
      } else {
        setActionMessage({ text: data.message || data.error || "Failed to add to cart", type: "error" });
      }
    } catch (err) {
      setActionMessage({ text: "Connection error. Try again.", type: "error" });
    }
    setTimeout(() => setActionMessage({ text: "", type: "" }), 5000);
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setActionMessage({ text: "Please login to manage wishlist", type: "error" });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 5000);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/wishlist?product_id=${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        setActionMessage({ text: "Session expired. Please log in again.", type: "error" });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      if (response.ok) {
        setActionMessage({ text: "Added to wishlist!", type: "success" });
      } else {
        setActionMessage({ text: data.message || data.error || "Failed to add to wishlist", type: "error" });
      }
    } catch (err) {
      setActionMessage({ text: "Connection error. Try again.", type: "error" });
    }
    setTimeout(() => setActionMessage({ text: "", type: "" }), 5000);
  };


  const maxStock = product?.variants?.find(v => v.size === selectedSize)?.stock || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-display uppercase tracking-widest animate-pulse">
        Loading Gear Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-display text-4xl uppercase mb-4">Gear Not Found</h2>
        <Link to="/shop" className="border border-soxenly-beige px-6 py-2 font-display uppercase text-xs hover:bg-soxenly-leaf hover:text-soxenly-cream transition-colors">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 relative">
      {/* ACTION NOTIFICATION TOAST */}
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

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white border border-soxenly-beige p-8 lg:p-12 relative shadow-xl">
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-6 right-6 p-2 text-soxenly-charcoal/40 hover:text-soxenly-green transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>
              </svg>
            </button>
            <div className="mb-8 text-center">
              <span className="text-xs font-display uppercase tracking-widest text-soxenly-leaf font-bold">Standard Reference</span>
              <h2 className="font-serif text-4xl text-soxenly-green mt-2">Sock Size Guide</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-display text-xs text-left">
                <thead>
                  <tr className="border-b border-soxenly-beige bg-soxenly-cream text-soxenly-green uppercase tracking-widest">
                    <th className="p-4">Label</th>
                    <th className="p-4">EU</th>
                    <th className="p-4">UK</th>
                    <th className="p-4">US (M)</th>
                    <th className="p-4">CM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-soxenly-beige hover:bg-soxenly-beige/20 text-soxenly-charcoal/80">
                    <td className="p-4 font-bold">XS</td>
                    <td className="p-4">32-34</td>
                    <td className="p-4">1-2.5</td>
                    <td className="p-4">2-3.5</td>
                    <td className="p-4">19-21.5</td>
                  </tr>
                  <tr className="border-b border-soxenly-beige hover:bg-soxenly-beige/20 text-soxenly-charcoal/80">
                    <td className="p-4 font-bold">SMALL</td>
                    <td className="p-4">35-38</td>
                    <td className="p-4">3-5.5</td>
                    <td className="p-4">4-6.5</td>
                    <td className="p-4">22-24.5</td>
                  </tr>
                  <tr className="border-b border-soxenly-beige hover:bg-soxenly-beige/20 text-soxenly-charcoal/80">
                    <td className="p-4 font-bold">MEDIUM</td>
                    <td className="p-4">39-42</td>
                    <td className="p-4">6-8.5</td>
                    <td className="p-4">7-9.5</td>
                    <td className="p-4">25-27.5</td>
                  </tr>
                  <tr className="border-b border-soxenly-beige hover:bg-soxenly-beige/20 text-soxenly-charcoal/80">
                    <td className="p-4 font-bold">LARGE</td>
                    <td className="p-4">43-46</td>
                    <td className="p-4">9-11.5</td>
                    <td className="p-4">10-12.5</td>
                    <td className="p-4">28-30.5</td>
                  </tr>
                  <tr className="border-b border-soxenly-beige/20 hover:bg-neutral-50">
                    <td className="p-4 font-bold">XL</td>
                    <td className="p-4">47-49</td>
                    <td className="p-4">12-13.5</td>
                    <td className="p-4">13-14.5</td>
                    <td className="p-4">31-33</td>
                  </tr>
                  <tr className="border-b border-soxenly-beige/20 hover:bg-neutral-50">
                    <td className="p-4 font-bold">2XL</td>
                    <td className="p-4">50+</td>
                    <td className="p-4">14+</td>
                    <td className="p-4">15+</td>
                    <td className="p-4">34+</td>
                  </tr>
                  <tr className="border-b border-soxenly-beige bg-neutral-100 font-bold">
                    <td className="p-4 font-bold uppercase">Free Size</td>
                    <td className="p-4">36-45</td>
                    <td className="p-4">4-11</td>
                    <td className="p-4">5-12</td>
                    <td className="p-4">23-29</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-4 bg-neutral-50 border-l-4 border-soxenly-beige font-display text-[10px] leading-relaxed uppercase tracking-widest text-neutral-600">
              * Most of our socks have a performance stretch fit. If between sizes, we recommend sizing down for a tighter compression feel.
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-8 text-[10px] font-display uppercase tracking-widest text-neutral-500 overflow-hidden whitespace-nowrap">
        <Link to="/" className="hover:text-soxenly-green">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-soxenly-green">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category_name}`} className="hover:text-soxenly-green">{product.category_name}</Link>
        <span>/</span>
        <span className="text-soxenly-green truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* IMAGE GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-soxenly-beige aspect-square bg-neutral-100 overflow-hidden relative">
            {mainImage ? (
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}${mainImage}`} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-display text-neutral-400 uppercase">No Image</div>
            )}
            {product.product_status === "out of stock" && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-red-600 text-soxenly-cream px-5 py-2 font-display text-xs uppercase tracking-[0.2em] font-black border border-soxenly-beige shadow-sm">
                  Sold Out
                </div>
              </div>
            )}
          </div>
          
          {product.image && product.image.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {product.image.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square border ${mainImage === img ? 'border-[red-600]' : 'border-soxenly-beige'} bg-neutral-100 overflow-hidden hover:opacity-80 transition-all`}
                >
                  <img src={`${import.meta.env.VITE_API_BASE_URL}${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="lg:col-span-5">
          <div className="border-b-2 border-soxenly-beige pb-8 mb-8">
            <span className="text-xs font-display uppercase tracking-[0.3em] text-[red-600] font-bold">
              {product.category_name}
            </span>
            <h1 className="font-serif text-5xl lg:text-7xl leading-tight mt-2 mb-4 text-soxenly-green">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-4xl lg:text-5xl">
                ₹{product.price.toFixed(2)}
              </span>
              {product.discounted_price < product.price && (
                <span className="font-display text-lg text-neutral-400 line-through">
                  ₹{product.discounted_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* SIZE SELECTOR */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-display uppercase tracking-widest font-bold">Select Size</label>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] font-display uppercase underline hover:text-[red-600]"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((v) => (
                    <button
                      key={v.size}
                      disabled={v.stock === 0}
                      onClick={() => {
                        setSelectedSize(v.size);
                        setQuantity(1);
                      }}
                      className={`min-w-[60px] h-[60px] flex items-center justify-center border font-display text-sm uppercase transition-all
                        ${v.stock === 0 ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed line-through' : 
                        selectedSize === v.size ? 'bg-soxenly-green text-soxenly-cream border-soxenly-beige' : 'bg-white border-soxenly-beige hover:bg-soxenly-leaf hover:text-soxenly-cream'}`}
                    >
                      {v.size}
                    </button>
                  ))
                ) : (
                  <p className="text-xs font-display text-neutral-500 italic">No sizes available</p>
                )}
              </div>
            </div>

            {/* STOCK STATUS INDICATOR */}
            {selectedSize && (
              <div className="pt-4 border-t-2 border-soxenly-beige/10">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${maxStock === 0 ? 'bg-red-500' : maxStock < 10 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-[10px] font-display uppercase tracking-[0.2em] font-bold">
                    {maxStock === 0 ? (
                      <span className="text-[red-600]">Product is currently out of stock</span>
                    ) : maxStock < 10 ? (
                      <span className="text-[red-600]">Running Low: Only {maxStock} units remaining</span>
                    ) : (
                      <span className="text-neutral-500">Inventory Status: In Stock</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR */}
            <div>
              <label className="text-[10px] font-display uppercase tracking-widest font-bold block mb-4">Quantity</label>
              <div className="flex items-center">
                <div className="inline-flex border border-soxenly-beige">
                  <button 
                    disabled={maxStock === 0}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center font-display text-xl border-r-2 border-soxenly-beige hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center font-display text-sm font-bold bg-white">
                    {maxStock === 0 ? 0 : quantity}
                  </div>
                  <button 
                    disabled={maxStock === 0 || quantity >= maxStock}
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center font-display text-xl border-l-2 border-soxenly-beige hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {selectedSize && maxStock < 10 && maxStock > 0 && (
                  <span className="ml-4 text-[10px] font-display uppercase text-[red-600] font-bold italic animate-bounce">
                    Limited Stock Available
                  </span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize || maxStock === 0}
                className={`w-full py-5 font-display uppercase tracking-[0.2em] font-black text-sm border transition-all
                  ${!selectedSize || maxStock === 0 
                    ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed' 
                    : 'bg-soxenly-green border-soxenly-beige text-soxenly-cream hover:bg-white hover:text-soxenly-green hover:-translate-y-1'}`}
              >
                {!selectedSize ? "Select a Size" : maxStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button 
                onClick={handleAddToWishlist}
                className="w-full py-5 font-display uppercase tracking-[0.2em] font-black text-sm border border-soxenly-beige bg-white text-soxenly-green hover:bg-soxenly-leaf hover:text-soxenly-cream transition-all hover:-translate-y-1"
              >
                Add to Wishlist
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-8 border-t-2 border-soxenly-beige/10">
              <h4 className="text-[10px] font-display uppercase tracking-widest font-bold mb-4">Description</h4>
              <p className="text-sm font-display leading-relaxed text-neutral-700">
                {product.description || "No description provided for this gear."}
              </p>
            </div>

            {/* INFO ACCORDIONS */}
            <div className="space-y-0 pt-8">
              {/* SHIPPING */}
              <div className="border-t-2 border-soxenly-beige">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-6 flex justify-between items-center group transition-colors hover:bg-neutral-50"
                >
                  <span className="text-[10px] font-display uppercase tracking-widest font-bold">Shipping & Returns</span>
                  <span className={`text-xl transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === 'shipping' ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                  <p className="text-[11px] font-display uppercase leading-relaxed text-neutral-500">
                    Standard Shipping (3-5 business days). Free shipping on orders over ₹399. 
                    Due to hygiene reasons, we have a strict No Return Policy. 
                    <span className="text-soxenly-green font-bold block mt-2">IMPORTANT: Please record a clear unboxing video while opening your package to claim for any damages or missing items.</span>
                  </p>
                </div>
              </div>

              {/* MATERIALS */}
              <div className="border-t-2 border-soxenly-beige border-b-2">
                <button 
                  onClick={() => toggleAccordion('materials')}
                  className="w-full py-6 flex justify-between items-center group transition-colors hover:bg-neutral-50"
                >
                  <span className="text-[10px] font-display uppercase tracking-widest font-bold">Materials & Care</span>
                  <span className={`text-xl transition-transform duration-300 ${activeAccordion === 'materials' ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === 'materials' ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                  <p className="text-[11px] font-display uppercase leading-relaxed text-neutral-500">
                    80% Premium Combed Cotton, 17% Polyamide, 3% Elastane. 
                    Machine wash cold. Do not bleach. Tumble dry low. Do not iron.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t-2 border-soxenly-beige pt-16">
          <h2 className="font-display text-4xl uppercase mb-8 tracking-tighter">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link 
                key={p.id}
                to={`/product/${p.id}`}
                className="group block border border-soxenly-beige bg-white hover:-translate-y-1 transition-all duration-200"
              >
                <div className="aspect-square overflow-hidden border-b-2 border-soxenly-beige bg-neutral-100 relative">
                  {p.image && p.image.length > 0 ? (
                    <img
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={`${import.meta.env.VITE_API_BASE_URL}${p.image[0]}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-display text-neutral-400">NO IMAGE</div>
                  )}
                </div>
                <div className="p-4 flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-display text-xl uppercase leading-none truncate max-w-[150px]">{p.name}</h3>
                    <p className="text-[11px] font-display uppercase tracking-widest text-neutral-600 mt-1">{p.category_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xl">₹<span>{p.price.toFixed(2)}</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
