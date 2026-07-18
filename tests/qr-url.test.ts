import { describe, expect, it } from "vitest";
import { getPublicCatalogUrl } from "@/lib/urls";

describe("QR destination", () => {
  it("uses the full public catalog URL", () =>
    expect(
      getPublicCatalogUrl("https://catalog.example/", "malabar-bakes"),
    ).toBe("https://catalog.example/shop/malabar-bakes"));
});
