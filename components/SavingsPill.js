"use client";

import React from 'react';

export const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function SavingsPill({
  originalSize,
  compressedSize,
  className = '',
  style = {},
  size = 'md',
  floating = false,
}) {
  if (!originalSize || !compressedSize) return null;

  const savedBytes = originalSize - compressedSize;
  const percentage = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  if (percentage <= 0) return null;

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const origFormatted = formatBytes(originalSize);
  const compFormatted = formatBytes(compressedSize);

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)',
        border: '1.5px solid #86EFAC',
        borderRadius: 999,
        padding: isSmall ? '3px 10px' : isLarge ? '8px 18px' : '5px 14px',
        boxShadow: floating
          ? '0 4px 16px rgba(22, 163, 74, 0.18), 0 2px 6px rgba(0, 0, 0, 0.04)'
          : '0 1px 3px rgba(22, 163, 74, 0.12)',
        color: '#14532D',
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        transition: 'all 0.2s ease',
        pointerEvents: 'auto',
        ...style,
      }}
    >
      {/* Down arrow circle */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isSmall ? 15 : isLarge ? 22 : 18,
          height: isSmall ? 15 : isLarge ? 22 : 18,
          borderRadius: '50%',
          background: '#16A34A',
          color: '#ffffff',
          flexShrink: 0,
        }}
      >
        <svg
          width={isSmall ? 8 : isLarge ? 12 : 10}
          height={isSmall ? 8 : isLarge ? 12 : 10}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16m7-7l-7 7-7-7" />
        </svg>
      </span>

      {/* Main text: "68% saved" */}
      <span
        style={{
          fontWeight: 800,
          fontSize: isSmall ? 11 : isLarge ? 14 : 12,
          color: '#15803D',
          whiteSpace: 'nowrap',
        }}
      >
        {percentage}% saved
      </span>

      {/* Details: "(3.2 MB → 1.0 MB)" */}
      <span
        style={{
          fontSize: isSmall ? 10 : isLarge ? 12 : 11,
          fontWeight: 600,
          color: '#166534',
          opacity: 0.9,
          whiteSpace: 'nowrap',
        }}
      >
        ({origFormatted} → {compFormatted})
      </span>
    </div>
  );
}
