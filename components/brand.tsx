import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 font-black tracking-[-0.03em]"
      aria-label="LocalCatalog AI home"
    >
      <span
        className={`grid size-9 place-items-center rounded-xl ${inverse ? "bg-white text-[#176b4d]" : "bg-[#176b4d] text-white"}`}
      >
        <Sparkles size={17} />
      </span>
      <span className={inverse ? "text-white" : "text-[#17201b]"}>
        LocalCatalog{" "}
        <span className={inverse ? "text-[#f4c58c]" : "text-[#176b4d]"}>
          AI
        </span>
      </span>
    </Link>
  );
}
