'use client';

import { throttle } from 'es-toolkit';
import { useEffect, useState } from 'react';

export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const checkIsMobile = throttle(() => {
      setIsMobile(window.innerWidth < 768);
    }, 200);

    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('scroll', checkIsMobile);
    checkIsMobile();

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', checkIsMobile);
    };
  }, []);

  return { isMobile };
};
