import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';
import { Camera, Trash2, Shield, Sparkles } from 'lucide-react';

interface FaceRecord {
  id: string;
  descriptor: number[];
  photoBase64: string;
  timestamp: number;
  isActive: boolean;
}

export const PatientFaceManager: React.FC = () => {
  const [faces, setFaces] = useState<FaceRecord[]>([]);
  const [showWebcam, setShowWebcam] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const OTP_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OTP_SERVER_URL || 'http://127.0.0.1:4001';

  const fetchFaces = async () => {
    try {
      const res = await fetch(`${OTP_SERVER_URL}/api/patient-faces`);
      const data = await res.json();
      setFaces(data);
    } catch (err) {
      console.error('Failed to fetch faces', err);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, []);

  useEffect(() => {
    if (showWebcam && !modelsLoaded) {
      const loadModels = async () => {
        try {
          const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
          ]);
          setModelsLoaded(true);
        } catch (error) {
          console.error("Error loading face models", error);
          setStatus("Failed to load face detection models.");
        }
      };
      loadModels();
    }
  }, [showWebcam, modelsLoaded]);

  const handleCaptureFace = async () => {
    if (!webcamRef.current || !webcamRef.current.video || !modelsLoaded) return;
    
    setStatus("Scanning face...");
    const video = webcamRef.current.video;
    
    try {
      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const photoBase64 = webcamRef.current.getScreenshot();
        if (!photoBase64) {
          setStatus("Failed to capture image.");
          return;
        }

        const id = 'face_' + Date.now();
        const timestamp = Date.now();
        const descriptorArray = Array.from(detection.descriptor);

        const res = await fetch(`${OTP_SERVER_URL}/api/patient-faces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            descriptor: descriptorArray,
            photoBase64,
            timestamp,
            isActive: true
          })
        });

        if (res.ok) {
          setStatus("Face registered successfully!");
          fetchFaces();
          setTimeout(() => {
            handleCloseWebcam();
          }, 2000);
        } else {
          setStatus("Failed to save to server.");
        }
      } else {
        setStatus("No face detected. Please ensure your face is clearly visible.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error during capture.");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`${OTP_SERVER_URL}/api/patient-faces/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchFaces();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${OTP_SERVER_URL}/api/patient-faces/${id}`, {
        method: 'DELETE'
      });
      fetchFaces();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseWebcam = () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowWebcam(false);
    setStatus(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          Patient Facial Recognition Access
        </h3>
        <button
          onClick={() => setShowWebcam(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          Add Patient Face
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {faces.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No patient faces registered. Add one to enable facial recognition security.
          </div>
        ) : (
          faces.map(face => (
            <div key={face.id} className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col">
              <img src={face.photoBase64} alt="Patient Face" className="w-full h-40 object-cover" />
              <div className="p-4 flex flex-col gap-3">
                <div className="text-xs text-slate-500">
                  Added: {new Date(face.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={face.isActive}
                      onChange={() => handleToggleActive(face.id, face.isActive)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-slate-700">Active</span>
                  </label>
                  <button
                    onClick={() => handleDelete(face.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete face record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showWebcam && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Register Patient Face</h2>
            <p className="text-slate-600 text-center mb-6 text-sm">
              Position the patient's face clearly in the camera view.
            </p>
            
            <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
              {!modelsLoaded ? (
                <div className="text-white font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Loading AI Models...
                </div>
              ) : (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {status && (
              <div className={`w-full p-3 rounded-xl mb-6 font-bold text-center text-sm ${
                status.includes('success') ? 'bg-emerald-100 text-emerald-800' :
                status.includes('Loading') || status.includes('Scanning') ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </div>
            )}

            <div className="flex gap-4 w-full">
              <button
                onClick={handleCloseWebcam}
                className="flex-1 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCaptureFace}
                disabled={!modelsLoaded || !!(status && status.includes('Scanning'))}
                className="flex-1 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Capture Face
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
