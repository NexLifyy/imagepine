"use client";

import React from 'react';
import SavingsPill, { formatBytes } from './SavingsPill';

export default function ImageResultBar({
  originalSize,
  compressedSize,
  dimensions = null,
  label = 'Output',
  onDownload = null,
  downloadLabel = 'Download',
  className = '',
  style = {},
}) {
  if (!compressedSize) return null;

  const savings = originalSize && compressedSize ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;
  const isPositive = savings > 0;

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
            }}
          >
            ↓ {downloadLabel}
          </button>
        )}
      </div>
    </div>
  );
}
