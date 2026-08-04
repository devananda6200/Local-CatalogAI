import { ArrowRight, Search } from "lucide-react";
import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Brand />
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <ButtonLink href="/discover" variant="ghost">
            <Search size={16} />{" "}
            <span className="hidden sm:inline">Find stores</span>
          </ButtonLink>
          <ButtonLink
            href="/sign-in"
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            Sign in
          </ButtonLink>
          <ButtonLink href="/sign-up" className="px-4">
            Create catalog <ArrowRight size={16} />
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
