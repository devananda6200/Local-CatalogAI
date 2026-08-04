import { PageHeader } from "@/components/dashboard/page-header";
import { ThemeSelector } from "@/components/dashboard/theme-selector";
import { ButtonLink } from "@/components/ui/button";
import { getOwnerWorkspace } from "@/lib/owner-data";
export default async function ThemesPage() {
  const workspace = await getOwnerWorkspace();
  if (!workspace.business)
    return (
      <PageHeader
        eyebrow="Business setup required"
        title="Create your business first"
        description="Set up your business before choosing its visual theme."
        action={
          <ButtonLink href="/dashboard/business">Create business</ButtonLink>
        }
      />
    );
  return (
    <>
      <PageHeader
        eyebrow="Step 3"
        title="Choose your look"
        description="Every theme uses the same business and product data, so you can switch without rebuilding anything."
      />
      <ThemeSelector
        business={workspace.business}
        products={workspace.products}
        configured={workspace.configured}
      />
    </>
  );
}
