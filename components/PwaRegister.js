"use client";

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => {
            // Service worker registered successfully
          })
          .catch((err) => {
            console.debug('SW registration notice:', err);
          });
      });
    }
  }, []);

  return null;
}
