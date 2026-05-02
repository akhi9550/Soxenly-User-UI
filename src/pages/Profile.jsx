import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: ""
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    password: "",
    re_password: ""
  });

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    house_name: "",
    street: "",
    city: "",
    state: "",
    pin: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch User Details
      const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      if (userRes.ok && userData.data) {
        setUser(userData.data);
        setProfileForm({
          firstname: userData.data.firstname || "",
          lastname: userData.data.lastname || "",
          email: userData.data.email || "",
          phone: userData.data.phone || ""
        });
      }

      // Fetch Addresses
      const addrRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/address`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const addrData = await addrRes.json();
      if (addrRes.ok) {
        setAddresses(addrData.data || []);
      }

      // Fetch Wallet
      const walletRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const walletData = await walletRes.json();
      if (walletRes.ok && walletData.data) {
        setWallet(walletData.data.amount || 0);
      }
    } catch (err) {
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        fetchData();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/users/changepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });
      if (res.ok) {
        setSuccess("Password changed successfully!");
        setPasswordForm({ old_password: "", password: "", re_password: "" });
      } else {
        const data = await res.json();
        setError(data.message || "Failed to change password.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const url = editAddressId 
      ? `${import.meta.env.VITE_API_BASE_URL}/user/address?address_id=${editAddressId}`
      : `${import.meta.env.VITE_API_BASE_URL}/user/address`;
    const method = editAddressId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });
      if (res.ok) {
        setSuccess(editAddressId ? "Address updated!" : "Address added!");
        setShowAddressForm(false);
        setEditAddressId(null);
        setAddressForm({ name: "", house_name: "", street: "", city: "", state: "", pin: "" });
        fetchData();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save address.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/address?address_id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("Address deleted!");
        fetchData();
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-display text-sm uppercase tracking-widest text-soxenly-green">Loading...</div>;

  return (
    <div className="bg-soxenly-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl lg:text-5xl text-soxenly-green mb-8">My Account</h1>
        
        {error && <div className="mb-6 p-4 bg-[red-50] text-[red-600] border border-[red-200] font-display text-xs">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 font-display text-xs">{success}</div>}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile Info" },
                { id: "addresses", label: "Addresses" },
                { id: "wallet", label: "Wallet" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setError(""); setSuccess(""); }}
                  className={`w-full text-left px-6 py-4 font-display uppercase tracking-widest text-xs font-bold transition-colors ${
                    activeTab === tab.id 
                      ? "bg-soxenly-green text-soxenly-cream" 
                      : "bg-white text-soxenly-charcoal hover:bg-soxenly-beige"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => navigate("/orders")}
                className="w-full text-left px-6 py-4 font-display uppercase tracking-widest text-xs font-bold bg-white text-soxenly-charcoal hover:bg-soxenly-beige transition-colors"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="w-full text-left px-6 py-4 font-display uppercase tracking-widest text-xs font-bold text-[red-600] bg-red-50 mt-4 hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 bg-white p-8 lg:p-12 border border-soxenly-beige">
            
            {activeTab === "profile" && (
              <div className="space-y-12">
                <section>
                  <h2 className="font-serif text-2xl text-soxenly-green mb-6 border-b border-soxenly-beige pb-4">Personal Details</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">First Name</label>
                        <input className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none" value={profileForm.firstname} onChange={e => setProfileForm({...profileForm, firstname: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Last Name</label>
                        <input className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none" value={profileForm.lastname} onChange={e => setProfileForm({...profileForm, lastname: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Email</label>
                      <input className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none bg-neutral-100" value={profileForm.email} readOnly disabled />
                    </div>
                    <div>
                      <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Phone</label>
                      <input className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                    </div>
                    <button type="submit" className="bg-soxenly-green text-soxenly-cream px-8 py-3 uppercase text-xs tracking-[0.25em] font-display font-bold hover:bg-soxenly-leaf transition-colors">Update Details</button>
                  </form>
                </section>

                <section>
                  <h2 className="font-serif text-2xl text-soxenly-green mb-6 border-b border-soxenly-beige pb-4">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Current Password</label>
                      <input type="password" required className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none" value={passwordForm.old_password} onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">New Password</label>
                        <input type="password" required className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none" value={passwordForm.password} onChange={e => setPasswordForm({...passwordForm, password: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Confirm Password</label>
                        <input type="password" required className="w-full border border-soxenly-beige px-4 py-3 text-sm focus:outline-none" value={passwordForm.re_password} onChange={e => setPasswordForm({...passwordForm, re_password: e.target.value})} />
                      </div>
                    </div>
                    <button type="submit" className="bg-soxenly-charcoal text-white px-8 py-3 uppercase text-xs tracking-[0.25em] font-display font-bold hover:bg-black transition-colors">Update Password</button>
                  </form>
                </section>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-between items-end mb-6 border-b border-soxenly-beige pb-4">
                  <h2 className="font-serif text-2xl text-soxenly-green">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button 
                      onClick={() => { setShowAddressForm(true); setEditAddressId(null); setAddressForm({name:"", house_name:"", street:"", city:"", state:"", pin:""}); }}
                      className="text-xs font-display uppercase tracking-widest font-bold text-soxenly-leaf hover:text-soxenly-green underline"
                    >
                      + Add New
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit} className="space-y-4 bg-soxenly-cream p-6 border border-soxenly-beige mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Name</label><input required className="w-full border border-soxenly-beige px-4 py-2 text-sm focus:outline-none" value={addressForm.name} onChange={e=>setAddressForm({...addressForm, name:e.target.value})} /></div>
                      <div><label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">House Name</label><input required className="w-full border border-soxenly-beige px-4 py-2 text-sm focus:outline-none" value={addressForm.house_name} onChange={e=>setAddressForm({...addressForm, house_name:e.target.value})} /></div>
                      <div className="md:col-span-2"><label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">Street</label><input className="w-full border border-soxenly-beige px-4 py-2 text-sm focus:outline-none" value={addressForm.street} onChange={e=>setAddressForm({...addressForm, street:e.target.value})} /></div>
                      <div><label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">City</label><input className="w-full border border-soxenly-beige px-4 py-2 text-sm focus:outline-none" value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city:e.target.value})} /></div>
                      <div><label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">State</label><input required className="w-full border border-soxenly-beige px-4 py-2 text-sm focus:outline-none" value={addressForm.state} onChange={e=>setAddressForm({...addressForm, state:e.target.value})} /></div>
                      <div><label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">PIN Code</label><input required className="w-full border border-soxenly-beige px-4 py-2 text-sm focus:outline-none" value={addressForm.pin} onChange={e=>setAddressForm({...addressForm, pin:e.target.value})} /></div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button type="submit" className="bg-soxenly-green text-soxenly-cream px-6 py-2 uppercase text-xs tracking-widest font-display font-bold">Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="border border-soxenly-charcoal px-6 py-2 uppercase text-xs tracking-widest font-display font-bold hover:bg-neutral-100">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length === 0 ? (
                      <p className="text-soxenly-charcoal/60 text-sm">No addresses saved yet.</p>
                    ) : (
                      addresses.map(addr => (
                        <div key={addr.id} className="border border-soxenly-beige p-6 flex flex-col justify-between">
                          <div className="mb-4">
                            <h3 className="font-bold font-display uppercase tracking-wider text-sm mb-2">{addr.name}</h3>
                            <p className="text-sm text-soxenly-charcoal/70">{addr.house_name}, {addr.street}</p>
                            <p className="text-sm text-soxenly-charcoal/70">{addr.city}, {addr.state} {addr.pin}</p>
                          </div>
                          <div className="flex gap-4 border-t border-soxenly-beige pt-4">
                            <button onClick={() => { setAddressForm(addr); setEditAddressId(addr.id); setShowAddressForm(true); }} className="text-xs font-display uppercase tracking-widest font-bold text-soxenly-green hover:underline">Edit</button>
                            <button onClick={() => deleteAddress(addr.id)} className="text-xs font-display uppercase tracking-widest font-bold text-[red-600] hover:underline">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wallet" && (
              <div>
                <h2 className="font-serif text-2xl text-soxenly-green mb-6 border-b border-soxenly-beige pb-4">My Wallet</h2>
                <div className="bg-soxenly-green p-8 text-center text-soxenly-cream max-w-sm mx-auto shadow-sm">
                  <span className="text-xs font-display uppercase tracking-widest opacity-80 block mb-2">Available Balance</span>
                  <h3 className="font-serif text-5xl">₹{wallet.toFixed(2)}</h3>
                  <p className="text-xs font-display opacity-60 mt-4">Use this balance securely during checkout.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
