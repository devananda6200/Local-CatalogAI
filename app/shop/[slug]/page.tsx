import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeRenderer } from "@/components/catalog/theme-renderer";
import { getPublicCatalog } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getPublicCatalog(slug);
  if (!catalog)
    return {
      title: "Catalog not found",
      robots: { index: false, follow: false },
    };
  const { business } = catalog;
  return {
    title: business.name,
    description: business.description,
    openGraph: {
      title: business.name,
      description: business.description,
      type: "website",
      images: business.coverImageUrl ? [business.coverImageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: business.name,
      description: business.description,
      images: business.coverImageUrl ? [business.coverImageUrl] : [],
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await getPublicCatalog(slug);
  if (!catalog) notFound();
  return (
    <ThemeRenderer
      catalog={catalog}
      publicUrl={`${getSiteUrl()}/shop/${catalog.business.slug}`}
    />
  );
}
