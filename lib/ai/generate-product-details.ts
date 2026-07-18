import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { aiProductSuggestionSchema } from "@/lib/validation";

const PROMPT = `You are assisting a small-business owner in creating a factual product catalog. Analyze the supplied product or dish image. Return a concise suggested name, an attractive but truthful description, a broad category, and relevant tags. Do not infer ingredients, brands, dietary claims, sizes, materials, or other details unless clearly visible. Do not generate a price. Clearly mark uncertainty.`;

export class AiUnavailableError extends Error {}

export async function generateProductDetails(image: {
  bytes: ArrayBuffer;
  mimeType: string;
}) {
  if (!process.env.OPENAI_API_KEY)
    throw new AiUnavailableError(
      "AI generation is unavailable until OPENAI_API_KEY is configured.",
    );
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 25_000,
    maxRetries: 1,
  });
  const base64 = Buffer.from(image.bytes).toString("base64");
  const response = await client.responses.parse({
    model: "gpt-5.6-luna",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: PROMPT },
          {
            type: "input_image",
            image_url: `data:${image.mimeType};base64,${base64}`,
            detail: "high",
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(
        aiProductSuggestionSchema,
        "product_catalog_suggestion",
      ),
    },
  });
  if (!response.output_parsed)
    throw new Error(
      "The AI response did not contain valid structured product details.",
    );
  return aiProductSuggestionSchema.parse(response.output_parsed);
}
