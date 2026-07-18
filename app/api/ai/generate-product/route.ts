import { NextResponse, type NextRequest } from "next/server";
import {
  AiUnavailableError,
  generateProductDetails,
} from "@/lib/ai/generate-product-details";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY)
    return NextResponse.json(
      {
        error:
          "AI generation is unavailable. Enter product details manually or configure OPENAI_API_KEY.",
      },
      { status: 503 },
    );
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rate = checkRateLimit(`product-ai:${ip}`);
  if (!rate.allowed)
    return NextResponse.json(
      { error: "Too many AI requests. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) },
      },
    );

  try {
    const supabase = await createClient();
    if (!supabase)
      return NextResponse.json(
        {
          error:
            "Supabase authentication must be configured before AI generation can be enabled.",
        },
        { status: 503 },
      );
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { error: "Sign in to generate product details." },
        { status: 401 },
      );
    const form = await request.formData();
    const businessId = String(form.get("businessId") || "");
    const image = form.get("image");
    if (!businessId || !(image instanceof File))
      return NextResponse.json(
        { error: "A business and product image are required." },
        { status: 400 },
      );
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        image.type as (typeof ALLOWED_IMAGE_TYPES)[number],
      ) ||
      image.size > MAX_IMAGE_SIZE
    )
      return NextResponse.json(
        { error: "Use a JPEG, PNG, or WebP image no larger than 8 MB." },
        { status: 400 },
      );
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!business)
      return NextResponse.json(
        { error: "You do not have permission to manage this business." },
        { status: 403 },
      );
    const suggestion = await generateProductDetails({
      bytes: await image.arrayBuffer(),
      mimeType: image.type,
    });
    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof AiUnavailableError)
      return NextResponse.json({ error: error.message }, { status: 503 });
    return NextResponse.json(
      {
        error:
          "AI generation could not complete. Your image is safe; continue with manual entry or try again.",
      },
      { status: 502 },
    );
  }
}
