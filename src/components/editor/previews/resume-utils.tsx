"use client";
import React from "react";

/** Ensure URL has https:// prefix */
export function toHref(val: string): string {
  if (!val) return "";
  return /^https?:\/\//i.test(val) ? val : `https://${val}`;
}

/** Strip protocol + www for clean display */
export function cleanUrl(val: string): string {
  return val.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

/** Clickable link for resume templates — works on-screen and in print PDF */
export function ResumeLink({
  href,
  children,
  className,
  style,
}: {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!href) return null;
  const url = toHref(href);
  const label = children ?? cleanUrl(href);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", ...style }}
      className={className}
    >
      {label}
    </a>
  );
}
