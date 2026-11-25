import {
  Files,
  Scissors,
  RotateCw,
  Image as ImageIcon,
  Stamp,
  ShieldCheck,
  type LucideProps,
} from "lucide-react";
import type { ToolDefinition } from "@/lib/site";

interface ToolIconProps extends LucideProps {
  slug: ToolDefinition["slug"];
}

export function ToolIcon({ slug, ...props }: ToolIconProps) {
  switch (slug) {
    case "merge-pdf":
      return <Files {...props} />;
    case "split-pdf":
      return <Scissors {...props} />;
    case "rotate-reorder-pdf":
      return <RotateCw {...props} />;
    case "images-to-pdf":
      return <ImageIcon {...props} />;
    case "watermark-pdf":
      return <Stamp {...props} />;
    case "remove-pdf-metadata":
      return <ShieldCheck {...props} />;
  }
}
