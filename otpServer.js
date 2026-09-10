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
import nodemailer from 'nodemailer';
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

// ── Nodemailer Client ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

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
    const info = await transporter.sendMail({
      from: `"Project O.C.T.A.V.E." <${process.env.SMTP_EMAIL}>`,
      to: emailLower,
      subject: `Project O.C.T.A.V.E. login code: ${otp}`,
      html: generateOtpEmail(name, otp, emailLower),
      text: `Hello ${name},\n\nYour Project O.C.T.A.V.E. verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.\n\n— Project O.C.T.A.V.E. Security`,
    });

    console.log(`📧 OTP sent via Nodemailer to ${emailLower} (OTP: ${otp})`, info.messageId);
    return res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('❌ Failed to send OTP email via Nodemailer:', err.message);
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

// ── POST /api/verify-portal-switch ───────────────────────────────────────────
const validCredentials = {
  caregiver: { id: 'caregiver_001', password: 'CarePass@2024' },
  doctor: { id: 'doctor_001', password: 'DocPass@2024' }
};

app.post('/api/verify-portal-switch', (req, res) => {
  console.log(`[AUTH] Received verify-portal-switch request:`, req.body);
  const { role, id, password } = req.body;
  
  if (!role || !id || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials.' });
  }

  const creds = validCredentials[role];
  if (creds && creds.id === id && creds.password === password) {
    console.log(`✅ Portal switch auth successful for ${id} (${role})`);
    return res.json({ success: true, message: 'Authentication successful.' });
  }

  console.log(`❌ Portal switch auth failed for ${id} (${role})`);
  return res.status(401).json({ success: false, message: 'Invalid ID or password.' });
});


// ── In-memory Patient Face storage (Phase 1) ────────────────────────────────
let patientFaceRecords = [];

// GET /api/patient-faces
app.get('/api/patient-faces', (req, res) => {
  return res.json(patientFaceRecords);
});

// POST /api/patient-faces
app.post('/api/patient-faces', (req, res) => {
  const { id, descriptor, photoBase64, timestamp, isActive } = req.body;
  if (!id || !descriptor || !photoBase64 || !timestamp) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  patientFaceRecords.push({ id, descriptor, photoBase64, timestamp, isActive: !!isActive });
  console.log(`📸 New patient face registered: ${id}`);
  return res.json({ success: true, message: 'Face record added.' });
});

// PATCH /api/patient-faces/:id
app.patch('/api/patient-faces/:id', (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const record = patientFaceRecords.find(r => r.id === id);
  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }
  record.isActive = !!isActive;
  console.log(`🔄 Patient face ${id} isActive set to ${!!isActive}`);
  return res.json({ success: true, message: 'Record updated.', record });
});

// DELETE /api/patient-faces/:id
app.delete('/api/patient-faces/:id', (req, res) => {
  const { id } = req.params;
  patientFaceRecords = patientFaceRecords.filter(r => r.id !== id);
  console.log(`🗑️ Patient face ${id} deleted`);
  return res.json({ success: true, message: 'Record deleted.' });
});

// ── Wander Guard (Geofencing SOS) ──────────────────────────────────────────
let homeCoordinates = null;

// GET /api/wander-guard/home
app.get('/api/wander-guard/home', (req, res) => {
  return res.json({ success: true, homeCoordinates });
});

// POST /api/wander-guard/home
app.post('/api/wander-guard/home', (req, res) => {
  const { lat, lng } = req.body;
  if (lat == null || lng == null) {
    return res.status(400).json({ success: false, message: 'Latitude and Longitude are required.' });
  }
  homeCoordinates = { lat, lng };
  console.log(`📍 Home base updated: [${lat}, ${lng}]`);
  return res.json({ success: true, message: 'Home base updated successfully.', homeCoordinates });
});

// POST /api/wander-guard/sos
app.post('/api/wander-guard/sos', async (req, res) => {
  const { currentLat, currentLng, timestamp } = req.body;
  
  if (currentLat == null || currentLng == null) {
    return res.status(400).json({ success: false, message: 'Current coordinates are required.' });
  }

  console.log(`🚨 URGENT: Patient wandered outside safe zone! [${currentLat}, ${currentLng}]`);

  try {
    const info = await transporter.sendMail({
      from: `"Project O.C.T.A.V.E. Safety" <${process.env.SMTP_EMAIL}>`,
      to: "arshchavda13@gmail.com", // Send to Caregiver's actual email
      subject: `URGENT: Wander Alert`,
      text: `URGENT: Patient has wandered outside the 100-meter safe zone. Last known coordinates: ${currentLat}, ${currentLng}`,
      html: `<h2>🚨 URGENT: Wander Alert</h2><p>Patient has wandered outside the 100-meter safe zone.</p><p><strong>Last known coordinates:</strong> <a href="https://maps.google.com/?q=${currentLat},${currentLng}">${currentLat}, ${currentLng}</a></p><p>Time: ${new Date(timestamp || Date.now()).toLocaleString()}</p>`
    });
    console.log(`📧 SOS Email sent successfully (ID: ${info.messageId})`);
    return res.json({ success: true, message: 'SOS email sent.' });
  } catch (error) {
    console.error('❌ Failed to send SOS email:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send SOS email.' });
  }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'Project O.C.T.A.V.E. OTP Server' }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Project O.C.T.A.V.E. OTP Server running on http://0.0.0.0:${PORT}`);
  console.log(`   POST /api/send-otp     — send OTP to email`);
  console.log(`   POST /api/verify-otp   — verify submitted OTP`);
  console.log(`   POST /api/verify-portal-switch — verify portal switch\n`);
});