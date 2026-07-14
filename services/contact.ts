"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { verifyReCaptchaAction } from "./recaptcha";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend } from "@/lib/email";

export async function sendContactMessageAction(input: {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
}) {
  try {
    // 1. Apply Rate Limiting (max 3 contact submissions per minute per IP)
    const rateLimit = await checkRateLimit("rate_limit:contact", 3, 60);
    if (!rateLimit.success) {
      return {
        success: false,
        error: `Too many messages sent. Please wait ${rateLimit.reset} seconds before trying again.`,
      };
    }

    // 2. Verify reCAPTCHA
    const recaptchaRes = await verifyReCaptchaAction(input.recaptchaToken);
    if (!recaptchaRes.success) {
      return {
        success: false,
        error: recaptchaRes.error || "Security validation failed. Please try again.",
      };
    }

    // 3. Send Email notification using Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.RESEND_TO_EMAIL || "info.arielbatoon@gmail.com";

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Contact Form Submission from ${input.name}`,
      text: `You have received a new message from your website contact form:\n\n` +
            `Name: ${input.name}\n` +
            `Email: ${input.email}\n\n` +
            `Message:\n${input.message}\n`,
      replyTo: input.email,
    });

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to send message.") };
  }
}
