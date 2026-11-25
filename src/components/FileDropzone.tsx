"use client";

import { useRef, useState } from "react";
import { UploadCloud, Lock } from "lucide-react";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFilesSelected: (files: File[]) => void;
  compact?: boolean;
}

export function FileDropzone({
  accept,
  multiple = false,
  label,
  hint,
  onFilesSelected,
  compact = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleList(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    onFilesSelected(multiple ? files : [files[0]]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleList(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`group relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50/50"
          : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
      } ${compact ? "px-5 py-5" : "px-6 py-12 sm:py-14"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleList(e.target.files)}
      />

      <div className="flex flex-col items-center text-center">
        <div
          className={`flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-transform group-hover:-translate-y-0.5 ${
            compact ? "h-10 w-10" : "h-12 w-12"
          }`}
        >
          <UploadCloud className={compact ? "h-5 w-5" : "h-6 w-6"} />
        </div>

        <p
          className={`font-semibold text-slate-900 ${
            compact ? "mt-2.5 text-sm" : "mt-4 text-base"
          }`}
        >
          {label}
        </p>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{hint}</p>

        {!compact && (
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-[11px] font-medium text-emerald-800">
            <Lock className="h-3 w-3" />
            Processed locally in browser RAM · Never uploaded
          </div>
        )}
      </div>
    </div>
  );
}
