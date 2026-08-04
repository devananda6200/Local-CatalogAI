"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ExternalLink, Globe2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Business, Product } from "@/lib/types";

export function PublishPanel({
  business,
  products,
  configured,
}: {
  business: Business;
  products: Product[];
  configured: boolean;
}) {
  const [published, setPublished] = useState(business.published);
  const [saving, setSaving] = useState(false);
  async function toggle() {
    setSaving(true);
    const next = !published;
    const supabase = createClient();
    if (configured && supabase) {
      const { error } = await supabase
        .from("businesses")
        .update({ published: next })
        .eq("id", business.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    } else localStorage.setItem("localcatalog-demo-published", String(next));
    setPublished(next);
    setSaving(false);
    toast.success(next ? "Catalog published" : "Catalog returned to draft");
  }
  const checklist = [
    { label: "Business profile", complete: true },
    {
      label: `${products.filter((product) => product.available).length} available products`,
      complete: products.some((product) => product.available),
    },
    {
      label: "Location and contact details",
      complete: Boolean(business.address && business.phone),
    },
    { label: "Theme selected", complete: Boolean(business.theme) },
  ];
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-6 md:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${published ? "bg-[#e3f1e7] text-[#176b4d]" : "bg-[#eeeae5] text-[#6b635d]"}`}
            >
              <span
                className={`size-2 rounded-full ${published ? "bg-[#21a56f]" : "bg-[#8c8279]"}`}
              />{" "}
              {published ? "Published" : "Draft"}
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight">
              {published ? "Your catalog is live." : "Ready when you are."}
            </h2>
            <p className="mt-3 max-w-lg leading-7 text-[#68756d]">
              {published
                ? "Anyone with the link or QR code can browse your available products without signing in."
                : "Publishing makes your catalog visible at its unique public link."}
            </p>
          </div>
          <span className="hidden size-14 place-items-center rounded-2xl bg-[#e4efe7] text-[#176b4d] sm:grid">
            <Globe2 />
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={toggle}
            disabled={saving}
            variant={published ? "secondary" : "primary"}
          >
            {saving ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : null}
            {published ? "Unpublish catalog" : "Publish catalog"}
          </Button>
          {published ? (
            <Link
              href={`/shop/${business.slug}`}
              target="_blank"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#17201b] px-5 text-sm font-bold text-white"
            >
              Open live catalog <ExternalLink size={15} />
            </Link>
          ) : null}
        </div>
      </section>
      <section className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-6">
        <h2 className="text-lg font-black">Publish checklist</h2>
        <div className="mt-5 space-y-4">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <CheckCircle2
                size={19}
                className={item.complete ? "text-[#176b4d]" : "text-black/20"}
              />
              <span className="text-sm font-bold">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[#f3f4f1] p-4">
          <p className="text-xs font-bold tracking-[.1em] text-[#7a867e] uppercase">
            Public URL
          </p>
          <p className="mt-2 text-sm font-black break-all">
            /shop/{business.slug}
          </p>
        </div>
      </section>
    </div>
  );
}
