"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

export function CrispChat() {
  useEffect(() => {
    // Prevent multiple initializations
    if (window.$crisp) return;
    
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "894b5955-b05e-457d-b572-d374a5a23462";
    
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
  }, []);

  return null;
}
