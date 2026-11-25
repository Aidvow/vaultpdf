"use client";

import { useEffect, useRef } from "react";
import { SITE_CONFIG } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** Your AdSense data-ad-slot ID once approved (e.g. "1234567890") */
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle";
  label?: string;
  className?: string;
}

/**
 * Policy-friendly Google AdSense container.
 * - Stays completely clean/hidden in production until NEXT_PUBLIC_ADSENSE_ID & slotId are configured.
 * - Set NEXT_PUBLIC_AD_PREVIEW=true locally to preview spacing and layout.
 */
export function AdSlot({
  slotId,
  format = "horizontal",
  label = "Advertisement",
  className = "",
}: AdSlotProps) {
  const pushed = useRef(false);
  const hasLiveConfig = Boolean(SITE_CONFIG.adsenseId && slotId);

  useEffect(() => {
    if (!hasLiveConfig || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script may not be loaded or may be blocked by user extension
    }
  }, [hasLiveConfig]);

  if (!hasLiveConfig) {
    if (!SITE_CONFIG.showAdPreview) {
      return null;
    }
    return (
      <div
        className={`mx-auto my-8 flex min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center ${className}`}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
            {label} · Preview Slot
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Activates automatically once{" "}
            <code className="font-mono text-slate-700">
              NEXT_PUBLIC_ADSENSE_ID
            </code>{" "}
            is configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label={label}
      className={`mx-auto my-8 w-full overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/40 p-3 text-center ${className}`}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight: format === "rectangle" ? 250 : 90 }}
        data-ad-client={SITE_CONFIG.adsenseId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
