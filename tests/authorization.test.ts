import { describe, expect, it } from "vitest";
import {
  assertBusinessOwnership,
  canManageBusiness,
} from "@/lib/auth/ownership";

describe("business authorization", () => {
  it("allows only the matching owner", () => {
    expect(canManageBusiness("owner-a", "owner-a")).toBe(true);
    expect(canManageBusiness("owner-a", "owner-b")).toBe(false);
  });
  it("throws for a different owner", () =>
    expect(() => assertBusinessOwnership("owner-a", "owner-b")).toThrow(
      /permission/i,
    ));
});
