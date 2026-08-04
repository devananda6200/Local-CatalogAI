import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#344239]">
      <span>{label}</span>
      <input
        className={cn(
          "min-h-12 rounded-2xl border border-black/10 bg-white px-4 text-base font-normal shadow-sm transition focus:border-[#176b4d]",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function TextareaField({
  label,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#344239]">
      <span>{label}</span>
      <textarea
        className={cn(
          "min-h-28 resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-base font-normal shadow-sm transition focus:border-[#176b4d]",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
