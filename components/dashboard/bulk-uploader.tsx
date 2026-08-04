"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { validateImageFile } from "@/lib/validation";

type Draft = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
};

export function BulkUploader({
  businessId,
  configured,
  aiEnabled,
}: {
  businessId: string;
  configured: boolean;
  aiEnabled: boolean;
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [working, setWorking] = useState(false);
  const [firstProductId, setFirstProductId] = useState<string | null>(null);

  useEffect(
    () => () => drafts.forEach((draft) => URL.revokeObjectURL(draft.preview)),
    [drafts],
  );

  function add(files: FileList | null) {
    if (!files) return;
    const valid: Draft[] = [];
    Array.from(files).forEach((file) => {
      const error = validateImageFile(file);
      if (error) toast.error(`${file.name}: ${error}`);
      else
        valid.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
        });
    });
    setDrafts((items) => [...items, ...valid]);
  }

  function remove(id: string) {
    setDrafts((items) => {
      const item = items.find((draft) => draft.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return items.filter((draft) => draft.id !== id);
    });
  }

  async function prepare() {
    setWorking(true);
    const supabase = createClient();
    const user = configured
      ? (await supabase?.auth.getUser())?.data.user
      : null;
    if (configured && (!supabase || !user)) {
      setWorking(false);
      return toast.error("Sign in again to upload products.");
    }

    let firstId: string | null = null;
    let successCount = 0;
    for (const draft of drafts) {
      setDrafts((items) =>
        items.map((item) =>
          item.id === draft.id
            ? { ...item, progress: 35, error: undefined }
            : item,
        ),
      );
      try {
        if (!configured || !supabase || !user) {
          await new Promise((resolve) => setTimeout(resolve, 180));
        } else {
          const extension =
            draft.file.name.split(".").pop()?.toLowerCase() || "jpg";
          const path = `${user.id}/${businessId}/${crypto.randomUUID()}.${extension}`;
          const { error: uploadError } = await supabase.storage
            .from("catalog-images")
            .upload(path, draft.file, {
              contentType: draft.file.type,
              upsert: false,
            });
          if (uploadError) throw uploadError;
          const imageUrl = supabase.storage
            .from("catalog-images")
            .getPublicUrl(path).data.publicUrl;
          setDrafts((items) =>
            items.map((item) =>
              item.id === draft.id ? { ...item, progress: 65 } : item,
            ),
          );

          let suggestion: Record<string, unknown> | null = null;
          if (aiEnabled) {
            const body = new FormData();
            body.set("image", draft.file);
            body.set("businessId", businessId);
            const response = await fetch("/api/ai/generate-product", {
              method: "POST",
              body,
            });
            if (response.ok) suggestion = (await response.json()).suggestion;
          }

          const fallbackName = draft.file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]+/g, " ")
            .trim();
          const { data, error: insertError } = await supabase
            .from("products")
            .insert({
              business_id: businessId,
              name:
                String(suggestion?.suggestedName || fallbackName) ||
                "Untitled product",
              description: String(
                suggestion?.description ||
                  "Review this draft and add a product description.",
              ),
              price: null,
              currency: "INR",
              category: String(suggestion?.category || "Other"),
              image_url: imageUrl,
              tags: Array.isArray(suggestion?.tags) ? suggestion.tags : [],
              dietary_labels: Array.isArray(suggestion?.dietaryLabels)
                ? suggestion.dietaryLabels
                : [],
              available: false,
              sort_order: 0,
              ai_generated: Boolean(suggestion),
            })
            .select("id")
            .single();
          if (insertError) throw insertError;
          firstId ||= String(data.id);
          setFirstProductId(firstId);
        }
        setDrafts((items) =>
          items.map((item) =>
            item.id === draft.id ? { ...item, progress: 100 } : item,
          ),
        );
        successCount += 1;
      } catch (error) {
        setDrafts((items) =>
          items.map((item) =>
            item.id === draft.id
              ? {
                  ...item,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : item,
          ),
        );
      }
    }
    setWorking(false);
    toast.success(
      `${successCount} product draft${successCount === 1 ? "" : "s"} prepared`,
      { description: "Review each one before publishing." },
    );
    router.refresh();
  }

  return (
    <div className="mt-8">
      <label className="grid min-h-52 cursor-pointer place-items-center rounded-[2rem] border-2 border-dashed border-[#176b4d]/25 bg-[#edf4ef] p-8 text-center transition hover:border-[#176b4d]/50">
        <span>
          <ImagePlus className="mx-auto text-[#176b4d]" size={30} />
          <span className="mt-4 block text-lg font-black">
            Drop product photos here
          </span>
          <span className="mt-2 block text-sm text-[#68756d]">
            Or choose multiple JPEG, PNG, or WebP files · 8 MB each
          </span>
        </span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => add(event.target.files)}
        />
      </label>
      {drafts.length ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <article
                key={draft.id}
                className="rounded-2xl border border-black/5 bg-[#fffefa] p-3"
              >
                <div className="relative">
                  <Image
                    src={draft.preview}
                    alt="Product preview"
                    width={500}
                    height={360}
                    unoptimized
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => remove(draft.id)}
                    aria-label={`Remove ${draft.file.name}`}
                    className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-white text-red-600 shadow"
                  >
                    <Trash2 size={15} />
                  </button>
                  {draft.progress === 100 ? (
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[#176b4d] px-2.5 py-1 text-xs font-bold text-white">
                      <Check size={12} /> Ready
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 truncate text-sm font-black">
                  {draft.file.name}
                </p>
                {draft.progress > 0 && draft.progress < 100 ? (
                  <div className="mt-3 h-1.5 rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-[#176b4d]"
                      style={{ width: `${draft.progress}%` }}
                    />
                  </div>
                ) : null}
                {draft.error ? (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    {draft.error}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#fffefa] p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-black">
                {drafts.length} image{drafts.length === 1 ? "" : "s"} selected
              </p>
              <p className="mt-1 text-xs text-[#68756d]">
                Saved as unavailable drafts until you review and publish them.
              </p>
            </div>
            {drafts.every((draft) => draft.progress === 100) ? (
              <Link
                href={
                  firstProductId
                    ? `/dashboard/products/${firstProductId}`
                    : "/dashboard/products/new"
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#176b4d] px-5 text-sm font-bold text-white"
              >
                Review first draft
              </Link>
            ) : (
              <Button type="button" onClick={prepare} disabled={working}>
                {working ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <Upload size={16} />
                )}{" "}
                Prepare drafts
              </Button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
