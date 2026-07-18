"use client";

import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareActions({ title, url }: { title: string; url: string }) {
  const shareUrl =
    typeof window === "undefined" || !url ? url : window.location.href;
  async function copy() {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Catalog link copied");
  }
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, text: `Browse ${title}`, url: shareUrl });
    } else await copy();
  }
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="secondary"
        onClick={copy}
        aria-label="Copy catalog link"
        className="size-11 px-0"
      >
        <Copy size={17} />
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={share}
        aria-label="Share catalog"
        className="size-11 px-0"
      >
        <Share2 size={17} />
      </Button>
    </div>
  );
}
