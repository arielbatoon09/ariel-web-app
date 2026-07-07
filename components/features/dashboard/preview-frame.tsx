"use client";

import * as React from "react";
import { createPortal } from "react-dom";

interface PreviewFrameProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  children: React.ReactNode;
}

export function PreviewFrame({ children, className, ...props }: PreviewFrameProps) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);

  const setIframeRef = React.useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;
    if (!node || !node.contentWindow) return;
    const doc = node.contentWindow.document;

    // Copy all classes and CSS variables from parent document elements to iframe elements
    const updateTheme = () => {
      doc.documentElement.className = document.documentElement.className;
      doc.body.className = document.body.className + " !bg-transparent";
    };

    // Initial theme set
    updateTheme();

    // Copy style and link elements from parent document head to iframe head
    const headEl = doc.head;
    while (headEl.firstChild) headEl.removeChild(headEl.firstChild);

    // Copy stylesheets
    document.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => {
      headEl.appendChild(el.cloneNode(true));
    });

    // Add a base style to make sure overflow works inside the frame body
    const baseStyle = doc.createElement("style");
    baseStyle.textContent = `
      body {
        margin: 0;
        padding: 0;
        background-color: transparent;
      }
      /* Custom scrollbar matching dashboard */
      ::-webkit-scrollbar {
        width: 4px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #88888840;
        border-radius: 9999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #88888880;
      }
    `;
    headEl.appendChild(baseStyle);

    // Prevent navigation for all anchor/link tags inside the iframe preview
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    doc.addEventListener("click", handleLinkClick, true);

    // Listen to theme mutations on parent document element
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    setMountNode(doc.body);

    return () => {
      doc.removeEventListener("click", handleLinkClick, true);
      observer.disconnect();
    };
  }, []);

  return (
    <iframe {...props} ref={setIframeRef} className={className} style={{ border: "none", ...props.style }}>
      {mountNode && createPortal(<div className="min-h-screen bg-background text-foreground">{children}</div>, mountNode)}
    </iframe>
  );
}
