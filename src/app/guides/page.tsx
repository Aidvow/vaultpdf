import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { GUIDES, SITE_CONFIG } from "@/lib/site";

export const metadata: Metadata = {
  title: "PDF Privacy & Workflow Guides",
  description:
    "Practical playbooks on client-side PDF privacy, removing hidden resume metadata, and preparing clean PDF packets for legal, tax, and visa submissions.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/guides`,
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Resources & Guides
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            PDF Privacy & Document Workflow Guides
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Clear, practical guides on protecting sensitive files, auditing
            hidden document metadata, and preparing submission-ready PDF
            packets.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-medium text-slate-700">
                    {guide.category}
                  </span>
                  <span>·</span>
                  <span>{guide.readTime}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
                  {guide.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {guide.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                <span className="text-slate-400">{guide.publishedAt}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-900 group-hover:text-blue-600">
                  Read guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
