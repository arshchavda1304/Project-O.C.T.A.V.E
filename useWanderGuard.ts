import { useEffect, useRef } from 'react';

// Haversine formula to calculate distance in meters
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

export function useWanderGuard() {
  const lastSOSSentAt = useRef<number>(0);
  const lastPredictionCheck = useRef<number>(0);
  const recentLocations = useRef<Array<{lat: number, lng: number, timestamp: number}>>([]);
  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    let watchId: number | null = null;
    const OTP_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OTP_SERVER_URL || 'http://127.0.0.1:4001';

    const initWanderGuard = async () => {
      try {
        const res = await fetch(`${OTP_SERVER_URL}/api/wander-guard/home`);
        const data = await res.json();
        
        if (data.success && data.homeCoordinates) {
          const homeLat = data.homeCoordinates.lat;
          const homeLng = data.homeCoordinates.lng;
          
          if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
              async (position) => {
                const currentLat = position.coords.latitude;
                const currentLng = position.coords.longitude;
                const now = Date.now();
                
                recentLocations.current.push({ lat: currentLat, lng: currentLng, timestamp: now });
                if (recentLocations.current.length > 10) {
                  recentLocations.current.shift();
                }

                const distance = calculateDistanceMeters(homeLat, homeLng, currentLat, currentLng);
                
                // 1. Hard Boundary Check (> 100m)
                if (distance > 100) {
                  if (now - lastSOSSentAt.current > COOLDOWN_MS) {
                    lastSOSSentAt.current = now;
                    
                    try {
                      await fetch(`${OTP_SERVER_URL}/api/wander-guard/sos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentLat, currentLng, timestamp: now })
                      });
                      console.log('🚨 Wander Guard SOS triggered!');
                    } catch (err) {
                      console.error('Failed to send SOS', err);
                    }
                  }
                } 
                // 2. Predictive AI Check (every 30 seconds if enough data)
                else if (now - lastPredictionCheck.current > 30000 && recentLocations.current.length >= 3) {
                  lastPredictionCheck.current = now;
                  try {
                    const pRes = await fetch(`${OTP_SERVER_URL}/api/wander-guard/predict`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ recentLocations: recentLocations.current })
                    });
                    const pData = await pRes.json();
                    
                    if (pData.success && pData.prediction?.isWandering && pData.prediction?.riskScore > 70) {
                      if (now - lastSOSSentAt.current > COOLDOWN_MS) {
                        lastSOSSentAt.current = now;
                        await fetch(`${OTP_SERVER_URL}/api/wander-guard/sos`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ currentLat, currentLng, timestamp: now })
                        });
                        console.log('🚨 Predictive AI Early Warning triggered!', pData.prediction.reason);
                      }
                    }
                  } catch (err) {
                    console.error('Predictive AI check failed', err);
                  }
                }
              },
              (error) => {
                console.error('Error watching position for Wander Guard:', error);
              },
              { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch Wander Guard home base', err);
      }
    };

    initWanderGuard();

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);
}
