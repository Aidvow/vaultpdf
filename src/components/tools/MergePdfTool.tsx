"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { downloadBytes, formatBytes } from "@/lib/pdf-utils";

interface LoadedPdf {
  id: string;
  file: File;
  pageCount: number;
}

export function MergePdfTool() {
  const [items, setItems] = useState<LoadedPdf[]>([]);
  const [outputName, setOutputName] = useState("merged-document");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  async function handleAddFiles(files: File[]) {
    setError(null);
    setSuccessInfo(null);
    const pdfFiles = files.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length === 0) {
      setError("Please select valid PDF (.pdf) files.");
      return;
    }

    const loaded: LoadedPdf[] = [];
    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
        loaded.push({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
          pageCount: doc.getPageCount(),
        });
      } catch {
        setError(
          `Could not read "${file.name}". It may be password-protected or corrupted.`
        );
      }
    }

    if (loaded.length > 0) {
      setItems((prev) => [...prev, ...loaded]);
    }
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSuccessInfo(null);
  }

  async function handleMerge() {
    if (items.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const merged = await PDFDocument.create();
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const copiedPages = await merged.copyPages(src, src.getPageIndices());
        copiedPages.forEach((p) => merged.addPage(p));
      }

      const outBytes = await merged.save();
      const safeName = (outputName.trim() || "merged-document").replace(
        /\.pdf$/i,
        ""
      );
      downloadBytes(outBytes, `${safeName}.pdf`);
      setSuccessInfo(
        `Merged ${items.length} files (${merged.getPageCount()} pages · ${formatBytes(outBytes.byteLength)}) locally.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to merge PDFs. One of the files may be encrypted."
      );
    } finally {
      setBusy(false);
    }
  }

  const totalPages = items.reduce((sum, i) => sum + i.pageCount, 0);
  const totalSize = items.reduce((sum, i) => sum + i.file.size, 0);

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf,.pdf"
        multiple
        compact={items.length > 0}
        label={
          items.length > 0
            ? "Add more PDF files"
            : "Drop PDF files here, or click to browse"
        }
        hint="Select two or more .pdf files — order can be adjusted below"
        onFilesSelected={handleAddFiles}
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

      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              <strong className="font-semibold text-slate-900">
                {items.length}
              </strong>{" "}
              {items.length === 1 ? "file" : "files"} ·{" "}
              <strong className="font-semibold text-slate-900">
                {totalPages}
              </strong>{" "}
              total pages · {formatBytes(totalSize)}
            </span>
            <button
              type="button"
              onClick={() => {
                setItems([]);
                setError(null);
                setSuccessInfo(null);
              }}
              className="font-medium text-slate-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>

          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {items.map((item, idx) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-medium text-slate-600">
                    {idx + 1}
                  </span>
                  <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}{" "}
                      · {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                    aria-label="Move file up"
                    className="rounded-md border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 1)}
                    aria-label="Move file down"
                    className="rounded-md border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove file"
                    className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <label
                htmlFor="merge-filename"
                className="block text-xs font-medium text-slate-700"
              >
                Output filename
              </label>
              <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-blue-500">
                <input
                  id="merge-filename"
                  type="text"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none"
                  placeholder="merged-document"
                />
                <span className="pr-3 font-mono text-xs text-slate-400">
                  .pdf
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={busy || items.length < 2}
              onClick={handleMerge}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Merge & Download PDF
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
