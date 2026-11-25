import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Cpu,
  WifiOff,
  CheckCircle2,
  BookOpen,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { GUIDES, SITE_CONFIG, TOOLS } from "@/lib/site";
import { ToolIcon } from "@/components/ToolIcon";
import { AdSlot } from "@/components/AdSlot";

const HOME_FAQS = [
  {
    question: "How does VaultPDF process PDF files without uploading them?",
    answer:
      "Every tool on VaultPDF runs directly inside your web browser using local JavaScript memory (ArrayBuffers) and pdf-lib. Your computer reads the file from disk, performs the merge, split, rotation, watermark, or metadata scrub locally, and saves the new PDF straight back to your Downloads folder—with zero server upload requests.",
  },
  {
    question: "Is VaultPDF safe for confidential contracts, tax forms, and IDs?",
    answer:
      "Yes. Because zero bytes of your documents ever travel across the internet or touch third-party cloud buckets, VaultPDF is designed for GDPR-conscious European teams, freelancers under client NDAs, students submitting transcripts, and anyone handling passports or W-2 tax forms.",
  },
  {
    question: "Do I need to create an account or pay a monthly subscription?",
    answer:
      "No. All eight PDF utilities are completely free with no forced signups, no daily merge caps, and no branding watermarks added to your files. The site is supported by non-intrusive display ads placed cleanly outside the tool workspaces.",
  },
  {
    question: "Which browsers and operating systems are supported?",
    answer:
      "VaultPDF works on modern versions of Chrome, Edge, Safari, Firefox, and Brave across Windows 11/10, macOS, Linux, Chromebooks, iOS, and Android. Once a page has loaded, the tools even continue working offline.",
  },
];

const COMPARISON_ROWS = [
  {
    dimension: "File transfer & privacy",
    local: "0 bytes uploaded — processed strictly in browser RAM",
    cloud: "Full document uploaded to remote third-party servers",
  },
  {
    dimension: "Processing speed",
    local: "Instant local execution (no upload or server queue)",
    cloud: "Depends on internet upload speed and server load",
  },
  {
    dimension: "GDPR & NDA risk",
    local: "No third-party data processor involved",
    cloud: "Requires trusting cloud retention & deletion policies",
  },
  {
    dimension: "File caps & paywalls",
    local: "Free with no forced login or daily task limits",
    cloud: "Often capped at 2 tasks/day or locked behind trials",
  },
  {
    dimension: "Offline capability",
    local: "Works even in Airplane Mode after initial load",
    cloud: "Requires continuous high-speed internet connection",
  },
];

export default function HomePage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section — Minimalist Stripe / Swiss Grid */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1 text-xs font-medium text-emerald-800 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              100% Client-Side Processing · Zero File Uploads
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.08]">
              Private PDF tools that never touch a server.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Merge contracts, split tax forms, delete blank scans, convert
              receipts, inspect paper sizes, and scrub hidden resume metadata
              directly inside your browser. Fast, free, and verifiable for
              GDPR-conscious teams and individuals.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/tools/merge-pdf"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800"
              >
                Start with Merge PDF
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools/remove-pdf-metadata"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-2xs transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Inspect PDF Metadata
              </Link>
            </div>

            {/* Key Guarantees Strip */}
            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 border-t border-slate-200/80 pt-7 sm:grid-cols-3">
              <div className="flex items-start gap-2.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Zero Cloud Exposure
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Documents stay in local RAM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Instant Execution
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    No upload or queue latency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Offline Capable
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Works even in Airplane Mode
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Tool Matrix (8 Tools — Crisp 4x2 Swiss Grid) */}
      <section
        id="tools"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Complete Local Suite
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Every essential PDF workflow, zero signups
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {TOOLS.length} focused tools · Works on Windows, macOS, Linux, and
            mobile
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/[0.04]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                    <ToolIcon slug={tool.slug} className="h-5 w-5" />
                  </span>
                  <span className="truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {tool.badge || tool.category}
                  </span>
                </div>

                <h3 className="mt-4 text-[15px] font-semibold text-slate-900 group-hover:text-blue-700">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {tool.tagline}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                Open tool
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        <AdSlot format="horizontal" label="Sponsored" />
      </section>

      {/* Verifiable Architecture Proof Section */}
      <section className="border-y border-slate-200/80 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Verifiable Privacy Architecture
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Don&apos;t take our word for it—verify in DevTools.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Most &ldquo;free&rdquo; PDF utilities upload your documents to
                cloud buckets before processing them. {SITE_CONFIG.name} runs
                purely inside your browser&apos;s JavaScript memory sandbox.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Open Chrome or Safari DevTools → Network tab while using any tool.",
                  "Observe 0 outgoing file upload requests and 0 bytes transmitted.",
                  "Ideal for signed NDAs, tax returns, passports, resumes, and medical records.",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-blue-600"
              >
                Read how our local engine works
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Clean Architectural Terminal / Network Audit Visual */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Terminal className="h-3.5 w-3.5 text-slate-400" />
                    Browser Network Audit · Filter: File Uploads
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-800">
                    0 B SENT
                  </span>
                </div>
                <div className="divide-y divide-slate-100 p-5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 text-slate-500">
                    <span>1. Read local File via ArrayBuffer</span>
                    <span className="text-emerald-700">LOCAL RAM</span>
                  </div>
                  <div className="flex items-center justify-between py-3 text-slate-500">
                    <span>2. Assemble / Scrub PDF via pdf-lib</span>
                    <span className="text-emerald-700">IN-BROWSER</span>
                  </div>
                  <div className="flex items-center justify-between py-3 text-slate-500">
                    <span>3. POST /api/upload</span>
                    <span className="font-semibold text-slate-900">
                      NEVER CALLED
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 text-slate-500">
                    <span>4. Save output via Blob URL</span>
                    <span className="text-blue-700">DIRECT TO DISK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Local vs. Cloud Comparison Table */}
          <div className="mt-14">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              How {SITE_CONFIG.name} compares to cloud-upload PDF websites
            </h3>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5">Capability</th>
                    <th className="px-5 py-3.5 text-emerald-800">
                      {SITE_CONFIG.name} (Local Browser)
                    </th>
                    <th className="px-5 py-3.5">Traditional Cloud PDF Sites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.dimension}>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {row.dimension}
                      </td>
                      <td className="px-5 py-3.5 text-emerald-900">
                        {row.local}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {row.cloud}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Original Editorial Guides Section (6 Featured + Link to All 8) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Document Privacy & Workflow Guides
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Practical playbooks for safer PDF handling
            </h2>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Read all {GUIDES.length} guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {GUIDES.slice(0, 6).map((guide) => (
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
                <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
                  {guide.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {guide.excerpt}
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                Read article
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Homepage FAQ Section */}
      <section className="border-t border-slate-200/80 bg-slate-50/40 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-slate-400" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Clear answers on local execution, privacy guarantees, and browser
            compatibility.
          </p>

          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {HOME_FAQS.map((item) => (
              <div key={item.question} className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
