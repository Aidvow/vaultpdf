"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import {
  convertImageFileToPngBytes,
  downloadBytes,
  formatBytes,
} from "@/lib/pdf-utils";

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
}

type PagePreset = "a4" | "letter" | "fit";
type MarginPreset = "none" | "small" | "standard";

const PRESET_DIMENSIONS: Record<Exclude<PagePreset, "fit">, [number, number]> =
  {
    a4: [595.28, 841.89],
    letter: [612, 792],
  };

const MARGIN_POINTS: Record<MarginPreset, number> = {
  none: 0,
  small: 24,
  standard: 48,
};

export function ImagesToPdfTool() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [pagePreset, setPagePreset] = useState<PagePreset>("a4");
  const [marginPreset, setMarginPreset] = useState<MarginPreset>("small");
  const [outputName, setOutputName] = useState("images-document");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  function handleAddFiles(files: File[]) {
    setError(null);
    setSuccessInfo(null);
    const valid = files.filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    if (valid.length === 0) {
      setError("Please select JPG, PNG, or WebP image files.");
      return;
    }

    const entries: ImageEntry[] = valid.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...entries]);
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  async function handleConvert() {
    if (images.length === 0) return;
    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const margin = pagePreset === "fit" ? 0 : MARGIN_POINTS[marginPreset];

      for (const entry of images) {
        const mime = entry.file.type.toLowerCase();
        const nameLower = entry.file.name.toLowerCase();

        let embedded;
        if (mime === "image/jpeg" || /\.jpe?g$/.test(nameLower)) {
          const bytes = new Uint8Array(await entry.file.arrayBuffer());
          embedded = await pdfDoc.embedJpg(bytes);
        } else if (mime === "image/png" || nameLower.endsWith(".png")) {
          const bytes = new Uint8Array(await entry.file.arrayBuffer());
          embedded = await pdfDoc.embedPng(bytes);
        } else {
          // WebP or other browser-supported image -> transcode locally to PNG via Canvas
          const pngBytes = await convertImageFileToPngBytes(entry.file);
          embedded = await pdfDoc.embedPng(pngBytes);
        }

        const imgW = embedded.width;
        const imgH = embedded.height;

        if (pagePreset === "fit") {
          const page = pdfDoc.addPage([imgW, imgH]);
          page.drawImage(embedded, {
            x: 0,
            y: 0,
            width: imgW,
            height: imgH,
          });
        } else {
          const [baseW, baseH] = PRESET_DIMENSIONS[pagePreset];
          // Auto-orient landscape photos to landscape page for clean viewing
          const isLandscape = imgW > imgH;
          const pageW = isLandscape ? baseH : baseW;
          const pageH = isLandscape ? baseW : baseH;
          const page = pdfDoc.addPage([pageW, pageH]);

          const availW = pageW - margin * 2;
          const availH = pageH - margin * 2;
          const scale = Math.min(availW / imgW, availH / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const x = (pageW - drawW) / 2;
          const y = (pageH - drawH) / 2;

          page.drawImage(embedded, { x, y, width: drawW, height: drawH });
        }
      }

      const outBytes = await pdfDoc.save();
      const safeName = (outputName.trim() || "images-document").replace(
        /\.pdf$/i,
        ""
      );
      downloadBytes(outBytes, `${safeName}.pdf`);
      setSuccessInfo(
        `Converted ${images.length} ${
          images.length === 1 ? "image" : "images"
        } into a ${formatBytes(outBytes.byteLength)} PDF locally.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to convert one or more images."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        compact={images.length > 0}
        label={
          images.length > 0
            ? "Add more images (JPG, PNG, WebP)"
            : "Drop JPG, PNG, or WebP images here"
        }
        hint="Auto-orients portrait & landscape photos cleanly into print-ready PDF pages"
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

      {images.length > 0 && (
        <>
          {/* Layout Options */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="page-preset"
                className="block text-xs font-medium text-slate-700"
              >
                Page Size
              </label>
              <select
                id="page-preset"
                value={pagePreset}
                onChange={(e) => setPagePreset(e.target.value as PagePreset)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="a4">A4 (Europe / International)</option>
                <option value="letter">US Letter (North America)</option>
                <option value="fit">Fit to Original Image Size</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="margin-preset"
                className="block text-xs font-medium text-slate-700"
              >
                Page Margin
              </label>
              <select
                id="margin-preset"
                disabled={pagePreset === "fit"}
                value={marginPreset}
                onChange={(e) =>
                  setMarginPreset(e.target.value as MarginPreset)
                }
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="none">No Margin (Edge-to-Edge)</option>
                <option value="small">Small Margin (0.33 in)</option>
                <option value="standard">Standard Margin (0.66 in)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="img-pdf-name"
                className="block text-xs font-medium text-slate-700"
              >
                Output Filename
              </label>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-blue-500">
                <input
                  id="img-pdf-name"
                  type="text"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none"
                />
                <span className="pr-3 font-mono text-xs text-slate-400">
                  .pdf
                </span>
              </div>
            </div>
          </div>

          {/* Image List */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              <strong className="font-semibold text-slate-900">
                {images.length}
              </strong>{" "}
              {images.length === 1 ? "image" : "images"} ready
            </span>
            <button
              type="button"
              onClick={() => {
                images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
                setImages([]);
                setSuccessInfo(null);
              }}
              className="font-medium text-slate-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>

          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {images.map((item, idx) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-medium text-slate-600">
                    {idx + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImage(idx, -1)}
                    aria-label="Move image up"
                    className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-35"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => moveImage(idx, 1)}
                    aria-label="Move image down"
                    className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-35"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    aria-label="Remove image"
                    className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={handleConvert}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Convert & Download PDF
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
