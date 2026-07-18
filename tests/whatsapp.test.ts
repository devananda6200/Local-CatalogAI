import { describe, expect, it } from "vitest";
import { demoProducts } from "@/lib/demo-data";
import {
  buildWhatsAppEnquiryMessage,
  getWhatsAppEnquiryUrl,
  normalizeWhatsAppNumber,
} from "@/lib/whatsapp";

describe("WhatsApp enquiries", () => {
  it("normalizes valid international phone numbers", () => {
    expect(normalizeWhatsAppNumber("+91 98765 43210")).toBe("919876543210");
    expect(normalizeWhatsAppNumber("123")).toBeNull();
  });

  it("builds a customer reviewed product enquiry", () => {
    const message = buildWhatsAppEnquiryMessage({
      businessName: "Malabar Bakes",
      lines: [{ product: demoProducts[0], quantity: 2 }],
      note: "Please confirm pickup time.",
      publicUrl: "https://catalog.example/shop/malabar-bakes",
    });
    expect(message).toContain("Hello Malabar Bakes");
    expect(message).toContain(`2 × ${demoProducts[0].name}`);
    expect(message).toContain("Estimated total:");
    expect(message).toContain("Please confirm pickup time.");
    expect(message).toContain("https://catalog.example/shop/malabar-bakes");
  });

  it("creates a WhatsApp URL only when a number and items exist", () => {
    const url = getWhatsAppEnquiryUrl({
      whatsapp: "+91 98765 43210",
      businessName: "Malabar Bakes",
      lines: [{ product: demoProducts[0], quantity: 1 }],
      publicUrl: "https://catalog.example/shop/malabar-bakes",
    });
    expect(url).toMatch(/^https:\/\/wa\.me\/919876543210\?text=/);
    expect(
      getWhatsAppEnquiryUrl({
        whatsapp: null,
        businessName: "Malabar Bakes",
        lines: [],
        publicUrl: "https://catalog.example/shop/malabar-bakes",
      }),
    ).toBeNull();
  });
});
