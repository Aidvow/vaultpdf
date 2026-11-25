import Link from "next/link";
import { Shield } from "lucide-react";
import { GUIDES, SITE_CONFIG, TOOLS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white">
                <Shield className="h-3.5 w-3.5" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              {SITE_CONFIG.tagline} Built for contracts, resumes, tax forms, and
              everyday documents that should never touch a third-party server.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Client-Side Verified · 0 Bytes Uploaded
            </div>
          </div>

          {/* Tools Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              PDF Tools
            </h3>
            <ul className="mt-3 space-y-2">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Guides
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  All Guides
                </Link>
              </li>
              {GUIDES.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="line-clamp-1 text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company Column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © 2026 {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <p>
            Files are processed locally inside your browser. Independent tool
            suite, not affiliated with Adobe Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
