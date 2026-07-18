import { PageHeader } from "@/components/dashboard/page-header";
import { QrShareCenter } from "@/components/dashboard/qr-share-center";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function SharePage() {
  const workspace = await getOwnerWorkspace();
  if (!workspace.business)
    return (
      <PageHeader
        eyebrow="Business setup required"
        title="Create your business first"
        description="Create a business before generating its public QR code."
        action={
          <ButtonLink href="/dashboard/business">Create business</ButtonLink>
        }
      />
    );
  return (
    <>
      <PageHeader
        eyebrow="Ready to share"
        title="QR and sharing"
        description="Turn your public catalog link into something customers can scan, copy, print, and send."
      />
      <QrShareCenter business={workspace.business} />
    </>
  );
}
