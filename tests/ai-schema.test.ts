import { describe, expect, it } from "vitest";
import { aiProductSuggestionSchema } from "@/lib/validation";

describe("AI suggestion schema", () => {
  it("accepts factual editable suggestions without a price", () => {
    const result = aiProductSuggestionSchema.parse({
      suggestedName: "Cardamom bun",
      description: "A golden baked bun with a sugar finish.",
      category: "Sweet bakes",
      tags: ["baked"],
      dietaryLabels: [],
      confidenceNotes: "Flavor cannot be confirmed from the image.",
    });
    expect(result.suggestedName).toBe("Cardamom bun");
    expect(result).not.toHaveProperty("price");
  });
  it("rejects malformed output", () =>
    expect(() =>
      aiProductSuggestionSchema.parse({ suggestedName: "", tags: "baked" }),
    ).toThrow());
});
