import Image from "next/image";
import {
  ArrowRight,
  Camera,
  Check,
  Globe2,
  MapPin,
  Palette,
  QrCode,
  Share2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { demoProducts } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

const steps = [
  {
    n: "01",
    title: "Upload",
    body: "Add photos from your phone. One product or an entire batch.",
    icon: Camera,
  },
  {
    n: "02",
    title: "Review",
    body: "AI drafts factual names and descriptions. You stay in control.",
    icon: WandSparkles,
  },
  {
    n: "03",
    title: "Publish",
    body: "Choose your look and share a polished catalog instantly.",
    icon: Globe2,
  },
];

const features = [
  {
    title: "Your catalog, your style",
    body: "Minimal, Café, and Boutique themes adapt beautifully to every screen.",
    icon: Palette,
  },
  {
    title: "Share everywhere",
    body: "A clean link, downloadable QR code, WhatsApp, and native sharing built in.",
    icon: QrCode,
  },
  {
    title: "Turn visits into footfall",
    body: "One tap opens Google Maps directions to your doorstep.",
    icon: MapPin,
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="noise relative overflow-hidden bg-[#f7f5ef] px-5 pt-36 pb-20 md:px-8 md:pt-44 md:pb-28">
          <div className="pointer-events-none absolute top-12 -right-32 size-[34rem] rounded-full bg-[#dceadd] blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
            <div className="fade-up max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#176b4d]/15 bg-white/70 px-3.5 py-2 text-xs font-bold text-[#176b4d]">
                <Sparkles size={14} /> Built for local business
              </div>
              <h1 className="balance text-5xl leading-[.94] font-black tracking-[-0.065em] sm:text-6xl md:text-7xl">
                Upload photos.
                <br />
                <span className="text-[#176b4d]">
                  Get a professional catalog.
                </span>
              </h1>
              <p className="balance mt-7 max-w-xl text-lg leading-8 text-[#59675f]">
                From camera roll to a beautiful, shareable storefront in
                minutes. No designer, developer, or complicated setup required.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/sign-up" className="px-7">
                  Create your catalog <ArrowRight size={17} />
                </ButtonLink>
                <ButtonLink
                  href="/discover"
                  variant="secondary"
                  className="px-7"
                >
                  Find local stores
                </ButtonLink>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#657269]">
                <span className="flex items-center gap-1.5">
                  <Check size={15} className="text-[#176b4d]" /> Free to try
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={15} className="text-[#176b4d]" /> No card needed
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={15} className="text-[#176b4d]" /> Works without
                  AI
                </span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl lg:mr-0">
              <div className="shadow-soft rotate-1 rounded-[2.3rem] border border-black/5 bg-[#fffefa] p-3">
                <div className="relative overflow-hidden rounded-[1.7rem] bg-[#2b1e17] p-5 text-white">
                  <Image
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85"
                    alt="Fresh bakery products"
                    width={1000}
                    height={520}
                    className="h-56 w-full rounded-2xl object-cover opacity-80"
                    priority
                  />
                  <div className="absolute inset-x-9 top-40">
                    <p className="text-xs font-bold tracking-[.2em] text-[#f4c58c] uppercase">
                      Sample catalog
                    </p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight">
                      Malabar Bakes
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {demoProducts.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="rounded-2xl bg-white p-2.5 text-[#17201b]"
                      >
                        <Image
                          src={product.imageUrl}
                          alt=""
                          width={300}
                          height={200}
                          className="h-24 w-full rounded-xl object-cover"
                        />
                        <div className="px-1 pt-2 pb-1">
                          <p className="truncate text-sm font-bold">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#176b4d]">
                            {formatPrice(product.price, product.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white px-4 py-3 shadow-xl md:-left-10">
                <span className="grid size-9 place-items-center rounded-xl bg-[#e3f2e8] text-[#176b4d]">
                  <Share2 size={17} />
                </span>
                <div>
                  <p className="text-xs text-[#6b776f]">Ready to share</p>
                  <p className="text-sm font-black">
                    One link. Every customer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#17201b] px-5 py-20 text-white md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[.18em] text-[#8bd0ae] uppercase">
                How it works
              </p>
              <h2 className="balance mt-4 text-4xl font-black tracking-[-0.045em] md:text-5xl">
                From photos to published in three simple steps.
              </h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map(({ n, title, body, icon: Icon }) => (
                <article
                  key={title}
                  className="group rounded-[2rem] border border-white/10 bg-white/[.04] p-7 transition hover:-translate-y-1 hover:bg-white/[.07]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-[#8bd0ae] text-[#17201b]">
                      <Icon size={21} />
                    </span>
                    <span className="text-sm font-black text-white/30">
                      {n}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-white/60">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-bold tracking-[.18em] text-[#176b4d] uppercase">
                Everything you need
              </p>
              <h2 className="balance mx-auto mt-4 max-w-2xl text-4xl font-black tracking-[-0.045em] md:text-5xl">
                Small business presence, without the big build.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map(({ title, body, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-[2rem] border border-black/5 bg-[#fffefa] p-7 shadow-[0_16px_50px_rgba(30,45,36,.06)]"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#e5efe7] text-[#176b4d]">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-7 text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-[#68756d]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 md:px-8 md:pb-28">
          <div className="noise mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#f0a75c] px-6 py-14 text-center md:px-16 md:py-20">
            <h2 className="balance mx-auto max-w-3xl text-4xl font-black tracking-[-0.05em] md:text-6xl">
              Your next customer is already on their phone.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[#49321f]">
              Give them something beautiful to browse, save, and share.
            </p>
            <ButtonLink href="/sign-up" variant="dark" className="mt-8 px-7">
              Build my catalog <ArrowRight size={17} />
            </ButtonLink>
          </div>
        </section>
      </main>
      <footer className="border-t border-black/5 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#68756d] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-[#17201b]">LocalCatalog AI</p>
          <p>Made for neighbourhood businesses with big ambitions.</p>
        </div>
      </footer>
    </>
  );
}
