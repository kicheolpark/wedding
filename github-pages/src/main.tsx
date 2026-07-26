import React from "react";
import { createRoot } from "react-dom/client";
import "../../app/globals.css";
import { WeddingInvitation } from "../../app/wedding-invitation";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WeddingInvitation />
  </React.StrictMode>,
);
