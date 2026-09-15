"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ToolPageShell from '@/components/ToolPageShell';

// Dynamically load WhiteboardCanvas on client side only
const WhiteboardCanvas = dynamic(
  () => import('@/components/WhiteboardCanvas'),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: '100%', height: '720px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', borderRadius: 20, border: '1.5px solid #E4E4EF' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #7342E6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 14 }}></div>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#111128', margin: 0 }}>Loading Whiteboard Studio...</p>
        <p style={{ fontSize: 12, color: '#6B6B8A', marginTop: 4 }}>100% Private &amp; In-Browser Canvas</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

const _FEATURES = [
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    title: 'Hand-Drawn Style',
    desc: 'Sketch flowcharts, wireframes, and mind maps with natural, expressive hand-drawn shapes.'
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Annotate Photos & Images',
    desc: 'Drag and drop any image directly onto the canvas to highlight, sketch over, or add callouts.'
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '100% Private & In-Browser',
    desc: 'Everything runs completely on your device. Your drawings and images are never uploaded to any server.'
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'PNG & SVG Vector Export',
    desc: 'Export at full resolution (1x, 2x, 3x scale) with transparent or solid backgrounds, or copy to clipboard.'
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
    title: 'Save & Reopen Projects (.ipdraw)',
    desc: 'Save editable .ipdraw project files to your computer and reload them anytime without an account.'
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Rich Icon & Shape Libraries',
    desc: 'Browse hundreds of community-crafted shapes: system design icons, cloud diagrams, and UI mockups.'
  }
];

const _STEPS = [
  { n: '1', title: 'Start Drawing or Drop Image', desc: 'Pick any shape from the top toolbar, or drag and drop an image onto the canvas.' },
  { n: '2', title: 'Customize & Annotate', desc: 'Adjust colors, stroke widths, fill styles, arrows, and add text captions.' },
  { n: '3', title: 'Export & Share', desc: 'Save as an on-brand .ipdraw project file, or export as crisp PNG or vector SVG.' }
];

const _FAQS = [
  {
    q: "What is ImagePine Whiteboard Studio?",
    a: "ImagePine Whiteboard Studio is a private, in-browser visual canvas that lets you easily sketch diagrams, wireframes, and mind maps with a clean hand-drawn feel. It supports flowcharts, system architectures, UI mockups, and quick photo annotations."
  },
  {
    q: "Can I drop my own images onto the canvas to draw over them?",
    a: "Yes! You can drag and drop any image (JPG, PNG, WebP, SVG) straight into the canvas. You can then resize the image, draw arrows, circle important elements, and write text notes directly on top."
  },
  {
    q: "Are my whiteboard drawings or images sent to any server?",
    a: "No. Never. The whiteboard runs 100% locally in your web browser using HTML5 Canvas. None of your drawings, diagrams, or imported pictures leave your device."
  },
  {
    q: "What export formats are supported?",
    a: "You can save your editable project as an on-brand .ipdraw file to continue editing anytime. You can also export as high-resolution PNG (with transparent or solid background, at 1x, 2x, or 3x scale), vector SVG, or copy it directly to your clipboard."
  },
  {
    q: "Can I save my work and continue editing later?",
    a: "Yes. Click 'Save (.ipdraw)' in the top menu or toolbar to download your editable project file. Later, click 'Open' to reload your canvas and resume editing right where you left off."
  },
  {
    q: "Does Whiteboard Studio support touch screens and stylus pens?",
    a: "Yes! It features first-class touch, Apple Pencil, and pressure-sensitive stylus support on iPad, Android tablets, touch laptops, and Microsoft Surface devices."
  }
];

export default function WhiteboardPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Esc key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  return (
    <ToolPageShell
      title="Online Whiteboard &amp; Diagram Studio"
      subtitle="Hand-drawn flowcharts, wireframes, mind maps, and image annotations. 100% private, free forever in your browser."
      features={_FEATURES}
      steps={_STEPS}
      faqs={_FAQS}
      openFaq={openFaq}
      toggleFaq={(idx) => setOpenFaq(openFaq === idx ? null : idx)}
    >
      {/* Studio Header Toolbar (Normal Mode) */}
      <div style={{ maxWidth: 1200, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B6B8A', fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EDE9FE', color: '#7342E6', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7342E6' }} />
            Ready to Draw
          </span>
          <span className="hidden sm:inline">💡 Drag &amp; drop any image onto the board to annotate it</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullScreen(!isFullScreen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#FFFFFF',
            border: '1.5px solid #E4E4EF',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12.5,
            fontWeight: 700,
            color: '#111128',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
          className="hover:border-[#7342E6] hover:text-[#7342E6]"
        >
          {isFullScreen ? (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
              Exit Fullscreen (Esc)
            </>
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              Fullscreen Mode
            </>
          )}
        </button>
      </div>

      {/* Main Canvas Workspace Container */}
      <div
        style={{
          width: '100%',
          maxWidth: isFullScreen ? '100vw' : 1200,
          margin: '0 auto',
          height: isFullScreen ? '100vh' : '720px',
          position: isFullScreen ? 'fixed' : 'relative',
          top: isFullScreen ? 0 : 'auto',
          left: isFullScreen ? 0 : 'auto',
          zIndex: isFullScreen ? 99999 : 1,
          background: '#FFFFFF',
          borderRadius: isFullScreen ? 0 : 20,
          border: isFullScreen ? 'none' : '1.5px solid #E4E4EF',
          overflow: 'hidden',
          boxShadow: isFullScreen ? 'none' : '0 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        <WhiteboardCanvas isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      </div>
    </ToolPageShell>
  );
}
