# Project O.C.T.A.V.E.
### Optimized Care Through Assisted Virtual Empowerment for North East India

> A unified, offline-first, AI-powered healthcare portal serving patients, caregivers, and physicians across Assam, Manipur, Tripura, and Nagaland. Built with multilingual support in 5 North Eastern languages.

---

## Run Locally

**Prerequisites:** Node.js, Python 3

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment — copy `.env.example` to `.env` and fill in:
   ```
   VITE_API_URL=<your backend URL>
   SMTP_EMAIL=your-gmail@gmail.com
   SMTP_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

4. Start the TTS server (optional, for audio):
   ```bash
   npm run tts
   ```

5. Start the OTP email server (optional, for auth):
   ```bash
   npm run otp
   ```

---

## Architecture

| Service | Port | Command |
|---------|------|---------|
| Vite Frontend | 3001 | `npm run dev` |
| Python TTS Server | 5005 | `npm run tts` |
| OTP Email Server | 4001 | `npm run otp` |

---

© 2026 Project O.C.T.A.V.E. — North Eastern Regional Tele-Care Platform
