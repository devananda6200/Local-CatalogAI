import type { Business, DiscoveryBusiness, Product } from "@/lib/types";

export type PriceBand = "all" | "under500" | "500to2000" | "over2000";
export type DiscoverySort =
  "relevance" | "distance" | "name" | "priceLow" | "priceHigh";

type DiscoveryProduct = Pick<
  Product,
  "businessId" | "price" | "currency" | "category"
>;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function getDistanceInKm(from: Coordinates, to: Coordinates) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const firstLatitude = toRadians(from.latitude);
  const secondLatitude = toRadians(to.latitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function matchesBusinessSearch(
  business: Business | DiscoveryBusiness,
  query: string,
  category = "all",
  productCategory = "all",
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchesCategory = category === "all" || business.category === category;
  const productCategories =
    "productCategories" in business ? business.productCategories : [];
  const matchesProductCategory =
    productCategory === "all" || productCategories.includes(productCategory);
  if (!matchesCategory || !matchesProductCategory) return false;
  if (!normalizedQuery) return true;
  return [
    business.name,
    business.category,
    business.address,
    business.description,
    ...productCategories,
  ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
}

export function buildDiscoveryBusiness(
  business: Business,
  products: DiscoveryProduct[],
): DiscoveryBusiness {
  const availablePrices = products
    .map((product) => product.price)
    .filter((price): price is number => price !== null)
    .sort((first, second) => first - second);
  return {
    ...business,
    minPrice: availablePrices[0] ?? null,
    maxPrice: availablePrices.at(-1) ?? null,
    currency: products.find((product) => product.currency)?.currency || "INR",
    productCount: products.length,
    productCategories: Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    ).sort(),
    prices: availablePrices,
  };
}

export function matchesPriceBand(
  business: DiscoveryBusiness,
  priceBand: PriceBand,
) {
  if (priceBand === "all") return true;
  if (!business.prices.length) return false;
  if (priceBand === "under500")
    return business.prices.some((price) => price < 500);
  if (priceBand === "500to2000")
    return business.prices.some((price) => price >= 500 && price <= 2000);
  return business.prices.some((price) => price > 2000);
}

export function sortDiscoveryBusinesses(
  businesses: DiscoveryBusiness[],
  sort: DiscoverySort,
  location: Coordinates | null,
) {
  return [...businesses].sort((first, second) => {
    if (sort === "distance" && location) {
      const firstDistance = getBusinessDistance(first, location);
      const secondDistance = getBusinessDistance(second, location);
      if (firstDistance === null && secondDistance === null)
        return first.name.localeCompare(second.name);
      if (firstDistance === null) return 1;
      if (secondDistance === null) return -1;
      return firstDistance - secondDistance;
    }
    if (sort === "priceLow" || sort === "priceHigh") {
      if (first.minPrice === null && second.minPrice === null)
        return first.name.localeCompare(second.name);
      if (first.minPrice === null) return 1;
      if (second.minPrice === null) return -1;
      return sort === "priceLow"
        ? first.minPrice - second.minPrice
        : second.minPrice - first.minPrice;
    }
    return first.name.localeCompare(second.name);
  });
}

export function getBusinessDistance(
  business: Business,
  location: Coordinates | null,
) {
  if (!location || business.latitude === null || business.longitude === null)
    return null;
  return getDistanceInKm(location, {
    latitude: business.latitude,
    longitude: business.longitude,
  });
}
