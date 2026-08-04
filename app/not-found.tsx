import { SearchX } from "lucide-react";
import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-5">
      <div className="max-w-md text-center">
        <div className="mb-10 flex justify-center">
          <Brand />
        </div>
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#e4eee7] text-[#176b4d]">
          <SearchX size={28} />
        </span>
        <p className="mt-7 text-sm font-bold tracking-[.2em] text-[#176b4d] uppercase">
          404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          This catalog is not available.
        </h1>
        <p className="mt-4 leading-7 text-[#66736b]">
          It may be unpublished, renamed, or the link might be incorrect.
        </p>
        <ButtonLink href="/" className="mt-7">
          Return home
        </ButtonLink>
      </div>
    </main>
  );
}
