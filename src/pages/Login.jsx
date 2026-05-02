import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        localStorage.setItem("token", data.data.AccessToken);
        localStorage.setItem("user", JSON.stringify(data.data.Users));
        navigate("/");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.data.AccessToken);
        localStorage.setItem("user", JSON.stringify(data.data.Users));
        navigate("/");
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-[70vh] flex items-center justify-center px-4 py-12"
        data-testid="login-page"
      >
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-md border border-soxenly-beige p-8 bg-white"
        >
          <span className="text-xs font-display uppercase tracking-[0.25em]">
            /// Access
          </span>
          <h1 className="font-serif text-4xl text-soxenly-green mb-6">Sign in</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-[red-600] text-soxenly-cream font-display text-xs border border-soxenly-beige">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">
                Email
              </label>
              <input
                required
                className="w-full border border-soxenly-beige px-4 py-3 text-sm font-display focus:outline-none focus:bg-neutral-50"
                data-testid="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-display uppercase tracking-[0.25em] font-bold mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  className="w-full border border-soxenly-beige px-4 py-3 text-sm font-display focus:outline-none focus:bg-neutral-50 pr-10"
                  data-testid="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-soxenly-green hover:text-[red-600] focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-soxenly-green text-soxenly-cream mt-6 py-4 uppercase text-sm tracking-[0.25em] font-display font-bold hover:bg-[red-600] disabled:opacity-50 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            data-testid="login-submit"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
          
          <div className="my-6 flex items-center justify-center">
            <div className="w-full h-[1px] bg-soxenly-beige"></div>
            <span className="px-4 text-xs font-display uppercase tracking-widest text-soxenly-charcoal/40">Or</span>
            <div className="w-full h-[1px] bg-soxenly-beige"></div>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign In failed.")}
              shape="rectangular"
              text="signin_with"
            />
          </div>
          
          <p className="text-xs font-display mt-6 text-center">
            New here?{" "}
            <Link
              className="underline font-bold hover:text-[red-600]"
              data-testid="signup-link"
              to="/signup"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
