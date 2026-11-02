import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { setupMockApi } from "./mock/mockApi";

// Initialize mock API engine if mock mode is active
setupMockApi();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
