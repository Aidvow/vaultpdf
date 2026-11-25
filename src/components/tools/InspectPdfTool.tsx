"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Layers,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { formatBytes } from "@/lib/pdf-utils";

interface PageMetric {
  pageNumber: number;
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  standardLabel: string;
  orientation: "Portrait" | "Landscape" | "Square";
  rotation: number;
}

interface PdfInspectionReport {
  fileName: string;
  fileSize: number;
  pageCount: number;
  isEncrypted: boolean;
  title: string;
  author: string;
  creator: string;
  producer: string;
  creationDate: string;
  hasMixedSizes: boolean;
  hasMixedOrientations: boolean;
  pages: PageMetric[];
}

function detectPaperSize(widthPt: number, heightPt: number): string {
  const shortSide = Math.min(widthPt, heightPt);
  const longSide = Math.max(widthPt, heightPt);

  const match = (w: number, h: number, tol = 6) =>
    Math.abs(shortSide - w) <= tol && Math.abs(longSide - h) <= tol;

  if (match(595.28, 841.89)) return "A4 (ISO)";
  if (match(612, 792)) return "US Letter";
  if (match(612, 1008)) return "US Legal";
  if (match(419.53, 595.28)) return "A5 (ISO)";
  if (match(841.89, 1190.55)) return "A3 (ISO)";
  if (match(792, 1224)) return "Tabloid / Ledger";
  return "Custom";
}

export function InspectPdfTool() {
  const [report, setReport] = useState<PdfInspectionReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(files: File[]) {
    setError(null);
    const picked = files[0];
    if (!picked) return;

    try {
      const buffer = await picked.arrayBuffer();
      const doc = await PDFDocument.load(buffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      const pages: PageMetric[] = doc.getPages().map((page, idx) => {
        const { width, height } = page.getSize();
        const rotation = page.getRotation().angle % 360;
        const effectiveW = rotation === 90 || rotation === 270 ? height : width;
        const effectiveH = rotation === 90 || rotation === 270 ? width : height;

        const orientation: PageMetric["orientation"] =
          Math.abs(effectiveW - effectiveH) < 2
            ? "Square"
            : effectiveW > effectiveH
              ? "Landscape"
              : "Portrait";

        return {
          pageNumber: idx + 1,
          widthPt: Math.round(effectiveW),
          heightPt: Math.round(effectiveH),
          widthMm: Math.round((effectiveW / 72) * 25.4),
          heightMm: Math.round((effectiveH / 72) * 25.4),
          widthIn: Number((effectiveW / 72).toFixed(2)),
          heightIn: Number((effectiveH / 72).toFixed(2)),
          standardLabel: detectPaperSize(effectiveW, effectiveH),
          orientation,
          rotation,
        };
      });

      const uniqueSizes = new Set(pages.map((p) => p.standardLabel));
      const uniqueOrientations = new Set(pages.map((p) => p.orientation));
      const created = doc.getCreationDate();

      setReport({
        fileName: picked.name,
        fileSize: picked.size,
        pageCount: pages.length,
        isEncrypted: doc.isEncrypted,
        title: doc.getTitle() || "—",
        author: doc.getAuthor() || "—",
        creator: doc.getCreator() || "—",
        producer: doc.getProducer() || "—",
        creationDate: created ? created.toISOString().split("T")[0] : "—",
        hasMixedSizes: uniqueSizes.size > 1,
        hasMixedOrientations: uniqueOrientations.size > 1,
        pages,
      });
    } catch {
      setError(
        `Could not inspect "${picked.name}". Please check that it is a valid PDF file.`
      );
      setReport(null);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf,.pdf"
        compact={Boolean(report)}
        label={
          report
            ? "Inspect another PDF file"
            : "Drop any PDF to analyze dimensions, paper sizes, and structure"
        }
        hint="Detects A4 vs. US Letter, mixed orientations, rotation flags, and metadata locally"
        onFilesSelected={handleSelect}
      />

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Pages
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900">
                {report.pageCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                File Size
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900">
                {formatBytes(report.fileSize)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Primary Paper
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {report.pages[0]?.standardLabel || "Unknown"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Encryption
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {report.isEncrypted ? "Encrypted" : "Unencrypted"}
              </p>
            </div>
          </div>

          {/* Preflight Diagnostic Alerts */}
          <div className="flex flex-wrap gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              {report.fileName}
            </span>
            {report.hasMixedSizes ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-medium text-amber-800">
                <Maximize2 className="h-3.5 w-3.5" />
                Mixed paper sizes detected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Uniform paper size
              </span>
            )}
            {report.hasMixedOrientations ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-medium text-amber-800">
                <Layers className="h-3.5 w-3.5" />
                Mixed portrait & landscape pages
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Consistent orientation
              </span>
            )}
          </div>

          {/* Metadata Snapshot */}
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs sm:grid-cols-2">
            <div>
              <span className="text-slate-400">Title:</span>{" "}
              <span className="font-medium text-slate-800">{report.title}</span>
            </div>
            <div>
              <span className="text-slate-400">Author:</span>{" "}
              <span className="font-medium text-slate-800">
                {report.author}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Creator:</span>{" "}
              <span className="font-medium text-slate-800">
                {report.creator}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Producer:</span>{" "}
              <span className="font-medium text-slate-800">
                {report.producer}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Created:</span>{" "}
              <span className="font-mono text-slate-800">
                {report.creationDate}
              </span>
            </div>
          </div>

          {/* Per-Page Dimension Breakdown Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Paper Standard</th>
                  <th className="px-4 py-3">Millimeters</th>
                  <th className="px-4 py-3">Inches</th>
                  <th className="px-4 py-3">Orientation</th>
                  <th className="px-4 py-3">Rotation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {report.pages.map((p) => (
                  <tr key={p.pageNumber}>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">
                      #{p.pageNumber}
                    </td>
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-800">
                      {p.standardLabel}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {p.widthMm} × {p.heightMm} mm
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {p.widthIn} × {p.heightIn} in
                    </td>
                    <td className="px-4 py-2.5 font-sans text-slate-700">
                      {p.orientation}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {p.rotation}°
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
