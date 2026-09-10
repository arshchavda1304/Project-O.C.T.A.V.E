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
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
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

// ── Email Clients (Resend for Prod, Nodemailer fallback for Local) ───────────
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const transporter = !resend ? nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
}) : null;

// ── Google Gen AI Client ─────────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    if (resend) {
      const data = await resend.emails.send({
        from: `Project O.C.T.A.V.E. <onboarding@resend.dev>`, // Resend requires a verified domain or onboarding@resend.dev for testing
        to: emailLower,
        subject: `Project O.C.T.A.V.E. login code: ${otp}`,
        html: generateOtpEmail(name, otp, emailLower),
        text: `Hello ${name},\n\nYour Project O.C.T.A.V.E. verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.\n\n— Project O.C.T.A.V.E. Security`,
      });

      if (data.error) {
        console.error('❌ Failed to send OTP email via Resend:', data.error);
        return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
      }
      console.log(`📧 OTP sent via Resend to ${emailLower} (OTP: ${otp})`, data.data?.id);
    } else {
      const info = await transporter.sendMail({
        from: `"Project O.C.T.A.V.E." <${process.env.SMTP_EMAIL}>`,
        to: emailLower,
        subject: `Project O.C.T.A.V.E. login code: ${otp}`,
        html: generateOtpEmail(name, otp, emailLower),
        text: `Hello ${name},\n\nYour Project O.C.T.A.V.E. verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.\n\n— Project O.C.T.A.V.E. Security`,
      });
      console.log(`📧 OTP sent via Nodemailer (Local Fallback) to ${emailLower} (OTP: ${otp})`, info.messageId);
    }
    
    return res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err.message);
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
    if (resend) {
      const data = await resend.emails.send({
        from: `Project O.C.T.A.V.E. Safety <onboarding@resend.dev>`,
        to: "arshchavda13@gmail.com", // Send to Caregiver's actual email
        subject: `URGENT: Wander Alert`,
        text: `URGENT: Patient has wandered outside the 100-meter safe zone. Last known coordinates: ${currentLat}, ${currentLng}`,
        html: `<h2>🚨 URGENT: Wander Alert</h2><p>Patient has wandered outside the 100-meter safe zone.</p><p><strong>Last known coordinates:</strong> <a href="https://maps.google.com/?q=${currentLat},${currentLng}">${currentLat}, ${currentLng}</a></p><p>Time: ${new Date(timestamp || Date.now()).toLocaleString()}</p>`
      });

      if (data.error) {
        console.error('❌ Failed to send SOS email via Resend:', data.error);
        return res.status(500).json({ success: false, message: 'Failed to send SOS email.' });
      }
      console.log(`📧 SOS Email sent successfully via Resend (ID: ${data.data?.id})`);
    } else {
      const info = await transporter.sendMail({
        from: `"Project O.C.T.A.V.E. Safety" <${process.env.SMTP_EMAIL}>`,
        to: "arshchavda13@gmail.com",
        subject: `URGENT: Wander Alert`,
        text: `URGENT: Patient has wandered outside the 100-meter safe zone. Last known coordinates: ${currentLat}, ${currentLng}`,
        html: `<h2>🚨 URGENT: Wander Alert</h2><p>Patient has wandered outside the 100-meter safe zone.</p><p><strong>Last known coordinates:</strong> <a href="https://maps.google.com/?q=${currentLat},${currentLng}">${currentLat}, ${currentLng}</a></p><p>Time: ${new Date(timestamp || Date.now()).toLocaleString()}</p>`
      });
      console.log(`📧 SOS Email sent successfully via Nodemailer (Local Fallback) (ID: ${info.messageId})`);
    }

    return res.json({ success: true, message: 'SOS email sent.' });
  } catch (error) {
    console.error('❌ Failed to send SOS email:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send SOS email.' });
  }
});

// ── AI Scenario Generator ───────────────────────────────────────────────────
app.post('/api/ai/generate-scenario', async (req, res) => {
  const { preferredLanguage, difficultyLevel } = req.body;
  
  if (!preferredLanguage) {
    return res.status(400).json({ success: false, message: 'preferredLanguage is required.' });
  }

  // Safely parse and clamp difficulty level to 1, 2, or 3
  let level = parseInt(difficultyLevel, 10);
  if (isNaN(level) || level < 1 || level > 3) {
    level = 1; // Safe fallback
  }

  let difficultyGuidelines = "";
  if (level === 1) {
    difficultyGuidelines = `Level 1 Difficulty Requirements:
- Obvious, single-element visual hazards.
- One clearly unsafe item.
- Minimal distraction.
- Suitable for beginners.`;
  } else if (level === 2) {
    difficultyGuidelines = `Level 2 Difficulty Requirements:
- Subtle household hazards.
- Requires careful observation.
- May include one harmless distraction.
- Still has one clearly best answer.`;
  } else if (level === 3) {
    difficultyGuidelines = `Level 3 Difficulty Requirements:
- Complex but realistic multi-step situations.
- May involve timing, distractions, or more than one environmental clue.
- Avoid ambiguity.
- The safest action must remain clearly identifiable.`;
  }

  const prompt = `You are a specialized clinical cognitive assessment assistant for elderly patients in Northeast India.

Generate exactly ONE realistic daily home-safety scenario suitable for evaluating cognitive awareness and decision-making.

Context Parameters:
- Target Language: ${preferredLanguage} (e.g., Assamese, Nagamese, Bengali, or English)
- Setting: Everyday domestic environment typical of Northeast Indian households (e.g., kitchen gas stove, wet bathroom floor, open exterior gate, medication storage, boiling water/tea).

${difficultyGuidelines}

Requirements:
1. Provide a clear, simple 1-2 sentence scenario in the target language.
2. Provide exactly 3 or 4 practical multiple-choice options in the target language.
3. Mark the single correct, safest action with its zero-based index.
4. Keep the vocabulary accessible for an elderly individual; avoid technical jargon.
5. Return ONLY a valid JSON object. Do not include markdown fences, greetings, or explanations.
6. The correctAnswer must match one of the available options and avoid medical diagnosis, dangerous instructions, and ambiguous situations.

Expected JSON schema:
{
  "scenario": "string",
  "options": ["string", "string", "string"],
  "correctIndex": number,
  "safetyCategory": "fire_hazard" | "fall_prevention" | "medication" | "home_security"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    // The model should return valid JSON because of responseMimeType
    const scenarioData = JSON.parse(response.text);

    // Validate required fields
    if (!scenarioData.scenario || typeof scenarioData.scenario !== 'string') throw new Error("Missing or invalid 'scenario'");
    if (!Array.isArray(scenarioData.options) || scenarioData.options.length < 2) throw new Error("Missing or invalid 'options'");
    if (typeof scenarioData.correctIndex !== 'number' || scenarioData.correctIndex < 0 || scenarioData.correctIndex >= scenarioData.options.length) {
      throw new Error("Invalid 'correctIndex'");
    }

    // Ensure options are strictly strings and not duplicated
    const uniqueOptions = new Set(scenarioData.options.map(String));
    if (uniqueOptions.size !== scenarioData.options.length) {
      throw new Error("Duplicate options found");
    }

    // Embed the validated difficulty into the response for safety tracking
    scenarioData.difficultyLevel = level;

    return res.json({ success: true, data: scenarioData });
  } catch (error) {
    console.error('❌ Failed to generate AI scenario:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to generate scenario via AI.' });
  }
});
// ── AI Scoring (Weighted) ─────────────────────────────────────────────────────
app.post('/api/score/calculate', (req, res) => {
  const { reactionTimeMs, isCorrect } = req.body;
  if (reactionTimeMs == null || isCorrect == null) {
    return res.status(400).json({ success: false, message: 'reactionTimeMs and isCorrect are required.' });
  }

  // 40% accuracy, 60% speed weighting
  let accuracyScore = isCorrect ? 40 : 0;
  
  let speedScore = 0;
  if (isCorrect) {
    const maxTime = 15000; // 15 seconds max time for points
    const timeUsed = Math.min(reactionTimeMs, maxTime);
    speedScore = Math.floor(60 * (1 - (timeUsed / maxTime)));
  }

  const pointsAwarded = accuracyScore + speedScore;
  return res.json({ success: true, pointsAwarded });
});

// ── Predictive Wander Guard ──────────────────────────────────────────────────
app.post('/api/wander-guard/predict', async (req, res) => {
  const { recentLocations } = req.body;
  
  if (!recentLocations || !Array.isArray(recentLocations)) {
    return res.status(400).json({ success: false, message: 'recentLocations array is required.' });
  }

  const prompt = `You are an AI Wander Guard analyzer.
Analyze the following recent GPS coordinates and timestamps of an elderly patient.
Determine the risk of wandering (0 to 100). If risk > 70, we should issue a warning.
Recent Locations: ${JSON.stringify(recentLocations)}

Return ONLY a valid JSON object matching exactly this schema: {"riskScore": number, "isWandering": boolean, "reason": "string"}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const prediction = JSON.parse(response.text);
    return res.json({ success: true, prediction });
  } catch (error) {
    console.error('❌ Failed to predict wander risk:', error.message);
    return res.json({ success: true, prediction: { riskScore: 0, isWandering: false, reason: "Fallback logic due to API failure" } });
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