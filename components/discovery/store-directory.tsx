"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  LocateFixed,
  LoaderCircle,
  MapPin,
  Search,
  ShieldCheck,
  Store,
} from "lucide-react";
import type { Business } from "@/lib/types";
import {
  getBusinessDistance,
  matchesBusinessSearch,
  type Coordinates,
} from "@/lib/discovery";
import {
  getLocationErrorMessage,
  locationUnavailableMessages,
} from "@/lib/geolocation";

export function StoreDirectory({ businesses }: { businesses: Business[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [locationError, setLocationError] = useState("");
  const categories = useMemo(
    () =>
      Array.from(
        new Set(businesses.map((business) => business.category)),
      ).sort(),
    [businesses],
  );
  const results = useMemo(() => {
    const filtered = businesses.filter((business) =>
      matchesBusinessSearch(business, query, category),
    );
    return filtered.sort((first, second) => {
      if (!location) return first.name.localeCompare(second.name);
      const firstDistance = getBusinessDistance(first, location);
      const secondDistance = getBusinessDistance(second, location);
      if (firstDistance === null && secondDistance === null)
        return first.name.localeCompare(second.name);
      if (firstDistance === null) return 1;
      if (secondDistance === null) return -1;
      return firstDistance - secondDistance;
    });
  }, [businesses, category, location, query]);

  async function useCurrentLocation() {
    setLocationError("");
    if (!window.isSecureContext) {
      setLocationStatus("error");
      setLocationError(locationUnavailableMessages.insecure);
      return;
    }
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError(locationUnavailableMessages.unsupported);
      return;
    }

    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        if (permission.state === "denied") {
          setLocationStatus("error");
          setLocationError(getLocationErrorMessage(1));
          return;
        }
      } catch {
        // Some browsers support geolocation without exposing permission state.
      }
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("ready");
        setLocationError("");
      },
      (error) => {
        setLocationStatus("error");
        setLocationError(getLocationErrorMessage(error.code));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
      <section className="relative -mt-8 rounded-[2rem] border border-black/5 bg-[#fffefa] p-4 shadow-[0_20px_70px_rgba(30,45,36,.12)] md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_14rem_auto]">
          <label className="relative block">
            <span className="sr-only">Search by business name or location</span>
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-black/40"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shop name, area, or category"
              className="min-h-12 w-full rounded-2xl border border-black/10 bg-white pr-4 pl-11 text-sm transition outline-none focus:border-[#176b4d] focus:ring-3 focus:ring-[#176b4d]/10"
            />
          </label>
          <label>
            <span className="sr-only">Business category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none focus:border-[#176b4d]"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locationStatus === "loading"}
            aria-describedby="location-help"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#176b4d] px-5 text-sm font-black text-white transition hover:bg-[#0d4d36] disabled:opacity-60"
          >
            {locationStatus === "loading" ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <LocateFixed size={17} />
            )}
            {locationStatus === "loading"
              ? "Finding you"
              : locationStatus === "ready"
                ? "Nearest first"
                : locationStatus === "error"
                  ? "Try location again"
                  : "Find near me"}
          </button>
        </div>
        <p
          id="location-help"
          className="mt-3 flex items-start gap-2 text-xs leading-5 text-black/50"
        >
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#176b4d]" />
          Your location is used only in this browser to sort nearby businesses.
          It is not saved to your profile.
        </p>
        {locationStatus === "ready" ? (
          <p className="mt-3 rounded-xl bg-[#e5efe7] px-4 py-3 text-sm font-semibold text-[#176b4d]">
            Location enabled. The closest businesses are shown first.
          </p>
        ) : null}
        {locationStatus === "error" ? (
          <div className="mt-3 rounded-xl bg-[#f9ebe6] px-4 py-3 text-sm text-[#7c3d31]">
            <p className="font-bold">{locationError}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-bold underline underline-offset-4">
                How to allow location
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5 leading-6">
                <li>Open the site controls beside the browser address.</li>
                <li>Set Location to Allow.</li>
                <li>Reload this page and select Try location again.</li>
              </ol>
            </details>
          </div>
        ) : null}
      </section>

      <div className="mt-10 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black tracking-[.16em] text-[#176b4d] uppercase">
            Local directory
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            {results.length} {results.length === 1 ? "business" : "businesses"}{" "}
            found
          </h2>
        </div>
        {locationStatus === "ready" ? (
          <button
            type="button"
            onClick={() => {
              setLocation(null);
              setLocationStatus("idle");
              setLocationError("");
            }}
            className="text-sm font-bold text-[#176b4d] underline underline-offset-4"
          >
            Clear location
          </button>
        ) : null}
      </div>

      {results.length ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((business) => {
            const distance = getBusinessDistance(business, location);
            return (
              <article
                key={business.id}
                className="group overflow-hidden rounded-[2rem] border border-black/5 bg-[#fffefa] shadow-[0_14px_44px_rgba(32,48,39,.07)]"
              >
                {business.coverImageUrl ? (
                  <Image
                    src={business.coverImageUrl}
                    alt=""
                    width={800}
                    height={480}
                    className="aspect-[5/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="grid aspect-[5/3] place-items-center bg-[#e3ece5] text-[#176b4d]">
                    <Store size={38} />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-black tracking-[.14em] text-[#176b4d] uppercase">
                          {business.category}
                        </p>
                        {business.sample ? (
                          <span className="rounded-full bg-[#f2e4c7] px-2 py-0.5 text-[10px] font-black tracking-wide text-[#72552a] uppercase">
                            Sample
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-2 text-xl font-black">
                        {business.name}
                      </h3>
                    </div>
                    {distance !== null ? (
                      <span className="shrink-0 rounded-full bg-[#e5efe7] px-2.5 py-1 text-xs font-black text-[#176b4d]">
                        {distance < 1
                          ? `${Math.round(distance * 1000)} m`
                          : `${distance.toFixed(1)} km`}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">
                    {business.description}
                  </p>
                  <p className="mt-4 flex items-start gap-2 text-sm text-black/55">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{business.address}</span>
                  </p>
                  <Link
                    href={`/shop/${business.slug}`}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#17201b] px-5 text-sm font-black text-white transition hover:bg-black"
                  >
                    View catalog <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-7 rounded-[2rem] border border-dashed border-black/15 bg-white/60 px-5 py-16 text-center">
          <Search className="mx-auto text-black/25" size={34} />
          <h3 className="mt-5 text-xl font-black">No matching businesses</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/50">
            Try a different business name, category, neighbourhood, or town.
          </p>
        </div>
      )}
    </div>
  );
}
