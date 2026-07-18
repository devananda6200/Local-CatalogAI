import type { Business } from "@/lib/types";

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
  business: Business,
  query: string,
  category = "all",
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchesCategory = category === "all" || business.category === category;
  if (!matchesCategory) return false;
  if (!normalizedQuery) return true;
  return [
    business.name,
    business.category,
    business.address,
    business.description,
  ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
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
