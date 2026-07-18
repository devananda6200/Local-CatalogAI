import { afterEach, describe, expect, it } from "vitest";
import {
  AiUnavailableError,
  generateProductDetails,
} from "@/lib/ai/generate-product-details";

const originalKey = process.env.OPENAI_API_KEY;
afterEach(() => {
  if (originalKey) process.env.OPENAI_API_KEY = originalKey;
  else delete process.env.OPENAI_API_KEY;
});

describe("manual fallback", () => {
  it("stops only AI generation when the key is absent", async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(
      generateProductDetails({
        bytes: new ArrayBuffer(0),
        mimeType: "image/jpeg",
      }),
    ).rejects.toBeInstanceOf(AiUnavailableError);
  });
});
