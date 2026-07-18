import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Package,
  QrCode,
  Sparkles,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";

export default async function DashboardPage() {
  const workspace = await getOwnerWorkspace();
  const { business, products } = workspace;
  if (!business)
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Welcome to LocalCatalog AI"
          title="Create your first business catalog"
          description="Add your business details first. Then you can upload products, choose a theme, and publish your own customer website."
          action={
            <ButtonLink href="/dashboard/business">
              Create my business <ArrowRight size={16} />
            </ButtonLink>
          }
        />
        <section className="rounded-[2rem] bg-[#17201b] p-7 text-white md:p-10">
          <p className="text-sm font-bold tracking-[.18em] text-[#8bd0ae] uppercase">
            Your setup journey
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              "Create business profile",
              "Add products and prices",
              "Choose a theme and publish",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/[.06] p-5">
                <span className="text-xs font-black text-[#8bd0ae]">
                  0{index + 1}
                </span>
                <p className="mt-3 font-black">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );

  const availableCount = products.filter((product) => product.available).length;
  const stats = [
    {
      label: "Products",
      value: String(products.length),
      note: `${availableCount} available`,
      icon: Package,
    },
    {
      label: "Catalog status",
      value: business.published ? "Live" : "Draft",
      note: business.published ? "Visible to everyone" : "Not public yet",
      icon: Eye,
    },
    {
      label: "AI status",
      value: process.env.OPENAI_API_KEY ? "Ready" : "Manual",
      note: process.env.OPENAI_API_KEY
        ? "Generation enabled"
        : "Manual entry available",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Owner workspace"
        title={`Welcome, ${business.name}.`}
        description="Manage your products, appearance, publishing, and customer sharing from one place."
        action={
          <ButtonLink
            href={`/shop/${business.slug}`}
            external
            variant="secondary"
          >
            View catalog <ArrowRight size={16} />
          </ButtonLink>
        }
      />
      {!workspace.configured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-[#d4e4d8] bg-[#edf5ef] p-4 text-sm text-[#405648]">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#176b4d] text-white">
            <Sparkles size={15} />
          </span>
          <div>
            <p className="font-black">Demo workspace</p>
            <p className="mt-1 leading-6">
              Connect Supabase to create permanent owner accounts and catalogs.
            </p>
          </div>
        </div>
      ) : null}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <article
            key={label}
            className="rounded-3xl border border-black/5 bg-[#fffefa] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#68756d]">{label}</p>
              <span className="grid size-9 place-items-center rounded-xl bg-[#e5efe7] text-[#176b4d]">
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-6 text-3xl font-black tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-[#7b867f]">{note}</p>
          </article>
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-[2rem] bg-[#17201b] p-6 text-white md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-[#8bd0ae] uppercase">
                Next best step
              </p>
              <h2 className="mt-3 text-2xl font-black">Add another product</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                Upload a photo, review editable details, set the price, and
                decide when it becomes available.
              </p>
            </div>
            <span className="hidden size-14 place-items-center rounded-2xl bg-white/10 text-[#8bd0ae] sm:grid">
              <Upload />
            </span>
          </div>
          <ButtonLink
            href="/dashboard/products/new"
            className="mt-7 bg-[#8bd0ae] text-[#17201b] hover:bg-[#a9e4c5]"
          >
            Add product <ArrowRight size={16} />
          </ButtonLink>
        </article>
        <article className="overflow-hidden rounded-[2rem] border border-black/5 bg-[#fffefa]">
          {business.coverImageUrl ? (
            <Image
              src={business.coverImageUrl}
              alt={`${business.name} catalog cover`}
              width={800}
              height={440}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="h-40 bg-[#e3ece5]" />
          )}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black">{business.name}</p>
                <p className="mt-1 text-xs text-[#68756d]">
                  /shop/{business.slug}
                </p>
              </div>
              <Link
                href="/dashboard/share"
                aria-label="Open QR and sharing"
                className="grid size-10 place-items-center rounded-xl bg-[#e5efe7] text-[#176b4d]"
              >
                <QrCode size={18} />
              </Link>
            </div>
          </div>
        </article>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Recent products</h2>
          <Link
            href="/dashboard/products"
            className="text-sm font-bold text-[#176b4d]"
          >
            Manage all
          </Link>
        </div>
        {products.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <article
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#fffefa] p-3"
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt=""
                    width={100}
                    height={100}
                    className="size-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="size-14 rounded-xl bg-black/5" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{product.name}</p>
                  <p className="mt-1 text-xs text-[#68756d]">
                    {product.category}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-[#68756d]">
            No products yet. Add your first product to begin.
          </div>
        )}
      </section>
    </div>
  );
}
