"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={23} />
        </span>
        <h1 className="mt-5 text-2xl font-black">
          We could not load your workspace.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#68756d]">
          Check your connection and Supabase setup, then try again.
        </p>
        <Button type="button" onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
