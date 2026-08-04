import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProductForm } from "@/components/dashboard/product-form";
import { getOwnedProduct, getOwnerWorkspace } from "@/lib/owner-data";
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getOwnerWorkspace();
  const product = await getOwnedProduct(id);
  if (!product) notFound();
  if (!workspace.business) notFound();
  return (
    <>
      <PageHeader
        eyebrow="Product editor"
        title={`Edit ${product.name}`}
        description="Changes stay in draft until you save. Confirm AI assisted text before publishing."
      />
      <ProductForm
        productId={id}
        businessId={workspace.business.id}
        configured={workspace.configured}
        initialAiGenerated={product.aiGenerated}
        aiEnabled={Boolean(process.env.OPENAI_API_KEY)}
        initial={{
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          category: product.category,
          imageUrl: product.imageUrl,
          tags: product.tags,
          dietaryLabels: product.dietaryLabels,
          available: product.available,
          sortOrder: product.sortOrder,
        }}
      />
    </>
  );
}
