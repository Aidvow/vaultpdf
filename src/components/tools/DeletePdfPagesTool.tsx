"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Trash2,
  RotateCcw,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { downloadBytes, formatBytes, stripExtension } from "@/lib/pdf-utils";

interface PageEntry {
  index: number; // 0-based
  width: number;
  height: number;
}

export function DeletePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [markedForDelete, setMarkedForDelete] = useState<Set<number>>(
    new Set()
  );
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
      const list = doc.getPages().map((page, index) => {
        const { width, height } = page.getSize();
        return {
          index,
          width: Math.round(width),
          height: Math.round(height),
        };
      });
      setFile(picked);
      setPages(list);
      setMarkedForDelete(new Set());
    } catch {
      setError(
        `Could not read "${picked.name}". Please ensure it is a valid, unencrypted PDF.`
      );
      setFile(null);
      setPages([]);
    }
  }

  function togglePage(index: number) {
    setMarkedForDelete((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
    setSuccessInfo(null);
  }

  function markPreset(type: "first" | "last" | "even" | "odd" | "clear") {
    if (type === "clear") {
      setMarkedForDelete(new Set());
      return;
    }
    const next = new Set<number>();
    if (type === "first" && pages.length > 0) next.add(0);
    if (type === "last" && pages.length > 0) next.add(pages.length - 1);
    if (type === "even") {
      pages.forEach((p) => {
        if ((p.index + 1) % 2 === 0) next.add(p.index);
      });
    }
    if (type === "odd") {
      pages.forEach((p) => {
        if ((p.index + 1) % 2 === 1) next.add(p.index);
      });
    }
    setMarkedForDelete(next);
    setSuccessInfo(null);
  }

  async function handleExport() {
    if (!file) return;
    const keepIndices = pages
      .map((p) => p.index)
      .filter((idx) => !markedForDelete.has(idx));

    if (keepIndices.length === 0) {
      setError("You must keep at least 1 page in the output PDF.");
      return;
    }
    if (markedForDelete.size === 0) {
      setError("Click at least one page to mark it for deletion.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const srcBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes);
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(srcDoc, keepIndices);
      copied.forEach((p) => outDoc.addPage(p));
      const outBytes = await outDoc.save();
      downloadBytes(outBytes, `${stripExtension(file.name)}-trimmed.pdf`);
      setSuccessInfo(
        `Removed ${markedForDelete.size} ${
          markedForDelete.size === 1 ? "page" : "pages"
        }. Saved ${keepIndices.length} remaining ${
          keepIndices.length === 1 ? "page" : "pages"
        } (${formatBytes(outBytes.byteLength)}) locally.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save trimmed PDF."
      );
    } finally {
      setBusy(false);
    }
  }

  const remainingCount = pages.length - markedForDelete.size;

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf,.pdf"
        compact={Boolean(file)}
        label={
          file
            ? "Load a different PDF"
            : "Drop a PDF file to remove unwanted or blank pages"
        }
        hint="Click any page tile below to mark it for deletion — zero server uploads"
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
          {/* Summary & Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="max-w-[200px] truncate text-sm font-semibold text-slate-900 sm:max-w-xs">
                {file.name}
              </span>
              <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                Keep {remainingCount} / {pages.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => markPreset("first")}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Mark First
              </button>
              <button
                type="button"
                onClick={() => markPreset("last")}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Mark Last
              </button>
              {pages.length >= 2 && (
                <button
                  type="button"
                  onClick={() => markPreset("even")}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Mark Even Pages
                </button>
              )}
              <button
                type="button"
                onClick={() => markPreset("clear")}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>

          {/* Clickable Page Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {pages.map((page) => {
              const isDeleted = markedForDelete.has(page.index);
              return (
                <button
                  key={page.index}
                  type="button"
                  onClick={() => togglePage(page.index)}
                  className={`group flex flex-col items-center justify-between rounded-xl border p-3.5 text-center transition-all ${
                    isDeleted
                      ? "border-red-300 bg-red-50/70 text-red-700 ring-1 ring-red-200"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex w-full items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold">P{page.index + 1}</span>
                    {isDeleted ? (
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    ) : (
                      <span className="text-slate-400 group-hover:text-red-500">
                        Keep
                      </span>
                    )}
                  </div>

                  <div
                    className={`my-3 flex h-12 w-9 flex-col items-center justify-center rounded border text-[10px] font-mono ${
                      isDeleted
                        ? "border-red-300 bg-white/70 text-red-500 line-through"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {page.index + 1}
                  </div>

                  <span className="text-[10px] text-slate-500">
                    {isDeleted
                      ? "Will delete"
                      : `${page.width}×${page.height}`}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">
              {markedForDelete.size > 0
                ? `${markedForDelete.size} ${
                    markedForDelete.size === 1 ? "page" : "pages"
                  } marked for removal · ${remainingCount} will be kept`
                : "Click pages above to mark them for removal"}
            </p>
            <button
              type="button"
              disabled={busy || markedForDelete.size === 0 || remainingCount === 0}
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building Clean PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Delete {markedForDelete.size || ""} & Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
