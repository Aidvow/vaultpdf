import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_CONFIG.name}, detailing 100% local in-browser PDF processing, Google Analytics, Google AdSense cookies, and GDPR/CCPA rights.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Legal & Compliance
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: November 25, 2026
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-4 pt-10 text-sm leading-relaxed text-slate-700 sm:px-6 sm:text-base">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            1. Local File Processing (Zero Uploads)
          </h2>
          <p>
            {SITE_CONFIG.name} is architected so that all PDF and image
            operations—including merging, splitting, rotating, watermarking,
            converting, and metadata scrubbing—execute exclusively inside your
            web browser. We do not upload, transmit, inspect, log, or store any
            document or image you open with our tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Analytics & Basic Usage Data
          </h2>
          <p>
            To understand which tools are most useful and keep the site fast, we
            may use privacy-respecting analytics such as Google Analytics 4
            (GA4) with IP anonymization enabled. This collects aggregate,
            non-document data such as page views, device category, browser
            family, and approximate region. We never collect the filenames or
            contents of files you process locally.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            3. Google AdSense & Advertising Cookies
          </h2>
          <p>
            To keep {SITE_CONFIG.name} free without paywalls, we may display
            advertisements served by Google AdSense and its certified ad
            technology partners. Third-party vendors, including Google, use
            cookies to serve ads based on a user&apos;s prior visits to this
            website or other websites.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners
            to serve ads based on your visit to our site and/or other sites on
            the Internet. You may opt out of personalized advertising at any
            time by visiting{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline underline-offset-2"
            >
              Google Ads Settings
            </a>{" "}
            or{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline underline-offset-2"
            >
              www.aboutads.info
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            4. Your Rights Under GDPR (EU/UK) & CCPA (California)
          </h2>
          <p>
            If you reside in the European Economic Area (EEA), the United
            Kingdom, or California, you have the right to control cookie consent
            preferences, opt out of personalized advertising, and request
            information regarding any personal data processed through contact
            emails. Because we do not collect user accounts or store uploaded
            documents, we hold no personal document data about you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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
