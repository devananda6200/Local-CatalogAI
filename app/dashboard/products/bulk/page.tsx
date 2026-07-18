import { BulkUploader } from "@/components/dashboard/bulk-uploader";
import { PageHeader } from "@/components/dashboard/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function BulkPage() {
  const workspace = await getOwnerWorkspace();
  if (!workspace.business)
    return (
      <PageHeader
        eyebrow="Business setup required"
        title="Create your business first"
        description="Set up your business profile before uploading products."
        action={
          <ButtonLink href="/dashboard/business">Create business</ButtonLink>
        }
      />
    );
  return (
    <>
      <PageHeader
        eyebrow="Batch workflow"
        title="Bulk image upload"
        description="Select several products at once. Each becomes an individual editable draft and nothing publishes without your confirmation."
      />
      <BulkUploader
        businessId={workspace.business.id}
        configured={workspace.configured}
        aiEnabled={Boolean(process.env.OPENAI_API_KEY)}
      />
    </>
  );
}
