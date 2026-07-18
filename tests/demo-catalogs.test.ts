import { describe, expect, it } from "vitest";
import {
  demoBusinesses,
  demoCatalogs,
  getDemoCatalogBySlug,
} from "@/lib/demo-data";

describe("sample catalogs", () => {
  it("includes the bakery, boutique, restaurant, and homestay examples", () => {
    expect(demoBusinesses.map((business) => business.category)).toEqual(
      expect.arrayContaining([
        "Bakery and cafe",
        "Boutique",
        "Restaurant",
        "Homestay",
      ]),
    );
  });

  it("provides published products for every sample business", () => {
    expect(demoCatalogs).toHaveLength(4);
    for (const catalog of demoCatalogs) {
      expect(catalog.business.sample).toBe(true);
      expect(catalog.business.published).toBe(true);
      expect(catalog.products.length).toBeGreaterThanOrEqual(4);
      expect(
        catalog.products.every(
          (product) => product.available && product.sample === true,
        ),
      ).toBe(true);
    }
  });

  it("finds each example through its public slug", () => {
    for (const business of demoBusinesses) {
      expect(getDemoCatalogBySlug(business.slug)?.business.id).toBe(
        business.id,
      );
    }
  });
});
