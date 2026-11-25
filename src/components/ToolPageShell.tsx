import Link from "next/link";
import {
  ChevronRight,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { SITE_CONFIG, TOOLS, type ToolDefinition } from "@/lib/site";
import { ToolIcon } from "@/components/ToolIcon";
import { AdSlot } from "@/components/AdSlot";

interface ToolPageShellProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const relatedTools = TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 3);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — ${SITE_CONFIG.name}`,
    url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
    description: tool.seoDescription,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Browser-Based)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="pb-20">
      {/* Structured Data for Google Search Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Top Header Band */}
      <section className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
          >
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link href="/#tools" className="hover:text-slate-900">
              Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900">{tool.shortName}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-2xs">
                <ToolIcon slug={tool.slug} className="h-3.5 w-3.5 text-blue-600" />
                {tool.category}
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {tool.name}
              </h1>
              <p className="mt-2.5 text-base leading-relaxed text-slate-600">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Micro Trust Signals */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              Zero server uploads
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              Instant local execution
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
              Free · No account required
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.03] sm:p-8">
          {children}
        </div>

        {/* Policy-compliant Ad Slot below workspace (never blocks tool buttons) */}
        <AdSlot format="horizontal" label="Sponsored" />
      </section>

      {/* Rich Editorial Content for SEO & User Value */}
      <section className="mx-auto mt-14 max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* How to Use (3 Steps) */}
        <div className="border-t border-slate-200 pt-12">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            How to use {tool.shortName} locally
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {tool.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-5"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white font-mono text-xs font-semibold text-slate-900">
                  0{index + 1}
                </span>
                <h3 className="mt-3.5 text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases + Privacy Architecture */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Common workflows
            </h2>
            <ul className="mt-4 space-y-3">
              {tool.useCases.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-6 lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Lock className="h-3.5 w-3.5" />
              Privacy Guarantee
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
              Why zero-upload matters
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
              {tool.privacyNote}
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              Verify our client-side architecture
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-14 border-t border-slate-200 pt-12">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {tool.faqs.map((faq) => (
              <div key={faq.question} className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools (Internal Linking for SEO & Session Depth) */}
        <div className="mt-14 border-t border-slate-200 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              More private PDF tools
            </h2>
            <Link
              href="/#tools"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all tools
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tools/${rel.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                  <ToolIcon slug={rel.slug} className="h-4 w-4" />
                </div>
                <h3 className="mt-3.5 text-sm font-semibold text-slate-900">
                  {rel.shortName}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {rel.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
