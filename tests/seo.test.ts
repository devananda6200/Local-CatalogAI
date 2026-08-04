import { describe, expect, it } from "vitest";
import { demoCatalog } from "@/lib/demo-data";
import { getCatalogStructuredData, serializeStructuredData } from "@/lib/seo";

describe("catalog SEO", () => {
  it("creates local business and product offer structured data", () => {
    const data = getCatalogStructuredData(
      demoCatalog,
      "https://catalog.example/shop/malabar-bakes",
    );
    expect(data["@type"]).toBe("Bakery");
    expect(data.hasOfferCatalog.itemListElement).toHaveLength(4);
    expect(
      data.hasOfferCatalog.itemListElement[0].itemOffered.offers?.priceCurrency,
    ).toBe("INR");
  });

  it("escapes structured data for safe HTML output", () => {
    expect(serializeStructuredData({ value: "<script>" })).not.toContain("<");
  });
});
