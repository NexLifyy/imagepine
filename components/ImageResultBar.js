"use client";

import React, { useState } from 'react';
import SavingsPill, { formatBytes } from './SavingsPill';

async function convertBlobToPng(blob) {
  if (blob.type === 'image/png') return blob;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Canvas 2D context unavailable'));
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error('Failed to convert blob to PNG'));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for clipboard copy'));
    };
    img.src = url;
  });
}

export default function ImageResultBar({
  originalSize,
  compressedSize,
  dimensions = null,
  label = 'Output',
  onDownload = null,
  downloadLabel = 'Download',
  onCopy = null,
  imageBlob = null,
  imageUrl = null,
  className = '',
  style = {},
}) {
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied' | 'error'

  if (!compressedSize) return null;

  const savings = originalSize && compressedSize ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;
  const isPositive = savings > 0;

  const handleCopy = async () => {
    try {
      if (onCopy) {
        await onCopy();
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 2200);
        return;
      }

      if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
        throw new Error('Clipboard API not supported');
      }

      let sourceBlob = imageBlob;
      if (!sourceBlob && imageUrl) {
        const res = await fetch(imageUrl);
        sourceBlob = await res.blob();
      }

      if (!sourceBlob) {
        throw new Error('No image available to copy');
      }

      const pngBlob = await convertBlobToPng(sourceBlob);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob }),
      ]);

      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2200);
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2200);
    }
  };

  const showCopyBtn = Boolean(onCopy || imageBlob || imageUrl);

  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        marginTop: 14,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: '14px 18px',
        background: isPositive ? '#F0FDF4' : '#F7F7FB',
        border: `1px solid ${isPositive ? '#BBF7D0' : '#E4E4EF'}`,
        borderRadius: 12,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: isPositive ? '#22C55E' : '#5B5BD6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 800, color: isPositive ? '#16A34A' : '#111128', margin: 0 }}>
            {label}: {dimensions ? `${dimensions} · ` : ''}{formatBytes(compressedSize)}
          </p>
          {originalSize ? (
            <p style={{ fontSize: 11, color: isPositive ? '#4ADE80' : '#9898B5', fontWeight: 600, margin: '2px 0 0' }}>
              Original: {formatBytes(originalSize)}
            </p>
          ) : null}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {isPositive && (
          <SavingsPill originalSize={originalSize} compressedSize={compressedSize} size="md" showDetails={false} />
        )}

        {showCopyBtn && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy image to clipboard to paste into Discord, Slack, WhatsApp, Figma, or Docs"
            style={{
              background: copyState === 'copied' ? '#DCFCE7' : copyState === 'error' ? '#FEE2E2' : '#FFFFFF',
              color: copyState === 'copied' ? '#16A34A' : copyState === 'error' ? '#DC2626' : '#4E4E6D',
              fontSize: 11,
              fontWeight: 700,
              padding: '7px 14px',
              borderRadius: 8,
              border: `1px solid ${copyState === 'copied' ? '#86EFAC' : copyState === 'error' ? '#FECACA' : '#D1D1E4'}`,
              cursor: 'pointer',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.18s ease',
            }}
          >
            {copyState === 'copied' ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied! ✓
              </>
            ) : copyState === 'error' ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Copy Failed
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                📋 Copy Image
              </>
            )}
          </button>
        )}

        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            style={{
              background: '#22C55E',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '7px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(34,197,94,0.25)',
              transition: 'background 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ↓ {downloadLabel}
          </button>
        )}
      </div>
    </div>
  );
}
