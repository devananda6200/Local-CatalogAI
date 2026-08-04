import { PageHeader } from "@/components/dashboard/page-header";
import { ProductForm } from "@/components/dashboard/product-form";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function NewProductPage() {
  const workspace = await getOwnerWorkspace();
  if (!workspace.business)
    return (
      <PageHeader
        eyebrow="Business setup required"
        title="Create your business first"
        description="Set up your business profile before adding products."
        action={
          <ButtonLink href="/dashboard/business">Create business</ButtonLink>
        }
      />
    );
  return (
    <>
      <PageHeader
        eyebrow="New product"
        title="Add a product"
        description="Start with a photo or enter every detail manually. You approve the final result."
      />
      <ProductForm
        businessId={workspace.business.id}
        configured={workspace.configured}
        aiEnabled={Boolean(process.env.OPENAI_API_KEY)}
      />
    </>
  );
}
