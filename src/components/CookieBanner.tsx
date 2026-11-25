"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const CONSENT_KEY = "vaultpdf_cookie_consent_v1";
const CONSENT_EVENT = "vaultpdf-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return "essential";
  }
}

function getServerSnapshot(): string | null {
  // Assume dismissed on server so SSR HTML never flashes the banner
  return "pending-hydration";
}

export function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function saveChoice(choice: "accepted" | "essential") {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      // Ignore storage access errors
    }
  }

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-5"
    >
      <p className="text-xs leading-relaxed text-slate-600">
        Your PDF files are always processed 100% locally and never uploaded. We
        use cookies only for basic analytics and AdSense advertising preferences.
        Read our{" "}
        <Link
          href="/privacy-policy"
          className="font-medium text-slate-900 underline underline-offset-2 hover:text-blue-600"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex shrink-0 items-center gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => saveChoice("essential")}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => saveChoice("accepted")}
          className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
