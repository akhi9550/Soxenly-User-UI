import mockData from "../data/mockData.json";
import { isMockEnabled } from "../config/appConfig";

/**
 * Soxenly Mock API Engine
 *
 * Intercepts network calls when VITE_USE_MOCK=true so the entire e-commerce
 * experience runs seamlessly on Vercel without requiring a live backend.
 */

// Storage Keys
const CART_KEY = "soxenly_cart";
const WISHLIST_KEY = "soxenly_wishlist";
const ORDERS_KEY = "soxenly_orders";
const ADDRESSES_KEY = "soxenly_addresses";
const USER_KEY = "soxenly_user";
const WALLET_KEY = "soxenly_wallet";

// Helper to safely read from localStorage
function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// Helper to safely write to localStorage
function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Dispatch storage event so other components / contexts update immediately
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Storage write error", e);
  }
}

// Initialize seed data if not present
function initializeMockStorage() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(CART_KEY)) {
    setStorage(CART_KEY, mockData.initialCart);
  }
  if (!localStorage.getItem(WISHLIST_KEY)) {
    setStorage(WISHLIST_KEY, mockData.initialWishlist);
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    setStorage(ORDERS_KEY, mockData.initialOrders);
  }
  if (!localStorage.getItem(ADDRESSES_KEY)) {
    setStorage(ADDRESSES_KEY, mockData.defaultAddresses);
  }
  if (!localStorage.getItem(USER_KEY)) {
    setStorage(USER_KEY, mockData.demoUser);
  }
  if (!localStorage.getItem(WALLET_KEY)) {
    setStorage(WALLET_KEY, mockData.wallet);
  }

  // Set default demo session so visitors on Vercel can immediately test all features
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "mock_jwt_token_soxenly_demo");
  }
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(mockData.demoUser));
  }
}

// Generate printable HTML invoice
function generateInvoiceHtml(order) {
  const orderDetails = order?.OrderDetails || {};
  const products = order?.OrderProductDetails || [];
  const orderId = orderDetails.OrderId || "1001";
  const finalPrice = orderDetails.FinalPrice || 0;
  const dateStr = orderDetails.CreatedAt
    ? new Date(orderDetails.CreatedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-IN");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${orderId} - Soxenly</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #faf8f5; color: #222; margin: 0; padding: 40px 20px; }
    .invoice-card { max-width: 700px; margin: 0 auto; background: #fff; border: 1px solid #e5dfd5; padding: 40px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2d4a3e; padding-bottom: 20px; }
    .brand { font-size: 24px; font-weight: 800; letter-spacing: 3px; color: #2d4a3e; }
    .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #5c7569; margin-top: 4px; }
    .meta { text-align: right; font-size: 13px; line-height: 1.6; }
    .meta strong { color: #2d4a3e; }
    .table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 14px; }
    .table th { background: #f4efe6; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #2d4a3e; }
    .table td { padding: 14px 12px; border-bottom: 1px solid #eee; }
    .total-box { margin-top: 25px; text-align: right; font-size: 15px; }
    .total-box .final { font-size: 24px; font-weight: 800; color: #2d4a3e; margin-top: 8px; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
    .print-btn { display: block; margin: 25px auto 0; background: #2d4a3e; color: #faf8f5; border: none; padding: 12px 30px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; border-radius: 2px; }
    .print-btn:hover { background: #3d6353; }
    @media print { .print-btn { display: none; } body { background: #fff; padding: 0; } .invoice-card { box-shadow: none; border: none; } }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand">SOXENLY</div>
        <div class="tagline">Engineered Comfort • Gentle on Earth</div>
      </div>
      <div class="meta">
        <div><strong>Tax Invoice</strong></div>
        <div>Order #: <strong>${orderId}</strong></div>
        <div>Date: ${dateStr}</div>
        <div>Payment: <strong>${orderDetails.PaymentStatus || "PAID"}</strong></div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (p) => `
          <tr>
            <td>
              <strong>${p.product_name}</strong>
            </td>
            <td style="text-align: center;">${p.quantity}</td>
            <td style="text-align: right;">₹${p.total_price}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="total-box">
      <div>Subtotal: ₹${finalPrice}</div>
      <div>Eco-Friendly Shipping: <strong>FREE</strong></div>
      <div class="final">Total: ₹${finalPrice}</div>
    </div>

    <button class="print-btn" onclick="window.print()">Print or Save as PDF</button>

    <div class="footer">
      Thank you for choosing Soxenly. Soft on You, Gentle on Earth.
    </div>
  </div>
</body>
</html>`;
}

// Build standard JSON response
function jsonResponse(data, statusCode = 200, message = "Success", error = null) {
  const body = {
    status_code: statusCode,
    message,
    data,
    error,
  };
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Primary Mock Request Dispatcher
 */
export async function handleMockRequest(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  // Normalize URL to extract path and search params
  let parsedUrl;
  try {
    parsedUrl = new URL(url, window.location.origin);
  } catch (e) {
    parsedUrl = new URL(url, "http://localhost");
  }

  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // Small network delay simulation (40-90ms) for realistic feel without lag
  await new Promise((r) => setTimeout(r, 50));

  // 1. GET /user/category
  if (pathname === "/user/category") {
    return jsonResponse(mockData.categories);
  }

  // 2. GET /user/banner
  if (pathname === "/user/banner") {
    return jsonResponse(mockData.banners);
  }

  // 3. GET /user/products/new
  if (pathname === "/user/products/new") {
    const count = parseInt(searchParams.get("count")) || 4;
    const latest = mockData.products.slice(0, count);
    return jsonResponse(latest);
  }

  // 4. GET /user/products/details
  if (pathname === "/user/products/details") {
    const id = parseInt(searchParams.get("id"));
    const product = mockData.products.find((p) => p.id === id) || mockData.products[0];
    return jsonResponse(product);
  }

  // 5. GET /user/products
  if (pathname === "/user/products") {
    const categoryFilter = searchParams.get("category");
    let list = [...mockData.products];
    if (categoryFilter && categoryFilter.toLowerCase() !== "all") {
      list = list.filter(
        (p) => p.category_name.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    const count = parseInt(searchParams.get("count"));
    if (count && count > 0) {
      list = list.slice(0, count);
    }
    return jsonResponse(list);
  }

  // 6. CART: GET /user/cart
  if (pathname === "/user/cart" && method === "GET") {
    const cart = getStorage(CART_KEY, mockData.initialCart);
    const totalPrice = cart.reduce((sum, item) => sum + (item.total_price || 0), 0);
    return jsonResponse({
      Cart: cart,
      TotalPrice: totalPrice,
    });
  }

  // 7. CART: POST /user/cart (Add item)
  if (pathname === "/user/cart" && method === "POST") {
    const productId = parseInt(searchParams.get("product_id"));
    const size = searchParams.get("size") || "M";
    const quantity = parseInt(searchParams.get("quantity")) || 1;

    const product = mockData.products.find((p) => p.id === productId) || mockData.products[0];
    const cart = getStorage(CART_KEY, []);

    const existingIndex = cart.findIndex(
      (item) => item.product_id === productId && item.size === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      cart[existingIndex].total_price = cart[existingIndex].quantity * cart[existingIndex].unit_price;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        size: size,
        quantity: quantity,
        unit_price: product.price,
        total_price: product.price * quantity,
        image: product.image[0],
      });
    }

    setStorage(CART_KEY, cart);
    return jsonResponse(cart, 200, "Item added to cart successfully");
  }

  // 8. CART: DELETE /user/cart (Remove single item)
  if (pathname === "/user/cart" && method === "DELETE") {
    const productId = parseInt(searchParams.get("product_id"));
    const size = searchParams.get("size");

    let cart = getStorage(CART_KEY, []);
    cart = cart.filter((item) => !(item.product_id === productId && item.size === size));
    setStorage(CART_KEY, cart);
    return jsonResponse(cart, 200, "Item removed from cart");
  }

  // 9. CART: DELETE /user/cart/empty (Clear entire cart)
  if (pathname === "/user/cart/empty" && method === "DELETE") {
    setStorage(CART_KEY, []);
    return jsonResponse([], 200, "Cart cleared successfully");
  }

  // 10. CART: PUT /user/cart/updatequantityadd
  if (pathname === "/user/cart/updatequantityadd" && method === "PUT") {
    const productId = parseInt(searchParams.get("product_id"));
    const size = searchParams.get("size");

    const cart = getStorage(CART_KEY, []);
    const item = cart.find(
      (i) => i.product_id === productId && i.size === size
    );
    if (item) {
      item.quantity += 1;
      item.total_price = item.quantity * item.unit_price;
      setStorage(CART_KEY, cart);
    }
    return jsonResponse(cart, 200, "Quantity updated");
  }

  // 11. CART: PUT /user/cart/updatequantityless
  if (pathname === "/user/cart/updatequantityless" && method === "PUT") {
    const productId = parseInt(searchParams.get("product_id"));
    const size = searchParams.get("size");

    let cart = getStorage(CART_KEY, []);
    const item = cart.find(
      (i) => i.product_id === productId && i.size === size
    );
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart = cart.filter((i) => !(i.product_id === productId && i.size === size));
      } else {
        item.total_price = item.quantity * item.unit_price;
      }
      setStorage(CART_KEY, cart);
    }
    return jsonResponse(cart, 200, "Quantity updated");
  }

  // 12. WISHLIST: GET /user/wishlist
  if (pathname === "/user/wishlist" && method === "GET") {
    const wishlist = getStorage(WISHLIST_KEY, mockData.initialWishlist);
    return jsonResponse(wishlist);
  }

  // 13. WISHLIST: POST /user/wishlist (Add to wishlist)
  if (pathname === "/user/wishlist" && method === "POST") {
    const productId = parseInt(searchParams.get("product_id") || searchParams.get("id"));
    const product = mockData.products.find((p) => p.id === productId);

    const wishlist = getStorage(WISHLIST_KEY, []);
    if (product && !wishlist.some((w) => w.id === product.id)) {
      wishlist.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discounted_price: product.discounted_price,
        category_name: product.category_name,
        image: product.image,
      });
      setStorage(WISHLIST_KEY, wishlist);
    }
    return jsonResponse(wishlist, 200, "Added to wishlist");
  }

  // 14. WISHLIST: DELETE /user/wishlist
  if (pathname === "/user/wishlist" && method === "DELETE") {
    const id = parseInt(searchParams.get("id"));
    let wishlist = getStorage(WISHLIST_KEY, []);
    wishlist = wishlist.filter((item) => item.id !== id);
    setStorage(WISHLIST_KEY, wishlist);
    return jsonResponse(wishlist, 200, "Removed from wishlist");
  }

  // 15. CHECKOUT: GET /user/checkout
  if (pathname === "/user/checkout" && method === "GET") {
    const addresses = getStorage(ADDRESSES_KEY, mockData.defaultAddresses);
    const cart = getStorage(CART_KEY, mockData.initialCart);
    const totalPrice = cart.reduce((sum, item) => sum + (item.total_price || 0), 0);

    return jsonResponse({
      AddressInfoResponse: addresses,
      Payment_Method: mockData.paymentMethods,
      Cart: cart,
      Total_Price: totalPrice,
    });
  }

  // 16. ADDRESS: POST /user/address
  if (pathname === "/user/address" && method === "POST") {
    let payload = {};
    try {
      payload = typeof options.body === "string" ? JSON.parse(options.body) : options.body || {};
    } catch (e) {}

    const addresses = getStorage(ADDRESSES_KEY, mockData.defaultAddresses);
    const newAddr = {
      id: Date.now(),
      name: payload.name || "Akhil Kumar",
      house_name: payload.house_name || "",
      street: payload.street || "",
      city: payload.city || "Bengaluru",
      state: payload.state || "Karnataka",
      pin: payload.pin || "560038",
    };
    addresses.push(newAddr);
    setStorage(ADDRESSES_KEY, addresses);
    return jsonResponse(addresses, 200, "Address saved successfully");
  }

  // 17. ADDRESS: GET /user/address
  if (pathname === "/user/address" && method === "GET") {
    const addresses = getStorage(ADDRESSES_KEY, mockData.defaultAddresses);
    return jsonResponse(addresses);
  }

  // 18. CHECKOUT: POST /user/checkout (Create order)
  if (pathname === "/user/checkout" && method === "POST") {
    const cart = getStorage(CART_KEY, []);
    const finalPrice = cart.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const newOrderId = Math.floor(1000 + Math.random() * 9000);

    const orders = getStorage(ORDERS_KEY, mockData.initialOrders);
    const newOrder = {
      OrderDetails: {
        OrderId: newOrderId,
        PaymentStatus: "Paid",
        ShipmentStatus: "Order Placed",
        FinalPrice: finalPrice > 0 ? finalPrice : 798,
        CreatedAt: new Date().toISOString(),
      },
      OrderProductDetails: cart.length > 0 ? cart.map((c) => ({
        product_id: c.product_id,
        product_name: c.product_name,
        quantity: c.quantity,
        total_price: c.total_price,
        image_url: c.image,
      })) : [
        {
          product_id: 1,
          product_name: "The Essential Crew - Forest Olive",
          quantity: 2,
          total_price: 798,
          image_url: "/socks/sock-01.webp",
        }
      ],
    };

    orders.unshift(newOrder);
    setStorage(ORDERS_KEY, orders);

    return jsonResponse({ order_id: newOrderId }, 200, "Order initialized");
  }

  // 19. ORDER: GET /user/order/place-order
  if (pathname.startsWith("/user/order/place-order")) {
    const orderId = searchParams.get("order_id") || "1001";
    // Returns link including razorpay as expected by frontend
    const link = `https://checkout.razorpay.com/pay?order_id=${orderId}`;
    return jsonResponse(link, 200, "Placed Order with razor pay following link");
  }

  // 19b. PAYMENT STATUS: GET /user/update_status
  if (pathname === "/user/update_status") {
    const orderId = parseInt(searchParams.get("order_id"));
    const orders = getStorage(ORDERS_KEY, []);
    const found = orders.find((o) => o.OrderDetails?.OrderId === orderId);
    if (found) {
      found.OrderDetails.PaymentStatus = "Paid";
      setStorage(ORDERS_KEY, orders);
    }
    // Also ensure cart is cleared
    setStorage(CART_KEY, []);
    return jsonResponse({ status: "success" }, 200, "Payment verified");
  }

  // 20. ORDERS: GET /user/order
  if (pathname === "/user/order" && method === "GET") {
    const orders = getStorage(ORDERS_KEY, mockData.initialOrders);
    return jsonResponse(orders);
  }

  // 21. ORDER: PUT /user/order (Cancel Order)
  if (pathname === "/user/order" && method === "PUT") {
    const orderId = parseInt(searchParams.get("id"));
    const orders = getStorage(ORDERS_KEY, []);
    const found = orders.find((o) => o.OrderDetails?.OrderId === orderId);
    if (found) {
      found.OrderDetails.ShipmentStatus = "Cancelled";
      setStorage(ORDERS_KEY, orders);
    }
    return jsonResponse(orders, 200, "Order cancelled");
  }

  // 22. INVOICE: GET /user/checkout/print
  if (pathname === "/user/checkout/print") {
    const orderId = parseInt(searchParams.get("order_id"));
    const orders = getStorage(ORDERS_KEY, mockData.initialOrders);
    const order = orders.find((o) => o.OrderDetails?.OrderId === orderId) || orders[0];
    const html = generateInvoiceHtml(order);

    const blob = new Blob([html], { type: "text/html" });
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="invoice_${orderId}.html"`,
      },
    });
  }

  // 23. USER PROFILE: GET /user/users
  if (pathname === "/user/users" && method === "GET") {
    const user = getStorage(USER_KEY, mockData.demoUser);
    return jsonResponse(user);
  }

  // 24. USER PROFILE: PUT / POST /user/users (Update Profile)
  if ((pathname === "/user/users" || pathname === "/user/users/changepassword") && (method === "PUT" || method === "POST")) {
    let payload = {};
    try {
      payload = typeof options.body === "string" ? JSON.parse(options.body) : options.body || {};
    } catch (e) {}

    const user = getStorage(USER_KEY, mockData.demoUser);
    const updated = { ...user, ...payload };
    setStorage(USER_KEY, updated);
    localStorage.setItem("user", JSON.stringify(updated));
    return jsonResponse(updated, 200, "Profile updated successfully");
  }

  // 25. WALLET: GET /user/wallet
  if (pathname === "/user/wallet" && method === "GET") {
    const wallet = getStorage(WALLET_KEY, mockData.wallet);
    return jsonResponse(wallet);
  }

  // 26. AUTH: POST /user/login
  if (pathname === "/user/login" && method === "POST") {
    let body = {};
    try {
      body = typeof options.body === "string" ? JSON.parse(options.body) : options.body || {};
    } catch (e) {}

    const user = {
      id: 1,
      firstname: body.email ? body.email.split("@")[0] : "Akhil",
      lastname: "Kumar",
      email: body.email || "akhil@soxenly.com",
      phone: "+91 98765 43210",
    };

    localStorage.setItem("token", "mock_jwt_token_soxenly");
    localStorage.setItem("user", JSON.stringify(user));
    setStorage(USER_KEY, user);

    return jsonResponse({
      AccessToken: "mock_jwt_token_soxenly",
      Users: user,
    });
  }

  // 27. AUTH: POST /user/signup
  if (pathname === "/user/signup" && method === "POST") {
    let body = {};
    try {
      body = typeof options.body === "string" ? JSON.parse(options.body) : options.body || {};
    } catch (e) {}

    const user = {
      id: Date.now(),
      firstname: body.firstname || "Akhil",
      lastname: body.lastname || "Kumar",
      email: body.email || "akhil@soxenly.com",
      phone: body.phone || "+919876543210",
    };

    localStorage.setItem("token", "mock_jwt_token_soxenly");
    localStorage.setItem("user", JSON.stringify(user));
    setStorage(USER_KEY, user);

    return jsonResponse({
      AccessToken: "mock_jwt_token_soxenly",
      Users: user,
    });
  }

  // 28. AUTH: POST /user/google-login
  if (pathname === "/user/google-login" && method === "POST") {
    const user = mockData.demoUser;
    localStorage.setItem("token", "mock_jwt_token_google");
    localStorage.setItem("user", JSON.stringify(user));
    return jsonResponse({
      AccessToken: "mock_jwt_token_google",
      Users: user,
    });
  }

  // 29. ADMIN: POST /admin/adminlogin
  if (pathname === "/admin/adminlogin") {
    return jsonResponse({
      Token: "mock_admin_token",
      Admin: { email: "admin@soxenly.com" },
    });
  }

  // 30. ADMIN: GET /admin/dashboard
  if (pathname === "/admin/dashboard") {
    return jsonResponse({
      total_sales: 148500,
      total_orders: 412,
      total_customers: 289,
      products_count: mockData.products.length,
    });
  }

  // Fallback for any other /user/ route
  return jsonResponse({}, 200, "Mock response");
}

/**
 * Installs transparent mock fetch interceptor
 */
export function setupMockApi() {
  if (typeof window === "undefined") return;

  initializeMockStorage();

  const originalFetch = window.fetch;

  window.fetch = async function (input, init) {
    if (!isMockEnabled()) {
      return originalFetch.apply(this, arguments);
    }

    let urlString = "";
    if (typeof input === "string") {
      urlString = input;
    } else if (input instanceof URL) {
      urlString = input.href;
    } else if (input && input.url) {
      urlString = input.url;
    }

    // Check if this is an API call meant for the backend (/user/ or /admin/)
    const isApiCall =
      urlString.includes("/user/") ||
      urlString.includes("/admin/") ||
      urlString.startsWith("/user") ||
      urlString.startsWith("/admin");

    if (isApiCall) {
      try {
        return await handleMockRequest(urlString, init);
      } catch (err) {
        console.error("Mock API Dispatch Error:", err);
        return jsonResponse(null, 500, "Mock API Error", err.message);
      }
    }

    // Pass through non-API calls (e.g. static assets, images, external fonts)
    return originalFetch.apply(this, arguments);
  };

  console.info("⚡ Soxenly Mock API is ACTIVE (VITE_USE_MOCK=true). All operations work standalone.");
}
