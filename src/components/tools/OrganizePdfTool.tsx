"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import {
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
  Undo2,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { downloadBytes, formatBytes, stripExtension } from "@/lib/pdf-utils";

interface PageItem {
  id: string;
  originalIndex: number; // 0-based
  extraRotation: number; // 0, 90, 180, 270
  width: number;
  height: number;
}

export function OrganizePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPages, setOriginalPages] = useState<PageItem[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
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
      const list: PageItem[] = doc.getPages().map((page, index) => {
        const { width, height } = page.getSize();
        return {
          id: `page-${index}`,
          originalIndex: index,
          extraRotation: 0,
          width: Math.round(width),
          height: Math.round(height),
        };
      });
      setFile(picked);
      setOriginalPages(list);
      setPages(list);
    } catch {
      setError(
        `Could not read "${picked.name}". Please ensure it is a valid, unencrypted PDF.`
      );
      setFile(null);
      setPages([]);
    }
  }

  function rotatePage(id: string, delta: 90 | -90) {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, extraRotation: (p.extraRotation + delta + 360) % 360 }
          : p
      )
    );
  }

  function rotateAll(delta: 90 | -90) {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        extraRotation: (p.extraRotation + delta + 360) % 360,
      }))
    );
  }

  function movePage(index: number, direction: -1 | 1) {
    setPages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  }

  function deletePage(id: string) {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }

  function resetAll() {
    setPages(originalPages.map((p) => ({ ...p })));
    setSuccessInfo(null);
  }

  async function handleExport() {
    if (!file || pages.length === 0) {
      setError("Keep at least one page before saving.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const srcBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes);
      const outDoc = await PDFDocument.create();

      const copied = await outDoc.copyPages(
        srcDoc,
        pages.map((p) => p.originalIndex)
      );

      copied.forEach((page, i) => {
        const extra = pages[i].extraRotation;
        if (extra !== 0) {
          const currentAngle = page.getRotation().angle;
          page.setRotation(degrees((currentAngle + extra) % 360));
        }
        outDoc.addPage(page);
      });

      const outBytes = await outDoc.save();
      downloadBytes(outBytes, `${stripExtension(file.name)}-organized.pdf`);
      setSuccessInfo(
        `Saved ${pages.length} organized ${
          pages.length === 1 ? "page" : "pages"
        } (${formatBytes(outBytes.byteLength)}) locally.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save organized PDF."
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
            ? "Load a different PDF"
            : "Drop a PDF to rotate, reorder, or delete pages"
        }
        hint="Fix sideways scans or remove blank pages cleanly in your browser"
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
        <>
          {/* Batch Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="max-w-[220px] truncate text-sm font-semibold text-slate-900 sm:max-w-xs">
                {file.name}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                {pages.length} / {originalPages.length} pages
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => rotateAll(-90)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                All -90°
              </button>
              <button
                type="button"
                onClick={() => rotateAll(90)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCw className="h-3.5 w-3.5" />
                All +90°
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Page Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      Position #{index + 1}
                    </span>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Original page {page.originalIndex + 1} · {page.width}×
                      {page.height} pt
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-medium ${
                      page.extraRotation === 0
                        ? "bg-slate-100 text-slate-500"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    +{page.extraRotation}°
                  </span>
                </div>

                {/* Orientation Preview Miniature */}
                <div className="my-4 flex h-20 items-center justify-center rounded-lg bg-slate-50">
                  <div
                    style={{ transform: `rotate(${page.extraRotation}deg)` }}
                    className="flex h-14 w-11 flex-col items-center justify-center rounded border border-slate-300 bg-white shadow-2xs transition-transform duration-200"
                  >
                    <div className="h-1 w-6 rounded-full bg-slate-300" />
                    <div className="mt-1 h-1 w-4 rounded-full bg-slate-200" />
                    <span className="mt-1.5 font-mono text-[10px] font-semibold text-slate-500">
                      P{page.originalIndex + 1}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-1 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => rotatePage(page.id, -90)}
                      title="Rotate counter-clockwise 90°"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotatePage(page.id, 90)}
                      title="Rotate clockwise 90°"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => movePage(index, -1)}
                      title="Move earlier"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-35"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === pages.length - 1}
                      onClick={() => movePage(index, 1)}
                      title="Move later"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-35"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={pages.length <= 1}
                      onClick={() => deletePage(page.id)}
                      title="Delete page"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-35"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={busy || pages.length === 0}
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Save Reorganized PDF
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
