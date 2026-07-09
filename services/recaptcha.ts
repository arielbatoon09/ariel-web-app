"use server";

import { getErrorMessage } from "@/lib/error-utils";

export async function verifyReCaptchaAction(token: string | null) {
  if (!token) {
    return { success: false, error: "reCAPTCHA token is missing." };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY is not defined. Bypassing reCAPTCHA validation.");
    return { success: true };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    if (!res.ok) {
      return { success: false, error: "Failed to communicate with reCAPTCHA verification server." };
    }

    const data = await res.json();
    if (!data.success) {
      return { success: false, error: "reCAPTCHA verification failed. Please try again." };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "An error occurred during reCAPTCHA verification.") };
  }
}
