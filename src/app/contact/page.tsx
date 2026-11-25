import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_CONFIG.name} team for bug reports, feature requests, or privacy inquiries.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Contact Us
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Questions, feedback, or bug reports?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            We welcome feature suggestions, browser compatibility reports, and
            privacy inquiries from our users worldwide.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Mail className="h-5 w-5 text-blue-600" />
            <h2 className="mt-3 text-base font-semibold text-slate-900">
              Email Support
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              For general support, partnership inquiries, or privacy questions,
              email us directly:
            </p>
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="mt-4 inline-block font-mono text-sm font-semibold text-blue-600 hover:underline"
            >
              {SITE_CONFIG.contactEmail}
            </a>
            <p className="mt-2 text-xs text-slate-400">
              Typical response time: 1–2 business days
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <MessageSquare className="h-5 w-5 text-slate-700" />
            <h2 className="mt-3 text-base font-semibold text-slate-900">
              Reporting a PDF Issue
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              If a tool fails on a specific document, please let us know your
              browser name/version and whether the PDF is password-protected or
              uses special compression.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Please never email us confidential contracts or identity scans—a
                short description of the error is all we need.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-600">
          Looking for information about how cookies or ads work on{" "}
          {SITE_CONFIG.name}? Review our{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-slate-900 underline underline-offset-2 hover:text-blue-600"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/terms"
            className="font-medium text-slate-900 underline underline-offset-2 hover:text-blue-600"
          >
            Terms of Service
          </Link>
          .
        </div>
      </section>
    </div>
  );
}
