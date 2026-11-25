import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for using ${SITE_CONFIG.name} client-side PDF tools.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Legal & Compliance
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: November 25, 2026
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-4 pt-10 text-sm leading-relaxed text-slate-700 sm:px-6 sm:text-base">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using {SITE_CONFIG.name}, you agree to be bound by
            these Terms of Service. If you do not agree with any part of these
            terms, please discontinue use of the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Local Processing & Document Responsibility
          </h2>
          <p>
            All tools on {SITE_CONFIG.name} run client-side inside your browser.
            You retain 100% ownership and responsibility for any files you
            process. Please always keep backup copies of important original
            documents and verify generated output PDFs before official legal,
            financial, or academic submission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            3. Permitted Use
          </h2>
          <p>
            You may use {SITE_CONFIG.name} freely for personal, educational, and
            commercial document workflows. You agree not to abuse, scrape,
            disrupt, or attempt to interfere with the proper functioning of the
            website or its advertising partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            4. Disclaimer of Warranties
          </h2>
          <p>
            {SITE_CONFIG.name} is provided on an &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; basis without warranties of any kind,
            either express or implied. We are not liable for any direct,
            indirect, or incidental damages resulting from the use or inability
            to use our tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Contact
          </h2>
          <p>
            Questions regarding these terms may be sent to{" "}
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="font-mono text-sm font-medium text-blue-600 hover:underline"
            >
              {SITE_CONFIG.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
