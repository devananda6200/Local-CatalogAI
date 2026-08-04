import { describe, expect, it } from "vitest";
import { getDirectionsUrl } from "@/lib/maps";

describe("directions URLs", () => {
  it("prefers coordinates", () =>
    expect(
      getDirectionsUrl({
        latitude: 9.9667,
        longitude: 76.2999,
        address: "Kochi",
      }),
    ).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=9.9667%2C76.2999",
    ));
  it("falls back to an encoded address", () =>
    expect(getDirectionsUrl({ address: "Panampilly Nagar, Kochi" })).toContain(
      "Panampilly%20Nagar%2C%20Kochi",
    ));
  it("returns null without a destination", () =>
    expect(getDirectionsUrl({})).toBeNull());
});
