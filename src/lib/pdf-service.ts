"use client";

/* ═══════════════════════════════════════════════════════════════
   PDF SERVICE — Single source of truth for PDF generation.
   Uses window.print() so the live HTML preview IS the PDF.
   No react-pdf, no server round-trip, pixel-perfect parity.
   ═══════════════════════════════════════════════════════════════ */

export interface PrintOptions {
  /** Used as the suggested filename in the browser's Save As PDF dialog */
  title?: string;
  /** Called just before window.print() — useful for toast/spinner */
  onBefore?: () => void;
  /** Called after the print dialog closes */
  onAfter?: () => void;
}

/**
 * printResume()
 *
 * Triggers the browser's native print dialog configured for A4 PDF export.
 * The @media print CSS in globals.css hides all UI except #resume-print-root,
 * so the user sees a clean, full-bleed A4 resume — exactly matching the
 * live editor preview.
 *
 * Usage:
 *   printResume({ title: "john-doe-resume", onBefore: () => toast.info("Opening PDF...") })
 */
export function printResume(options: PrintOptions = {}): void {
  const { title, onBefore, onAfter } = options;

  // 1. Swap document title so browser suggests a good filename in Save-As dialog
  const previousTitle = document.title;
  if (title) {
    document.title = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  // 2. Pre-print hook
  onBefore?.();

  // 3. Give React one tick to finish any in-flight renders before printing
  requestAnimationFrame(() => {
    window.print();

    // 4. Restore title & fire post-print hook
    document.title = previousTitle;
    onAfter?.();
  });
}
