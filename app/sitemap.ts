import type { MetadataRoute } from "next";
import { getPublishedBusinesses } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const businesses = await getPublishedBusinesses();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/discover`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...businesses
      .filter((business) => !business.sample)
      .map((business) => ({
        url: `${siteUrl}/shop/${business.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
