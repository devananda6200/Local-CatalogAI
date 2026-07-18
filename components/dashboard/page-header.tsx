import type { ReactNode } from "react";
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold tracking-[.18em] text-[#176b4d] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-black tracking-[-.04em] md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68756d]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
