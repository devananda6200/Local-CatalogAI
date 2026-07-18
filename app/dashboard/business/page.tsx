import { BusinessForm } from "@/components/dashboard/business-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function BusinessPage() {
  const workspace = await getOwnerWorkspace();
  return (
    <>
      <PageHeader
        eyebrow="Step 1"
        title="Business profile"
        description="The essentials customers need to recognize, contact, and visit your business."
      />
      <BusinessForm
        business={workspace.business}
        configured={workspace.configured}
      />
    </>
  );
}
