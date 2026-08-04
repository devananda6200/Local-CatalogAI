import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/catalog/product-card";
import { WhatsAppEnquiryProvider } from "@/components/catalog/whatsapp-enquiry";
import { demoBusiness, demoProducts } from "@/lib/demo-data";

describe("WhatsApp enquiry basket", () => {
  it("adds a product and opens the customer review dialog", () => {
    const product = demoProducts[0];
    render(
      <WhatsAppEnquiryProvider
        business={demoBusiness}
        products={[product]}
        publicUrl="https://catalog.example/shop/malabar-bakes"
      >
        <ProductCard product={product} />
      </WhatsAppEnquiryProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ask on WhatsApp" }));

    const dialog = screen.getByRole("dialog", { name: "Review your items" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(product.name)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Send enquiry" })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/919876543210"),
    );
  });
});
