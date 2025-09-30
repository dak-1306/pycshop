import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SellerApp from "./SellerApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SellerApp />
  </StrictMode>
);
