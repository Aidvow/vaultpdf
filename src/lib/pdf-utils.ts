export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );
  const value = bytes / Math.pow(k, i);
  return `${value >= 10 || i === 0 ? value.toFixed(0) : value.toFixed(1)} ${sizes[i]}`;
}

export function downloadBytes(
  data: Uint8Array | Blob,
  filename: string,
  mimeType = "application/pdf"
): void {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([new Uint8Array(data)], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Parses 1-indexed page ranges like "1-3, 5, 8-10" into 0-indexed page indices.
 * Preserves user-specified order and validates against totalPages.
 */
export function parsePageRanges(
  input: string,
  totalPages: number
): { indices: number[]; error?: string } {
  const cleaned = input.trim();
  if (!cleaned) {
    return { indices: [], error: "Please enter at least one page or range." };
  }

  const indices: number[] = [];
  const parts = cleaned
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const bounds = part.split("-").map((b) => b.trim());
      if (bounds.length !== 2) {
        return { indices: [], error: `Invalid range syntax: "${part}".` };
      }
      const start = Number(bounds[0]);
      const end = Number(bounds[1]);
      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 1 ||
        end < 1 ||
        start > totalPages ||
        end > totalPages
      ) {
        return {
          indices: [],
          error: `Range "${part}" is outside valid pages (1–${totalPages}).`,
        };
      }
      if (start <= end) {
        for (let p = start; p <= end; p++) indices.push(p - 1);
      } else {
        for (let p = start; p >= end; p--) indices.push(p - 1);
      }
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > totalPages) {
        return {
          indices: [],
          error: `Page "${part}" is outside valid pages (1–${totalPages}).`,
        };
      }
      indices.push(page - 1);
    }
  }

  if (indices.length === 0) {
    return { indices: [], error: "No valid pages selected." };
  }

  return { indices };
}

/**
 * Converts any browser-supported image File (e.g. WebP) into PNG bytes via Canvas
 * when pdf-lib cannot embed the format natively (pdf-lib natively supports JPG & PNG).
 */
export async function convertImageFileToPngBytes(
  file: File
): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not initialize 2D canvas context.");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) {
    throw new Error("Failed to convert image to PNG locally.");
  }
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}
