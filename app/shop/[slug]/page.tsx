import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeRenderer } from "@/components/catalog/theme-renderer";
import { getPublicCatalog } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";
import { getCatalogStructuredData, serializeStructuredData } from "@/lib/seo";

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
    alternates: { canonical: `/shop/${business.slug}` },
    robots: business.sample
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: business.name,
      description: business.description,
      type: "website",
      url: `/shop/${business.slug}`,
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
  const publicUrl = `${getSiteUrl()}/shop/${catalog.business.slug}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(
            getCatalogStructuredData(catalog, publicUrl),
          ),
        }}
      />
      <ThemeRenderer catalog={catalog} publicUrl={publicUrl} />
    </>
  );
}
