import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, SITE_CONFIG, TOOLS } from "@/lib/site";
import { ToolPageShell } from "@/components/ToolPageShell";
import { MergePdfTool } from "@/components/tools/MergePdfTool";
import { SplitPdfTool } from "@/components/tools/SplitPdfTool";
import { OrganizePdfTool } from "@/components/tools/OrganizePdfTool";
import { DeletePdfPagesTool } from "@/components/tools/DeletePdfPagesTool";
import { ImagesToPdfTool } from "@/components/tools/ImagesToPdfTool";
import { WatermarkPdfTool } from "@/components/tools/WatermarkPdfTool";
import { MetadataPdfTool } from "@/components/tools/MetadataPdfTool";
import { InspectPdfTool } from "@/components/tools/InspectPdfTool";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: `${SITE_CONFIG.url}/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  function renderWorkspace() {
    switch (tool!.slug) {
      case "merge-pdf":
        return <MergePdfTool />;
      case "split-pdf":
        return <SplitPdfTool />;
      case "rotate-reorder-pdf":
        return <OrganizePdfTool />;
      case "delete-pdf-pages":
        return <DeletePdfPagesTool />;
      case "images-to-pdf":
        return <ImagesToPdfTool />;
      case "watermark-pdf":
        return <WatermarkPdfTool />;
      case "remove-pdf-metadata":
        return <MetadataPdfTool />;
      case "inspect-pdf":
        return <InspectPdfTool />;
    }
  }

  return <ToolPageShell tool={tool}>{renderWorkspace()}</ToolPageShell>;
}
