interface BookingEmailSlotProps {
  guestName: string;
  dateLabel: string;
  timeLabel: string;
  timeZone: string;
  inquiry?: string;
  guestEmail?: string;
  guestPhone?: string | null;
  status?: string;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function layout(title: string, eyebrow: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px dashed #e5e7eb; background-color: #0a0a0a;">
              <p style="margin: 0 0 4px; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #10b981;">${eyebrow}</p>
              <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">${title}</h1>
            </td>
          </tr>
          ${bodyHtml}
          <tr>
            <td style="padding: 20px 32px; border-top: 1px dashed #e5e7eb;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af; font-family: monospace;">Ariel Batoon · Discovery Call</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function bookingGuestReceivedHtml(props: BookingEmailSlotProps): string {
  const inquiry = props.inquiry ? escapeHtml(props.inquiry) : "";
  return layout(
    "Request Received",
    "Pending Confirmation",
    `<tr>
      <td style="padding: 28px 32px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #374151; line-height: 1.6;">
          Hi ${escapeHtml(props.guestName)}, thanks for booking a Discovery Call. Your request is <strong>pending confirmation</strong> — I’ll review it shortly and email you once it’s confirmed.
        </p>
        <table width="100%" style="border: 1px dashed #e5e7eb; margin: 16px 0;">
          <tr><td style="padding: 12px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af;">Date</td>
              <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #111827;">${escapeHtml(props.dateLabel)}</td></tr>
          <tr><td style="padding: 12px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af; border-top: 1px dashed #f3f4f6;">Time</td>
              <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #111827; border-top: 1px dashed #f3f4f6;">${escapeHtml(props.timeLabel)} (${escapeHtml(props.timeZone)})</td></tr>
        </table>
        ${
          inquiry
            ? `<p style="margin: 16px 0 0; font-size: 12px; color: #6b7280;"><span style="font-family: monospace; text-transform: uppercase; font-size: 10px; color: #9ca3af;">Your inquiry</span><br/>${inquiry}</p>`
            : ""
        }
      </td>
    </tr>`
  );
}

export function bookingGuestReceivedText(props: BookingEmailSlotProps): string {
  return `Hi ${props.guestName},

Thanks for booking a Discovery Call. Your request is pending confirmation.

Date: ${props.dateLabel}
Time: ${props.timeLabel} (${props.timeZone})
${props.inquiry ? `\nInquiry:\n${props.inquiry}\n` : ""}
— Ariel Batoon`;
}

export function bookingAdminNotificationHtml(props: BookingEmailSlotProps): string {
  return layout(
    "New Booking Request",
    "Requires Confirmation",
    `<tr>
      <td style="padding: 28px 32px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #374151;">A new Discovery Call was requested.</p>
        <table width="100%" style="border: 1px dashed #e5e7eb;">
          <tr><td style="padding: 10px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af;">Guest</td>
              <td style="padding: 10px 16px; font-size: 13px; font-weight: bold;">${escapeHtml(props.guestName || "")}</td></tr>
          <tr><td style="padding: 10px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af; border-top: 1px dashed #f3f4f6;">Email</td>
              <td style="padding: 10px 16px; font-size: 13px; border-top: 1px dashed #f3f4f6;">${escapeHtml(props.guestEmail || "")}</td></tr>
          <tr><td style="padding: 10px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af; border-top: 1px dashed #f3f4f6;">Phone</td>
              <td style="padding: 10px 16px; font-size: 13px; border-top: 1px dashed #f3f4f6;">${escapeHtml(props.guestPhone || "—")}</td></tr>
          <tr><td style="padding: 10px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af; border-top: 1px dashed #f3f4f6;">When</td>
              <td style="padding: 10px 16px; font-size: 13px; font-weight: bold; border-top: 1px dashed #f3f4f6;">${escapeHtml(props.dateLabel)} · ${escapeHtml(props.timeLabel)}</td></tr>
        </table>
        ${
          props.inquiry ? `<p style="margin: 16px 0 0; font-size: 13px; color: #374151; white-space: pre-wrap;">${escapeHtml(props.inquiry)}</p>` : ""
        }
      </td>
    </tr>`
  );
}

export function bookingAdminNotificationText(props: BookingEmailSlotProps): string {
  return `New Discovery Call request

Guest: ${props.guestName}
Email: ${props.guestEmail}
Phone: ${props.guestPhone || "—"}
When: ${props.dateLabel} · ${props.timeLabel} (${props.timeZone})

Inquiry:
${props.inquiry || "—"}`;
}

export function bookingStatusUpdateHtml(props: BookingEmailSlotProps): string {
  const status = (props.status || "").replace("_", " ");
  return layout(
    `Booking ${status}`,
    "Status Update",
    `<tr>
      <td style="padding: 28px 32px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #374151; line-height: 1.6;">
          Hi ${escapeHtml(props.guestName)}, your Discovery Call is now <strong>${escapeHtml(status)}</strong>.
        </p>
        <table width="100%" style="border: 1px dashed #e5e7eb;">
          <tr><td style="padding: 12px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af;">Date</td>
              <td style="padding: 12px 16px; font-size: 13px; font-weight: bold;">${escapeHtml(props.dateLabel)}</td></tr>
          <tr><td style="padding: 12px 16px; font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9ca3af; border-top: 1px dashed #f3f4f6;">Time</td>
              <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; border-top: 1px dashed #f3f4f6;">${escapeHtml(props.timeLabel)} (${escapeHtml(props.timeZone)})</td></tr>
        </table>
      </td>
    </tr>`
  );
}

export function bookingStatusUpdateText(props: BookingEmailSlotProps): string {
  return `Hi ${props.guestName},

Your Discovery Call is now ${(props.status || "").replace("_", " ")}.

Date: ${props.dateLabel}
Time: ${props.timeLabel} (${props.timeZone})

— Ariel Batoon`;
}
