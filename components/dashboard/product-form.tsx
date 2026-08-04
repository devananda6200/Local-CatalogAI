"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImagePlus, LoaderCircle, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, TextareaField } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { productSchema, validateImageFile } from "@/lib/validation";

type Values = z.infer<typeof productSchema>;
const empty: Values = {
  name: "",
  description: "",
  price: null,
  currency: "INR",
  category: "",
  imageUrl: "",
  tags: [],
  dietaryLabels: [],
  available: false,
  sortOrder: 0,
};

export function ProductForm({
  initial,
  productId,
  businessId,
  configured,
  initialAiGenerated = false,
  aiEnabled = false,
}: {
  initial?: Partial<Values>;
  productId?: string;
  businessId: string;
  configured: boolean;
  initialAiGenerated?: boolean;
  aiEnabled?: boolean;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.imageUrl || "");
  const [generating, setGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(initialAiGenerated);
  const [progress, setProgress] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...empty, ...initial },
  });
  useEffect(
    () => () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function chooseImage(next: File | undefined) {
    if (!next) return;
    const error = validateImageFile(next);
    if (error) return toast.error(error);
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setProgress(10);
    if (aiEnabled) void generate(next);
  }

  async function generate(targetFile: File | null = file) {
    if (!targetFile) return toast.error("Choose a product image first.");
    setGenerating(true);
    setProgress(35);
    try {
      const body = new FormData();
      body.set("image", targetFile);
      body.set("businessId", businessId);
      const response = await fetch("/api/ai/generate-product", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI generation failed");
      const suggestion = data.suggestion;
      setValue("name", suggestion.suggestedName, { shouldDirty: true });
      setValue("description", suggestion.description, { shouldDirty: true });
      setValue("category", suggestion.category, { shouldDirty: true });
      setValue("tags", suggestion.tags, { shouldDirty: true });
      setValue("dietaryLabels", suggestion.dietaryLabels, {
        shouldDirty: true,
      });
      setProgress(70);
      setAiGenerated(true);
      toast.success("Suggestions added for your review", {
        description:
          suggestion.confidenceNotes ||
          "Confirm every detail before publishing.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "AI is unavailable. Continue with manual entry.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function save(values: Values) {
    const supabase = createClient();
    if (!supabase) {
      localStorage.setItem(
        `localcatalog-demo-product-${productId || "new"}`,
        JSON.stringify(values),
      );
      setProgress(100);
      toast.success(
        productId ? "Sample product updated" : "Sample product saved as draft",
      );
      router.push("/dashboard/products");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("Sign in again to save this product.");
    let imageUrl = values.imageUrl;
    if (file) {
      setProgress(55);
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${businessId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("catalog-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) return toast.error(error.message);
      imageUrl = supabase.storage.from("catalog-images").getPublicUrl(path)
        .data.publicUrl;
    }
    const payload = {
      business_id: businessId,
      name: values.name,
      description: values.description,
      price: values.price,
      currency: values.currency,
      category: values.category,
      image_url: imageUrl,
      tags: values.tags,
      dietary_labels: values.dietaryLabels,
      available: values.available,
      sort_order: values.sortOrder,
      ai_generated: aiGenerated,
    };
    setProgress(85);
    const result = productId
      ? await supabase
          .from("products")
          .update(payload)
          .eq("id", productId)
          .eq("business_id", businessId)
      : await supabase.from("products").insert(payload);
    if (result.error) return toast.error(result.error.message);
    setProgress(100);
    toast.success(productId ? "Product updated" : "Product saved");
    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(save)}
      className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"
    >
      <section className="h-fit rounded-[2rem] border border-black/5 bg-[#fffefa] p-5 lg:sticky lg:top-8">
        <label className="block cursor-pointer">
          <span className="sr-only">Choose product image</span>
          {preview ? (
            <Image
              src={preview}
              alt="Product preview"
              width={700}
              height={560}
              unoptimized={preview.startsWith("blob:")}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          ) : (
            <span className="grid aspect-[4/3] place-items-center rounded-2xl border-2 border-dashed border-[#176b4d]/25 bg-[#edf4ef] text-center">
              <span>
                <ImagePlus className="mx-auto text-[#176b4d]" />
                <span className="mt-3 block text-sm font-black">
                  Choose a product photo
                </span>
                <span className="mt-1 block text-xs text-[#68756d]">
                  JPEG, PNG, or WebP · max 8 MB
                </span>
              </span>
            </span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => chooseImage(event.target.files?.[0])}
          />
        </label>
        {progress > 0 && progress < 100 ? (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[#176b4d] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#68756d]">
              Upload and analysis progress · {progress}%
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          onClick={() => void generate()}
          disabled={!file || generating || !aiEnabled}
          variant="secondary"
          className="mt-4 w-full"
        >
          {generating ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}{" "}
          Generate editable details
        </Button>
        {!aiEnabled ? (
          <p className="mt-3 rounded-xl bg-[#f7efe4] p-3 text-xs leading-5 text-[#765333]">
            AI generation is unavailable until the server key is configured.
            Enter details manually; nothing else is blocked.
          </p>
        ) : null}
        {!configured ? (
          <p className="mt-3 text-xs leading-5 text-[#68756d]">
            Demo changes remain in this browser. Connect Supabase for permanent
            storage.
          </p>
        ) : null}
      </section>
      <section className="space-y-6 rounded-[2rem] border border-black/5 bg-[#fffefa] p-5 md:p-7">
        <div>
          <h2 className="text-xl font-black">Product details</h2>
          <p className="mt-1 text-sm text-[#68756d]">
            Review every field. AI suggestions are never published
            automatically.
          </p>
        </div>
        <Field
          label="Product name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Cardamom bun"
        />
        <TextareaField
          label="Description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Describe only what customers can expect."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Price"
            type="number"
            step="0.01"
            {...register("price", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            error={errors.price?.message}
            placeholder="0.00"
          />
          <Field
            label="Currency"
            {...register("currency")}
            error={errors.currency?.message}
          />
          <Field
            label="Category"
            {...register("category")}
            error={errors.category?.message}
            placeholder="Sweet bakes"
          />
          <Field
            label="Sort order"
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            error={errors.sortOrder?.message}
          />
        </div>
        <Field
          label="Tags, separated by commas"
          defaultValue={(initial?.tags || []).join(", ")}
          onChange={(event) =>
            setValue(
              "tags",
              event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              { shouldValidate: true },
            )
          }
          error={errors.tags?.message}
        />
        <Field
          label="Dietary labels, only when confirmed"
          defaultValue={(initial?.dietaryLabels || []).join(", ")}
          onChange={(event) =>
            setValue(
              "dietaryLabels",
              event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              { shouldValidate: true },
            )
          }
          error={errors.dietaryLabels?.message}
        />
        <label className="flex items-center gap-3 rounded-2xl bg-[#f3f5f2] p-4 text-sm font-bold">
          <input
            type="checkbox"
            className="size-4 accent-[#176b4d]"
            {...register("available")}
          />{" "}
          Available on the public catalog
        </label>
        <Button disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}{" "}
          {productId ? "Save changes" : "Save product"}
        </Button>
      </section>
    </form>
  );
}
