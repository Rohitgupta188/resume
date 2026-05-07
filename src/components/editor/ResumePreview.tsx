"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "@/contexts/EditorContext";
import { RESUME_TEMPLATES } from "./previews";
import type { TemplateId } from "./previews";

const A4_W = 794; // A4 width @ 96 DPI
const A4_H = 1123; // A4 height @ 96 DPI

export function ResumePreview() {
  const { resume, templateId } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateZoom = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      if (width <= 0) return;
      setZoom(width < A4_W ? width / A4_W : 1);
    };

    updateZoom();
    const observer = new ResizeObserver(updateZoom);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateZoom);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateZoom);
    };
  }, []);

  if (!resume) return null;

  const content = resume.content;
  const config =
    RESUME_TEMPLATES[(templateId as TemplateId) ?? "professional"] ??
    RESUME_TEMPLATES.professional;
  const Template = config.component;

  return (
    <>
      {/* ─────────────────────────────────────
          SCREEN PREVIEW
      ───────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-full min-h-screen bg-slate-100 dark:bg-zinc-900/40 flex justify-center py-8 px-4 overflow-auto preview-ui"
      >
        <div
          className="relative bg-white border border-slate-200 dark:border-zinc-700 origin-top h-fit"
          style={{
            width: `${A4_W}px`,
            minHeight: `${A4_H}px`,
            zoom,
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Paper Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply"
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
            }}
          />

          {/* Page Break Guide Lines — Visible in Editor Only */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent 0px,
                transparent calc(${A4_H}px - 2px),
                rgba(71,85,105,0.7) calc(${A4_H}px - 2px),
                rgba(71,85,105,0.7) ${A4_H}px
              )`,
            }}
          />

          {/* Actual Template Content */}
          <div className="relative z-0">
            <Template content={content} />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────
          PRINT ROOT (Portal to body)
      ───────────────────────────────────── */}
      {mounted &&
        createPortal(
          <div id="resume-print-root">
            <div className="resume-print-content">
              <Template content={content} />
            </div>
          </div>,
          document.body
        )}

      {/* ─────────────────────────────────────
          GLOBAL PRINT CSS
      ───────────────────────────────────── */}
      <style jsx global>{`
        /* Default: Hidden on screen */
        #resume-print-root {
          display: none;
        }

        @media print {
          /* 1. Reset Page and Body */
          @page {
            size: A4;
            margin: 0;
          }
          
          html, body {
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          /* 2. Hide everything except print root */
          body > *:not(#resume-print-root) {
            display: none !important;
          }

          /* 3. Show and Style Print Root */
          #resume-print-root {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important; /* Full A4 Width */
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            z-index: 9999 !important;
          }

          .resume-print-content {
            width: 210mm !important;
            min-height: 297mm !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }

          /* 4. Content Protection Rules */
          section, .resume-section, .experience-item, .project-item, .education-item {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          h1, h2, h3 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }

          /* Force link colors and underline in print if needed */
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
      `}</style>
    </>
  );
}
