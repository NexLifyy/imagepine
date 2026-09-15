"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { toolsData, categories } from '@/lib/toolsData';
import ToolIcon from '@/components/ToolIcon';
import WindowDropOverlay from '@/components/WindowDropOverlay';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Filter tools by active category and search keyword
  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inName = tool.name.toLowerCase().includes(q);
      const inDesc = tool.description.toLowerCase().includes(q);
      const inKeywords = tool.keywords?.some((k) => k.toLowerCase().includes(q));
      return inName || inDesc || inKeywords;
    });
  }, [selectedCategory, searchQuery]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: toolsData.length };
    categories.forEach((c) => {
      if (c.id !== 'all') {
        counts[c.id] = toolsData.filter((t) => t.category === c.id).length;
      }
    });
    return counts;
  }, []);

  const trendingTools = useMemo(() => {
    return toolsData.filter((t) => t.trending);
  }, []);

  const spotlightCandidates = useMemo(() => {
    return toolsData.filter((t) => t.trending || t.featured);
  }, []);

  const [toolOfTheDay, setToolOfTheDay] = useState(() => {
    return toolsData.find((t) => t.id === 'image-compressor') || toolsData[0];
  });

  useEffect(() => {
    if (spotlightCandidates.length > 0) {
      // Rotate tool every 12 hours based on current timestamp
      const slot = Math.floor(Date.now() / (12 * 60 * 60 * 1000));
      const idx = Math.abs(slot) % spotlightCandidates.length;
      setToolOfTheDay(spotlightCandidates[idx]);
    }
  }, [spotlightCandidates]);

  const [searchPlaceholder, setSearchPlaceholder] = useState('Search 40+ tools...');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        const el = document.getElementById('landing-search-input');
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 640) {
        setSearchPlaceholder('Search 40+ tools... (e.g. compress, convert, png to jpg, ocr, meme, qr, pdf)');
      } else {
        setSearchPlaceholder('Search 40+ tools...');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "Are all 40+ tools really 100% free to use?",
      a: "Yes, completely free forever. There are no paid tiers, subscription limits, file count caps, or hidden paywalls. Every tool is available without restrictions."
    },
    {
      q: "Are my photos or files uploaded to any servers?",
      a: "No. Never. Every tool processes your images 100% locally in your web browser. Your private images and files never leave your device or get uploaded to any servers."
    },
    {
      q: "Do I need to create an account or sign in?",
      a: "No account, no sign-up, and no email address is required. You can start using any tool immediately with zero friction."
    },
    {
      q: "Can I batch process multiple images at the same time?",
      a: "Yes! Our core tools, including Image Compressor, Universal Image Converter, Bulk Resizer, and Bulk Renamer, support multi-file queues and 1-click 'Download All as ZIP' batch downloads."
    },
    {
      q: "Will ImagePine put watermarks or logos on my images?",
      a: "No. ImagePine never overlays watermarks or logos on your exported files. All outputs remain clean and professional."
    },
    {
      q: "What file formats does ImagePine support?",
      a: "ImagePine supports all modern and legacy image and document formats including JPG, PNG, WebP, SVG, AVIF, HEIC, TIFF, BMP, GIF, ICO, and PDF."
    }
  ];

  return (
    <div style={{ background: '#F7F7FB', minHeight: '100vh', color: '#111128' }}>
      {/* Full-window drag & drop overlay */}
      <WindowDropOverlay
        onDropFiles={(files) => {
          if (files && files.length > 0) {
            window.location.href = '/compress';
          }
        }}
      />

      {/* Structured Data (WebApplication & FAQPage JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "ImagePine",
                "url": "https://www.imagepine.com",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "All",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                "description": "Free online suite of 40+ private image tools. Compress, convert, resize, crop, and edit images instantly in your browser."
              },
              {
                "@type": "FAQPage",
                "mainEntity": faqs.map((f) => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": { "@type": "Answer", "text": f.a }
                }))
              }
            ]
          }),
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
          1. HERO SECTION
         ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(115, 66, 230, 0.08) 0%, rgba(255, 255, 255, 0.9) 70%, #F7F7FB 100%)',
          padding: '70px 20px 48px',
          textAlign: 'center',
          borderBottom: '1px solid #E4E4EF',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(32px, 5.5vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              margin: '0 0 16px',
              color: '#111128',
            }}
          >
            40+ Free{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7342E6 0%, #9061F9 50%, #5B5BD6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Image Tools
            </span>{' '}
            for Creators
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(15px, 2.2vw, 18px)',
              color: '#6B6B8A',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: 620,
              margin: '0 auto 32px',
            }}
          >
            Powerful compression, format conversion, editing &amp; creative image utilities all in one place, completely free &amp; 100% private in your browser.
          </p>

          {/* Action Buttons — always side-by-side, adjusts smoothly on small screens */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: 440,
              width: '100%',
              margin: '0 auto 28px',
            }}
          >
            <a
              href="#tools-directory"
              style={{
                flex: '1 1 0',
                minWidth: 0,
                background: 'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 'clamp(12px, 3.4vw, 14px)',
                padding: '13px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 4px 18px rgba(91,91,214,0.32)',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
              <span>Explore Tools</span>
            </a>

            <Link
              href="/image-studio"
              style={{
                flex: '1 1 0',
                minWidth: 0,
                background: '#FFFFFF',
                color: '#111128',
                fontWeight: 700,
                fontSize: 'clamp(12px, 3.4vw, 14px)',
                padding: '13px 12px',
                borderRadius: 12,
                border: '1.5px solid #E4E4EF',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7342E6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Image Studio</span>
            </Link>
          </div>

          {/* Micro Trust Badges — clean column on mobile, horizontal row with dots on desktop */}
          <style>{`
            .hero-trust-badges {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              font-size: 12px;
              font-weight: 600;
              color: #6B6B8A;
            }
            .hero-trust-dot {
              display: none;
            }
            @media (min-width: 640px) {
              .hero-trust-badges {
                flex-direction: row;
                justify-content: center;
                gap: 16px;
              }
              .hero-trust-dot {
                display: inline;
                color: #C4C4D9;
              }
            }
          `}</style>
          <div className="hero-trust-badges">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" fill="none" stroke="#16A34A" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              100% Private (No Uploads)
            </span>
            <span className="hero-trust-dot">·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" fill="none" stroke="#7342E6" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Instant Browser Processing
            </span>
            <span className="hero-trust-dot">·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" fill="none" stroke="#F59E0B" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Forever Free &amp; Unlimited
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. SEARCH & CATEGORY FILTER BAR
         ════════════════════════════════════════════════════════════════ */}
      <section id="tools-directory" className="tools-directory-section">
        <style>{`
          .tools-directory-section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px 24px;
          }
          .landing-search-container {
            background: #FFFFFF;
            border: 1.5px solid #E4E4EF;
            border-radius: 16px;
            padding: 6px 8px 6px 18px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            box-sizing: border-box;
            width: 100%;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .landing-search-container:focus-within {
            border-color: #7342E6;
            box-shadow: 0 4px 20px rgba(115, 66, 230, 0.12);
          }
          .landing-search-input {
            flex: 1;
            min-width: 0;
            width: 100%;
            border: none;
            outline: none;
            font-size: 14px;
            font-weight: 600;
            color: #111128;
            background: transparent;
            padding: 8px 0;
          }
          .landing-search-btn {
            flex-shrink: 0;
            background: linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%);
            color: #FFFFFF;
            border: none;
            border-radius: 10px;
            padding: 9px 18px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(91,91,214,0.25);
            white-space: nowrap;
          }
          .category-filter-row {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 6px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .category-filter-row::-webkit-scrollbar {
            display: none;
          }
          @media (max-width: 640px) {
            .tools-directory-section {
              padding: 28px 16px 20px;
            }
            .landing-search-container {
              padding: 5px 6px 5px 12px;
              gap: 8px;
              border-radius: 14px;
            }
            .landing-search-input {
              font-size: 13px;
              padding: 6px 0;
            }
            .landing-search-btn {
              padding: 8px 14px;
              font-size: 12.5px;
              border-radius: 9px;
            }
          }
          .landing-search-kbd {
            display: inline-flex;
            align-items: center;
            background: #F4F4F8;
            border: 1px solid #DCDCE8;
            border-radius: 6px;
            padding: 3px 7px;
            font-size: 11px;
            font-weight: 700;
            color: #8C8CA8;
            font-family: inherit;
            flex-shrink: 0;
            user-select: none;
          }
          @media (max-width: 640px) {
            .landing-search-kbd {
              display: none !important;
            }
          }
          @media (min-width: 768px) {
            .category-filter-row {
              justify-content: center;
              flex-wrap: wrap;
            }
          }
        `}</style>

        {/* Search Bar */}
        <div className="landing-search-container">
          <svg width="18" height="18" fill="none" stroke="#9898B5" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="landing-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="landing-search-input"
          />
          <kbd className="landing-search-kbd" title="Press / or Ctrl+K to search">
            Ctrl K
          </kbd>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                flexShrink: 0,
                background: '#F1F1F7',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#6B6B8A',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          )}
          <button
            type="button"
            className="landing-search-btn"
          >
            Search
          </button>
        </div>

        {/* Popular Quick Search Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 18, padding: '0 2px' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#9898B5', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: 2 }}>
            Popular:
          </span>
          {[
            { label: 'Compress JPG', q: 'compress jpg' },
            { label: 'PNG to JPG', q: 'png to jpg' },
            { label: 'Crop Photo', q: 'crop' },
            { label: 'HEIC to JPG', q: 'heic' },
            { label: 'Bulk Resize', q: 'bulk resize' },
            { label: 'OCR Text', q: 'ocr' },
            { label: 'PDF to Image', q: 'pdf' },
          ].map((tag) => {
            const isActive = searchQuery.toLowerCase() === tag.q;
            return (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery(isActive ? '' : tag.q);
                }}
                style={{
                  background: isActive ? '#EDE9FE' : '#FFFFFF',
                  border: `1.5px solid ${isActive ? '#7342E6' : '#E4E4EF'}`,
                  borderRadius: 99,
                  padding: '5px 12px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: isActive ? '#7342E6' : '#555577',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
                className="hover:border-[#7342E6] hover:text-[#7342E6]"
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Match Counter */}
        {searchQuery.trim() && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, fontSize: 13, color: '#6B6B8A', padding: '0 4px' }}>
            <span>
              Found <strong style={{ color: '#111128' }}>{filteredTools.length}</strong> matching {filteredTools.length === 1 ? 'tool' : 'tools'} for "{searchQuery}"
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#7342E6', fontWeight: 700, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear Search
            </button>
          </div>
        )}
        <div className="category-filter-row">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? '#7342E6' : '#E4E4EF'}`,
                  background: isSelected ? 'linear-gradient(135deg, #7342E6 0%, #5B5BD6 100%)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#6B6B8A',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 14px rgba(115,66,230,0.25)' : '0 1px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.18s ease',
                }}
              >
                <ToolIcon name={cat.icon} size={15} />
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 99,
                    background: isSelected ? 'rgba(255,255,255,0.22)' : '#F1F1F7',
                    color: isSelected ? '#FFFFFF' : '#9898B5',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. 3-COLUMN TOOLS DIRECTORY GRID
         ════════════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 20px 60px' }}>
        {filteredTools.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #E4E4EF', borderRadius: 18, padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#7342E6' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111128', margin: '0 0 8px' }}>No tools matched your search</h3>
            <p style={{ fontSize: 13, color: '#6B6B8A', margin: '0 0 20px' }}>Try searching for a different keyword like "compress", "convert", "crop", or "pdf".</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              style={{ background: '#7342E6', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  border: '1.5px solid #E4E4EF',
                  borderRadius: 18,
                  padding: '22px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  transition: 'all 0.22s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="group hover:border-[#7342E6] hover:shadow-lg hover:-translate-y-1"
              >
                {/* Header: Icon & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#F5F3FF',
                      border: '1px solid #DDD6FE',
                      color: '#7342E6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ToolIcon name={tool.icon} size={22} />
                  </div>

                  {tool.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        padding: '4px 9px',
                        borderRadius: 6,
                        background: tool.badge === 'POPULAR' ? '#FEF3C7' : '#EDE9FE',
                        color: tool.badge === 'POPULAR' ? '#D97706' : '#7342E6',
                        border: `1px solid ${tool.badge === 'POPULAR' ? '#FDE68A' : '#DDD6FE'}`,
                      }}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#111128',
                    letterSpacing: '-0.02em',
                    margin: '0 0 8px',
                  }}
                  className="group-hover:text-[#7342E6] transition-colors"
                >
                  {tool.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13,
                    color: '#6B6B8A',
                    lineHeight: 1.55,
                    margin: '0 0 18px',
                    flexGrow: 1,
                  }}
                >
                  {tool.description}
                </p>

                {/* Footer Action */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid #F1F1F7',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9898B5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {tool.category === 'compress-resize' ? 'Compress' : tool.category === 'convert' ? 'Convert' : tool.category === 'creative' ? 'Creative' : 'Utility'}
                  </span>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#7342E6',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      letterSpacing: '0.02em',
                    }}
                  >
                    USE TOOL
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      style={{ transition: 'transform 0.2s' }}
                      className="group-hover:translate-x-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. "TRENDING TOOLS" MOVING RIBBON
         ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E4E4EF', borderBottom: '1px solid #E4E4EF', padding: '36px 0', overflow: 'hidden' }}>
        <style>{`
          @keyframes ribbonScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ribbon-track {
            display: flex;
            width: max-content;
            gap: 16px;
            animation: ribbonScroll 32s linear infinite;
          }
          .ribbon-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ToolIcon name="flame" size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111128', margin: 0 }}>Trending Tools This Week</h3>
              <p style={{ fontSize: 12, color: '#6B6B8A', margin: '2px 0 0' }}>Most popular image tools used by creators and designers</p>
            </div>
          </div>
          <a href="#tools-directory" style={{ fontSize: 12, fontWeight: 800, color: '#7342E6', textDecoration: 'none' }}>
            View All 40+ Tools →
          </a>
        </div>

        {/* Continuous Moving Ribbon */}
        <div
          style={{
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            padding: '6px 0',
            maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
          }}
        >
          <div className="ribbon-track">
            {[...trendingTools, ...trendingTools].map((t, idx) => (
              <Link
                key={`${t.id}-${idx}`}
                href={t.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: '#F8F9FD',
                  border: '1.5px solid #E4E4EF',
                  textDecoration: 'none',
                  color: 'inherit',
                  minWidth: 230,
                  maxWidth: 270,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.18s ease',
                }}
                className="hover:border-[#7342E6] hover:bg-white hover:shadow-md hover:-translate-y-0.5"
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EDE9FE', color: '#7342E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ToolIcon name={t.icon} size={19} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#111128', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                    Trending
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. TOOL OF THE DAY · ROTATING EVERY 12 HOURS
         ════════════════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8FF 100%)',
            border: '2px solid #E0DBF9',
            borderRadius: 22,
            padding: '32px 30px',
            boxShadow: '0 8px 32px rgba(115,66,230,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Tool of the Day Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#EDE9FE',
                border: '1px solid #DDD6FE',
                padding: '6px 14px',
                borderRadius: 99,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7342E6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#7342E6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Tool of the Day
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #7342E6 0%, #5B5BD6 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(115,66,230,0.3)',
                flexShrink: 0,
              }}
            >
              <ToolIcon name={toolOfTheDay.icon} size={32} />
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111128', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                {toolOfTheDay.name}
              </h2>
              <p style={{ fontSize: 14, color: '#6B6B8A', lineHeight: 1.6, margin: '0 0 16px' }}>
                {toolOfTheDay.description}
              </p>

              {/* Benefit checkmarks — simple, friendly, no technical jargon */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, fontWeight: 700, color: '#4E4E6D' }}>
                <span>✓ Fast Browser Processing</span>
                <span>✓ High-Quality Output</span>
                <span>✓ 1-Click Instant Export</span>
              </div>
            </div>

            <div>
              <Link
                href={toolOfTheDay.href}
                style={{
                  background: 'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 14,
                  padding: '14px 28px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 18px rgba(91,91,214,0.35)',
                  whiteSpace: 'nowrap',
                }}
              >
                Launch Tool Now
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. "WHY DIGITAL CREATORS CHOOSE IMAGEPINE" (VALUE PROPS)
         ════════════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #E4E4EF', background: '#FFFFFF', padding: '68px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-block', background: '#EDE9FE', color: '#7342E6', fontSize: 11, fontWeight: 800, padding: '5px 16px', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, border: '1px solid #DDD6FE' }}>
              The ImagePine Advantage
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#111128', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
              Why Digital Creators Choose ImagePine
            </h2>
            <p style={{ fontSize: 15, color: '#6B6B8A', maxWidth: 500, margin: '0 auto' }}>
              Built from the ground up for blistering speed, uncompromised quality, and complete on-device privacy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              {
                icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>),
                title: 'Blazing Fast Processing',
                desc: 'Your photos and documents process instantly right on your device, with zero waiting on slow server queues or upload delays.'
              },
              {
                icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
                title: '100% Private & Secure',
                desc: 'Your photos and documents never touch a remote server. Zero cloud uploads, zero data logs, and complete privacy guaranteed.'
              },
              {
                icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>),
                title: 'Always Free & Unlimited',
                desc: 'Enjoy full unrestricted access with no subscription paywalls, no daily file limits, and zero watermarks on your work.'
              },
              {
                icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
                title: 'Zero Registration Needed',
                desc: 'No signup forms, passwords, or emails required. Open any tool and finish your task in seconds.'
              },
              {
                icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>),
                title: 'Works on Every Device',
                desc: 'Engineered for smooth responsiveness across desktop, laptop, tablet, iPhone, and Android web browsers.'
              },
              {
                icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>),
                title: 'All-in-One Utility Suite',
                desc: 'Over 40+ specialized tools: compression, format conversion, vectorization, OCR text extraction, QR codes, and PDF tools.'
              }
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: '#F8F9FD',
                  border: '1.5px solid #E4E4EF',
                  borderRadius: 16,
                  padding: '24px',
                  transition: 'all 0.18s ease',
                }}
                className="hover:border-[#7342E6] hover:bg-white hover:shadow-sm"
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#EDE9FE',
                    color: '#7342E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111128', margin: '0 0 8px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: '#6B6B8A', lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. SEO FAQS & ACCORDION
         ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '68px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ display: 'inline-block', background: '#EDE9FE', color: '#7342E6', fontSize: 11, fontWeight: 800, padding: '5px 16px', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, border: '1px solid #DDD6FE' }}>
              Frequently Asked Questions
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#111128', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: 14, color: '#6B6B8A', margin: 0 }}>
              Everything you need to know about ImagePine tools and privacy.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  border: '1.5px solid #E4E4EF',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: openFaqIndex === i ? '#FAF8FF' : '#FFFFFF',
                  transition: 'background 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111128' }}>
                    {faq.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#7342E6"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{
                      flexShrink: 0,
                      transform: openFaqIndex === i ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqIndex === i && (
                  <div
                    style={{
                      padding: '0 20px 18px',
                      fontSize: 14,
                      color: '#6B6B8A',
                      lineHeight: 1.7,
                    }}
                    className="animate-fade-in"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          7. PRE-FOOTER ALL-IN-ONE STUDIO BANNER
         ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 20px 64px' }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #7342E6 0%, #5B5BD6 100%)',
            borderRadius: 24,
            padding: '44px 36px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: '0 12px 36px rgba(115, 66, 230, 0.22)',
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 99,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              All-In-One Workspace
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>
              Prefer a single editor for all your photos?
            </h2>
            <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
              Try <strong>Image Studio</strong> to compress, resize, rotate, flip, and inspect images side-by-side with a live before/after slider — completely free in your browser.
            </p>
          </div>
          <div>
            <Link
              href="/image-studio"
              style={{
                background: '#FFFFFF',
                color: '#7342E6',
                fontWeight: 800,
                fontSize: 14,
                padding: '14px 28px',
                borderRadius: 12,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                whiteSpace: 'nowrap',
              }}
              className="hover:scale-105 transition-transform"
            >
              Open Image Studio
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7342E6 0%, #5B5BD6 100%)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 4px 18px rgba(115, 66, 230, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'all 0.2s ease',
          }}
          className="hover:scale-110 active:scale-95"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
