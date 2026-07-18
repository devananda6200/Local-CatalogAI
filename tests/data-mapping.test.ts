import { describe, expect, it } from "vitest";
import { mapBusiness, mapProduct } from "@/lib/catalog";

describe("Supabase row mapping", () => {
  it("maps an owner business row into application data", () => {
    const business = mapBusiness({
      id: "business-1",
      owner_id: "owner-1",
      name: "Corner Shop",
      slug: "corner-shop",
      category: "Retail",
      description: "A neighbourhood shop.",
      logo_url: null,
      cover_image_url: null,
      phone: null,
      whatsapp: null,
      instagram_url: null,
      address: "Kochi",
      latitude: "9.96",
      longitude: "76.29",
      opening_hours: { Mon: "9 AM to 6 PM" },
      theme: "minimal",
      published: false,
    });
    expect(business.ownerId).toBe("owner-1");
    expect(business.latitude).toBe(9.96);
    expect(business.openingHours.Mon).toBe("9 AM to 6 PM");
  });

  it("maps product arrays and numeric prices", () => {
    const product = mapProduct({
      id: "product-1",
      business_id: "business-1",
      name: "Tea",
      description: "Fresh tea",
      price: "25.00",
      currency: "INR",
      category: "Drinks",
      image_url: "",
      tags: ["hot"],
      dietary_labels: [],
      available: false,
      sort_order: 2,
      ai_generated: true,
    });
    expect(product.price).toBe(25);
    expect(product.available).toBe(false);
    expect(product.aiGenerated).toBe(true);
  });
});
