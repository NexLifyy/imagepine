"use client";

import React, { useState, useEffect, useRef } from 'react';

/**
 * WindowDropOverlay - Listens to window-level drag events.
 * When files are dragged anywhere over the browser window,
 * displays a sleek, backdrop-blurred full-screen drop zone.
 *
 * Props:
 *   onDropFiles: (files: File[]) => void
 *   acceptedExtensions?: string[] (e.g. ['.jpg', '.png', '.webp'])
 *   enabled?: boolean (default true)
 */
export default function WindowDropOverlay({
  onDropFiles,
  acceptedExtensions = [],
  enabled = true,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleDragEnter = (e) => {
      e.preventDefault();
      // Check if drag event contains files
      if (e.dataTransfer && e.dataTransfer.types) {
        const types = Array.from(e.dataTransfer.types);
        if (types.includes('Files')) {
          dragCounter.current += 1;
          setIsDragging(true);
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);

      if (!e.dataTransfer || !e.dataTransfer.files) return;

      const rawFiles = Array.from(e.dataTransfer.files);
      if (rawFiles.length === 0) return;

      // Filter by extensions if provided
      let validFiles = rawFiles;
      if (acceptedExtensions.length > 0) {
        const exts = acceptedExtensions.map((x) => x.toLowerCase().trim());
        validFiles = rawFiles.filter((file) => {
          const name = file.name.toLowerCase();
          return exts.some((ext) => name.endsWith(ext));
        });
      }

      if (validFiles.length > 0 && onDropFiles) {
        onDropFiles(validFiles);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [enabled, onDropFiles, acceptedExtensions]);

  if (!isDragging) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(17, 17, 40, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        pointerEvents: 'all',
        animation: 'overlayFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          border: '2.5px dashed rgba(255, 255, 255, 0.85)',
          borderRadius: 24,
          padding: '48px 32px',
          background: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 16,
          color: '#ffffff',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            background: 'linear-gradient(135deg, #7342E6 0%, #9333EA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(115, 66, 230, 0.5)',
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease',
          }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          Drop image anywhere to open
        </h2>

        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            margin: 0,
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: 400,
            lineHeight: 1.5,
          }}
        >
          Release to immediately load into ImagePine. 100% private in your browser.
        </p>
      </div>

      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
