import { describe, expect, it } from "vitest";
import { isPubliclyReadable } from "@/lib/catalog";
import { getDemoCatalogBySlug } from "@/lib/demo-data";

describe("public catalog behavior", () => {
  it("does not expose unpublished businesses", () =>
    expect(isPubliclyReadable({ published: false })).toBe(false));
  it("returns no catalog for an unknown slug", () =>
    expect(getDemoCatalogBySlug("unknown-shop")).toBeNull());
  it("returns only available products for the demo shop", () =>
    expect(
      getDemoCatalogBySlug("malabar-bakes")?.products.every(
        (product) => product.available,
      ),
    ).toBe(true));
});
