"use client";

import { useState, useRef, useEffect } from "react";

interface LabelWithTooltipProps {
  label: string;
  tooltip: string;
  className?: string;
  id?: string;
}

export function LabelWithTooltip({ label, tooltip, className = "", id }: LabelWithTooltipProps) {
  const [show, setShow] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    const onTouchOutside = (e: TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("touchstart", onTouchOutside, { passive: true });
    return () => document.removeEventListener("touchstart", onTouchOutside);
  }, [show]);

  return (
    <span ref={wrapRef} className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <span id={id}>{label}</span>
      <span
        className="shrink-0 w-4 h-4 rounded-full bg-barak-700/40 text-barak-200 flex items-center justify-center text-[10px] font-bold cursor-help hover:bg-barak-700/60 transition-colors touch-manipulation"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onTouchStart={(e) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
        aria-describedby={show ? `tooltip-${id ?? "tt"}` : undefined}
        aria-label={tooltip}
      >
        ?
      </span>
      {show && (
        <span
          id={id ? `tooltip-${id}` : undefined}
          role="tooltip"
          className="absolute bottom-full right-0 mb-1.5 px-3 py-2 rounded-xl bg-barak-800/95 text-white text-xs font-medium text-right max-w-[280px] shadow-lg border border-barak-600/40 z-30 pointer-events-none whitespace-normal"
        >
          {tooltip}
          <span className="absolute top-full right-4 border-[6px] border-transparent border-t-barak-800" aria-hidden />
        </span>
      )}
    </span>
  );
}
