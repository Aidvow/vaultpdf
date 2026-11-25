import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Cpu, Lock, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & Privacy Architecture",
  description: `Learn how ${SITE_CONFIG.name} processes PDFs 100% locally in your browser with zero file uploads.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            How It Works
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Built for people who don&apos;t want to upload sensitive PDFs to
            strangers.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {SITE_CONFIG.name} is an independent suite of browser-native PDF
            utilities engineered around one non-negotiable rule: your documents
            stay on your device.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-10 px-4 pt-12 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Lock className="h-5 w-5 text-emerald-600" />
            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              No Upload Endpoints
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              There is no file storage bucket or upload API behind our PDF
              tools. Files are read directly into local browser memory.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Cpu className="h-5 w-5 text-blue-600" />
            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              Pure Client-Side Engine
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Merging, splitting, rotating, watermarking, and metadata scrubbing
              execute cleanly in JavaScript right on your CPU.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Shield className="h-5 w-5 text-slate-800" />
            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              Free & Transparent
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              No forced accounts, no hidden trial traps, and no surprise
              watermarks stamped onto your downloads.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-slate-700">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Why we created {SITE_CONFIG.name}
          </h2>
          <p>
            Every day, millions of students, freelancers, attorneys, and job
            seekers search for quick ways to combine two PDFs, rotate a sideways
            scan, or scrub personal details from a resume. Almost every top
            search result asks you to upload those private documents to remote
            cloud servers—then locks basic downloads behind paywalls or account
            walls.
          </p>
          <p>
            Modern web browsers already have more than enough computing power to
            manipulate PDFs locally in milliseconds. By running every tool
            directly inside your browser tab, {SITE_CONFIG.name} eliminates
            cloud storage risk, slashes wait times, and keeps core PDF workflows
            accessible to everyone for free.
          </p>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-slate-700">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            How we keep the site free
          </h2>
          <p>
            Because we do not pay for expensive GPU or document-processing
            servers, our operating costs remain lean. {SITE_CONFIG.name} is
            supported by non-intrusive display advertising (such as Google
            AdSense) placed outside tool action areas so your workflow stays
            fast and uncluttered.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Ready to process a document privately?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Jump straight into any of our eight browser-native PDF tools—no sign
            up required.
          </p>
          <Link
            href="/#tools"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Explore All Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
