"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppEnquiryUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";

interface EnquiryContextValue {
  addProduct: (productId: string) => void;
  enabled: boolean;
  quantities: Record<string, number>;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useWhatsAppEnquiry() {
  return useContext(EnquiryContext);
}

export function WhatsAppEnquiryProvider({
  business,
  products,
  publicUrl,
  children,
}: {
  business: Business;
  products: Product[];
  publicUrl: string;
  children: ReactNode;
}) {
  const enabled = Boolean(normalizeWhatsAppNumber(business.whatsapp));
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const selected = useMemo(
    () =>
      products
        .filter((product) => (quantities[product.id] || 0) > 0)
        .map((product) => ({ product, quantity: quantities[product.id] })),
    [products, quantities],
  );
  const count = selected.reduce((sum, line) => sum + line.quantity, 0);
  const enquiryUrl = getWhatsAppEnquiryUrl({
    whatsapp: business.whatsapp,
    businessName: business.name,
    lines: selected,
    note,
    publicUrl,
  });

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[productId];
      else next[productId] = Math.min(quantity, 99);
      return next;
    });
  }, []);

  const addProduct = useCallback((productId: string) => {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.min((current[productId] || 0) + 1, 99),
    }));
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <EnquiryContext.Provider value={{ addProduct, enabled, quantities }}>
      {children}
      {enabled && count > 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-40 flex min-h-14 items-center gap-3 rounded-full bg-[#176b4d] px-5 font-bold text-white shadow-[0_18px_50px_rgba(23,107,77,.35)] transition hover:bg-[#0d4d36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b4d]"
          aria-label={`Open WhatsApp enquiry with ${count} selected item${count === 1 ? "" : "s"}`}
        >
          <ShoppingBag size={19} />
          <span>Enquiry · {count}</span>
        </button>
      ) : null}
      {open && enabled ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Close enquiry"
            className="absolute inset-0 cursor-default"
            onClick={() => setOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-enquiry-title"
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-[#fffefa] p-5 shadow-2xl sm:rounded-[2rem] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black tracking-[.16em] text-[#176b4d] uppercase">
                  WhatsApp enquiry
                </p>
                <h2
                  id="whatsapp-enquiry-title"
                  className="mt-2 text-2xl font-black"
                >
                  Review your items
                </h2>
                <p className="mt-1 text-sm text-black/55">
                  You can review the message again before sending it in
                  WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-black/10"
                aria-label="Close enquiry"
              >
                <X size={18} />
              </button>
            </div>

            {selected.length ? (
              <div className="mt-6 grid gap-3">
                {selected.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#f2f4f1] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-black">{product.name}</p>
                      <p className="mt-1 text-xs font-bold text-black/50">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="grid size-9 place-items-center rounded-full bg-white"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        {quantity === 1 ? (
                          <Trash2 size={15} />
                        ) : (
                          <Minus size={15} />
                        )}
                      </button>
                      <span className="w-8 text-center text-sm font-black">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="grid size-9 place-items-center rounded-full bg-white"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-[#f2f4f1] p-6 text-center text-sm text-black/55">
                Add a product to start an enquiry.
              </div>
            )}

            <label
              className="mt-5 block text-sm font-bold"
              htmlFor="enquiry-note"
            >
              Note for the business
            </label>
            <textarea
              id="enquiry-note"
              value={note}
              onChange={(event) => setNote(event.target.value.slice(0, 300))}
              placeholder="Ask about availability, customization, or pickup time"
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#176b4d]"
            />
            <p className="mt-1 text-right text-xs text-black/40">
              {note.length}/300
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                className="sm:flex-1"
              >
                Keep browsing
              </Button>
              {enquiryUrl ? (
                <a
                  href={enquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176b4d] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d4d36] sm:flex-1"
                >
                  <MessageCircle size={17} /> Send enquiry
                </a>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </EnquiryContext.Provider>
  );
}
