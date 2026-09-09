/**
 * Project O.C.T.A.V.E. — OTP Email Server
 * ──────────────────────────────────
 * Run:  node otpServer.js
 * Port: 4001 (separate from Vite dev server on 3001)
 *
 * Endpoints:
 *   POST /api/send-otp     { email, name }
 *   POST /api/verify-otp   { email, otp }
 */

import express from 'express';
import { Resend } from 'resend';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { generateOtpEmail } from './emailTemplate.js';

dotenv.config();

const app = express();
const PORT = process.env.OTP_SERVER_PORT || 4001;

app.use(express.json());

// ── Allow requests from the Vite dev server (CORS) ──────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── In-memory OTP store: { email → { otp, expiresAt } } ─────────────────────
const otpStore = new Map();

// ── Resend Client ──────────────────────────────────────────────────────────
const resend = new Resend('re_Vy16GhzQ_KPco48CYSjykRePjCDovFpS4');

// ── Helper: generate a 6-digit OTP ──────────────────────────────────────────
function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

// ── POST /api/send-otp ───────────────────────────────────────────────────────
app.post('/api/send-otp', async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'email and name are required.' });
  }

  const emailLower = email.trim().toLowerCase();
  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Store OTP
  otpStore.set(emailLower, { otp, expiresAt });

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: emailLower,
      subject: `Project O.C.T.A.V.E. login code: ${otp}`,
      html: generateOtpEmail(name, otp, emailLower),
      text: `Hello ${name},\n\nYour Project O.C.T.A.V.E. verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.\n\n— Project O.C.T.A.V.E. Security`,
    });

    console.log(`📧 OTP sent via Resend to ${emailLower} (OTP: ${otp})`, data);
    return res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('❌ Failed to send OTP email via Resend:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

// ── POST /api/verify-otp ─────────────────────────────────────────────────────
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'email and otp are required.' });
  }

  const emailLower = email.trim().toLowerCase();
  const record = otpStore.get(emailLower);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email. Please request a new one.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(emailLower);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
  }

  // ✅ OTP verified — delete it so it cannot be reused
  otpStore.delete(emailLower);
  console.log(`✅ OTP verified for ${emailLower}`);
  return res.json({ success: true, message: 'OTP verified successfully.' });
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Project O.C.T.A.V.E. OTP Server' }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Project O.C.T.A.V.E. OTP Server running on http://localhost:${PORT}`);
  console.log(`   POST /api/send-otp     — send OTP to email`);
  console.log(`   POST /api/verify-otp   — verify submitted OTP\n`);
});