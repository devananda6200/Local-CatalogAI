"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ExternalLink,
  Home,
  LogOut,
  Package,
  Palette,
  QrCode,
  Send,
  Upload,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";
import type { Business } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/business", label: "Business profile", icon: Building2 },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/products/bulk", label: "Bulk upload", icon: Upload },
  { href: "/dashboard/themes", label: "Themes", icon: Palette },
  { href: "/dashboard/publish", label: "Publish", icon: Send },
  { href: "/dashboard/share", label: "QR and sharing", icon: QrCode },
];

export function Sidebar({
  business,
  configured,
}: {
  business: Business | null;
  configured: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }
  return (
    <aside className="border-r border-black/5 bg-[#fffefa] lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
      <div className="flex h-full flex-col p-4">
        <div className="hidden px-2 py-4 lg:block">
          <Brand />
        </div>
        <nav
          className="flex gap-1 overflow-x-auto py-2 lg:mt-7 lg:flex-col"
          aria-label="Dashboard navigation"
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                  active
                    ? "bg-[#e2eee6] text-[#176b4d]"
                    : "text-[#647067] hover:bg-black/[.04]",
                )}
              >
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>
        {configured ? (
          <button
            type="button"
            onClick={signOut}
            className="mt-3 hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#647067] hover:bg-black/[.04] lg:flex"
          >
            <LogOut size={17} /> Sign out
          </button>
        ) : null}
        {business ? (
          <div className="mt-auto hidden rounded-2xl bg-[#17201b] p-4 text-white lg:block">
            <p className="text-xs text-white/55">Public catalog</p>
            <p className="mt-1 truncate text-sm font-bold">
              /shop/{business.slug}
            </p>
            <Link
              href={`/shop/${business.slug}`}
              target="_blank"
              className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#9ad8b8]"
            >
              Open catalog <ExternalLink size={12} />
            </Link>
          </div>
        ) : (
          <div className="mt-auto hidden rounded-2xl bg-[#17201b] p-4 text-white lg:block">
            <p className="text-sm font-black">Create your catalog</p>
            <Link
              href="/dashboard/business"
              className="mt-3 block text-xs font-bold text-[#9ad8b8]"
            >
              Start business setup
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
