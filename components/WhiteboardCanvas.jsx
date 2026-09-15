"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Excalidraw, MainMenu } from '@excalidraw/excalidraw';
import "@excalidraw/excalidraw/index.css";

export default function WhiteboardCanvas({ isFullScreen, setIsFullScreen }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState(null);

  // Show temporary toast notification
  const showToast = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // Save project as branded .ipdraw file
  const handleSaveProject = useCallback(() => {
    if (!excalidrawAPI) {
      showToast("Canvas is still loading, please wait...", "error");
      return;
    }

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      if (!elements || elements.length === 0) {
        showToast("Canvas is empty. Draw something before saving!", "info");
      }

      // Structure compatible with Excalidraw loaders but branded for ImagePine
      const projectData = {
        type: "excalidraw",
        version: 2,
        source: "https://imagepine.com/whiteboard",
        generator: "ImagePine Whiteboard Studio",
        exportedAt: new Date().toISOString(),
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor || "#ffffff",
          gridSize: appState.gridSize || null,
        },
        files: files || {},
      };

      const jsonString = JSON.stringify(projectData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `imagepine-board-${dateStr}.ipdraw`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("Project saved as .ipdraw!");
    } catch (err) {
      console.error("Error saving ImagePine project:", err);
      showToast("Failed to save project file.", "error");
    }
  }, [excalidrawAPI, showToast]);

  // Trigger hidden file picker
  const handleOpenClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  // Read uploaded project file (.ipdraw, .excalidraw, or .json)
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file || !excalidrawAPI) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        const data = JSON.parse(text);

        if (Array.isArray(data.elements)) {
          excalidrawAPI.updateScene({
            elements: data.elements,
            appState: data.appState ? {
              viewBackgroundColor: data.appState.viewBackgroundColor || '#ffffff',
              gridSize: data.appState.gridSize || null,
            } : undefined,
          });

          if (data.files && typeof data.files === 'object') {
            const filesList = Object.values(data.files);
            if (filesList.length > 0) {
              excalidrawAPI.addFiles(filesList);
            }
          }

          showToast("Project loaded successfully!");
        } else {
          showToast("Unrecognized file structure. Expected an .ipdraw or .excalidraw file.", "error");
        }
      } catch (err) {
        console.error("Error reading project file:", err);
        showToast("Could not parse file. Make sure it's a valid .ipdraw file.", "error");
      }
    };
    reader.readAsText(file);
  }, [excalidrawAPI, showToast]);

  // Handle ESC to exit fullscreen
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullScreen, setIsFullScreen]);

  return (
    <>
      {/* Hidden file input for opening .ipdraw / .excalidraw projects */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".ipdraw,.excalidraw,.json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Floating Exit Fullscreen & Quick Actions Bar when in Fullscreen Mode */}
      {isFullScreen && (
        <div
          style={{
            position: 'fixed',
            top: 14,
            right: 18,
            zIndex: 100002,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            padding: '6px 10px',
            borderRadius: 14,
            border: '1.5px solid #E4E4EF',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Quick Save Project */}
          <button
            type="button"
            onClick={handleSaveProject}
            title="Save project as on-brand .ipdraw file"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: 9,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: '#7342E6',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save (.ipdraw)
          </button>

          {/* Quick Open Project */}
          <button
            type="button"
            onClick={handleOpenClick}
            title="Open an existing .ipdraw or .excalidraw file"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#F8F8FC',
              border: '1px solid #E4E4EF',
              borderRadius: 9,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: '#33334F',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Open
          </button>

          {/* Prominent Exit Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullScreen(false)}
            title="Exit Fullscreen Mode (or press Escape)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: '#7342E6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 9,
              padding: '7px 15px',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(115, 66, 230, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
            Exit Fullscreen
            <span style={{ fontSize: 10.5, opacity: 0.85, background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: 4, marginLeft: 2 }}>
              Esc
            </span>
          </button>
        </div>
      )}

      {/* Floating Notification Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100003,
            background: notification.type === 'error' ? '#EF4444' : notification.type === 'info' ? '#3B82F6' : '#10B981',
            color: '#FFFFFF',
            padding: '9px 18px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Excalidraw Canvas Wrapper with Link Suppression CSS */}
      <div
        className="imagepine-whiteboard-wrapper"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          theme="light"
          name="ImagePine-Board"
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: true,
              export: false, // We provide custom on-brand .ipdraw export
              loadScene: false, // We provide custom on-brand project loader
              saveToActiveFile: false,
              theme: true,
              saveAsImage: true,
            },
          }}
        >
          {/* Custom On-Brand Main Menu: strips out Excalidraw community/social links */}
          <MainMenu>
            <MainMenu.Item
              icon={
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              }
              onSelect={handleSaveProject}
            >
              Save ImagePine Board (.ipdraw)
            </MainMenu.Item>

            <MainMenu.Item
              icon={
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              }
              onSelect={handleOpenClick}
            >
              Open Project (.ipdraw / .excalidraw)
            </MainMenu.Item>

            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            {/* Note: Socials and external community links are intentionally excluded */}
          </MainMenu>
        </Excalidraw>

        {/* Global Injected CSS to hide any external Excalidraw links, Help header, etc. */}
        <style jsx global>{`
          /* 1. Hide Help Dialog header containing Documentation, Blog, GitHub issues, YouTube */
          .excalidraw .HelpDialog__header,
          .HelpDialog__header {
            display: none !important;
          }

          /* 2. Hide any external links to Excalidraw, Discord, GitHub, Twitter/X in menus or popovers */
          .excalidraw a[href*="github.com/excalidraw"],
          .excalidraw a[href*="github.com"],
          .excalidraw a[href*="twitter.com"],
          .excalidraw a[href*="x.com"],
          .excalidraw a[href*="discord.gg"],
          .excalidraw a[href*="discord.com"],
          .excalidraw a[href*="youtube.com"],
          .excalidraw a[href*="docs.excalidraw.com"],
          .excalidraw a[href*="plus.excalidraw.com"],
          .excalidraw a[href*="excalidraw.com"] {
            display: none !important;
          }

          /* 3. Hide any dropdown group labeled 'Excalidraw links' or containing socials */
          .excalidraw .dropdown-menu-group:has(a[href*="discord"]),
          .excalidraw .dropdown-menu-group:has(a[href*="github"]) {
            display: none !important;
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translate(-50%, 10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
      </div>
    </>
  );
}
