import { useState, useEffect } from 'react';

export const useVRSession = () => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVRSupport = async () => {
      try {
        const supported = 'xr' in navigator && await (navigator as any).xr.isSessionSupported('immersive-vr');
        setIsVRSupported(supported);
      } catch {
        setIsVRSupported(false);
      } finally {
        setLoading(false);
      }
    };

    checkVRSupport();
  }, []);
  
  return {
    isVRSupported,
    loading
  };
};