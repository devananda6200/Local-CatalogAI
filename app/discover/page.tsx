import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPinned, Sparkles } from "lucide-react";
import { StoreDirectory } from "@/components/discovery/store-directory";
import { getPublishedBusinesses } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";
import { getDirectoryStructuredData, serializeStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Discover local businesses",
  description:
    "Search nearby restaurants, bakeries, boutiques, homestays, and local shops by name, location, category, and price.",
  keywords: [
    "local businesses",
    "nearby shops",
    "restaurants near me",
    "boutiques near me",
    "homestays in Kochi",
    "local catalogs",
  ],
  alternates: { canonical: "/discover" },
  openGraph: {
    title: "Discover local businesses near you",
    description:
      "Compare local shops by category, product, price, and distance.",
    url: "/discover",
    type: "website",
  },
};

export default async function DiscoverPage() {
  const businesses = await getPublishedBusinesses();
  const siteUrl = getSiteUrl();
  const indexableBusinesses = businesses.filter((business) => !business.sample);
  return (
    <main id="main" className="min-h-screen bg-[#f7f5ef] text-[#17201b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(
            getDirectoryStructuredData(indexableBusinesses, siteUrl),
          ),
        }}
      />
      <header className="noise bg-[#17201b] px-5 pt-6 pb-24 text-white md:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-black"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#176b4d]">
                <Sparkles size={17} />
              </span>
              LocalCatalog AI
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white"
            >
              <ArrowLeft size={15} /> Home
            </Link>
          </div>
          <div className="mt-16 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-black tracking-[.2em] text-[#8bd0ae] uppercase">
              <MapPinned size={16} /> Discover nearby
            </p>
            <h1 className="balance mt-5 text-4xl font-black tracking-[-.045em] md:text-6xl">
              Find a local business worth visiting.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Search by name, category, product, price, neighbourhood, or town.
              Compare every published catalog without signing in.
            </p>
          </div>
        </div>
      </header>
      <StoreDirectory businesses={businesses} />
    </main>
  );
}
