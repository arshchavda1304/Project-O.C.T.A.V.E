#!/usr/bin/env python3
"""
Project O.C.T.A.V.E. \u2014 Dynamic TTS Routing Service
- Routes Edge-TTS supported languages (Assamese, English, Bengali) to Edge-TTS.
- Routes Regional languages (Manipuri, Bodo, Mizo, Nagamese) to Bhashini TTS API.
- Streams audio directly to frontend via HTML5 Web Audio API.
"""

import os
import io
import sys
import json
import asyncio
import base64
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

# Configuration
PORT = int(os.environ.get("TTS_PORT", 5005))
HOST = "0.0.0.0"

# Bhashini Configuration (optional environment variables)
BHASHINI_API_KEY = os.environ.get("BHASHINI_API_KEY", "")
BHASHINI_USER_ID = os.environ.get("BHASHINI_USER_ID", "")
BHASHINI_INFERENCE_URL = os.environ.get(
    "BHASHINI_INFERENCE_URL",
    "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
)

# Edge TTS Voice Mappings
EDGE_TTS_VOICE_MAP = {
    "as": ["as-IN-YashicaNeural", "as-IN-PrabhatNeural", "bn-IN-TanishaaNeural"],
    "en": ["en-IN-NeerjaNeural", "en-IN-PrabhatNeural"],
    "trp": ["bn-IN-TanishaaNeural", "bn-IN-BashkarNeural"],
    "bn": ["bn-IN-TanishaaNeural", "bn-IN-BashkarNeural"],
    "hi": ["hi-IN-SwaraNeural", "hi-IN-MadhurNeural"],
}

# Regional / Bhashini Language Mappings
BHASHINI_LANG_MAP = {
    "mni": "mni",   # Manipuri / Meitei
    "brx": "brx",   # Bodo
    "lus": "lus",   # Mizo
    "nag": "nag",   # Nagamese
}

async def generate_edge_tts(text: str, language: str, preferred_voice: str = None) -> bytes:
    """Generate audio bytes using edge-tts with voice fallback support."""
    import edge_tts

    candidate_voices = []
    if preferred_voice:
        candidate_voices.append(preferred_voice)
    
    defaults = EDGE_TTS_VOICE_MAP.get(language, ["en-IN-NeerjaNeural"])
    for v in defaults:
        if v not in candidate_voices:
            candidate_voices.append(v)

    last_err = None
    for voice in candidate_voices:
        try:
            communicate = edge_tts.Communicate(text, voice)
            audio_buffer = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_buffer.write(chunk["data"])
            audio_data = audio_buffer.getvalue()
            if len(audio_data) > 0:
                return audio_data
        except Exception as e:
            last_err = e
            continue
            
    raise RuntimeError(f"Edge TTS generation failed for language {language}: {last_err}")


def generate_bhashini_tts(text: str, language: str) -> bytes | None:
    """Call Bhashini pipeline inference API for regional languages."""
    if not BHASHINI_API_KEY:
        return None

    bhashini_lang = BHASHINI_LANG_MAP.get(language, language)
    payload = {
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {
                        "sourceLanguage": bhashini_lang
                    },
                    "gender": "female"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    }

    req = urllib.request.Request(
        BHASHINI_INFERENCE_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": BHASHINI_API_KEY,
            "ulcaApiKey": BHASHINI_API_KEY,
            "userId": BHASHINI_USER_ID,
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            result = json.loads(response.read().decode("utf-8"))
            tasks = result.get("pipelineResponse", [])
            if tasks:
                audio_objs = tasks[0].get("audio", [])
                if audio_objs:
                    b64_content = audio_objs[0].get("audioContent", "")
                    if b64_content:
                        return base64.b64decode(b64_content)
    except Exception as err:
        print(f"[Bhashini Error] {err}")
        return None

    return None


class TTSRequestHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Range")
        self.send_header("Access-Control-Expose-Headers", "Content-Length, Content-Range")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/tts/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            data = {
                "status": "healthy",
                "service": "Project O.C.T.A.V.E. TTS Router",
                "edge_tts_languages": list(EDGE_TTS_VOICE_MAP.keys()),
                "bhashini_languages": list(BHASHINI_LANG_MAP.keys()),
                "bhashini_configured": bool(BHASHINI_API_KEY),
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
        elif self.path == "/api/tts/voices":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            data = {
                "edge_voices": EDGE_TTS_VOICE_MAP,
                "bhashini_languages": BHASHINI_LANG_MAP
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/api/tts":
            content_len = int(self.headers.get("Content-Length", 0))
            if content_len == 0:
                self.send_response(400)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(b'{"error": "Empty request body"}')
                return

            body = self.rfile.read(content_len).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                self.send_response(400)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(b'{"error": "Invalid JSON"}')
                return

            text = data.get("text", "").strip()
            language = data.get("language", "en").lower()
            preferred_voice = data.get("voice")

            if not text:
                self.send_response(400)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(b'{"error": "Text parameter is required"}')
                return

            print(f"[TTS Request] Lang: {language}, Text: '{text[:50]}...'")

            # Route 1: Regional languages (Manipuri, Bodo, Mizo, Nagamese) -> Bhashini TTS
            if language in BHASHINI_LANG_MAP:
                print(f"[TTS Routing] Dispatching '{language}' to Bhashini TTS Engine")
                bhashini_audio = generate_bhashini_tts(text, language)
                if bhashini_audio:
                    self.send_response(200)
                    self.send_header("Content-Type", "audio/wav")
                    self.send_header("X-TTS-Provider", "Bhashini")
                    self.send_header("X-TTS-Language", language)
                    self._send_cors_headers()
                    self.end_headers()
                    self.wfile.write(bhashini_audio)
                    return

                # If Bhashini is not configured or offline, return fallback response for Web Audio / Web Speech
                print(f"[Bhashini Fallback] Bhashini not configured or offline for '{language}'. Responding with fallback protocol.")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("X-TTS-Provider", "Bhashini-Fallback")
                self._send_cors_headers()
                self.end_headers()
                resp = {
                    "fallback": True,
                    "provider": "bhashini-browser-fallback",
                    "language": language,
                    "text": text,
                    "message": f"Bhashini pipeline active for {language}. Handing off to browser Web Audio/Speech engine."
                }
                self.wfile.write(json.dumps(resp).encode("utf-8"))
                return

            # Route 2: Edge TTS supported languages (Assamese, English, Bengali, etc.)
            print(f"[TTS Routing] Dispatching '{language}' to Edge TTS Engine")
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                audio_bytes = loop.run_until_complete(
                    generate_edge_tts(text, language, preferred_voice)
                )
                loop.close()

                self.send_response(200)
                self.send_header("Content-Type", "audio/mpeg")
                self.send_header("X-TTS-Provider", "Edge-TTS")
                self.send_header("X-TTS-Language", language)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(audio_bytes)
                return
            except Exception as err:
                print(f"[Edge-TTS Error] {err}")
                # Return graceful fallback JSON
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("X-TTS-Provider", "Edge-Fallback")
                self._send_cors_headers()
                self.end_headers()
                resp = {
                    "fallback": True,
                    "provider": "edge-browser-fallback",
                    "language": language,
                    "text": text,
                    "error": str(err)
                }
                self.wfile.write(json.dumps(resp).encode("utf-8"))
                return
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Clean logging
        print(f"[TTS Server] {self.address_string()} - {format % args}")


def run_server():
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, TTSRequestHandler)
    print(f"=====================================================")
    print(f" Project O.C.T.A.V.E. TTS Server running on port {PORT}")
    print(f" - Edge TTS: Assamese (as), English (en), Bengali (trp/bn)")
    print(f" - Bhashini TTS: Manipuri (mni), Bodo (brx), Mizo (lus), Nagamese (nag)")
    print(f"=====================================================")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()

