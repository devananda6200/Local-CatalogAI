"use client";

import { useState } from "react";
import { Check, Eye, Palette } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThemeRenderer } from "@/components/catalog/theme-renderer";
import { createClient } from "@/lib/supabase/client";
import type { Business, Product, ThemeName } from "@/lib/types";

const themes: {
  id: ThemeName;
  name: string;
  description: string;
  colors: string[];
}[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Airy, crisp, and product focused.",
    colors: ["#f7f8f6", "#e3ece5", "#176b4d"],
  },
  {
    id: "cafe",
    name: "Café",
    description: "Warm, welcoming, and full of character.",
    colors: ["#efe5d3", "#30231c", "#f3b67a"],
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "Editorial, refined, and premium.",
    colors: ["#f5f0ea", "#2e2926", "#8c6652"],
  },
];

export function ThemeSelector({
  business,
  products,
  configured,
}: {
  business: Business;
  products: Product[];
  configured: boolean;
}) {
  const [selected, setSelected] = useState<ThemeName>(business.theme);
  const [previewing, setPreviewing] = useState(false);
  async function save() {
    const supabase = createClient();
    if (configured && supabase) {
      const { error } = await supabase
        .from("businesses")
        .update({ theme: selected })
        .eq("id", business.id);
      if (error) return toast.error(error.message);
    } else localStorage.setItem("localcatalog-demo-theme", selected);
    toast.success(
      `${themes.find((theme) => theme.id === selected)?.name} theme saved`,
    );
  }
  if (previewing)
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
        <div className="fixed top-4 right-4 z-[60] flex gap-2 rounded-full bg-white p-1.5 shadow-xl">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPreviewing(false)}
          >
            Close preview
          </Button>
          <Button type="button" onClick={save}>
            Use this theme
          </Button>
        </div>
        <ThemeRenderer
          catalog={{
            business: { ...business, theme: selected },
            products,
          }}
          publicUrl={`/shop/${business.slug}`}
        />
      </div>
    );
  return (
    <div className="mt-8">
      <div className="grid gap-5 md:grid-cols-3">
        {themes.map((theme) => (
          <button
            type="button"
            key={theme.id}
            onClick={() => setSelected(theme.id)}
            className={`rounded-[2rem] border-2 bg-[#fffefa] p-4 text-left transition ${selected === theme.id ? "border-[#176b4d] shadow-[0_14px_40px_rgba(23,107,77,.12)]" : "border-transparent hover:border-black/10"}`}
          >
            <div
              className="relative grid h-48 place-items-center overflow-hidden rounded-2xl"
              style={{ background: theme.colors[0] }}
            >
              <div
                className="w-4/5 rounded-xl p-3 shadow-lg"
                style={{ background: theme.colors[1] }}
              >
                <div
                  className="h-14 rounded-lg"
                  style={{ background: theme.colors[2] }}
                />
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className="h-9 rounded-md bg-white/80" />
                  ))}
                </div>
              </div>
              {selected === theme.id ? (
                <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-[#176b4d] text-white">
                  <Check size={15} />
                </span>
              ) : null}
            </div>
            <h2 className="mt-5 text-xl font-black">{theme.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[#68756d]">
              {theme.description}
            </p>
            <div className="mt-4 flex gap-1.5">
              {theme.colors.map((color) => (
                <span
                  key={color}
                  className="size-5 rounded-full border border-black/10"
                  style={{ background: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setPreviewing(true)}
        >
          <Eye size={16} /> Preview theme
        </Button>
        <Button type="button" onClick={save}>
          <Palette size={16} /> Save theme
        </Button>
      </div>
    </div>
  );
}
