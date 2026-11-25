export interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  relatedToolSlug:
    | "merge-pdf"
    | "split-pdf"
    | "rotate-reorder-pdf"
    | "delete-pdf-pages"
    | "images-to-pdf"
    | "watermark-pdf"
    | "remove-pdf-metadata"
    | "inspect-pdf";
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export const GUIDES: GuideArticle[] = [
  {
    slug: "why-browser-based-pdf-processing-protects-sensitive-documents",
    title:
      "Why Browser-Based PDF Processing Protects Sensitive Contracts & Tax Forms",
    excerpt:
      "Most free online PDF sites quietly upload your contracts, resumes, and ID scans to remote cloud servers. Here is how client-side processing works and how to verify it yourself.",
    publishedAt: "2026-11-18",
    readTime: "6 min read",
    category: "Privacy & Security",
    relatedToolSlug: "merge-pdf",
    sections: [
      {
        heading: "The hidden risk of traditional 'free' PDF websites",
        paragraphs: [
          "When you drop a signed employment contract, W-2 tax return, bank statement, or passport scan onto a conventional web-based PDF tool, your browser transmits the entire file over the public internet to a third-party server. Even when a provider states that uploaded files are deleted after one or two hours, your document temporarily sits on remote storage infrastructure you do not audit or control.",
          "In real-world cloud architecture, temporary files can pass through load balancers, reverse proxies, automated error loggers, or misconfigured object storage buckets. For professionals operating under the European Union's General Data Protection Regulation (GDPR), strict US corporate non-disclosure agreements (NDAs), or university research policies, casually uploading client files to an unknown web utility creates avoidable legal and security exposure.",
        ],
      },
      {
        heading: "How 100% local in-browser PDF processing works",
        paragraphs: [
          "Modern desktop and mobile web browsers include fast JavaScript engines and binary memory APIs such as FileReader and ArrayBuffer. Rather than shipping your document to a remote Linux container running Ghostscript or Python, a client-side PDF toolkit parses the PDF byte structure directly inside your browser tab's volatile RAM.",
          "When you merge contracts, delete blank scanner pages, stamp vector watermarks, or scrub document metadata on VaultPDF, every transformation executes on your own CPU. Once the new PDF byte array is assembled, your browser creates a temporary local Blob URL and saves the file directly to your Downloads folder.",
        ],
        bullets: [
          "Zero network transfer: Your files never cross the network boundary or touch a third-party server.",
          "Instant throughput: Skipping upload and download waits makes multi-megabyte merges feel instantaneous even on slow hotel or campus Wi-Fi.",
          "Offline resilience: After the web page finishes loading, you can switch on Airplane Mode and continue processing documents uninterrupted.",
          "Automatic memory cleanup: Closing the browser tab immediately releases the local working memory.",
        ],
      },
      {
        heading: "How you can empirically verify zero uploads in 15 seconds",
        paragraphs: [
          "A privacy promise is only as strong as your ability to verify it. You do not need specialized security tools to audit whether a PDF website uploads your documents—every major browser ships with built-in network inspection tools.",
        ],
        bullets: [
          "Open any VaultPDF tool page in Chrome, Edge, Firefox, or Safari.",
          "Press F12 (Windows/Linux) or Cmd + Option + I (macOS) to open Developer Tools, then click the Network tab.",
          "Click the clear icon to empty previous requests, and filter by Fetch/XHR.",
          "Drop a PDF into the workspace and click Download. Observe that zero outgoing upload requests appear and zero bytes of your file are transmitted.",
        ],
      },
      {
        heading: "When should you insist on client-side tools?",
        paragraphs: [
          "If you are combining public lecture notes or a restaurant menu, a cloud converter is a minor risk. However, for tax forms (1040, W-2, P60), mortgage disclosures, signed NDAs, medical lab reports, academic transcripts, and government ID scans, local browser execution should be your default standard.",
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
    readTime: "6 min read",
    category: "Career & Privacy",
    relatedToolSlug: "remove-pdf-metadata",
    sections: [
      {
        heading: "What software silently writes into your PDF header",
        paragraphs: [
          "Every standard PDF contains an internal Document Information Dictionary alongside optional XML metadata streams. When you click 'Export to PDF' in Microsoft Word, Google Docs, Apple Pages, LibreOffice, Canva, or LaTeX, the export engine silently populates technical and personal attributes you never see on the rendered page.",
        ],
        bullets: [
          "Author: Often pulled straight from your Windows or macOS login account—or worse, the original author of a downloaded Word resume template.",
          "Title & Subject: Frequently preserves an outdated internal draft name like 'Resume_OldCompany_Final2' even after you rename the file on disk.",
          "Creator & Producer: Reveals your exact operating system, office suite version, or third-party template generator.",
          "CreationDate & ModDate: Logs exact timestamps and time zone offsets showing when the document was first drafted and last modified.",
          "Keywords: Hidden search tags inherited from older templates or corporate SharePoint libraries.",
        ],
      },
      {
        heading: "Real-world scenarios where PDF metadata causes awkward mistakes",
        paragraphs: [
          "Modern browsers like Chrome and Safari display a PDF's internal Title property in the browser tab header—ignoring your clean filename. Job seekers routinely send a tailored application to Company B while the recruiter's browser tab openly reads 'Cover Letter - Company A'.",
          "Freelancers, law clerks, and consultants face an even riskier version of this problem: duplicating a previous client's proposal or contract template often leaves the prior client's organization name embedded in the Author, Subject, or Keywords fields—creating an accidental confidentiality breach.",
        ],
      },
      {
        heading: "How to audit and scrub your PDF before hitting Send",
        paragraphs: [
          "You do not need an expensive Adobe Acrobat Pro subscription to clean document headers. Open VaultPDF's local Metadata Inspector, drop your exported resume or proposal into the browser, and inspect every exposed field in a clear audit table.",
          "Clicking 'Scrub Metadata & Download' reconstructs a fresh PDF container containing your exact visual pages, vector fonts, and hyperlinks while wiping every hidden header field clean. Because the entire operation executes locally in browser RAM, your personal contact details and work history never touch an external server.",
        ],
      },
      {
        heading: "Verify the cleaned file yourself",
        paragraphs: [
          "After saving your cleaned PDF, drop the newly generated `-clean.pdf` file straight back into the Metadata Inspector. You will see every sensitive property reported as Empty—giving you complete confidence before uploading to LinkedIn, Greenhouse, Lever, or emailing a client.",
        ],
      },
    ],
  },
  {
    slug: "prepare-clean-pdf-packets-for-visa-tax-and-job-applications",
    title:
      "How to Assemble Clean PDF Packets for Visa, Mortgage, and Job Applications",
    excerpt:
      "Official portals routinely reject upside-down scans, unnumbered multi-file bundles, and raw smartphone photos. Follow this 4-step workflow to build crisp, submission-ready PDF packets locally.",
    publishedAt: "2026-11-22",
    readTime: "6 min read",
    category: "Productivity",
    relatedToolSlug: "images-to-pdf",
    sections: [
      {
        heading: "Why official portals and reviewers prefer clean single-file packets",
        paragraphs: [
          "Whether you are submitting a Schengen or US visa bundle, uploading mortgage underwriting paperwork, applying for graduate school, or sending a rental packet to a European landlord, reviewers process dozens of applications every day. Attaching six separate smartphone JPGs alongside two sideways PDFs makes review slow and increases the risk of a missing document.",
          "A single, properly oriented, cleanly numbered PDF packet signals professionalism and drastically reduces back-and-forth requests for re-submission.",
        ],
      },
      {
        heading: "The 4-step submission-ready workflow",
        paragraphs: [
          "You can build an executive-grade document packet in under three minutes without installing desktop software or uploading private records to cloud converters:",
        ],
        bullets: [
          "Step 1 — Convert photos to standard pages: Open Images to PDF to convert smartphone scans of receipts, passports, or proof-of-address letters into uniform A4 (Europe/UK) or US Letter (US/Canada) pages with neat margins.",
          "Step 2 — Fix sideways scans & remove blank sheets: Load scanned PDFs into Rotate & Organize PDF (or Delete PDF Pages) to correct 90°/180° scanner errors and strip accidental blank duplex pages.",
          "Step 3 — Merge in exact checklist sequence: Use Merge PDF to assemble your cover sheet, primary forms, bank statements, and appendices in the exact order requested by the portal checklist.",
          "Step 4 — Add page numbers or protective stamps: Use Watermark & Numbers to add clean 'Page 1 of 14' footers so printed pages never get scrambled—or add a subtle 'COPY — FOR APPLICATION USE ONLY' watermark across sensitive identity documents.",
        ],
      },
      {
        heading: "Naming and final verification best practices",
        paragraphs: [
          "Before uploading to an official portal, rename your finished PDF using clear, ASCII-safe hyphens instead of spaces or special symbols—for example, `Alex-Morgan-Visa-Supporting-Docs-2026.pdf`. Open it once in your browser to verify page orientation and legibility, and check page dimensions with our PDF Inspector if the portal enforces strict A4 or US Letter requirements.",
        ],
      },
    ],
  },
  {
    slug: "how-to-merge-pdf-files-on-windows-mac-without-adobe-acrobat",
    title:
      "How to Merge PDF Files on Windows 11, macOS, and Chromebook Without Adobe Acrobat",
    excerpt:
      "You don't need a $20/month Adobe subscription just to combine two PDFs. Compare built-in Windows/Mac options against zero-upload browser merging and pick the fastest method.",
    publishedAt: "2026-11-23",
    readTime: "7 min read",
    category: "How-To Guides",
    relatedToolSlug: "merge-pdf",
    sections: [
      {
        heading: "Why combining PDFs shouldn't require a monthly subscription",
        paragraphs: [
          "Adobe Acrobat Reader lets you view and sign PDFs for free, but the moment you click 'Combine Files', you hit a paid subscription wall. Meanwhile, searching online for a free PDF merger surfaces dozens of sites that either throttle you to two merges per day, force account creation, or upload your private documents to remote servers.",
          "Fortunately, depending on your operating system and privacy requirements, there are completely free ways to merge PDFs in seconds.",
        ],
      },
      {
        heading: "Option 1: Built-in macOS Preview (Mac users)",
        paragraphs: [
          "Apple's built-in Preview app can merge PDFs offline, though the workflow is slightly hidden. Open the first PDF in Preview, click View → Thumbnails to open the sidebar, then drag the second PDF file directly onto the thumbnail strip and press Cmd + S. Note that Preview modifies the original file in place unless you first duplicate it, and it does not exist on Windows or Chromebooks.",
        ],
      },
      {
        heading: "Option 2: Built-in Windows 11 tools (and their limitations)",
        paragraphs: [
          "Unlike macOS, Windows 11 does not include a native one-click PDF merger in File Explorer. Microsoft Edge and 'Microsoft Print to PDF' can export single documents, but they cannot cleanly concatenate multiple existing PDFs while preserving vector text and bookmarks without installing third-party desktop software.",
        ],
      },
      {
        heading: "Option 3: Cross-platform zero-upload browser merging (Fastest)",
        paragraphs: [
          "Using a client-side web tool like VaultPDF's Merge PDF gives you the exact privacy of offline desktop software with zero installation—working identically on Windows 11, macOS, Linux, Chromebooks, iPads, and Android phones.",
        ],
        bullets: [
          "Open Merge PDF and drag two or more PDFs into the dropzone.",
          "Inspect each file's page count and size, then use the up/down controls to set the exact sequence.",
          "Type a clean output filename and click Merge & Download PDF.",
          "Original files remain untouched, vector text stays selectable, and zero bytes leave your computer.",
        ],
      },
    ],
  },
  {
    slug: "gdpr-hipaa-document-checklist-before-sharing-client-pdfs",
    title:
      "GDPR & Confidentiality Checklist: 7 Rules Before Sharing Client PDFs Online",
    excerpt:
      "Law firms, freelancers, HR teams, and European businesses handle personal data inside PDFs every day. Follow these 7 practical hygiene rules to prevent accidental data leaks.",
    publishedAt: "2026-11-23",
    readTime: "7 min read",
    category: "Compliance & Security",
    relatedToolSlug: "remove-pdf-metadata",
    sections: [
      {
        heading: "Why everyday PDF workflows trigger compliance headaches",
        paragraphs: [
          "Under GDPR in the European Union and UK, any file containing names, addresses, tax IDs, bank account numbers, or health details qualifies as personal data. When an employee uploads a customer invoice bundle or HR onboarding packet to a random free cloud converter, that site effectively becomes an unvetted third-party data processor—without a Data Processing Agreement (DPA) in place.",
          "Even outside formal enterprise compliance, independent consultants, accountants, and students can dramatically reduce data leakage by following a simple repeatable checklist.",
        ],
      },
      {
        heading: "The 7-point PDF privacy hygiene checklist",
        paragraphs: [
          "Run through these seven checks before editing, converting, or emailing any sensitive document:",
        ],
        bullets: [
          "1. Keep processing on-device: Prefer offline desktop software or provably client-side browser tools (like VaultPDF) so personal data never traverses third-party conversion servers.",
          "2. Audit and strip hidden metadata: Scrub Author, Title, Subject, and timestamp tags before distributing contracts, CVs, or public reports.",
          "3. Extract only the required pages: Never send an entire 40-page bank or lease packet when the recipient only needs page 3—use Split PDF or Delete PDF Pages to minimize shared data (a core GDPR data-minimization principle).",
          "4. Watermark identity copies: When sharing passport or ID scans for verification, stamp the intended recipient and date diagonally across the scan.",
          "5. Never rely on black highlighter rectangles for redaction: Drawing a black box over text in a basic editor often leaves the underlying text copy-pasteable in the PDF stream.",
          "6. Double-check filenames: Remove sensitive client IDs, salary figures, or medical terms from the PDF filename itself.",
          "7. Verify output before sending: Open the final PDF locally to confirm page order, legibility, and absence of unintended pages.",
        ],
      },
      {
        heading: "Building privacy into daily habits",
        paragraphs: [
          "Strong security rarely comes from complex enterprise software—it comes from removing friction from safe workflows. Bookmarking local-only browser tools ensures your team never feels tempted to upload confidential files to ad-heavy cloud converters just to merge two pages quickly.",
        ],
      },
    ],
  },
  {
    slug: "how-to-watermark-passport-and-id-scans-safely-for-rentals-and-banks",
    title:
      "How to Safely Watermark Passport, Driver's License, and ID Scans for Landlords & Banks",
    excerpt:
      "Renting an apartment in Europe or applying for a bank account often requires sending a copy of your ID. Learn how a clear purpose-specific watermark helps prevent identity theft.",
    publishedAt: "2026-11-24",
    readTime: "5 min read",
    category: "Privacy & Security",
    relatedToolSlug: "watermark-pdf",
    sections: [
      {
        heading: "Why you should never send an unmarked ID scan",
        paragraphs: [
          "Across Europe (such as France's DossierFacile guidelines, Germany's Mieterselbstauskunft, and UK Right to Rent checks) and North America, landlords, recruiters, and financial institutions frequently ask for a PDF copy of your passport, national ID card, or driver's license.",
          "If that unmarked scan is later leaked from an insecure email inbox or forwarded to a scammer, a clean high-resolution copy can be reused to open fraudulent mobile contracts, rental listings, or online accounts in your name.",
        ],
      },
      {
        heading: "What makes an effective, acceptable ID watermark?",
        paragraphs: [
          "A good protective watermark makes reuse obvious without obscuring the details the legitimate reviewer needs to verify:",
        ],
        bullets: [
          "State the exact purpose and date: For example, 'COPY — FOR RENTAL APPLICATION ONLY (NOV 2026)' or 'VERIFICATION COPY — ACME BANK ONLY'.",
          "Use subtle transparency (20%–32% opacity): Semi-transparent vector text sits cleanly across the document while keeping your photo, name, and expiry date legible.",
          "Angle diagonally across key fields: A 45° diagonal stamp across the center cannot be easily cropped out in an image editor.",
          "Keep it local: Never upload your passport scan to a cloud watermarking website—process it locally in your browser so the raw scan never leaves your device.",
        ],
      },
      {
        heading: "Step-by-step local workflow",
        paragraphs: [
          "If your ID scan is currently a smartphone photo (JPG or PNG), first convert it into a clean PDF with VaultPDF's Images to PDF tool. Next, open Watermark & Numbers, type your purpose-specific text, adjust opacity to around 25%, preview the live layout on screen, and download the stamped PDF locally.",
        ],
      },
    ],
  },
  {
    slug: "a4-vs-us-letter-formatting-international-pdfs-for-clean-printing",
    title:
      "A4 vs. US Letter: Formatting Multi-Country PDFs Without Cut-Off Margins",
    excerpt:
      "Sending a US Letter resume to a European recruiter or an A4 invoice to a US client often causes awkward print scaling. Understand exact dimensions and how to inspect PDF page sizes.",
    publishedAt: "2026-11-24",
    readTime: "6 min read",
    category: "Design & Print",
    relatedToolSlug: "inspect-pdf",
    sections: [
      {
        heading: "The subtle dimension difference that ruins cross-border prints",
        paragraphs: [
          "Virtually the entire world—including the European Union, the United Kingdom, Australia, and Asia—uses the ISO 216 A4 paper standard. The United States, Canada, and Mexico use ANSI US Letter. Although both sheets look nearly identical at a glance, their proportions differ meaningfully:",
        ],
        bullets: [
          "A4 dimensions: 210 × 297 mm (8.27 × 11.69 inches, or 595 × 842 PDF points) — noticeably taller and slightly narrower.",
          "US Letter dimensions: 215.9 × 279.4 mm (8.5 × 11 inches, or 612 × 792 PDF points) — slightly wider and shorter.",
        ],
      },
      {
        heading: "What goes wrong when you mix A4 and US Letter in one PDF?",
        paragraphs: [
          "When you merge an A4 European university transcript with a US Letter cover letter, the combined PDF contains mixed page widths. When printed without 'Fit to Page', bottom footers on A4 pages get clipped off on US printers, while wide margins on US Letter sheets look cramped on European A4 trays.",
          "Worse, some government visa portals and academic publishing systems run automated pre-flight checks that reject PDFs with inconsistent page sizes or unexpected landscape pages.",
        ],
      },
      {
        heading: "How to inspect and standardize your PDF pages locally",
        paragraphs: [
          "Before submitting an international resume, invoice packet, or academic thesis, drop it into VaultPDF's PDF Inspector. The tool instantly calculates every page's exact dimensions in points, millimeters, and inches, automatically tagging each sheet as A4, US Letter, or Custom and flagging mixed orientations.",
          "If you are building a PDF from smartphone scans or exported PNG slides, use Images to PDF and explicitly select 'A4 (Europe / International)' or 'US Letter (North America)' based on your recipient's country, with a small or standard margin so nothing ever gets clipped on paper.",
        ],
      },
    ],
  },
  {
    slug: "pdf-security-myths-why-renaming-files-does-not-remove-sensitive-data",
    title:
      "PDF Security Myths Debunked: Why Renaming a File Doesn't Remove Sensitive Data",
    excerpt:
      "Think renaming a file or hiding text makes a PDF anonymous? Explore how PDF internals store metadata, deleted revisions, and page objects—and how clean re-serialization helps.",
    publishedAt: "2026-11-25",
    readTime: "6 min read",
    category: "Technical Deep Dive",
    relatedToolSlug: "inspect-pdf",
    sections: [
      {
        heading: "Myth 1: Renaming a PDF removes its original title and history",
        paragraphs: [
          "Changing a file from `Confidential_Salary_Offer_JohnDoe.pdf` to `Document1.pdf` in Windows Explorer or macOS Finder only updates the filesystem label. Inside the binary PDF file, the Document Information Dictionary still holds the original Title, Author, Creator software, and exact creation timestamps.",
          "Any PDF viewer, browser tab, or search indexer reads those internal fields—not just the filename.",
        ],
      },
      {
        heading: "Myth 2: Deleting pages in a basic editor always erases old bytes",
        paragraphs: [
          "The PDF specification supports 'incremental updates', which allow editors to append changes to the end of a file for speed rather than rewriting the entire document from scratch. In poorly designed editors, older object references can sometimes linger in the file's binary body.",
          "When you use VaultPDF's Delete PDF Pages, Split PDF, or Metadata Scrubber, our local engine initializes a brand-new clean PDFDocument container and copies only the explicitly selected pages into it—discarding orphaned objects and blanking out old header fields during fresh serialization.",
        ],
      },
      {
        heading: "Myth 3: Password-protected PDFs are safe to upload anywhere",
        paragraphs: [
          "While AES-256 encryption protects a PDF at rest, weak owner passwords (used only to restrict printing or copying) can be stripped effortlessly, and uploading an encrypted file alongside its password to an online 'PDF Unlocker' hands both keys to an unknown server.",
        ],
      },
      {
        heading: "Best practices for technical hygiene",
        paragraphs: [
          "Treat every outgoing PDF as a structured software artifact rather than a flat piece of paper. Inspect its page structure with PDF Inspector, remove unnecessary pages with Delete PDF Pages, scrub header metadata with Strip Metadata, and keep sensitive files off cloud processing servers whenever a browser-native tool can do the job locally.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
