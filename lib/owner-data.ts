import { cache } from "react";
import { redirect } from "next/navigation";
import { mapBusiness, mapProduct } from "@/lib/catalog";
import { demoBusiness, demoProducts } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Business, Product } from "@/lib/types";

export interface OwnerWorkspace {
  configured: boolean;
  userId: string | null;
  business: Business | null;
  products: Product[];
}

export const getOwnerWorkspace = cache(async (): Promise<OwnerWorkspace> => {
  if (!hasSupabaseEnv) {
    return {
      configured: false,
      userId: demoBusiness.ownerId,
      business: demoBusiness,
      products: demoProducts,
    };
  }

  const supabase = await createClient();
  const { data: authData } = (await supabase?.auth.getUser()) || {
    data: { user: null },
  };
  if (!authData.user) redirect("/sign-in");

  const { data: businessRow, error: businessError } = await supabase!
    .from("businesses")
    .select("*")
    .eq("owner_id", authData.user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (businessError) throw new Error("Unable to load your business workspace.");
  if (!businessRow) {
    return {
      configured: true,
      userId: authData.user.id,
      business: null,
      products: [],
    };
  }

  const { data: productRows, error: productsError } = await supabase!
    .from("products")
    .select("*")
    .eq("business_id", businessRow.id)
    .order("sort_order")
    .order("created_at");

  if (productsError) throw new Error("Unable to load your products.");
  return {
    configured: true,
    userId: authData.user.id,
    business: mapBusiness(businessRow),
    products: (productRows || []).map(mapProduct),
  };
});

export async function getOwnedProduct(productId: string) {
  const workspace = await getOwnerWorkspace();
  return workspace.products.find((product) => product.id === productId) || null;
}
