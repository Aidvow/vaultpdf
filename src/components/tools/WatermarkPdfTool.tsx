"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import {
  FileText,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { downloadBytes, formatBytes, stripExtension } from "@/lib/pdf-utils";

type InkColor = "slate" | "crimson" | "indigo";
type FooterFormat = "none" | "page-of" | "slash";

const INK_RGB: Record<InkColor, [number, number, number]> = {
  slate: [0.28, 0.33, 0.41],
  crimson: [0.76, 0.14, 0.18],
  indigo: [0.15, 0.39, 0.92],
};

export function WatermarkPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.22);
  const [fontSize, setFontSize] = useState(48);
  const [inkColor, setInkColor] = useState<InkColor>("slate");
  const [footerFormat, setFooterFormat] = useState<FooterFormat>("page-of");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  async function handleSelect(files: File[]) {
    setError(null);
    setSuccessInfo(null);
    const picked = files[0];
    if (!picked) return;

    try {
      const buffer = await picked.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setFile(picked);
      setPageCount(doc.getPageCount());
    } catch {
      setError(
        `Could not open "${picked.name}". Please ensure it is a valid, unencrypted PDF.`
      );
      setFile(null);
      setPageCount(0);
    }
  }

  async function handleApply() {
    if (!file) return;
    const trimmed = watermarkText.trim();
    if (!trimmed && footerFormat === "none") {
      setError("Enter watermark text or enable footer page numbers.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const [r, g, b] = INK_RGB[inkColor];
      const pages = pdfDoc.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();

        // Diagonal centered vector watermark
        if (trimmed) {
          const textWidth = boldFont.widthOfTextAtSize(trimmed, fontSize);
          const angleRad = (45 * Math.PI) / 180;
          const x =
            width / 2 -
            (textWidth / 2) * Math.cos(angleRad) +
            (fontSize / 3) * Math.sin(angleRad);
          const y =
            height / 2 -
            (textWidth / 2) * Math.sin(angleRad) -
            (fontSize / 3) * Math.cos(angleRad);

          page.drawText(trimmed, {
            x,
            y,
            size: fontSize,
            font: boldFont,
            color: rgb(r, g, b),
            opacity,
            rotate: degrees(45),
          });
        }

        // Crisp footer page numbers
        if (footerFormat !== "none") {
          const label =
            footerFormat === "page-of"
              ? `Page ${idx + 1} of ${total}`
              : `${idx + 1} / ${total}`;
          const footerSize = 9.5;
          const labelWidth = regularFont.widthOfTextAtSize(label, footerSize);
          page.drawText(label, {
            x: (width - labelWidth) / 2,
            y: 22,
            size: footerSize,
            font: regularFont,
            color: rgb(0.35, 0.4, 0.48),
            opacity: 0.9,
          });
        }
      });

      const outBytes = await pdfDoc.save();
      downloadBytes(outBytes, `${stripExtension(file.name)}-stamped.pdf`);
      setSuccessInfo(
        `Applied changes across ${total} ${
          total === 1 ? "page" : "pages"
        } (${formatBytes(outBytes.byteLength)}) locally.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to watermark PDF."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf,.pdf"
        compact={Boolean(file)}
        label={
          file
            ? "Replace with another PDF"
            : "Drop a PDF to add watermarks or page numbers"
        }
        hint="Ideal for CONFIDENTIAL drafts, ID copies, contracts, and academic manuscripts"
        onFilesSelected={handleSelect}
      />

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successInfo && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {file && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-blue-600" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {pageCount} {pageCount === 1 ? "page" : "pages"} ·{" "}
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPageCount(0);
                setSuccessInfo(null);
              }}
              className="text-xs font-medium text-slate-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Controls */}
            <div className="space-y-4 lg:col-span-7">
              <div>
                <label
                  htmlFor="wm-text"
                  className="block text-xs font-medium text-slate-700"
                >
                  Watermark text (leave empty to add page numbers only)
                </label>
                <input
                  id="wm-text"
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL or DRAFT"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["CONFIDENTIAL", "DRAFT", "FOR VERIFICATION ONLY", ""].map(
                    (preset) => (
                      <button
                        key={preset || "none"}
                        type="button"
                        onClick={() => setWatermarkText(preset)}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                      >
                        {preset || "No watermark"}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="wm-size"
                    className="flex justify-between text-xs font-medium text-slate-700"
                  >
                    <span>Font Size</span>
                    <span className="font-mono text-slate-500">
                      {fontSize}pt
                    </span>
                  </label>
                  <input
                    id="wm-size"
                    type="range"
                    min={20}
                    max={84}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-2 w-full accent-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wm-opacity"
                    className="flex justify-between text-xs font-medium text-slate-700"
                  >
                    <span>Opacity</span>
                    <span className="font-mono text-slate-500">
                      {Math.round(opacity * 100)}%
                    </span>
                  </label>
                  <input
                    id="wm-opacity"
                    type="range"
                    min={0.08}
                    max={0.65}
                    step={0.02}
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="mt-2 w-full accent-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="block text-xs font-medium text-slate-700">
                    Ink Color
                  </span>
                  <div className="mt-1.5 flex gap-2">
                    {(
                      [
                        { id: "slate", label: "Slate", dot: "bg-slate-600" },
                        { id: "crimson", label: "Red", dot: "bg-red-600" },
                        { id: "indigo", label: "Blue", dot: "bg-blue-600" },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setInkColor(c.id)}
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                          inkColor === c.id
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="footer-format"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Footer Page Numbers
                  </label>
                  <select
                    id="footer-format"
                    value={footerFormat}
                    onChange={(e) =>
                      setFooterFormat(e.target.value as FooterFormat)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="page-of">Page 1 of {pageCount}</option>
                    <option value="slash">1 / {pageCount}</option>
                    <option value="none">No page numbers</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Page Preview */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6 lg:col-span-5">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Live Preview
              </p>
              <div className="relative flex aspect-[1/1.35] w-44 flex-col justify-between overflow-hidden rounded border border-slate-300 bg-white p-4 shadow-xs">
                <div className="space-y-2">
                  <div className="h-2 w-24 rounded bg-slate-200" />
                  <div className="h-1.5 w-full rounded bg-slate-100" />
                  <div className="h-1.5 w-5/6 rounded bg-slate-100" />
                  <div className="h-1.5 w-4/5 rounded bg-slate-100" />
                </div>

                {watermarkText.trim() && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span
                      style={{
                        opacity,
                        fontSize: `${Math.max(10, Math.round(fontSize * 0.28))}px`,
                      }}
                      className={`-rotate-45 whitespace-nowrap font-bold tracking-wider ${
                        inkColor === "crimson"
                          ? "text-red-700"
                          : inkColor === "indigo"
                            ? "text-blue-600"
                            : "text-slate-700"
                      }`}
                    >
                      {watermarkText.trim()}
                    </span>
                  </div>
                )}

                <div className="text-center font-mono text-[9px] text-slate-400">
                  {footerFormat === "page-of" && `Page 1 of ${pageCount}`}
                  {footerFormat === "slash" && `1 / ${pageCount}`}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={handleApply}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Stamping PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Apply & Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
