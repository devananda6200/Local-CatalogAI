"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductsList({
  initialProducts,
  configured,
}: {
  initialProducts: Product[];
  configured: boolean;
}) {
  const [products, setProducts] = useState(initialProducts);
  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    const supabase = createClient();
    if (configured && supabase) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return toast.error(error.message);
    }
    setProducts((items) => items.filter((item) => item.id !== id));
    toast.success(
      configured ? "Product deleted" : "Product removed from the demo list",
    );
  }
  if (!products.length)
    return (
      <div className="mt-8 rounded-[2rem] border-2 border-dashed border-black/10 p-12 text-center">
        <p className="text-lg font-black">No products yet</p>
        <p className="mt-2 text-sm text-[#68756d]">
          Add your first photo and create a product in minutes.
        </p>
        <Link
          href="/dashboard/products/new"
          className="mt-5 inline-block font-bold text-[#176b4d]"
        >
          Add a product
        </Link>
      </div>
    );
  return (
    <div className="mt-7 overflow-hidden rounded-[2rem] border border-black/5 bg-[#fffefa]">
      <div className="hidden grid-cols-[30px_1fr_150px_110px_80px] gap-4 border-b border-black/5 px-5 py-3 text-xs font-bold tracking-[.1em] text-[#7a867e] uppercase md:grid">
        <span />
        <span>Product</span>
        <span>Category</span>
        <span>Status</span>
        <span />
      </div>
      {products.map((product) => (
        <article
          key={product.id}
          className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/5 p-4 last:border-0 md:grid-cols-[30px_1fr_150px_110px_80px]"
        >
          <GripVertical size={16} className="hidden text-black/25 md:block" />
          <div className="flex min-w-0 items-center gap-3">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt=""
                width={120}
                height={120}
                className="size-16 rounded-xl object-cover"
              />
            ) : (
              <div className="size-16 rounded-xl bg-black/5" />
            )}
            <div className="min-w-0">
              <p className="truncate font-black">{product.name}</p>
              <p className="mt-1 text-sm font-bold text-[#176b4d]">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </div>
          <p className="hidden text-sm text-[#68756d] md:block">
            {product.category}
          </p>
          <span className="hidden w-fit rounded-full bg-[#e5f1e9] px-2.5 py-1 text-xs font-bold text-[#176b4d] md:block">
            {product.available ? "Available" : "Draft"}
          </span>
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/dashboard/products/${product.id}`}
              aria-label={`Edit ${product.name}`}
              className="grid size-9 place-items-center rounded-xl hover:bg-black/5"
            >
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              onClick={() => remove(product.id, product.name)}
              aria-label={`Delete ${product.name}`}
              className="grid size-9 place-items-center rounded-xl text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
            <MoreHorizontal size={16} className="hidden" />
          </div>
        </article>
      ))}
    </div>
  );
}
