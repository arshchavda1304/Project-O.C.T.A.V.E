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
                
                const distance = calculateDistanceMeters(homeLat, homeLng, currentLat, currentLng);
                
                if (distance > 100) {
                  const now = Date.now();
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
