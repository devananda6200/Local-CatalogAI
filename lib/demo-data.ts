import type { Business, CatalogData, Product } from "@/lib/types";

const sampleOwnerId = "00000000-0000-4000-8000-000000000001";

export const demoBusiness: Business = {
  id: "00000000-0000-4000-8000-000000000101",
  ownerId: sampleOwnerId,
  name: "Malabar Bakes",
  slug: "malabar-bakes",
  category: "Bakery and cafe",
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
    Mon: "8 AM to 9 PM",
    Tue: "8 AM to 9 PM",
    Wed: "8 AM to 9 PM",
    Thu: "8 AM to 9 PM",
    Fri: "8 AM to 10 PM",
    Sat: "8 AM to 10 PM",
    Sun: "9 AM to 9 PM",
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

export const boutiqueBusiness: Business = {
  id: "00000000-0000-4000-8000-000000000301",
  ownerId: sampleOwnerId,
  name: "Pepper and Loom",
  slug: "pepper-and-loom",
  category: "Boutique",
  description:
    "Easy handloom clothing and artisan accessories inspired by the colours of the Malabar coast.",
  logoUrl: null,
  coverImageUrl: "/demo/pepper-loom-boutique.webp",
  phone: "+91 98470 11223",
  whatsapp: "919847011223",
  instagramUrl: "https://www.instagram.com/",
  address: "Sample location, Princess Street, Fort Kochi, Kerala",
  latitude: 9.9658,
  longitude: 76.2421,
  openingHours: {
    Mon: "10 AM to 7 PM",
    Tue: "10 AM to 7 PM",
    Wed: "10 AM to 7 PM",
    Thu: "10 AM to 7 PM",
    Fri: "10 AM to 8 PM",
    Sat: "10 AM to 8 PM",
    Sun: "11 AM to 6 PM",
  },
  theme: "boutique",
  published: true,
  sample: true,
};

export const boutiqueProducts: Product[] = [
  {
    id: "00000000-0000-4000-8000-000000000311",
    businessId: boutiqueBusiness.id,
    name: "Indigo Handloom Dress",
    description:
      "A relaxed cotton dress with a clean silhouette and handloom texture.",
    price: 2450,
    currency: "INR",
    category: "Clothing",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    tags: ["handloom", "cotton", "small batch"],
    dietaryLabels: [],
    available: true,
    sortOrder: 1,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000312",
    businessId: boutiqueBusiness.id,
    name: "Block Print Scarf",
    description:
      "A lightweight cotton scarf with a versatile hand printed pattern.",
    price: 850,
    currency: "INR",
    category: "Accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85",
    tags: ["hand printed", "lightweight", "gift idea"],
    dietaryLabels: [],
    available: true,
    sortOrder: 2,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000313",
    businessId: boutiqueBusiness.id,
    name: "Coir Sling Bag",
    description:
      "A compact woven sling bag with a cotton lining and adjustable strap.",
    price: 1200,
    currency: "INR",
    category: "Bags",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    tags: ["woven", "everyday", "locally made"],
    dietaryLabels: [],
    available: true,
    sortOrder: 3,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000314",
    businessId: boutiqueBusiness.id,
    name: "Brass Leaf Earrings",
    description:
      "Lightweight statement earrings with a softly brushed brass finish.",
    price: 780,
    currency: "INR",
    category: "Jewellery",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
    tags: ["artisan made", "brass", "lightweight"],
    dietaryLabels: [],
    available: true,
    sortOrder: 4,
    aiGenerated: false,
    sample: true,
  },
];

export const restaurantBusiness: Business = {
  id: "00000000-0000-4000-8000-000000000401",
  ownerId: sampleOwnerId,
  name: "Backwater Table",
  slug: "backwater-table",
  category: "Restaurant",
  description:
    "A relaxed Kerala kitchen serving coastal favourites, seasonal vegetables, and warm local hospitality.",
  logoUrl: null,
  coverImageUrl: "/demo/backwater-table-restaurant.webp",
  phone: "+91 98950 22446",
  whatsapp: "919895022446",
  instagramUrl: "https://www.instagram.com/",
  address: "Sample location, Marine Drive, Ernakulam, Kerala",
  latitude: 9.9816,
  longitude: 76.2756,
  openingHours: {
    Mon: "12 PM to 10 PM",
    Tue: "12 PM to 10 PM",
    Wed: "12 PM to 10 PM",
    Thu: "12 PM to 10 PM",
    Fri: "12 PM to 11 PM",
    Sat: "12 PM to 11 PM",
    Sun: "12 PM to 10 PM",
  },
  theme: "cafe",
  published: true,
  sample: true,
};

export const restaurantProducts: Product[] = [
  {
    id: "00000000-0000-4000-8000-000000000411",
    businessId: restaurantBusiness.id,
    name: "Kerala Sadhya",
    description:
      "A generous banana leaf meal with rice and a changing selection of traditional vegetarian sides.",
    price: 320,
    currency: "INR",
    category: "Meals",
    imageUrl: "/demo/backwater-table-restaurant.webp",
    tags: ["Kerala classic", "banana leaf", "lunch"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    sortOrder: 1,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000412",
    businessId: restaurantBusiness.id,
    name: "Karimeen Pollichathu",
    description:
      "Pearl spot fish cooked in a spiced masala and wrapped in banana leaf.",
    price: 480,
    currency: "INR",
    category: "Coastal specials",
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=85",
    tags: ["coastal", "banana leaf", "house special"],
    dietaryLabels: [],
    available: true,
    sortOrder: 2,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000413",
    businessId: restaurantBusiness.id,
    name: "Appam and Vegetable Stew",
    description:
      "Soft lace edged appams served with a gentle coconut milk vegetable stew.",
    price: 260,
    currency: "INR",
    category: "Comfort food",
    imageUrl:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=85",
    tags: ["coconut", "mild", "Kerala favourite"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    sortOrder: 3,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000414",
    businessId: restaurantBusiness.id,
    name: "Tender Coconut Pudding",
    description:
      "A cool, delicate pudding with tender coconut pieces and a clean finish.",
    price: 190,
    currency: "INR",
    category: "Desserts",
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
    tags: ["chilled", "coconut", "house made"],
    dietaryLabels: ["Vegetarian"],
    available: true,
    sortOrder: 4,
    aiGenerated: false,
    sample: true,
  },
];

export const homestayBusiness: Business = {
  id: "00000000-0000-4000-8000-000000000501",
  ownerId: sampleOwnerId,
  name: "Mango Courtyard Homestay",
  slug: "mango-courtyard-homestay",
  category: "Homestay",
  description:
    "A quiet heritage home with garden rooms, local breakfasts, and thoughtful Fort Kochi experiences.",
  logoUrl: null,
  coverImageUrl: "/demo/mango-courtyard-homestay.webp",
  phone: "+91 97460 33557",
  whatsapp: "919746033557",
  instagramUrl: "https://www.instagram.com/",
  address: "Sample location, Mattancherry, Kochi, Kerala",
  latitude: 9.9582,
  longitude: 76.2599,
  openingHours: {
    Reception: "7 AM to 10 PM",
    CheckIn: "From 2 PM",
    CheckOut: "Before 11 AM",
  },
  theme: "minimal",
  published: true,
  sample: true,
};

export const homestayProducts: Product[] = [
  {
    id: "00000000-0000-4000-8000-000000000511",
    businessId: homestayBusiness.id,
    name: "Garden Room Stay",
    description:
      "A calm double room opening onto the tropical courtyard. Sample nightly price shown.",
    price: 2800,
    currency: "INR",
    category: "Rooms",
    imageUrl: "/demo/mango-courtyard-homestay.webp",
    tags: ["two guests", "garden view", "nightly stay"],
    dietaryLabels: [],
    available: true,
    sortOrder: 1,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000512",
    businessId: homestayBusiness.id,
    name: "Heritage Suite Stay",
    description:
      "A spacious heritage room with timber details and a private sitting area. Sample nightly price shown.",
    price: 4200,
    currency: "INR",
    category: "Rooms",
    imageUrl:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85",
    tags: ["two guests", "heritage room", "nightly stay"],
    dietaryLabels: [],
    available: true,
    sortOrder: 2,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000513",
    businessId: homestayBusiness.id,
    name: "Kerala Breakfast",
    description:
      "A fresh home style breakfast with a rotating local menu and seasonal fruit.",
    price: 350,
    currency: "INR",
    category: "Food",
    imageUrl:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=85",
    tags: ["home cooked", "morning", "prebook"],
    dietaryLabels: [],
    available: true,
    sortOrder: 3,
    aiGenerated: false,
    sample: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000514",
    businessId: homestayBusiness.id,
    name: "Fort Kochi Heritage Walk",
    description:
      "A small guided walk through historic streets, markets, and waterfront landmarks.",
    price: 900,
    currency: "INR",
    category: "Experiences",
    imageUrl:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85",
    tags: ["two hours", "local guide", "prebook"],
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

export const demoCatalogs: CatalogData[] = [
  demoCatalog,
  { business: boutiqueBusiness, products: boutiqueProducts },
  { business: restaurantBusiness, products: restaurantProducts },
  { business: homestayBusiness, products: homestayProducts },
];

export const demoBusinesses = demoCatalogs.map((catalog) => catalog.business);

export function getDemoCatalogBySlug(slug: string) {
  const catalog = demoCatalogs.find(
    (item) => item.business.slug === slug && item.business.published,
  );
  if (!catalog) return null;
  return {
    business: catalog.business,
    products: catalog.products.filter((product) => product.available),
  };
}
