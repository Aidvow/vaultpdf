"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { FileDropzone } from "@/components/FileDropzone";
import { downloadBytes, formatBytes, stripExtension } from "@/lib/pdf-utils";

interface MetadataField {
  label: string;
  value: string;
  riskHint: string;
}

export function MetadataPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [fields, setFields] = useState<MetadataField[]>([]);
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
      const doc = await PDFDocument.load(buffer, { updateMetadata: false });
      setFile(picked);
      setPageCount(doc.getPageCount());

      const creation = doc.getCreationDate();
      const modified = doc.getModificationDate();

      setFields([
        {
          label: "Title",
          value: doc.getTitle() || "",
          riskHint: "Often displays old draft names in browser tabs",
        },
        {
          label: "Author",
          value: doc.getAuthor() || "",
          riskHint: "Frequently leaks real name or OS account username",
        },
        {
          label: "Subject",
          value: doc.getSubject() || "",
          riskHint: "May retain recycled template descriptions",
        },
        {
          label: "Keywords",
          value: doc.getKeywords() || "",
          riskHint: "Hidden search tags embedded by Word or Acrobat",
        },
        {
          label: "Creator Software",
          value: doc.getCreator() || "",
          riskHint: "Reveals editing tool and operating system",
        },
        {
          label: "PDF Producer",
          value: doc.getProducer() || "",
          riskHint: "Reveals export engine & version number",
        },
        {
          label: "Creation Date",
          value: creation ? creation.toISOString() : "",
          riskHint: "Exact creation timestamp",
        },
        {
          label: "Modification Date",
          value: modified ? modified.toISOString() : "",
          riskHint: "Exact last-edited timestamp",
        },
      ]);
    } catch {
      setError(
        `Could not inspect "${picked.name}". Ensure it is a valid, unencrypted PDF.`
      );
      setFile(null);
      setFields([]);
    }
  }

  async function handleScrub() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const srcBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes, {
        updateMetadata: false,
      });

      // Build a brand-new clean PDF copying only visible pages, wiping header metadata
      const cleanDoc = await PDFDocument.create();
      const copied = await cleanDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      copied.forEach((p) => cleanDoc.addPage(p));

      cleanDoc.setTitle("");
      cleanDoc.setAuthor("");
      cleanDoc.setSubject("");
      cleanDoc.setKeywords([]);
      cleanDoc.setCreator("");
      cleanDoc.setProducer("");

      const outBytes = await cleanDoc.save({ addDefaultPage: false });
      downloadBytes(outBytes, `${stripExtension(file.name)}-clean.pdf`);
      setSuccessInfo(
        `Scrubbed all hidden metadata fields (${formatBytes(outBytes.byteLength)}). Drop the downloaded file back in anytime to verify it is clean.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to scrub PDF metadata."
      );
    } finally {
      setBusy(false);
    }
  }

  const exposedCount = fields.filter((f) => f.value.trim().length > 0).length;

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf,.pdf"
        compact={Boolean(file)}
        label={
          file
            ? "Inspect another PDF file"
            : "Drop a PDF to inspect and scrub hidden metadata"
        }
        hint="Audit resumes, legal filings, and proposals before sharing externally"
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
          {/* Status Banner */}
          <div
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              exposedCount > 0
                ? "border-amber-200 bg-amber-50/70"
                : "border-emerald-200 bg-emerald-50/70"
            }`}
          >
            <div className="flex items-start gap-3">
              {exposedCount > 0 ? (
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              ) : (
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {exposedCount > 0
                    ? `${exposedCount} hidden metadata ${
                        exposedCount === 1 ? "field" : "fields"
                      } detected`
                    : "This PDF has clean metadata"}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  <FileText className="mr-1 inline h-3.5 w-3.5" />
                  {file.name} · {pageCount} {pageCount === 1 ? "page" : "pages"}{" "}
                  · {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={handleScrub}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50 sm:text-sm"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scrubbing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Scrub Metadata & Download
                </>
              )}
            </button>
          </div>

          {/* Metadata Audit Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Detected Value</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fields.map((field) => {
                  const hasValue = field.value.trim().length > 0;
                  return (
                    <tr key={field.label}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-slate-900">
                          {field.label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {field.riskHint}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top font-mono text-xs text-slate-800">
                        {hasValue ? (
                          <span className="break-all">{field.value}</span>
                        ) : (
                          <span className="italic text-slate-400">Empty</span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 align-top sm:table-cell">
                        {hasValue ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                            Exposed
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                            Clean
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
