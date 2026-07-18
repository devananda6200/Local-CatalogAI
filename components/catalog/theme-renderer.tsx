import Image from "next/image";
import { Clock3, MapPin, Sparkles } from "lucide-react";
import { CatalogActions } from "@/components/catalog/catalog-actions";
import { ProductCard } from "@/components/catalog/product-card";
import { ShareActions } from "@/components/catalog/share-actions";
import { WhatsAppEnquiryProvider } from "@/components/catalog/whatsapp-enquiry";
import type { CatalogData } from "@/lib/types";

function Hours({ data }: { data: Record<string, string> }) {
  const entries = Object.entries(data);
  if (!entries.length) return null;
  return (
    <details className="group text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-bold">
        <Clock3 size={15} /> Opening hours
      </summary>
      <div className="mt-3 grid max-w-sm grid-cols-2 gap-x-5 gap-y-1 text-black/60">
        {entries.map(([day, hours]) => (
          <div key={day} className="contents">
            <span>{day}</span>
            <span className="text-right">{hours}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

function EmptyProducts() {
  return (
    <div className="col-span-full rounded-3xl border border-dashed border-black/20 p-10 text-center">
      <p className="font-bold">The catalog is being prepared.</p>
      <p className="mt-1 text-sm text-black/55">
        Check back soon for available products.
      </p>
    </div>
  );
}

export function ThemeRenderer({
  catalog,
  publicUrl,
}: {
  catalog: CatalogData;
  publicUrl: string;
}) {
  const { business, products } = catalog;
  const content = (() => {
    if (business.theme === "cafe")
      return (
        <main id="main" className="min-h-screen bg-[#efe5d3] text-[#38281f]">
          <header className="relative min-h-[30rem] overflow-hidden bg-[#30231c]">
            <Image
              src={
                business.coverImageUrl ||
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=85"
              }
              alt=""
              fill
              priority
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#30231c] via-[#30231c]/20 to-transparent" />
            <div className="relative mx-auto flex min-h-[30rem] max-w-6xl flex-col justify-end px-5 pb-12 text-[#fff9ee] md:px-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[.24em] text-[#f3b67a] uppercase">
                    {business.category}
                  </p>
                  <h1 className="mt-3 font-serif text-5xl font-black tracking-tight md:text-7xl">
                    {business.name}
                  </h1>
                </div>
                <ShareActions title={business.name} url={publicUrl} />
              </div>
              <p className="mt-4 max-w-xl text-lg leading-8 text-white/75">
                {business.description}
              </p>
              {business.sample ? (
                <span className="mt-4 w-fit rounded-full bg-[#f3b67a] px-3 py-1 text-xs font-black text-[#38281f]">
                  Sample catalog
                </span>
              ) : null}
            </div>
          </header>
          <section className="mx-auto max-w-6xl px-5 py-9 md:px-8">
            <CatalogActions business={business} />
            <div className="mt-7 flex flex-col gap-4 border-y border-[#38281f]/15 py-6 md:flex-row md:justify-between">
              <p className="flex max-w-lg items-start gap-2 text-sm leading-6 text-black/65">
                <MapPin size={16} className="mt-1 shrink-0" />{" "}
                {business.address}
              </p>
              <Hours data={business.openingHours} />
            </div>
            <h2 className="mt-12 font-serif text-3xl font-black">
              From our counter
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.length ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="cafe"
                  />
                ))
              ) : (
                <EmptyProducts />
              )}
            </div>
          </section>
          <footer className="mt-10 bg-[#30231c] px-5 py-8 text-center text-sm text-white/55">
            Published with LocalCatalog AI
          </footer>
        </main>
      );

    if (business.theme === "boutique")
      return (
        <main id="main" className="min-h-screen bg-[#f5f0ea] text-[#2e2926]">
          <header className="mx-auto max-w-7xl px-5 pt-7 pb-10 md:px-8">
            <div className="flex items-center justify-between border-b border-[#2e2926]/15 pb-5">
              <p className="font-serif text-xl font-bold tracking-[.08em]">
                {business.name.toUpperCase()}
              </p>
              <ShareActions title={business.name} url={publicUrl} />
            </div>
            <div className="grid items-end gap-8 pt-12 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold tracking-[.3em] text-[#8c6652] uppercase">
                  Curated local collection
                </p>
                <h1 className="balance mt-6 font-serif text-5xl leading-[1.02] md:text-7xl">
                  {business.description}
                </h1>
                <div className="mt-8">
                  <CatalogActions business={business} />
                </div>
              </div>
              {business.coverImageUrl ? (
                <Image
                  src={business.coverImageUrl}
                  alt=""
                  width={900}
                  height={700}
                  priority
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : null}
            </div>
          </header>
          <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
            <div className="flex flex-col gap-4 border-y border-[#2e2926]/15 py-6 md:flex-row md:justify-between">
              <p className="text-sm text-black/60">{business.address}</p>
              <Hours data={business.openingHours} />
            </div>
            <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.length ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="boutique"
                  />
                ))
              ) : (
                <EmptyProducts />
              )}
            </div>
          </section>
          <footer className="mt-12 border-t border-black/10 py-8 text-center text-sm text-black/45">
            Published with LocalCatalog AI
          </footer>
        </main>
      );

    return (
      <main id="main" className="min-h-screen bg-[#f7f8f6] text-[#17201b]">
        <header className="mx-auto max-w-7xl px-5 pt-7 pb-10 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black">
              <Sparkles size={18} className="text-[#176b4d]" /> {business.name}
            </div>
            <ShareActions title={business.name} url={publicUrl} />
          </div>
          <div className="mt-10 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[#e3ece5] p-7 md:grid-cols-[1fr_.8fr] md:p-12">
            <div>
              <p className="text-xs font-bold tracking-[.2em] text-[#176b4d] uppercase">
                {business.category}
              </p>
              <h1 className="balance mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">
                {business.name}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-black/60">
                {business.description}
              </p>
              <div className="mt-7">
                <CatalogActions business={business} />
              </div>
            </div>
            {business.coverImageUrl ? (
              <Image
                src={business.coverImageUrl}
                alt=""
                width={900}
                height={700}
                priority
                className="aspect-[4/3] w-full rounded-3xl object-cover"
              />
            ) : null}
          </div>
          <div className="mt-8 flex flex-col gap-4 border-y border-black/10 py-5 md:flex-row md:justify-between">
            <p className="flex items-center gap-2 text-sm text-black/60">
              <MapPin size={15} /> {business.address}
            </p>
            <Hours data={business.openingHours} />
          </div>
        </header>
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.length ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <EmptyProducts />
            )}
          </div>
        </section>
        <footer className="border-t border-black/5 py-8 text-center text-sm text-black/45">
          Published with LocalCatalog AI
        </footer>
      </main>
    );
  })();

  return (
    <WhatsAppEnquiryProvider
      business={business}
      products={products}
      publicUrl={publicUrl}
    >
      {content}
    </WhatsAppEnquiryProvider>
  );
}
