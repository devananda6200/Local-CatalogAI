import { describe, expect, it } from "vitest";
import { ensureUniqueSlug, generateSlug } from "@/lib/slug";

describe("slug generation", () => {
  it("normalizes punctuation, spacing, and accents", () =>
    expect(generateSlug("  Café & Bakes!  ")).toBe("cafe-bakes"));
  it("adds a stable suffix when a slug exists", () =>
    expect(
      ensureUniqueSlug("Malabar Bakes", ["malabar-bakes", "malabar-bakes-2"]),
    ).toBe("malabar-bakes-3"));
});
