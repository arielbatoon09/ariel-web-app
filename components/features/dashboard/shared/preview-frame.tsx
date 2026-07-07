"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { PortalContainerContext } from "@/components/context/portal-context";

interface PreviewFrameProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  children: React.ReactNode;
}

export function PreviewFrame({ children, className, ...props }: PreviewFrameProps) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  const setIframeRef = React.useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;
    if (!node || !node.contentWindow) {
      setIsReady(false);
      setMountNode(null);
      return;
    }
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
    const links = document.querySelectorAll("style, link[rel='stylesheet']");
    const promises: Promise<void>[] = [];

    links.forEach((el) => {
      const cloned = el.cloneNode(true) as HTMLElement;
      if (cloned.tagName === "LINK") {
        promises.push(
          new Promise((resolve) => {
            cloned.onload = () => resolve();
            cloned.onerror = () => resolve();
          })
        );
      }
      headEl.appendChild(cloned);
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

    // Listen to style/link injections in parent head (for Next.js dynamic styles in dev mode)
    const headObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === "STYLE" || (node.nodeName === "LINK" && (node as HTMLLinkElement).rel === "stylesheet")) {
            doc.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });
    headObserver.observe(document.head, { childList: true });

    setMountNode(doc.body);

    // Wait for all stylesheets to load and a layout tick before showing the iframe
    Promise.all(promises).then(() => {
      setTimeout(() => {
        setIsReady(true);
      }, 80);
    });

    return () => {
      doc.removeEventListener("click", handleLinkClick, true);
      observer.disconnect();
      headObserver.disconnect();
    };
  }, []);

  return (
    <iframe
      {...props}
      ref={setIframeRef}
      className={`${className || ""} transition-opacity duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
      style={{ border: "none", ...props.style }}
    >
      {mountNode && createPortal(
        <PortalContainerContext.Provider value={mountNode}>
          <div className="min-h-screen bg-background text-foreground">{children}</div>
        </PortalContainerContext.Provider>,
        mountNode
      )}
    </iframe>
  );
}
