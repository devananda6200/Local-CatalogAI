"use client";

import Image from "next/image";
import { MessageCircle, Plus } from "lucide-react";
import { useWhatsAppEnquiry } from "@/components/catalog/whatsapp-enquiry";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  variant = "minimal",
}: {
  product: Product;
  variant?: "minimal" | "cafe" | "boutique";
}) {
  const cafe = variant === "cafe";
  const boutique = variant === "boutique";
  const enquiry = useWhatsAppEnquiry();
  const quantity = enquiry?.quantities[product.id] || 0;
  return (
    <article
      className={`overflow-hidden ${cafe ? "rounded-[1.7rem] bg-[#fffaf1] shadow-[0_14px_40px_rgba(55,34,20,.1)]" : boutique ? "border-b border-[#2e2926]/15 pb-6" : "rounded-3xl border border-black/5 bg-white shadow-[0_14px_44px_rgba(32,48,39,.07)]"}`}
    >
      <div
        className={`relative overflow-hidden ${boutique ? "rounded-none" : ""}`}
      >
        <Image
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
          }
          alt={product.name}
          width={800}
          height={600}
          className={`w-full object-cover transition duration-500 hover:scale-[1.03] ${boutique ? "aspect-[4/5]" : "aspect-[4/3]"}`}
        />
      </div>
      <div className={boutique ? "pt-5" : "p-5"}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`text-xs font-bold tracking-[.15em] uppercase ${cafe ? "text-[#b46036]" : "text-[#176b4d]"}`}
            >
              {product.category}
            </p>
            <h2
              className={`mt-2 font-black tracking-tight ${boutique ? "font-serif text-2xl" : "text-xl"}`}
            >
              {product.name}
            </h2>
          </div>
          <p className="shrink-0 font-black">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
        <p className="mt-3 text-sm leading-6 text-black/60">
          {product.description}
        </p>
        {product.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/[.05] px-2.5 py-1 text-[11px] font-bold text-black/55"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {enquiry?.enabled ? (
          <button
            type="button"
            onClick={() => enquiry.addProduct(product.id)}
            className={`mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition ${cafe ? "bg-[#38281f] text-[#fff9ee] hover:bg-black" : boutique ? "border border-[#2e2926] text-[#2e2926] hover:bg-[#2e2926] hover:text-white" : "bg-[#176b4d] text-white hover:bg-[#0d4d36]"}`}
          >
            {quantity ? <Plus size={16} /> : <MessageCircle size={16} />}
            {quantity
              ? `Add another · ${quantity} selected`
              : "Ask on WhatsApp"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
