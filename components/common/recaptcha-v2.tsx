"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface ReCaptchaV2Props {
  onChange: (token: string | null) => void;
}

export interface ReCaptchaV2Ref {
  reset: () => void;
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLDivElement | string,
        parameters: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
    onReCaptchaV2LoadCallback?: () => void;
  }
}

export const ReCaptchaV2 = forwardRef<ReCaptchaV2Ref, ReCaptchaV2Props>(
  ({ onChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (e) {
            console.error("Error resetting reCAPTCHA:", e);
          }
        }
        onChange(null);
      },
    }));

    useEffect(() => {
      if (!siteKey) {
        console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined.");
        return;
      }

      const renderWidget = () => {
        if (window.grecaptcha && containerRef.current && widgetIdRef.current === null) {
          try {
            const id = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => onChange(token),
              "expired-callback": () => onChange(null),
              "error-callback": () => onChange(null),
            });
            widgetIdRef.current = id;
          } catch (e) {
            console.error("Error rendering reCAPTCHA v2:", e);
          }
        }
      };

      if (window.grecaptcha) {
        renderWidget();
      } else {
        const scriptId = "recaptcha-v2-script";
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        
        if (!script) {
          script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://www.google.com/recaptcha/api.js?onload=onReCaptchaV2LoadCallback&render=explicit";
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        }

        window.onReCaptchaV2LoadCallback = () => {
          renderWidget();
        };
      }

      return () => {
        // Clean up/Reset the widget on unmount
        if (window.grecaptcha && widgetIdRef.current !== null) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch {
            // ignore reset errors on unmount
          }
        }
      };
    }, [onChange, siteKey]);

    return (
      <div className="flex justify-start py-2">
        <div ref={containerRef} />
      </div>
    );
  }
);

ReCaptchaV2.displayName = "ReCaptchaV2";

