import { describe, expect, it } from "vitest";
import {
  getLocationErrorMessage,
  locationUnavailableMessages,
} from "@/lib/geolocation";

describe("location access messages", () => {
  it("explains how to recover from denied permission", () => {
    expect(getLocationErrorMessage(1)).toContain("browser site settings");
  });

  it("distinguishes unavailable and timed out positions", () => {
    expect(getLocationErrorMessage(2)).toContain("location services");
    expect(getLocationErrorMessage(3)).toContain("took too long");
  });

  it("requires a secure context", () => {
    expect(locationUnavailableMessages.insecure).toContain("HTTPS");
  });
});
