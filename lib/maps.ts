export function getDirectionsUrl(input: {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
}) {
  const hasCoordinates =
    typeof input.latitude === "number" &&
    Number.isFinite(input.latitude) &&
    typeof input.longitude === "number" &&
    Number.isFinite(input.longitude);
  const destination = hasCoordinates
    ? `${input.latitude},${input.longitude}`
    : input.address?.trim();

  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
