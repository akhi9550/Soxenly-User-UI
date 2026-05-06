import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    house_name: "",
    street: "",
    city: "",
    state: "",
    pin: ""
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const navigate = useNavigate();

  const fetchCheckoutData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/checkout`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setCheckoutData(data.data);
        if (data.data.AddressInfoResponse?.length > 0) {
          // Keep current selection if valid, otherwise select first
          if (!selectedAddress || !data.data.AddressInfoResponse.find(a => a.id === selectedAddress)) {
            setSelectedAddress(data.data.AddressInfoResponse[0].id);
          }
        }
        if (data.data.Payment_Method?.length > 0) {
           // Find Razorpay specifically
           let razorpayId = null;
           data.data.Payment_Method.forEach(pGroup => {
             const found = pGroup.PaymentDetail?.find(m => m.payment_name.toLowerCase().includes('razorpay'));
             if (found) razorpayId = found.id;
           });
           
           if (razorpayId && !selectedPayment) {
             setSelectedPayment(razorpayId);
           }
        }
      } else {
        setError(data.error || "Failed to load checkout details");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, [navigate]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });
      if (response.ok) {
        await fetchCheckoutData(); // Refresh list
        setShowAddressModal(false);
        setAddressForm({ name: "", house_name: "", street: "", city: "", state: "", pin: "" });
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save address");
      }
    } catch (err) {
      alert("Error saving address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert("Please select an address and payment method");
      return;
    }

    setIsPlacingOrder(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Create order
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: parseInt(selectedAddress),
          payment_id: parseInt(selectedPayment),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Place order (COD or get payment link)
        // Correct path is data.data.order_id based on domain.OrderSuccessResponse
        const orderId = data.data?.order_id;
        
        if (!orderId) {
          console.error("Order ID missing in response:", data);
          throw new Error("Order creation failed: No order ID received");
        }

        const placeRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/order/place-order?order_id=${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const placeData = await placeRes.json();

        if (placeRes.ok) {
          // If Razorpay, the backend returns a link in placeData.data
          if (placeData.data && typeof placeData.data === 'string' && placeData.data.includes('razorpay')) {
            window.location.href = placeData.data;
          } else {
            navigate("/shop", { state: { message: "Order placed successfully!" } });
          }
        } else {
          alert(placeData.error || "Failed to finalize order");
        }
      } else {
        alert(data.error || data.message || "Failed to create order");
      }
    } catch (err) {
      console.error("Place Order Error:", err);
      alert(`Error processing order: ${err.message}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-display uppercase animate-pulse">Initializing Checkout...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <p className="text-red-600 font-display mb-4">ERROR: {error}</p>
      <Link to="/cart" className="border border-soxenly-beige px-6 py-2 uppercase font-display hover:bg-soxenly-green hover:text-soxenly-cream transition-colors">Return to Cart</Link>
    </div>
  );

  const subtotal = checkoutData?.Total_Price || 0;
  const isFreeShipping = subtotal >= 399;

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl lg:text-5xl text-soxenly-green border-b border-soxenly-beige pb-8 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: ADDRESS & PAYMENT */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* ADDRESS SECTION */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-display text-2xl uppercase font-bold tracking-widest">1. Shipping Address</h2>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-display uppercase underline hover:text-[red-600]"
                >
                  Manage Addresses
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkoutData?.AddressInfoResponse?.length > 0 ? (
                  <>
                    {checkoutData.AddressInfoResponse.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`p-6 border cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-soxenly-beige bg-white ring-2 ring-black' : 'border-neutral-200 bg-white hover:border-soxenly-beige'}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-display font-bold uppercase text-xs tracking-widest">{addr.name}</span>
                          {selectedAddress === addr.id && <div className="w-2 h-2 bg-[red-600]"></div>}
                        </div>
                        <p className="font-display text-xs uppercase leading-relaxed text-neutral-600">
                          {addr.house_name}, {addr.street}<br />
                          {addr.city}, {addr.state} - {addr.pin}
                        </p>
                      </div>
                    ))}
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="p-6 border border-dashed border-neutral-300 hover:border-soxenly-beige flex flex-col items-center justify-center gap-2 group transition-all"
                    >
                      <div className="w-8 h-8 rounded-full border border-neutral-300 group-hover:border-soxenly-beige flex items-center justify-center text-xl">+</div>
                      <span className="font-display text-[10px] uppercase tracking-widest font-bold">Add New</span>
                    </button>
                  </>
                ) : (
                  <div className="col-span-full p-8 border border-dashed border-neutral-300 text-center">
                    <p className="font-display text-xs uppercase text-neutral-500 mb-4">No address found</p>
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="inline-block border border-soxenly-beige px-6 py-2 uppercase font-display text-xs font-bold hover:bg-soxenly-green hover:text-soxenly-cream"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* PAYMENT SECTION */}
            <section>
              <h2 className="font-display text-2xl uppercase font-bold tracking-widest mb-6">2. Payment Method</h2>
              <div className="space-y-4">
                {checkoutData?.Payment_Method?.length > 0 ? (
                  checkoutData.Payment_Method.map((pGroup) => (
                    pGroup.PaymentDetail?.filter(m => /razor\s*pay/i.test(m.payment_name))?.map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-6 border cursor-pointer flex items-center gap-4 transition-all ${selectedPayment === method.id ? 'border-soxenly-beige bg-white ring-2 ring-black' : 'border-neutral-200 bg-white hover:border-soxenly-beige'}`}
                      >
                        <div className={`w-4 h-4 border border-soxenly-beige flex items-center justify-center p-0.5`}>
                          {selectedPayment === method.id && <div className="w-full h-full bg-soxenly-green"></div>}
                        </div>
                        <div>
                          <span className="font-display font-bold uppercase text-sm tracking-widest">{method.payment_name}</span>
                          <p className="text-[10px] font-display text-neutral-500 mt-2 leading-relaxed max-w-[200px]">
                            CARDS, UPI, NETBANKING & WALLETS. 
                            SECURED BY RAZORPAY.
                          </p>
                        </div>
                        <div className="ml-auto">
                          <img 
                            src="https://razorpay.com/assets/razorpay-glyph.svg" 
                            alt="Razorpay" 
                            className="w-6 h-6 grayscale opacity-50"
                          />
                        </div>
                      </div>
                    ))
                  ))
                ) : (
                  <div className="p-8 border border-dashed border-neutral-300 text-center">
                    <p className="font-display text-xs uppercase text-neutral-500">Loading Payment Methods...</p>
                    <p className="text-[10px] font-display mt-2">(Make sure the database is seeded with Razorpay)</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="border border-soxenly-beige bg-white p-8 sticky top-24">
              <h2 className="font-display uppercase tracking-widest font-bold text-xl mb-8 pb-4 border-b border-soxenly-beige">Your Order</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                {checkoutData?.Cart?.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-100 border border-soxenly-beige shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_API_BASE_URL}${item.image}`} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-display uppercase text-neutral-400">IMG</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-display font-bold text-xs uppercase truncate w-40">{item.product_name}</h4>
                      <p className="text-[10px] font-display text-neutral-500 uppercase mt-1">Size: {item.size} × {item.quantity}</p>
                      <p className="text-base font-bold tracking-tight text-soxenly-green tabular-nums">₹{item.total_price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t border-soxenly-beige font-display uppercase text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold tracking-tight tabular-nums">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? "text-green-600 font-bold" : "text-neutral-500"}>
                    {isFreeShipping ? "FREE" : "₹40"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-soxenly-beige pt-4 mb-8 font-display">
                <span className="uppercase tracking-widest font-bold">Total</span>
                <span className="text-3xl font-bold tracking-tighter tabular-nums text-soxenly-green">₹{subtotal === 0 ? 0 : (isFreeShipping ? subtotal : subtotal + 40)}</span>
              </div>

              <button 
                disabled={isPlacingOrder}
                onClick={() => {
                  if (!selectedAddress) {
                    alert("PLEASE SELECT A SHIPPING ADDRESS BEFORE PLACING ORDER.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }
                  if (!selectedPayment) {
                    alert("PLEASE SELECT A PAYMENT METHOD.");
                    return;
                  }
                  handlePlaceOrder();
                }}
                className="w-full py-5 bg-soxenly-green text-soxenly-cream font-display uppercase tracking-[0.2em] font-black text-sm border border-soxenly-beige hover:bg-white hover:text-soxenly-green transition-all disabled:opacity-50"
              >
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </button>
              
              <p className="text-[9px] font-display text-neutral-400 uppercase text-center mt-6 tracking-wider">
                By placing an order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-soxenly-green/60 backdrop-blur-sm" onClick={() => setShowAddressModal(false)}></div>
          <div className="relative bg-white border border-soxenly-beige w-full max-w-lg p-8 animate-slideUp">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-soxenly-beige">
              <h2 className="font-display text-xl font-black uppercase tracking-tighter">Add Shipping Address</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-2xl font-black hover:rotate-90 transition-transform">&times;</button>
            </div>

            {/* MAP PREVIEW */}
            <div className="w-full h-48 bg-neutral-100 border border-soxenly-beige mb-6 overflow-hidden">
               <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={addressForm.lat && addressForm.lng 
                  ? `https://maps.google.com/maps?q=${addressForm.lat},${addressForm.lng}&t=&z=17&ie=UTF8&iwloc=&output=embed`
                  : `https://maps.google.com/maps?q=${addressForm.city || 'India'}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                }
              ></iframe>
            </div>

            <div className="mb-6">
               <button 
                type="button"
                disabled={isSavingAddress}
                onClick={() => {
                  if (!("geolocation" in navigator)) {
                    alert("Geolocation is not supported by your browser.");
                    return;
                  }

                  const btn = document.activeElement;
                  const originalText = btn.innerHTML;
                  btn.innerHTML = '<span className="animate-spin mr-2">◌</span> Locating...';
                  btn.disabled = true;

                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const { latitude, longitude } = position.coords;
                      console.log("GPS Detected:", latitude, longitude);
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                          headers: { 'Accept-Language': 'en', 'User-Agent': 'ZhoozeStore' }
                        });
                        const data = await res.json();
                        if (data.address) {
                          const addr = data.address;
                          setAddressForm(prev => ({
                            ...prev,
                            house_name: addr.house_number || addr.building || addr.amenity || addr.office || addr.shop || "",
                            street: addr.road || addr.suburb || addr.neighbourhood || addr.city_district || "",
                            city: addr.city || addr.town || addr.village || addr.county || "",
                            state: addr.state || "",
                            pin: addr.postcode || "",
                            // Store coords for map
                            lat: latitude,
                            lng: longitude
                          }));
                        } else {
                          alert("Address details not found for this location.");
                        }
                      } catch (err) {
                        console.error("Geocode Error:", err);
                        alert("Could not detect address. Please enter manually.");
                      } finally {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                      }
                    },
                    async (error) => {
                      console.error("Geolocation Error:", error);
                      
                      // FALLBACK: IP-Based Location if GPS fails
                      if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
                        console.log("GPS failed, trying IP-based fallback...");
                        try {
                          const ipRes = await fetch("https://ipapi.co/json/");
                          const ipData = await ipRes.json();
                          if (ipData.city) {
                            setAddressForm(prev => ({
                              ...prev,
                              city: ipData.city || "",
                              state: ipData.region || "",
                              pin: ipData.postal || ""
                            }));
                            alert("Used IP-based location (less accurate). Please verify the details.");
                          } else {
                            alert("Could not detect location. Please enter manually.");
                          }
                        } catch (fallbackErr) {
                          alert("Location information is unavailable. Please enter manually.");
                        }
                      } else if (error.code === error.PERMISSION_DENIED) {
                        alert("Location access denied. Please enable it in your browser settings.");
                      } else {
                        alert("An unknown error occurred while detecting location.");
                      }

                      btn.innerHTML = originalText;
                      btn.disabled = false;
                    },
                    { 
                      enableHighAccuracy: true, 
                      timeout: 15000,
                      maximumAge: 0
                    }
                  );
                }}
                className="w-full flex items-center justify-center gap-3 py-3 border border-blue-600 text-blue-600 font-display text-[10px] uppercase font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,104a24,24,0,1,0,24,24A24,24,0,0,0,128,104Zm0,32a8,8,0,1,1,8-8A8,8,0,0,1,128,136Zm104-16H207.65a80.11,80.11,0,0,0-71.65-71.65V24a8,8,0,0,0-16,0V48.35A80.11,80.11,0,0,0,48.35,120H24a8,8,0,0,0,0,16H48.35a80.11,80.11,0,0,0,71.65,71.65V232a8,8,0,0,0,16,0V207.65a80.11,80.11,0,0,0,71.65-71.65H232a8,8,0,0,0,0-16Zm-104,72a64.07,64.07,0,0,1-64-64,64.07,64.07,0,0,1,64-64,64.07,64.07,0,0,1,64,64A64.07,64.07,0,0,1,128,192Z"></path></svg>
                 Use Current Location
               </button>
               <div className="flex items-center gap-4 my-4">
                 <div className="h-[1px] bg-neutral-200 flex-grow"></div>
                 <span className="text-[10px] font-display text-neutral-400 uppercase">Or enter manually</span>
                 <div className="h-[1px] bg-neutral-200 flex-grow"></div>
               </div>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-display text-[10px] uppercase font-bold tracking-widest">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                  className="w-full p-3 border border-soxenly-beige font-display text-sm focus:outline-none focus:bg-neutral-50 uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-display text-[10px] uppercase font-bold tracking-widest">House Name/No.</label>
                  <input 
                    required
                    type="text" 
                    value={addressForm.house_name}
                    onChange={(e) => setAddressForm({...addressForm, house_name: e.target.value})}
                    className="w-full p-3 border border-soxenly-beige font-display text-sm focus:outline-none focus:bg-neutral-50 uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-display text-[10px] uppercase font-bold tracking-widest">Street/Area</label>
                  <input 
                    required
                    type="text" 
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                    className="w-full p-3 border border-soxenly-beige font-display text-sm focus:outline-none focus:bg-neutral-50 uppercase"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-display text-[10px] uppercase font-bold tracking-widest">City</label>
                  <input 
                    required
                    type="text" 
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full p-3 border border-soxenly-beige font-display text-sm focus:outline-none focus:bg-neutral-50 uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-display text-[10px] uppercase font-bold tracking-widest">State</label>
                  <input 
                    required
                    type="text" 
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full p-3 border border-soxenly-beige font-display text-sm focus:outline-none focus:bg-neutral-50 uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-display text-[10px] uppercase font-bold tracking-widest">Pincode</label>
                  <input 
                    required
                    type="text" 
                    value={addressForm.pin}
                    onChange={(e) => setAddressForm({...addressForm, pin: e.target.value})}
                    className="w-full p-3 border border-soxenly-beige font-display text-sm focus:outline-none focus:bg-neutral-50 uppercase"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSavingAddress}
                className="w-full py-4 bg-soxenly-green text-soxenly-cream font-display uppercase tracking-widest font-black text-sm border border-soxenly-beige hover:bg-white hover:text-soxenly-green transition-all mt-4 disabled:opacity-50"
              >
                {isSavingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
