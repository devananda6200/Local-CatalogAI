export const locationUnavailableMessages = {
  insecure:
    "Location requires a secure connection. Open this page on localhost or an HTTPS website.",
  unsupported:
    "This browser does not support location access. Search by area or town instead.",
} as const;

export function getLocationErrorMessage(code: number) {
  if (code === 1) {
    return "Location is blocked for this site. Allow location in your browser site settings, then try again.";
  }
  if (code === 2) {
    return "Your location could not be determined. Check that device location services are on, then try again.";
  }
  if (code === 3) {
    return "Finding your location took too long. Move to an area with a stronger signal and try again.";
  }
  return "Location access was unavailable. Search by area or town instead.";
}
