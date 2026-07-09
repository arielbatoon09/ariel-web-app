interface OrderConfirmationEmailProps {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceBasePrice: number;
  referenceNumber: string;
  totalAmount: number;
  addOns: Array<{ name: string; price: number }>;
  requirements?: string;
  isNewClient: boolean;
}

export function orderConfirmationHtml({
  customerName,
  serviceName,
  serviceBasePrice,
  referenceNumber,
  totalAmount,
  addOns,
  requirements,
  isNewClient,
}: OrderConfirmationEmailProps): string {
  const formattedBasePrice = `₱${serviceBasePrice.toLocaleString("en-PH")}`;
  const formattedTotal = `₱${totalAmount.toLocaleString("en-PH")}`;

  const addOnsHtml =
    addOns.length > 0
      ? addOns
          .map(
            (addon) =>
              `<tr style="border-bottom: 1px dashed #f3f4f6;">
                <td style="padding: 12px 20px; font-family: monospace; font-size: 11px; color: #9ca3af;">+ Add-on: ${addon.name}</td>
                <td align="right" style="padding: 12px 20px; font-size: 12px; font-weight: bold; color: #111827;">₱${addon.price.toLocaleString("en-PH")}</td>
              </tr>`
          )
          .join("")
      : "";

  const requirementsHtml = requirements
    ? `
    <tr>
      <td style="padding: 24px; border-top: 1px dashed #e5e7eb;">
        <p style="margin: 0 0 8px; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Project Requirements</p>
        <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${requirements}</p>
      </td>
    </tr>`
    : "";

  const clientNoteHtml = isNewClient
    ? `<p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.6;">
        Since this is your first order with us, a <strong>customer portal account</strong> will be created for you after payment verification.
        You will receive a <strong>separate email</strong> containing your login credentials so you can track your project's progress.
      </p>`
    : `<p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.6;">
        As an existing client, you can <strong>log in to your customer portal</strong> now to track the progress of this order once your payment has been verified.
      </p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Received – Ariel Batoon</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px dashed #e5e7eb; background-color: #0a0a0a;">
              <p style="margin: 0 0 4px; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #10b981;">Transaction Recorded</p>
              <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">Order Received</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 28px 32px 0;">
              <p style="margin: 0 0 12px; font-size: 15px; color: #111827;">Hi <strong>${customerName}</strong>,</p>
              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.7;">
                Thank you for your order. Your order has been received and your proof of payment is undergoing manual verification.
                We will get back to you within <strong style="color: #111827;">less than 12 hours</strong>.
              </p>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px dashed #e5e7eb;">
                <tr>
                  <td colspan="2" style="padding: 16px 20px; border-bottom: 1px dashed #e5e7eb; background-color: #f9fafb;">
                    <p style="margin: 0; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Reference Summary</p>
                  </td>
                </tr>
                <tr style="border-bottom: 1px dashed #f3f4f6;">
                  <td style="padding: 16px 20px; font-family: monospace; font-size: 11px; color: #9ca3af;">Reference Number</td>
                  <td align="right" style="padding: 16px 20px; font-family: monospace; font-size: 12px; font-weight: bold; color: #111827;">${referenceNumber}</td>
                </tr>
                <tr style="border-bottom: 1px dashed #f3f4f6;">
                  <td style="padding: 12px 20px; font-family: monospace; font-size: 11px; color: #9ca3af;">Base Package: ${serviceName}</td>
                  <td align="right" style="padding: 12px 20px; font-size: 12px; font-weight: bold; color: #111827;">${formattedBasePrice}</td>
                </tr>
                ${addOnsHtml}
                <tr>
                  <td style="padding: 16px 20px; background-color: #f9fafb; font-family: monospace; font-size: 11px; color: #9ca3af;">Total Amount Deposited</td>
                  <td align="right" style="padding: 16px 20px; background-color: #f9fafb; font-size: 16px; font-weight: 900; color: #111827;">${formattedTotal}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Requirements block (if any) -->
          ${requirementsHtml ? `<tr><td style="padding: 0 32px 24px;"><table width="100%" cellpadding="0" cellspacing="0" style="border: 1px dashed #e5e7eb;">${requirementsHtml}</table></td></tr>` : ""}

          <!-- Workflow Steps -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px dashed #e5e7eb;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px dashed #e5e7eb; background-color: #f9fafb;">
                    <p style="margin: 0; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">What Happens Next</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px dashed #f3f4f6;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 24px; vertical-align: top; padding-top: 1px;">
                          <div style="width: 16px; height: 16px; border-radius: 50%; background-color: #10b981; display: inline-block; text-align: center; line-height: 16px; font-size: 8px; font-weight: bold; color: white;">✓</div>
                        </td>
                        <td style="padding-left: 10px;">
                          <p style="margin: 0 0 2px; font-size: 12px; font-weight: bold; color: #111827;">Order Staged</p>
                          <p style="margin: 0; font-size: 11px; color: #9ca3af;">Order details and payment receipt uploaded successfully.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px dashed #f3f4f6;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 24px; vertical-align: top; padding-top: 1px;">
                          <div style="width: 16px; height: 16px; border-radius: 50%; border: 1px dashed #f59e0b; background-color: #fef9c3; display: inline-block; text-align: center; line-height: 14px; font-size: 9px; font-weight: bold; color: #d97706;">2</div>
                        </td>
                        <td style="padding-left: 10px;">
                          <p style="margin: 0 0 2px; font-size: 12px; font-weight: bold; color: #111827;">Manual Verification</p>
                          <p style="margin: 0; font-size: 11px; color: #9ca3af;">We will audit your payment proof shortly. ${isNewClient ? "Once verified, you will receive your customer portal credentials in a follow-up email." : "Once verified, you can log in to your dashboard to track your order."}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 24px; vertical-align: top; padding-top: 1px;">
                          <div style="width: 16px; height: 16px; border-radius: 50%; border: 1px solid #d1d5db; display: inline-block; text-align: center; line-height: 14px; font-size: 9px; font-weight: bold; color: #9ca3af;">3</div>
                        </td>
                        <td style="padding-left: 10px;">
                          <p style="margin: 0 0 2px; font-size: 12px; font-weight: bold; color: #9ca3af;">Project Workspace Setup</p>
                          <p style="margin: 0; font-size: 11px; color: #d1d5db;">Once verified, we start working and set up your demo preview build.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Portal Note -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px dashed #dbeafe; background-color: #eff6ff;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 6px; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6;">Customer Panel</p>
                    ${clientNoteHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0a0a0a; border-top: 1px dashed #1f2937;">
              <p style="margin: 0; font-family: monospace; font-size: 10px; color: #6b7280; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
                Ariel Batoon · Software Solutions &amp; Design &nbsp;·&nbsp; <a href="mailto:info.arielbatoon@gmail.com" style="color: #6b7280; text-decoration: none;">info.arielbatoon@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationText({
  customerName,
  serviceName,
  serviceBasePrice,
  referenceNumber,
  totalAmount,
  addOns,
  isNewClient,
}: OrderConfirmationEmailProps): string {
  const addOnsText = addOns.map((a) => `+ ${a.name} (₱${a.price.toLocaleString("en-PH")})`).join("\n");

  return `Hi ${customerName},

Your order has been received and is being reviewed.

ORDER REFERENCE: ${referenceNumber}
PACKAGE: ${serviceName} (₱${serviceBasePrice.toLocaleString("en-PH")})
${addOns.length > 0 ? `ADD-ONS:\n${addOnsText}\n` : ""}
TOTAL AMOUNT DEPOSITED: ₱${totalAmount.toLocaleString("en-PH")}

WHAT'S NEXT:
1. Order Staged — Order and payment receipt recorded.
2. Manual Verification — We will audit your payment proof shortly.
   ${isNewClient ? "New clients will receive their customer portal credentials via a follow-up email." : "Existing clients can log in to their dashboard to track the order."}
3. Project Workspace Setup — Once verified, we'll begin work and set up your demo build.

— Ariel Batoon`;
}
