# VaultPDF — Private Zero-Upload PDF Tools

**Live Website:** [https://www.usevaultpdf.com](https://www.usevaultpdf.com)

VaultPDF is a fast, browser-native suite of 8 PDF utilities engineered with a strict zero-upload architecture. All document processing executes locally in browser memory via `pdf-lib`, so sensitive contracts, resumes, tax forms, and ID scans never leave the user's device.

## Core Tools (100% Client-Side)

- **Merge PDF** (`/tools/merge-pdf`) — Combine and reorder multiple PDFs locally.
- **Split & Extract PDF** (`/tools/split-pdf`) — Extract custom page ranges or burst every page into a ZIP archive.
- **Rotate & Organize PDF** (`/tools/rotate-reorder-pdf`) — Rotate sideways scans, reorder pages, and delete blank sheets.
- **Delete PDF Pages** (`/tools/delete-pdf-pages`) — Visually mark blank or unwanted pages for removal and export a clean PDF.
- **Images to PDF** (`/tools/images-to-pdf`) — Convert JPG, PNG, and WebP photos into A4, US Letter, or fit-to-image PDFs.
- **Watermark & Page Numbers** (`/tools/watermark-pdf`) — Stamp diagonal vector watermarks and clean `Page X of Y` footers.
- **Inspect & Strip PDF Metadata** (`/tools/remove-pdf-metadata`) — Audit and scrub hidden Author, Title, Creator, and timestamp metadata.
- **PDF Inspector** (`/tools/inspect-pdf`) — Check exact A4 vs. US Letter dimensions, orientation mix, and structure locally.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Lucide Icons
- **Client-Side PDF Engine**: `pdf-lib` & `jszip`
- **Deployment**: Vercel Global CDN (`https://www.usevaultpdf.com`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
