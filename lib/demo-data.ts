import type { Business, CatalogData, Product } from "@/lib/types";

export const demoBusiness: Business = {
  id: "00000000-0000-4000-8000-000000000101",
  ownerId: "00000000-0000-4000-8000-000000000001",
  name: "Malabar Bakes",
  slug: "malabar-bakes",
  category: "Bakery and café",
  description:
    "Fresh Kerala inspired bakes, savouries, and small batch treats made in Kochi.",
  logoUrl: null,
  coverImageUrl:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=85",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  instagramUrl: "https://www.instagram.com/",
  address: "Sample location, Panampilly Nagar, Kochi, Kerala",
  latitude: 9.9667,
  longitude: 76.2999,
  openingHours: {
    Mon: "8 AM – 9 PM",
    Tue: "8 AM – 9 PM",
    Wed: "8 AM – 9 PM",
    Thu: "8 AM – 9 PM",
    Fri: "8 AM – 10 PM",
    Sat: "8 AM – 10 PM",
    Sun: "9 AM – 9 PM",
  },
  theme: "cafe",
  published: true,
  sample: true,
};

export const demoProducts: Product[] = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    businessId: demoBusiness.id,
    name: "Cardamom Bun",
    description: "A soft, golden bun finished with fragrant cardamom sugar.",
    price: 90,
    currency: "INR",
    category: "Sweet bakes",
    imageUrl:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",
    tags: ["baked fresh", "tea time"],
    dietaryLabels: ["Sample label"],
    available: true,
    sortOrder: 1,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    businessId: demoBusiness.id,
    name: "Malabar Veg Puff",
    description:
      "Flaky, layered pastry with a warmly spiced vegetable filling.",
    price: 65,
    currency: "INR",
    category: "Savouries",
    imageUrl:
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=85",
    tags: ["savoury", "quick bite"],
    dietaryLabels: [],
    available: true,
    sortOrder: 2,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000203",
    businessId: demoBusiness.id,
    name: "Coconut Tea Cake",
    description:
      "A tender loaf cake with a toasted coconut finish, made for sharing.",
    price: 280,
    currency: "INR",
    category: "Cakes",
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    tags: ["small batch", "sharing"],
    dietaryLabels: [],
    available: true,
    sortOrder: 3,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000204",
    businessId: demoBusiness.id,
    name: "Cold Coffee",
    description:
      "A smooth chilled coffee, blended to order and served over ice.",
    price: 160,
    currency: "INR",
    category: "Drinks",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    tags: ["chilled", "coffee"],
    dietaryLabels: [],
    available: true,
    sortOrder: 4,
    aiGenerated: false,
    sample: true,
  },
];

export const demoCatalog: CatalogData = {
  business: demoBusiness,
  products: demoProducts,
};

export function getDemoCatalogBySlug(slug: string) {
  if (slug !== demoBusiness.slug || !demoBusiness.published) return null;
  return {
    business: demoBusiness,
    products: demoProducts.filter((product) => product.available),
  };
}
