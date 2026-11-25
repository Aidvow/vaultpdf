# VaultPDF — Private Zero-Upload PDF Tools

VaultPDF is a fast, browser-native suite of PDF utilities engineered with a strict zero-upload architecture. All document processing executes locally in browser memory via `pdf-lib`, so sensitive contracts, resumes, tax forms, and ID scans never leave the user's device.

## Core Tools

- **Merge PDF** (`/tools/merge-pdf`) — Combine and reorder multiple PDFs locally.
- **Split & Extract PDF** (`/tools/split-pdf`) — Extract custom page ranges or burst every page into a ZIP archive.
- **Rotate & Organize PDF** (`/tools/rotate-reorder-pdf`) — Rotate sideways scans, reorder pages, and delete blank sheets.
- **Images to PDF** (`/tools/images-to-pdf`) — Convert JPG, PNG, and WebP photos into A4, US Letter, or fit-to-image PDFs.
- **Watermark & Page Numbers** (`/tools/watermark-pdf`) — Stamp diagonal vector watermarks and clean `Page X of Y` footers.
- **Inspect & Strip PDF Metadata** (`/tools/remove-pdf-metadata`) — Audit and scrub hidden Author, Title, Creator, and timestamp metadata.

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS + Lucide Icons
- **Client-Side PDF Engine**: `pdf-lib` & `jszip`
- **SEO & Monetization Ready**: Dynamic `sitemap.xml`, `robots.txt`, JSON-LD (`WebApplication`, `FAQPage`, `Article`), GDPR cookie notice, GA4 & Google AdSense environment hooks (`public/ads.txt`).

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` (or configure in Vercel / Cloudflare Pages):

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_AD_PREVIEW=false
```
