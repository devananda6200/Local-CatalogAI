import { z } from "zod";

const optionalHttpUrl = z
  .union([z.literal(""), z.string().url()])
  .refine(
    (value) => !value || /^https?:\/\//i.test(value),
    "Use an HTTP or HTTPS URL",
  );

export const businessSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(64),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(500),
  logoUrl: optionalHttpUrl,
  coverImageUrl: optionalHttpUrl,
  phone: z.string().trim().max(30),
  whatsapp: z.string().trim().max(30),
  instagramUrl: optionalHttpUrl,
  address: z.string().trim().min(5).max(300),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  theme: z.enum(["minimal", "cafe", "boutique"]),
  published: z.boolean(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(800),
  price: z.number().nonnegative().max(10_000_000).nullable(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  category: z.string().trim().min(2).max(80),
  imageUrl: optionalHttpUrl,
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  dietaryLabels: z.array(z.string().trim().min(1).max(40)).max(8),
  available: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
});

export const aiProductSuggestionSchema = z.object({
  suggestedName: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(800),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  dietaryLabels: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  confidenceNotes: z.string().trim().max(300),
});

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function validateImageFile(file: Pick<File, "size" | "type">) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return "Choose a JPEG, PNG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_SIZE) return "Images must be 8 MB or smaller.";
  return null;
}
