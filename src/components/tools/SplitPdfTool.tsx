"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import {
  FileText,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Package,
  Scissors,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import {
  downloadBytes,
  formatBytes,
  parsePageRanges,
  stripExtension,
} from "@/lib/pdf-utils";

type SplitMode = "range" | "all-zip";

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>("range");
  const [rangeText, setRangeText] = useState("1-1");
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
      const count = doc.getPageCount();
      setFile(picked);
      setPageCount(count);
      setRangeText(count > 1 ? `1-${Math.min(3, count)}` : "1");
    } catch {
      setError(
        `Could not open "${picked.name}". Ensure it is a valid, unencrypted PDF.`
      );
      setFile(null);
      setPageCount(0);
    }
  }

  async function handleSplit() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const srcBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes);
      const baseName = stripExtension(file.name);

      if (mode === "range") {
        const parsed = parsePageRanges(rangeText, pageCount);
        if (parsed.error) {
          setError(parsed.error);
          setBusy(false);
          return;
        }
        const outDoc = await PDFDocument.create();
        const pages = await outDoc.copyPages(srcDoc, parsed.indices);
        pages.forEach((p) => outDoc.addPage(p));
        const outBytes = await outDoc.save();
        downloadBytes(outBytes, `${baseName}-extracted.pdf`);
        setSuccessInfo(
          `Extracted ${parsed.indices.length} ${
            parsed.indices.length === 1 ? "page" : "pages"
          } (${formatBytes(outBytes.byteLength)}) locally.`
        );
      } else {
        const zip = new JSZip();
        const pad = String(pageCount).length;
        for (let i = 0; i < pageCount; i++) {
          const singleDoc = await PDFDocument.create();
          const [page] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(page);
          const bytes = await singleDoc.save();
          const num = String(i + 1).padStart(pad, "0");
          zip.file(`${baseName}-page-${num}.pdf`, bytes);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBytes(zipBlob, `${baseName}-all-pages.zip`, "application/zip");
        setSuccessInfo(
          `Split all ${pageCount} pages into individual PDFs (${formatBytes(zipBlob.size)} ZIP archive).`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to split PDF.");
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
            : "Drop a PDF file to split or extract pages"
        }
        hint="Single PDF document · Processed strictly inside your browser"
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
        <div className="space-y-5">
          {/* Loaded File Summary */}
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
                setError(null);
                setSuccessInfo(null);
              }}
              className="text-xs font-medium text-slate-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("range")}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                mode === "range"
                  ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Scissors
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  mode === "range" ? "text-blue-600" : "text-slate-500"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Extract Custom Page Ranges
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Save selected pages (e.g. 1-3, 5, 8) as one clean PDF.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("all-zip")}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                mode === "all-zip"
                  ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Package
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  mode === "all-zip" ? "text-blue-600" : "text-slate-500"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Split Every Page (ZIP)
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Export all {pageCount} pages as individual PDF files in a ZIP.
                </p>
              </div>
            </button>
          </div>

          {/* Range Input */}
          {mode === "range" && (
            <div>
              <label
                htmlFor="page-ranges"
                className="block text-xs font-medium text-slate-700"
              >
                Pages to extract (valid range: 1 to {pageCount})
              </label>
              <input
                id="page-ranges"
                type="text"
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                placeholder={`e.g. 1-${Math.min(3, pageCount)}, ${pageCount}`}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 outline-none focus:border-blue-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRangeText("1")}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  First page only
                </button>
                <button
                  type="button"
                  onClick={() => setRangeText(String(pageCount))}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Last page only
                </button>
                {pageCount >= 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      setRangeText(
                        Array.from({ length: pageCount }, (_, i) => i + 1)
                          .filter((p) => p % 2 === 1)
                          .join(", ")
                      )
                    }
                    className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Odd pages
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={handleSplit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {mode === "range"
                    ? "Extract & Download PDF"
                    : `Download All ${pageCount} Pages (.zip)`}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
