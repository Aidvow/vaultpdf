"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { SITE_CONFIG, TOOLS } from "@/lib/site";
import { ToolIcon } from "@/components/ToolIcon";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-slate-900"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs transition-transform group-hover:scale-[1.03]">
            <Shield className="h-4 w-4 stroke-[2.2]" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setToolsOpen((o) => !o)}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/tools")
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              aria-expanded={toolsOpen}
            >
              Tools
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  toolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {toolsOpen && (
              <div className="absolute left-0 top-full w-[540px] pt-1.5">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg shadow-slate-900/5">
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-50"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
                        <ToolIcon slug={tool.slug} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {tool.shortName}
                          </span>
                          {tool.badge && (
                            <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                          {tool.tagline}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/guides"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/guides")
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Guides
          </Link>

          <Link
            href="/about"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/about"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            How It Works
          </Link>

          <Link
            href="/contact"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/contact"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Trust Pill + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            100% Local · Zero Uploads
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 md:hidden">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            PDF Tools
          </p>
          <div className="mt-1.5 grid grid-cols-1 gap-1">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <ToolIcon slug={tool.slug} className="h-4 w-4 text-slate-500" />
                {tool.shortName}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/guides"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Guides
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
