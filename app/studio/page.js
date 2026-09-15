"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudioRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/image-studio');
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6B8A', fontFamily: 'inherit' }}>
      <p>Redirecting to Image Studio...</p>
    </div>
  );
}
