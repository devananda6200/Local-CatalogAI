export type ThemeName = "minimal" | "cafe" | "boutique";

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagramUrl: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  openingHours: Record<string, string>;
  theme: ThemeName;
  published: boolean;
  sample?: boolean;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number | null;
  currency: string;
  category: string;
  imageUrl: string;
  tags: string[];
  dietaryLabels: string[];
  available: boolean;
  sortOrder: number;
  aiGenerated: boolean;
  sample?: boolean;
}

export interface CatalogData {
  business: Business;
  products: Product[];
}

export interface DiscoveryBusiness extends Business {
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
  productCount: number;
  productCategories: string[];
  prices: number[];
}

export interface AiProductSuggestion {
  suggestedName: string;
  description: string;
  category: string;
  tags: string[];
  dietaryLabels: string[];
  confidenceNotes: string;
}
