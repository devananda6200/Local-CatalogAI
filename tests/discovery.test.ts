import { describe, expect, it } from "vitest";
import {
  boutiqueBusiness,
  boutiqueProducts,
  demoBusiness,
  demoProducts,
} from "@/lib/demo-data";
import {
  buildDiscoveryBusiness,
  getBusinessDistance,
  getDistanceInKm,
  matchesPriceBand,
  matchesBusinessSearch,
  sortDiscoveryBusinesses,
} from "@/lib/discovery";

describe("business discovery", () => {
  it("searches by business name, category, and address", () => {
    expect(matchesBusinessSearch(demoBusiness, "malabar")).toBe(true);
    expect(matchesBusinessSearch(demoBusiness, "bakery")).toBe(true);
    expect(matchesBusinessSearch(demoBusiness, "kochi")).toBe(true);
    expect(matchesBusinessSearch(demoBusiness, "jewellery")).toBe(false);
  });

  it("applies category filters", () => {
    expect(matchesBusinessSearch(demoBusiness, "", demoBusiness.category)).toBe(
      true,
    );
    expect(matchesBusinessSearch(demoBusiness, "", "Boutique")).toBe(false);
  });

  it("calculates nearby distances", () => {
    const distance = getDistanceInKm(
      { latitude: 9.9667, longitude: 76.2999 },
      { latitude: 9.9816, longitude: 76.2999 },
    );
    expect(distance).toBeGreaterThan(1);
    expect(distance).toBeLessThan(2);
    expect(
      getBusinessDistance(demoBusiness, {
        latitude: demoBusiness.latitude!,
        longitude: demoBusiness.longitude!,
      }),
    ).toBe(0);
  });

  it("builds searchable product and price information", () => {
    const business = buildDiscoveryBusiness(demoBusiness, demoProducts);
    expect(business.minPrice).toBe(65);
    expect(business.maxPrice).toBe(280);
    expect(business.productCount).toBe(4);
    expect(business.productCategories).toContain("Drinks");
    expect(matchesBusinessSearch(business, "drinks")).toBe(true);
  });

  it("filters and sorts by actual available prices", () => {
    const bakery = buildDiscoveryBusiness(demoBusiness, demoProducts);
    const boutique = buildDiscoveryBusiness(boutiqueBusiness, boutiqueProducts);
    expect(matchesPriceBand(bakery, "under500")).toBe(true);
    expect(matchesPriceBand(bakery, "over2000")).toBe(false);
    expect(matchesPriceBand(boutique, "over2000")).toBe(true);
    expect(
      sortDiscoveryBusinesses([boutique, bakery], "priceLow", null)[0].id,
    ).toBe(bakery.id);
  });
});
