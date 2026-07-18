import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  primary:
    "bg-[#176b4d] text-white hover:bg-[#0d4d36] shadow-[0_10px_30px_rgba(23,107,77,.2)]",
  secondary:
    "border border-black/10 bg-white text-[#17201b] hover:bg-[#f7f5ef]",
  ghost: "text-[#48564e] hover:bg-black/5",
  dark: "bg-[#17201b] text-white hover:bg-black",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof styles;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
