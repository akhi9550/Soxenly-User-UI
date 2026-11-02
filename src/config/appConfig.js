/**
 * Application Configuration
 *
 * Controls whether mock data & mock API or live backend should be used.
 * Default is TRUE so that the frontend works 100% out-of-the-box on local dev
 * and when deployed to Vercel without a live backend.
 */

export const isMockEnabled = () => {
  // Check runtime override in localStorage if set
  if (typeof window !== "undefined") {
    const runtimeOverride = localStorage.getItem("soxenly_use_mock");
    if (runtimeOverride !== null) {
      return runtimeOverride === "true";
    }
  }

  // Check Vite environment variable: VITE_USE_MOCK
  const envMock = import.meta.env.VITE_USE_MOCK;
  if (envMock !== undefined) {
    return envMock === "true" || envMock === true;
  }

  // Default to true if not specified
  return true;
};

export const setMockEnabled = (enabled) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("soxenly_use_mock", enabled ? "true" : "false");
    window.location.reload();
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
