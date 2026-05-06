import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderToCancel, setOrderToCancel] = useState(null);

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/order?id=${orderId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setOrderToCancel(null);
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel error", err);
    }
  };

  const handleViewInvoice = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/checkout/print?order_id=${orderId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      } else {
        const errData = await response.json();
        const detailedError = errData.error || errData.message || 'Server error';
        alert(`Failed to retrieve invoice: ${detailedError}`);
      }
    } catch (err) {
      console.error("Invoice view error", err);
      alert("An unexpected error occurred while trying to view the invoice.");
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/order`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (response.ok && data.data) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch error", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-display uppercase tracking-widest text-soxenly-green animate-pulse">Synchronizing...</div>;
  }

  return (
    <div className="bg-soxenly-cream min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 py-24">
        <h1 className="font-serif text-4xl lg:text-5xl text-soxenly-green border-b border-soxenly-beige pb-8 mb-12">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-32 border border-soxenly-beige bg-white shadow-sm">
            <p className="font-display uppercase tracking-widest text-soxenly-charcoal/60 mb-8 font-bold">No orders found</p>
            <Link to="/shop" className="inline-block bg-soxenly-green text-soxenly-cream px-10 py-4 font-display uppercase tracking-widest text-xs font-bold hover:bg-soxenly-leaf transition-all duration-300">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto bg-white border border-soxenly-beige shadow-sm overflow-x-auto">
            <div className="min-w-[800px] hidden md:grid grid-cols-[80px_1fr_1fr_100px_320px] gap-4 px-8 py-4 bg-soxenly-cream border-b border-soxenly-beige font-display text-[10px] uppercase font-bold text-soxenly-charcoal tracking-widest">
              <span>Reference</span>
              <span>Items</span>
              <span>Status</span>
              <span className="text-right">Total</span>
              <span className="text-right">Actions</span>
            </div>
            
            <div className="min-w-[800px] divide-y divide-soxenly-beige">
              {orders.map((fullOrder) => {
                const { OrderDetails: order, OrderProductDetails: products } = fullOrder;
                const isPaid = order.PaymentStatus.toLowerCase() === 'paid';
                return (
                  <div key={order.OrderId} className="px-8 py-6 flex flex-col md:grid md:grid-cols-[80px_1fr_1fr_100px_320px] md:gap-4 md:items-center hover:bg-soxenly-cream/50 transition-colors">
                    <div>
                      <span className="md:hidden font-display text-[9px] uppercase tracking-widest text-soxenly-charcoal/60 block mb-1">Ref</span>
                      <span className="font-serif text-lg text-soxenly-green">#{order.OrderId}</span>
                    </div>
                    <div>
                      <span className="md:hidden font-display text-[9px] uppercase tracking-widest text-soxenly-charcoal/60 block mb-1">Purchased</span>
                      <span className="font-display text-[11px] text-soxenly-charcoal/80 uppercase tracking-wide">{products?.length || 0} Items</span>
                    </div>
                    <div>
                      <span className="md:hidden font-display text-[9px] uppercase tracking-widest text-soxenly-charcoal/60 block mb-1">Status</span>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-soxenly-leaf' : 'bg-red-400'}`}></span>
                          <span className={`font-display text-[10px] uppercase font-bold tracking-widest ${isPaid ? 'text-soxenly-leaf' : 'text-red-500'}`}>{order.PaymentStatus}</span>
                        </div>
                        <span className="font-display text-[9px] uppercase tracking-widest text-soxenly-charcoal/60">{order.ShipmentStatus}</span>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <span className="md:hidden font-display text-[9px] uppercase tracking-widest text-soxenly-charcoal/60 block mb-1">Amount</span>
                      <span className="font-display tabular-nums text-lg text-soxenly-green font-bold">{formatCurrency(order.FinalPrice)}</span>
                    </div>
                    <div className="flex gap-2 md:justify-end mt-4 md:mt-0">
                      <button onClick={() => setSelectedOrder(fullOrder)} className="flex-1 md:flex-none px-4 py-2 border border-soxenly-green text-soxenly-green text-[10px] font-display tracking-widest uppercase font-bold hover:bg-soxenly-green hover:text-soxenly-cream transition-all duration-300">Details</button>
                      {order.ShipmentStatus.toLowerCase() === 'order placed' && (
                        <button 
                          onClick={() => setOrderToCancel(order.OrderId)} 
                          className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 text-[10px] font-display tracking-widest uppercase font-bold hover:bg-red-50 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      )}
                      <button onClick={() => handleViewInvoice(order.OrderId)} className="flex-1 md:flex-none px-4 py-2 bg-soxenly-green text-soxenly-cream text-[10px] font-display tracking-widest uppercase font-bold hover:bg-soxenly-leaf transition-all duration-300">Invoice</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
            <div className="relative bg-white border border-soxenly-beige shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-soxenly-beige p-6 flex justify-between items-center">
                <h2 className="font-serif text-3xl text-soxenly-green">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-soxenly-charcoal/40 hover:text-soxenly-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                </button>
              </div>
              <div className="p-8 space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-widest text-soxenly-charcoal/60 font-bold mb-2">Reference</p>
                    <p className="font-serif text-2xl text-soxenly-green">#{selectedOrder.OrderDetails.OrderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[10px] uppercase tracking-widest text-soxenly-charcoal/60 font-bold mb-2">Payment</p>
                    <p className={`font-display tracking-widest text-xs uppercase px-3 py-1 inline-block font-bold ${selectedOrder.OrderDetails.PaymentStatus.toLowerCase() === 'paid' ? 'bg-soxenly-cream text-soxenly-leaf' : 'bg-red-50 text-red-600'}`}>{selectedOrder.OrderDetails.PaymentStatus}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="font-display tracking-widest text-[10px] uppercase text-soxenly-charcoal/60 font-bold border-b border-soxenly-beige pb-4">Order Items</p>
                  <div className="space-y-4">
                    {selectedOrder.OrderProductDetails.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center py-3 border-b border-soxenly-beige last:border-0">
                        <div className="w-16 h-16 bg-soxenly-cream flex-shrink-0 border border-soxenly-beige overflow-hidden">
                          {item.image_url ? (
                            <img 
                              src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_BASE_URL}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`} 
                              alt={item.product_name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-soxenly-charcoal/40 font-display uppercase tracking-widest">NO IMG</div>
                          )}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <p className="font-serif text-lg text-soxenly-green leading-none">{item.product_name}</p>
                          <p className="font-display text-[10px] tracking-widest text-soxenly-charcoal/60 uppercase">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-display tabular-nums font-bold text-lg text-soxenly-green">{formatCurrency(item.total_price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-soxenly-cream p-8 border border-soxenly-beige space-y-4">
                  <div className="flex justify-between font-display text-sm uppercase">
                    <span className="text-soxenly-charcoal/60 font-bold tracking-widest">Total</span>
                    <span className="font-display tabular-nums font-bold text-3xl text-soxenly-green">{formatCurrency(selectedOrder.OrderDetails.FinalPrice)}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleViewInvoice(selectedOrder.OrderDetails.OrderId)} className="flex-1 bg-soxenly-green text-soxenly-cream py-4 font-display text-xs uppercase font-bold tracking-widest hover:bg-soxenly-leaf transition-all duration-300">View Invoice</button>
                  {selectedOrder.OrderDetails.ShipmentStatus.toLowerCase() === 'order placed' && (
                    <button 
                      onClick={() => {
                        setOrderToCancel(selectedOrder.OrderDetails.OrderId);
                        setSelectedOrder(null);
                      }} 
                      className="flex-1 bg-white border border-red-200 text-red-600 py-4 font-display text-xs uppercase font-bold tracking-widest hover:bg-red-50 transition-all duration-300"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CLEAN CANCELLATION MODAL */}
        {orderToCancel && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOrderToCancel(null)}></div>
            <div className="bg-white rounded-sm w-full max-w-sm relative z-10 p-8 text-center shadow-2xl border border-soxenly-beige">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-soxenly-green mb-2">Cancel Order?</h3>
              <p className="text-sm text-soxenly-charcoal/70 mb-8 leading-relaxed">
                Are you sure you want to cancel order <span className="font-bold text-soxenly-green">#{orderToCancel}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setOrderToCancel(null)}
                  className="flex-1 px-4 py-4 bg-soxenly-cream text-soxenly-green border border-soxenly-beige font-display text-xs uppercase tracking-widest hover:bg-soxenly-beige transition-all duration-300"
                >
                  No, Keep
                </button>
                <button 
                  onClick={() => handleCancelOrder(orderToCancel)}
                  className="flex-1 px-4 py-4 bg-red-600 text-white font-display text-xs uppercase tracking-widest hover:bg-red-700 transition-all duration-300 shadow-md shadow-red-200"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
