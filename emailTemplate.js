/**
 * Project O.C.T.A.V.E. — OTP Email Template
 * Inline CSS only — required for Gmail/Outlook rendering compatibility.
 * Modeled after Meta/Instagram transactional security alert style.
 *
 * @param {string} userName   - Recipient's display name  e.g. "Ramesh"
 * @param {string} otp        - 6-digit one-time password  e.g. "482910"
 * @param {string} userEmail  - Recipient's email address
 * @returns {string}          - Complete HTML string ready to pass to Nodemailer's `html` field
 */
export function generateOtpEmail(userName, otp, userEmail) {
  const APP_NAME = 'Project O.C.T.A.V.E.';
  const YEAR = new Date().getFullYear();

  // Space out digits for instant readability: "482910" → "4 8 2 9 1 0"
  const spacedOtp = otp.split('').join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${APP_NAME} login code: ${otp}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden preview text shown in inbox) -->
  <span style="display:none;font-size:1px;color:#f4f4f5;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Your ${APP_NAME} verification code is ${otp}. Valid for 5 minutes.
  </span>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">

        <!-- Email Card -->
        <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER BANNER -->
          <tr>
            <td align="center" style="padding:0;background-color:#f8fafc;">
              <img src="https://i.postimg.cc/nVdskN6m/Gemini-Generated-Image-sjt8sbsjt8sbsjt8.png" alt="Project O.C.T.A.V.E. Banner" width="100%" style="display:block;max-width:520px;height:auto;border-top-left-radius:16px;border-top-right-radius:16px;" />
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 0;">

              <!-- Headline -->
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;text-align:center;letter-spacing:-0.4px;line-height:1.25;">
                Your verification code, ${userName}
              </h1>

              <!-- Subtext -->
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;text-align:center;line-height:1.6;">
                Use this one-time passcode to sign in to your<br/>
                <strong style="color:#0f172a;">${APP_NAME}</strong> account.
              </p>

              <!-- OTP BOX -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border:2px solid #86efac;border-radius:14px;padding:24px 40px;">
                      <div style="font-size:42px;font-weight:900;letter-spacing:14px;color:#14532d;font-family:'Courier New',Courier,monospace;text-indent:14px;">
                        ${spacedOtp}
                      </div>
                      <p style="margin:10px 0 0;font-size:11px;color:#166534;font-weight:600;text-align:center;letter-spacing:0.8px;text-transform:uppercase;">
                        One-Time Passcode
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;font-size:13px;color:#78350f;line-height:1.55;">
                    <strong>This code expires in 5 minutes.</strong> If you did not request this
                    login attempt, please ignore this email or contact
                    <a href="mailto:security@projectoctave.org" style="color:#92400e;text-decoration:underline;">security@projectoctave.org</a>.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
                from <strong style="color:#64748b;">${APP_NAME}</strong> &bull; North East India Healthcare Portal
              </p>
              <p style="margin:0 0 6px;font-size:11px;color:#cbd5e1;text-align:center;">
                &copy; ${YEAR} ${APP_NAME}. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;text-align:center;">
                This message was sent to <span style="color:#94a3b8;">${userEmail}</span>
                and intended for <span style="color:#94a3b8;">${userName}</span>.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;text-align:center;">
                Do not reply to this email &bull; This is an automated message
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