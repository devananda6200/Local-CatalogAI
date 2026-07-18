import { describe, expect, it } from "vitest";
import { demoBusiness } from "@/lib/demo-data";
import {
  getBusinessDistance,
  getDistanceInKm,
  matchesBusinessSearch,
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
});
