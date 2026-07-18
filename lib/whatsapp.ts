import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export interface WhatsAppEnquiryLine {
  product: Product;
  quantity: number;
}

export function normalizeWhatsAppNumber(value: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

export function buildWhatsAppEnquiryMessage({
  businessName,
  lines,
  note,
  publicUrl,
}: {
  businessName: string;
  lines: WhatsAppEnquiryLine[];
  note?: string;
  publicUrl: string;
}) {
  const items = lines.map(({ product, quantity }) => {
    const price = formatPrice(product.price, product.currency);
    return `${quantity} × ${product.name} · ${price}`;
  });
  const pricedLines = lines.filter(({ product }) => product.price !== null);
  const currencies = new Set(
    pricedLines.map(({ product }) => product.currency),
  );
  const canShowTotal =
    pricedLines.length === lines.length && currencies.size === 1;
  const total = pricedLines.reduce(
    (sum, { product, quantity }) => sum + Number(product.price) * quantity,
    0,
  );
  const currency = pricedLines[0]?.product.currency || "INR";
  const sections = [
    `Hello ${businessName},`,
    "I am interested in:",
    items.join("\n"),
  ];
  if (canShowTotal)
    sections.push(`Estimated total: ${formatPrice(total, currency)}`);
  if (note?.trim()) sections.push(`Note: ${note.trim()}`);
  sections.push(`Catalog: ${publicUrl}`);
  return sections.join("\n\n");
}

export function getWhatsAppEnquiryUrl({
  whatsapp,
  businessName,
  lines,
  note,
  publicUrl,
}: {
  whatsapp: string | null;
  businessName: string;
  lines: WhatsAppEnquiryLine[];
  note?: string;
  publicUrl: string;
}) {
  const number = normalizeWhatsAppNumber(whatsapp);
  if (!number || !lines.length) return null;
  const message = buildWhatsAppEnquiryMessage({
    businessName,
    lines,
    note,
    publicUrl,
  });
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
