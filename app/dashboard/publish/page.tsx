import { PageHeader } from "@/components/dashboard/page-header";
import { PublishPanel } from "@/components/dashboard/publish-panel";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function PublishPage() {
  const workspace = await getOwnerWorkspace();
  if (!workspace.business)
    return (
      <PageHeader
        eyebrow="Business setup required"
        title="Create your business first"
        description="Complete your business profile before publishing a catalog."
        action={
          <ButtonLink href="/dashboard/business">Create business</ButtonLink>
        }
      />
    );
  return (
    <>
      <PageHeader
        eyebrow="Step 4"
        title="Publish settings"
        description="Control public visibility. Customers never need an account to browse a published catalog."
      />
      <PublishPanel
        business={workspace.business}
        products={workspace.products}
        configured={workspace.configured}
      />
    </>
  );
}
