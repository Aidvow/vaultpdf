export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug:
    | "merge-pdf"
    | "split-pdf"
    | "rotate-reorder-pdf"
    | "images-to-pdf"
    | "watermark-pdf"
    | "remove-pdf-metadata";
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  category: "Organize" | "Convert" | "Security & Privacy" | "Polish";
  badge?: string;
  steps: { title: string; body: string }[];
  useCases: string[];
  privacyNote: string;
  faqs: ToolFaq[];
}

export interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  relatedToolSlug: ToolDefinition["slug"];
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export const SITE_CONFIG = {
  name: "VaultPDF",
  tagline: "Private PDF tools that run 100% in your browser.",
  description:
    "Merge, split, rotate, watermark, convert images to PDF, and strip hidden metadata entirely on your device. Zero uploads, zero servers, built for sensitive documents.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vaultpdf-khaki.vercel.app",
  contactEmail: "hello@vaultpdf.tools",
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  showAdPreview: process.env.NEXT_PUBLIC_AD_PREVIEW === "true",
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF Files",
    shortName: "Merge PDF",
    tagline: "Combine multiple PDF documents into a single file locally.",
    description:
      "Join contracts, invoices, tax statements, or study packets in seconds without uploading private files to external servers.",
    seoTitle: "Merge PDF Locally — Free Zero-Upload PDF Combiner",
    seoDescription:
      "Combine multiple PDF files into one document 100% inside your browser. No server uploads, no watermarks, and no registration required.",
    category: "Organize",
    badge: "Most Popular",
    steps: [
      {
        title: "Add your PDF files",
        body: "Drag and drop two or more PDF documents into the local workspace, or select them from your device.",
      },
      {
        title: "Arrange the exact order",
        body: "Use the quick up and down controls to put cover letters, resumes, or appendices in the sequence you need.",
      },
      {
        title: "Merge & download instantly",
        body: "Click Merge PDFs. Your browser assembles the combined PDF in local memory and saves it directly to disk.",
      },
    ],
    useCases: [
      "Combining a resume, cover letter, and portfolio into one job application packet",
      "Assembling monthly receipts and expense reports for accounting or tax filing",
      "Bundling signed NDAs, statements of work, and exhibits for legal review",
      "Merging lecture slides and reading chapters into a single printable study guide",
    ],
    privacyNote:
      "Traditional online PDF mergers transmit your files across the internet to remote servers. VaultPDF uses WebAssembly-grade JavaScript PDF assembly directly inside your browser tab, so zero bytes of your documents ever leave your computer.",
    faqs: [
      {
        question: "Are my PDFs uploaded to a server when I merge them?",
        answer:
          "No. All file reading and merging happen strictly inside your browser's local memory. You can even disconnect from the internet after loading the page and the merger will still work.",
      },
      {
        question: "Is there a file size limit or daily merge cap?",
        answer:
          "VaultPDF imposes no artificial upload limits or paywalls. Performance depends only on your device's available memory, easily handling dozens of multi-megabyte documents.",
      },
      {
        question: "Does merging reduce image quality or strip selectable text?",
        answer:
          "No. VaultPDF copies the original PDF page objects directly rather than rasterizing them, preserving crisp vector text, links, and original resolution.",
      },
    ],
  },
  {
    slug: "split-pdf",
    name: "Split & Extract PDF Pages",
    shortName: "Split PDF",
    tagline: "Extract exact page ranges or burst every page into individual PDFs.",
    description:
      "Pull out signature pages, single chapters, or specific invoices from large PDF packets with zero cloud uploads.",
    seoTitle: "Split PDF Online Privately — Extract PDF Pages Locally",
    seoDescription:
      "Extract specific pages or split every page of a PDF into separate files 100% locally in your browser. Free, fast, and zero uploads.",
    category: "Organize",
    steps: [
      {
        title: "Load a PDF document",
        body: "Drop your PDF into the workspace to immediately inspect the total page count locally.",
      },
      {
        title: "Choose extraction mode",
        body: "Enter custom page ranges like 1-3, 5, 8-10 to extract one clean PDF, or burst every page into a ZIP archive.",
      },
      {
        title: "Download clean output",
        body: "Export your extracted PDF or ZIP bundle immediately—with no branding or forced signups.",
      },
    ],
    useCases: [
      "Extracting only the signed execution page from a 60-page lease or contract",
      "Separating individual client invoices from a batch accounting export",
      "Pulling specific chapters or worksheets from a large textbook PDF",
      "Removing cover pages or blank trailing pages before submission",
    ],
    privacyNote:
      "Whether you are isolating a W-2 tax form or a confidential HR annex, your original file stays strictly inside your local browser sandbox.",
    faqs: [
      {
        question: "How should I format custom page ranges?",
        answer:
          "Separate individual pages or ranges with commas—for example, '1-3, 5, 9-12'. Ranges are inclusive and 1-indexed.",
      },
      {
        question: "Can I split a 20-page PDF into 20 separate PDF files at once?",
        answer:
          "Yes. Switch to 'Split Every Page (ZIP)' mode and VaultPDF will generate each page as its own numbered PDF bundled inside a single convenient ZIP download.",
      },
      {
        question: "Will splitting modify my original file?",
        answer:
          "Never. Your original file on disk remains untouched; VaultPDF creates a brand-new output file for download.",
      },
    ],
  },
  {
    slug: "rotate-reorder-pdf",
    name: "Rotate & Organize PDF Pages",
    shortName: "Rotate & Organize",
    tagline: "Fix sideways scans, reorder pages, and delete unwanted sheets.",
    description:
      "Visually reorganize page order, rotate landscape scans by 90°, and remove blank pages cleanly inside your browser.",
    seoTitle: "Rotate & Reorder PDF Pages Locally — Zero Upload",
    seoDescription:
      "Rotate sideways PDF pages, reorder page sequence, or delete blank pages entirely in your browser. Private, instant, and free.",
    category: "Organize",
    steps: [
      {
        title: "Open your scanned or exported PDF",
        body: "Drop any PDF to generate an instant page-by-page organizer list right inside your browser.",
      },
      {
        title: "Rotate, reorder, or remove pages",
        body: "Rotate single pages or all pages at once in 90° increments, move pages up or down, and remove blank sheets.",
      },
      {
        title: "Save your reorganized PDF",
        body: "Export the cleaned, properly oriented PDF document in one click.",
      },
    ],
    useCases: [
      "Fixing upside-down or sideways pages from office duplex scanners",
      "Deleting accidental blank pages from exported Word or Google Docs files",
      "Reordering presentation handouts or architectural sheets before printing",
      "Preparing clean visa or mortgage document packets in exact checklist order",
    ],
    privacyNote:
      "Scanned identity documents, medical records, and signed forms are among the most sensitive files people handle. Rotating them locally guarantees zero exposure.",
    faqs: [
      {
        question: "Does rotating a PDF page permanently save the new orientation?",
        answer:
          "Yes. VaultPDF updates each page's internal PDF rotation matrix and saves a new file so every PDF viewer displays the corrected orientation permanently.",
      },
      {
        question: "Can I rotate all pages at once?",
        answer:
          "Yes. Use the 'Rotate All +90°' toolbar button to fix an entire sideways scan in a single click, or adjust individual pages independently.",
      },
      {
        question: "Can I undo removing a page before exporting?",
        answer:
          "Yes. Clicking 'Reset All Changes' restores the exact original page order and rotations before you export.",
      },
    ],
  },
  {
    slug: "images-to-pdf",
    name: "Convert Images to PDF",
    shortName: "Images to PDF",
    tagline: "Turn JPG, PNG, and WebP photos into a crisp, print-ready PDF.",
    description:
      "Convert scanned receipts, ID photos, whiteboard notes, or design mockups into standard US Letter, A4, or exact-fit PDFs locally.",
    seoTitle: "Images to PDF Converter (JPG, PNG, WebP) — 100% Local",
    seoDescription:
      "Convert JPG, PNG, and WebP images into a clean A4 or US Letter PDF directly in your browser without uploading photos to the cloud.",
    category: "Convert",
    steps: [
      {
        title: "Drop your images",
        body: "Select one or multiple JPG, PNG, or WebP files. WebP files are automatically converted cleanly inside your browser.",
      },
      {
        title: "Configure layout & order",
        body: "Reorder images and choose US Letter, A4, or Fit-to-Image sizing along with page margins and orientation.",
      },
      {
        title: "Build & download PDF",
        body: "Generate a sharp, print-ready PDF document in milliseconds—completely offline-capable.",
      },
    ],
    useCases: [
      "Turning smartphone photos of paper receipts into an expense PDF",
      "Packaging passport scans or driver's license photos for HR onboarding",
      "Compiling whiteboard snapshots or handwritten notes into a single assignment PDF",
      "Exporting UI screenshots or product photos into a shareable client lookbook",
    ],
    privacyNote:
      "Photos of IDs, passports, checks, and home documents should never sit on third-party conversion servers. VaultPDF encodes them into PDF purely in client-side memory.",
    faqs: [
      {
        question: "Which image formats are supported?",
        answer:
          "VaultPDF natively supports JPG/JPEG, PNG, and WebP images. WebP images are automatically transcoded via your browser's local Canvas engine before embedding.",
      },
      {
        question: "What is the difference between A4, US Letter, and Fit to Image?",
        answer:
          "A4 (210 × 297 mm) is standard across Europe and globally; US Letter (8.5 × 11 in) is standard in the United States and Canada; Fit to Image sizes each PDF page to match the exact aspect ratio of the photo with zero cropping.",
      },
      {
        question: "Are my images compressed or watermarked?",
        answer:
          "VaultPDF never adds watermarks and embeds your original JPG/PNG image data cleanly without unnecessary quality degradation.",
      },
    ],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark & Number PDF",
    shortName: "Watermark & Numbers",
    tagline: "Stamp diagonal text watermarks and clean footer page numbers.",
    description:
      "Mark drafts as CONFIDENTIAL, protect client proposals, or add professional 'Page X of Y' footers to contracts and academic papers.",
    seoTitle: "Add Watermark & Page Numbers to PDF Locally",
    seoDescription:
      "Add custom diagonal watermarks and clean page numbers to any PDF inside your browser. Zero server uploads, tailored for legal and business files.",
    category: "Polish",
    steps: [
      {
        title: "Upload a PDF locally",
        body: "Drop your draft contract, thesis, or proposal into the browser workspace.",
      },
      {
        title: "Customize watermark & footer",
        body: "Set watermark text (e.g., CONFIDENTIAL, DRAFT, DO NOT DISTRIBUTE), opacity, size, color, and optional page numbering.",
      },
      {
        title: "Apply & download",
        body: "Stamp every page with vector-sharp typography and save the finished PDF immediately.",
      },
    ],
    useCases: [
      "Stamping 'CONFIDENTIAL' or 'FOR REVIEW ONLY' across investor pitch decks",
      "Adding 'COPY — FOR VERIFICATION ONLY' onto ID scans before sending to landlords",
      "Inserting clean 'Page 1 of 24' footers onto legal briefs and academic manuscripts",
      "Labeling draft contracts clearly so unsigned versions aren't mistaken for final",
    ],
    privacyNote:
      "Adding a 'CONFIDENTIAL' stamp by uploading the file to an unknown web server defeats the purpose of confidentiality. VaultPDF stamps your document locally.",
    faqs: [
      {
        question: "Can I add only page numbers without a watermark?",
        answer:
          "Yes! Simply leave the watermark text blank (or toggle off watermark) and enable the Page Numbers option to insert clean footer numbering.",
      },
      {
        question: "Is the watermark vector text or a blurry image?",
        answer:
          "It is rendered as crisp native PDF vector typography using standard Helvetica fonts, so it stays razor-sharp at any zoom level or print DPI.",
      },
      {
        question: "Can I control how subtle or bold the watermark looks?",
        answer:
          "Yes. Adjust opacity (from a faint 8% background stamp up to 60%), font size, angle, and slate/crimson/indigo ink color.",
      },
    ],
  },
  {
    slug: "remove-pdf-metadata",
    name: "Inspect & Strip PDF Metadata",
    shortName: "Strip Metadata",
    tagline: "Reveal and erase hidden Author, Creator, software, and timestamp data.",
    description:
      "Audit hidden metadata embedded inside resumes, legal filings, and client proposals—and scrub every sensitive tag in one click.",
    seoTitle: "Remove PDF Metadata Online — Inspect & Scrub Hidden PDF Info",
    seoDescription:
      "Inspect and remove hidden Author, Creator, Producer, Subject, and timestamp metadata from PDFs 100% locally in your browser.",
    category: "Security & Privacy",
    badge: "Privacy Essential",
    steps: [
      {
        title: "Drop a PDF to inspect",
        body: "VaultPDF immediately reads and displays hidden document properties like Author name, OS software, and creation timestamps.",
      },
      {
        title: "Review exposed fields",
        body: "Check whether your personal username, employer template name, or internal draft title is leaking inside the file header.",
      },
      {
        title: "Scrub all metadata cleanly",
        body: "Click 'Scrub Metadata & Download' to produce an anonymized PDF with clean empty metadata fields.",
      },
    ],
    useCases: [
      "Cleaning personal computer usernames and Word template metadata from resumes",
      "Sanitizing legal discovery packets, whistleblowing docs, or anonymous submissions",
      "Removing previous client names left inside recycled proposal or contract templates",
      "Auditing PDFs before publishing them publicly on a company website or GitHub",
    ],
    privacyNote:
      "A privacy scrubbing tool must itself be provably private. VaultPDF inspects and rewrites PDF header dictionaries exclusively in local browser RAM.",
    faqs: [
      {
        question: "What hidden metadata is usually stored inside a PDF?",
        answer:
          "Most PDFs exported from Microsoft Word, Apple Pages, Google Docs, or Adobe Acrobat quietly embed Author (often your real name or PC login), Creator software, Producer version, Title, Subject, Keywords, and exact Creation/Modification timestamps.",
      },
      {
        question: "Does stripping metadata change how my PDF looks or prints?",
        answer:
          "Not at all. Every page, font, image, and layout element stays 100% identical—only the hidden document metadata fields are wiped clean.",
      },
      {
        question: "How can I verify that the metadata is truly gone?",
        answer:
          "After downloading the scrubbed PDF, drop the newly downloaded file right back into this tool—you will see all metadata fields reported as empty.",
      },
    ],
  },
];

export const GUIDES: GuideArticle[] = [
  {
    slug: "why-browser-based-pdf-processing-protects-sensitive-documents",
    title:
      "Why Browser-Based PDF Processing Protects Sensitive Contracts & Tax Forms",
    excerpt:
      "Most free online PDF sites quietly upload your contracts, resumes, and ID scans to remote cloud servers. Here is how client-side processing works and how to verify it yourself.",
    publishedAt: "2026-11-18",
    readTime: "4 min read",
    category: "Privacy & Security",
    relatedToolSlug: "merge-pdf",
    sections: [
      {
        heading: "The hidden risk of traditional 'free' PDF websites",
        paragraphs: [
          "When you drop a signed employment contract, W-2 tax return, or passport scan onto a conventional web-based PDF tool, your browser sends the entire file across the internet to a third-party server. Even when a provider promises to delete uploaded files after one or two hours, your document temporarily resides on infrastructure you do not control—subject to server logs, backup snapshots, or misconfigured cloud buckets.",
          "For professionals working under GDPR in Europe, strict client NDAs in the United States, or university data-handling guidelines, casually uploading sensitive files to unknown web utilities creates unnecessary compliance risk.",
        ],
      },
      {
        heading: "How 100% local in-browser PDF processing works",
        paragraphs: [
          "Modern browsers are remarkably capable computing environments. Using JavaScript ArrayBuffers and low-level PDF parsing libraries like pdf-lib, your browser can read a PDF file directly from your local disk into volatile RAM, restructure page trees, embed images, or stamp vector watermarks, and then trigger a local Blob download—without ever making an HTTP POST request.",
        ],
        bullets: [
          "Zero network transfer: Files remain inside your browser tab's memory sandbox.",
          "Instant speed: Eliminating upload and download latency makes multi-megabyte merges nearly instantaneous.",
          "Offline resilience: Once the web application assets are loaded, the core tools work even in Airplane Mode.",
        ],
      },
      {
        heading: "How you can verify zero uploads in 15 seconds",
        paragraphs: [
          "You should never have to take any privacy claim on faith. In Chrome, Edge, Firefox, or Safari, open Developer Tools (F12 or Cmd+Option+I), switch to the Network tab, and filter by Fetch/XHR. Now drop a PDF into VaultPDF and run any operation. You will observe zero outgoing file uploads—confirming cryptographically and empirically that your document stays on your machine.",
        ],
      },
    ],
  },
  {
    slug: "hidden-metadata-inside-your-pdf-resume-and-how-to-remove-it",
    title:
      "What Hidden Metadata Lives Inside Your PDF Resume (And How to Scrub It)",
    excerpt:
      "Exporting a resume or client proposal to PDF often leaks your PC username, old template titles, and edit timestamps. Learn what gets embedded and how to clean it in seconds.",
    publishedAt: "2026-11-20",
    readTime: "5 min read",
    category: "Career & Privacy",
    relatedToolSlug: "remove-pdf-metadata",
    sections: [
      {
        heading: "What software silently writes into your PDF header",
        paragraphs: [
          "Every standard PDF file contains an internal Information Dictionary. When you click 'Save as PDF' in Microsoft Word, LibreOffice, Canva, or macOS Preview, the application automatically populates metadata properties you rarely see on screen.",
        ],
        bullets: [
          "Author: Often defaults to your full operating system username or a previous template author's name.",
          "Title & Subject: Frequently retains an old filename like 'Resume_Draft_v3_OldCompany' even after you rename the file.",
          "Creator & Producer: Reveals exact operating system and software versions.",
          "CreationDate & ModDate: Exposes exact timestamps and time zones showing when the file was created or revised.",
        ],
      },
      {
        heading: "Real-world scenarios where PDF metadata causes embarrassment",
        paragraphs: [
          "Recruiters and ATS portals often display the internal PDF Title field in browser tabs instead of the filename. Imagine submitting a tailored application to Company B while the browser tab header still reads 'Cover Letter - Company A'.",
          "Similarly, freelancers and consultants who duplicate an older client proposal frequently forget that the prior client's name or internal project code remains embedded in the PDF's Author, Subject, or Keywords fields.",
        ],
      },
      {
        heading: "A 10-second pre-send hygiene checklist",
        paragraphs: [
          "Before emailing any resume, legal filing, grant proposal, or public whitepaper, inspect it with VaultPDF's local Metadata Inspector. Scrubbing all hidden fields takes one click, leaves visual formatting 100% untouched, and ensures you only share what is actually visible on the page.",
        ],
      },
    ],
  },
  {
    slug: "prepare-clean-pdf-packets-for-visa-tax-and-job-applications",
    title:
      "How to Assemble Clean PDF Packets for Visa, Mortgage, and Job Applications",
    excerpt:
      "Portals reject upside-down scans, unnumbered multi-file bundles, and raw smartphone photos. Follow this 4-step workflow to build crisp, submission-ready PDF packets locally.",
    publishedAt: "2026-11-22",
    readTime: "5 min read",
    category: "Productivity",
    relatedToolSlug: "images-to-pdf",
    sections: [
      {
        heading: "Why official portals and reviewers love clean single-file packets",
        paragraphs: [
          "Whether you are applying for a US/Schengen visa, submitting mortgage underwriting documents, or sending an academic graduate packet, reviewers often open dozens of applications per hour. Sending six separate JPGs alongside two sideways PDFs slows review and increases the chance of missing a required attachment.",
        ],
      },
      {
        heading: "The 4-step submission-ready workflow",
        paragraphs: [
          "You can prepare an executive-grade document packet in under two minutes without installing heavy desktop software:",
        ],
        bullets: [
          "Step 1 — Convert photos to standard pages: Use Images to PDF to turn smartphone scans of IDs or receipts into uniform A4 (Europe) or US Letter (North America) pages.",
          "Step 2 — Fix orientation & remove blanks: Open Rotate & Organize PDF to rotate any sideways pages 90° and strip accidental blank scanner sheets.",
          "Step 3 — Merge in checklist order: Use Merge PDF to combine every section in the exact order requested by the application checklist.",
          "Step 4 — Add page numbers or protective stamps: Use Watermark & Numbers to add 'Page X of Y' footers—or stamp 'COPY FOR VISA APPLICATION ONLY' across sensitive ID copies.",
        ],
      },
      {
        heading: "Final check before hitting submit",
        paragraphs: [
          "Give the final file a clear, descriptive filename using hyphens rather than spaces (for example, `Jane-Doe-Application-Packet-2026.pdf`), open it once in your browser to verify page flow, and strip unnecessary metadata if the document will be archived publicly.",
        ],
      },
    ],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
