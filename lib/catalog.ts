import { cache } from "react";
import { demoCatalogs, getDemoCatalogBySlug } from "@/lib/demo-data";
import { buildDiscoveryBusiness } from "@/lib/discovery";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type {
  Business,
  CatalogData,
  DiscoveryBusiness,
  Product,
  ThemeName,
} from "@/lib/types";

export function isPubliclyReadable(business: Pick<Business, "published">) {
  return business.published;
}

export function mapBusiness(row: Record<string, unknown>): Business {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    name: String(row.name),
    slug: String(row.slug),
    category: String(row.category),
    description: String(row.description),
    logoUrl: row.logo_url ? String(row.logo_url) : null,
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : null,
    phone: row.phone ? String(row.phone) : null,
    whatsapp: row.whatsapp ? String(row.whatsapp) : null,
    instagramUrl: row.instagram_url ? String(row.instagram_url) : null,
    address: String(row.address),
    latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude),
    openingHours: (row.opening_hours as Record<string, string>) || {},
    theme: row.theme as ThemeName,
    published: Boolean(row.published),
  };
}

export function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    businessId: String(row.business_id),
    name: String(row.name),
    description: String(row.description),
    price: row.price === null ? null : Number(row.price),
    currency: String(row.currency),
    category: String(row.category),
    imageUrl: String(row.image_url || ""),
    tags: (row.tags as string[]) || [],
    dietaryLabels: (row.dietary_labels as string[]) || [],
    available: Boolean(row.available),
    sortOrder: Number(row.sort_order),
    aiGenerated: Boolean(row.ai_generated),
  };
}

export const getPublicCatalog = cache(
  async (slug: string): Promise<CatalogData | null> => {
    const sampleCatalog = getDemoCatalogBySlug(slug);
    if (sampleCatalog) return sampleCatalog;
    if (!hasSupabaseEnv) return null;
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: business, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !business) return null;
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", business.id)
      .eq("available", true)
      .order("sort_order");
    return {
      business: mapBusiness(business),
      products: (products || []).map(mapProduct),
    };
  },
);

const demoDiscoveryBusinesses = demoCatalogs.map((catalog) =>
  buildDiscoveryBusiness(catalog.business, catalog.products),
);

export const getPublishedBusinesses = cache(
  async (): Promise<DiscoveryBusiness[]> => {
    if (!hasSupabaseEnv) return demoDiscoveryBusinesses;
    const supabase = await createClient();
    if (!supabase) return demoDiscoveryBusinesses;
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("published", true)
      .order("name");
    if (error) return demoDiscoveryBusinesses;
    const publishedBusinesses = (data || []).map(mapBusiness);
    const businessIds = publishedBusinesses.map((business) => business.id);
    const { data: productRows } = businessIds.length
      ? await supabase
          .from("products")
          .select("business_id, price, currency, category")
          .in("business_id", businessIds)
          .eq("available", true)
      : { data: [] };
    const realDiscoveryBusinesses = publishedBusinesses.map((business) =>
      buildDiscoveryBusiness(
        business,
        (productRows || [])
          .filter((product) => product.business_id === business.id)
          .map((product) => ({
            businessId: String(product.business_id),
            price: product.price === null ? null : Number(product.price),
            currency: String(product.currency || "INR"),
            category: String(product.category || "Other"),
          })),
      ),
    );
    const realSlugs = new Set(
      realDiscoveryBusinesses.map((business) => business.slug),
    );
    return [
      ...realDiscoveryBusinesses,
      ...demoDiscoveryBusinesses.filter(
        (business) => !realSlugs.has(business.slug),
      ),
    ].sort((first, second) => first.name.localeCompare(second.name));
  },
);
