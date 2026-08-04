import { Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProductsList } from "@/components/dashboard/products-list";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function ProductsPage() {
  const workspace = await getOwnerWorkspace();
  if (!workspace.business)
    return (
      <>
        <PageHeader
          eyebrow="Business setup required"
          title="Create your business first"
          description="Your products need a business catalog to belong to. Complete the profile, then return here."
          action={
            <ButtonLink href="/dashboard/business">Create business</ButtonLink>
          }
        />
      </>
    );
  return (
    <>
      <PageHeader
        eyebrow="Step 2"
        title="Products"
        description="Review availability, update prices, and keep your public catalog current."
        action={
          <div className="flex gap-2">
            <ButtonLink href="/dashboard/products/bulk" variant="secondary">
              <Upload size={16} /> Bulk upload
            </ButtonLink>
            <ButtonLink href="/dashboard/products/new">
              <Plus size={16} /> Add product
            </ButtonLink>
          </div>
        }
      />
      <ProductsList
        initialProducts={workspace.products}
        configured={workspace.configured}
      />
    </>
  );
}
