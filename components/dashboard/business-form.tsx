"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Check, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, TextareaField } from "@/components/ui/field";
import { generateSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/lib/types";
import { businessSchema, validateImageFile } from "@/lib/validation";

type Values = z.infer<typeof businessSchema>;
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function BusinessForm({
  business,
  configured,
}: {
  business: Business | null;
  configured: boolean;
}) {
  const router = useRouter();
  const [slugEdited, setSlugEdited] = useState(Boolean(business));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [hours, setHours] = useState<Record<string, string>>(
    business?.openingHours || {},
  );
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name || "",
      slug: business?.slug || "",
      category: business?.category || "",
      description: business?.description || "",
      logoUrl: business?.logoUrl || "",
      coverImageUrl: business?.coverImageUrl || "",
      phone: business?.phone || "",
      whatsapp: business?.whatsapp || "",
      instagramUrl: business?.instagramUrl || "",
      address: business?.address || "",
      latitude: business?.latitude || null,
      longitude: business?.longitude || null,
      theme: business?.theme || "minimal",
      published: business?.published || false,
    },
  });
  const name = useWatch({ control, name: "name" });
  useEffect(() => {
    if (!slugEdited)
      setValue("slug", generateSlug(name), { shouldValidate: true });
  }, [name, setValue, slugEdited]);
  async function save(values: Values) {
    const supabase = createClient();
    if (!supabase) {
      localStorage.setItem(
        "localcatalog-demo-business",
        JSON.stringify(values),
      );
      toast.success("Business profile saved for this demo session");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("Sign in again to save changes.");
    const userId = user.id;
    const businessId = business?.id || crypto.randomUUID();
    async function uploadBrandImage(file: File | null, kind: string) {
      if (!file) return null;
      const validationError = validateImageFile(file);
      if (validationError) throw new Error(validationError);
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${businessId}/brand-${kind}-${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase!.storage
        .from("catalog-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      return supabase!.storage.from("catalog-images").getPublicUrl(path).data
        .publicUrl;
    }
    let logoUrl = values.logoUrl || null;
    let coverImageUrl = values.coverImageUrl || null;
    try {
      logoUrl = (await uploadBrandImage(logoFile, "logo")) || logoUrl;
      coverImageUrl =
        (await uploadBrandImage(coverFile, "cover")) || coverImageUrl;
    } catch (error) {
      return toast.error(
        error instanceof Error ? error.message : "Brand image upload failed.",
      );
    }
    const payload = {
      id: businessId,
      owner_id: userId,
      name: values.name,
      slug: values.slug,
      category: values.category,
      description: values.description,
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
      phone: values.phone || null,
      whatsapp: values.whatsapp || null,
      instagram_url: values.instagramUrl || null,
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
      opening_hours: hours,
      theme: values.theme,
      published: values.published,
    };
    const { error } = business
      ? await supabase.from("businesses").update(payload).eq("id", business.id)
      : await supabase.from("businesses").insert(payload);
    if (error)
      return toast.error(
        error.code === "23505"
          ? "That catalog URL is already taken."
          : error.message,
      );
    toast.success("Business profile saved");
    router.refresh();
  }
  return (
    <form onSubmit={handleSubmit(save)} className="mt-8 space-y-7">
      {!configured ? (
        <div className="rounded-2xl bg-[#edf5ef] p-4 text-sm leading-6 text-[#405648]">
          Demo mode is active. Connect Supabase to create a permanent owner
          catalog.
        </div>
      ) : null}
      <section className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-5 md:p-7">
        <h2 className="text-lg font-black">Business basics</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Business name"
            {...register("name")}
            error={errors.name?.message}
          />
          <Field
            label="Category"
            {...register("category")}
            error={errors.category?.message}
            placeholder="Bakery, boutique, salon"
          />
          <div className="md:col-span-2">
            <TextareaField
              label="Short description"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
          <Field
            label="Catalog URL slug"
            {...register("slug", { onChange: () => setSlugEdited(true) })}
            error={errors.slug?.message}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSlugEdited(false);
                setValue("slug", generateSlug(name));
              }}
              className="mb-3 text-sm font-bold text-[#176b4d] underline underline-offset-4"
            >
              Regenerate from name
            </button>
          </div>
        </div>
      </section>
      <section className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-5 md:p-7">
        <h2 className="text-lg font-black">Brand images</h2>
        <p className="mt-1 text-sm text-[#68756d]">
          Upload a logo and a wide cover image, or paste an existing public URL.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Upload logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
          />
          <Field
            label="Upload cover image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
          />
          <Field
            label="Logo URL"
            {...register("logoUrl")}
            error={errors.logoUrl?.message}
          />
          <Field
            label="Cover image URL"
            {...register("coverImageUrl")}
            error={errors.coverImageUrl?.message}
          />
        </div>
      </section>
      <section className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-5 md:p-7">
        <h2 className="text-lg font-black">Opening hours</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {days.map((day) => (
            <Field
              key={day}
              label={day}
              value={hours[day] || ""}
              placeholder="9 AM to 8 PM, or Closed"
              onChange={(event) =>
                setHours((current) => ({
                  ...current,
                  [day]: event.target.value,
                }))
              }
            />
          ))}
        </div>
      </section>
      <section className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-5 md:p-7">
        <h2 className="text-lg font-black">Contact and location</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Phone number"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Field
            label="WhatsApp number"
            {...register("whatsapp")}
            error={errors.whatsapp?.message}
          />
          <Field
            label="Instagram URL"
            {...register("instagramUrl")}
            error={errors.instagramUrl?.message}
          />
          <div className="md:col-span-2">
            <TextareaField
              label="Address"
              {...register("address")}
              error={errors.address?.message}
            />
          </div>
          <Field
            label="Latitude"
            type="number"
            step="any"
            {...register("latitude", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            error={errors.latitude?.message}
          />
          <Field
            label="Longitude"
            type="number"
            step="any"
            {...register("longitude", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            error={errors.longitude?.message}
          />
        </div>
      </section>
      <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-black/5 bg-white/90 p-3 shadow-xl backdrop-blur">
        <p className="hidden text-xs text-[#68756d] sm:block">
          {isDirty ? "You have unsaved changes" : "All changes saved"}
        </p>
        <Button disabled={isSubmitting} className="ml-auto">
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Check size={16} />
          )}{" "}
          {business ? "Save profile" : "Create business"}
        </Button>
      </div>
    </form>
  );
}
