import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import {
  getGuideBySlug,
  getToolBySlug,
  GUIDES,
  SITE_CONFIG,
} from "@/lib/site";
import { ToolIcon } from "@/components/ToolIcon";
import { AdSlot } from "@/components/AdSlot";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: {
      canonical: `${SITE_CONFIG.url}/guides/${guide.slug}`,
    },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.excerpt,
      publishedTime: guide.publishedAt,
      url: `${SITE_CONFIG.url}/guides/${guide.slug}`,
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedTool = getToolBySlug(guide.relatedToolSlug);
  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <article className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="border-b border-slate-200/80 bg-swiss-grid">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Guides
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
              {guide.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {guide.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {guide.readTime}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {guide.excerpt}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <div className="space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-slate-700">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-4 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-sm leading-relaxed text-slate-700">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <AdSlot format="horizontal" label="Sponsored" />

        {/* Related Tool CTA */}
        {relatedTool && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600">
                <ToolIcon slug={relatedTool.slug} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Try it locally
                </p>
                <h3 className="mt-0.5 text-base font-semibold text-slate-900">
                  {relatedTool.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {relatedTool.tagline}
                </p>
              </div>
            </div>
            <Link
              href={`/tools/${relatedTool.slug}`}
              className="mt-4 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:mt-0"
            >
              Open Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* More Guides */}
        <div className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="text-lg font-semibold text-slate-900">
            Continue reading
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {otherGuides.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
              >
                <p className="text-xs font-medium text-blue-600">
                  {item.category}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
