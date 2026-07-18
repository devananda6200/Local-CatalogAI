import { Sparkles } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { getOwnerWorkspace } from "@/lib/owner-data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const workspace = await getOwnerWorkspace();
  return (
    <div className="min-h-screen bg-[#f7f5ef]">
      <div className="flex items-center justify-between border-b border-black/5 bg-[#fffefa] px-5 py-3 lg:hidden">
        <span className="font-black">
          LocalCatalog <span className="text-[#176b4d]">AI</span>
        </span>
        <span className="grid size-8 place-items-center rounded-xl bg-[#176b4d] text-white">
          <Sparkles size={15} />
        </span>
      </div>
      <Sidebar
        business={workspace.business}
        configured={workspace.configured}
      />
      <main id="main" className="px-5 py-8 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
