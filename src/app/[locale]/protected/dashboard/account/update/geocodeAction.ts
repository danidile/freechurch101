"use server";

import { GeocodeResult } from "./geocodeTypes";

type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  suburb?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
};

type NominatimItem = {
  display_name?: string;
  address?: NominatimAddress;
};

/**
 * Server-side proxy to Nominatim (OpenStreetMap) for address autocomplete.
 * Free, no API key. Runs on the server so we can set a proper User-Agent
 * (required by the OSM usage policy) and keep the browser out of it.
 * Callers should debounce to respect the ~1 request/second policy.
 */
export async function geocodeAddress(query: string): Promise<GeocodeResult[]> {
  const q = query?.trim() ?? "";
  if (q.length < 3) return [];

  const url =
    "https://nominatim.openstreetmap.org/search" +
    "?format=jsonv2&addressdetails=1&limit=5&countrycodes=it&q=" +
    encodeURIComponent(q);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FreeChurch101/1.0 (support@freechurch101.com)",
        "Accept-Language": "it",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = (await res.json()) as NominatimItem[];

    return data.map((item) => {
      const a = item.address ?? {};
      const road = a.road ?? a.pedestrian ?? a.suburb ?? "";
      const house = a.house_number ? ` ${a.house_number}` : "";
      const city = a.city ?? a.town ?? a.village ?? a.municipality ?? "";
      const province = a.county ?? a.state ?? "";
      const cap = a.postcode ?? "";

      return {
        label: item.display_name ?? `${road}${house}`.trim(),
        address: `${road}${house}`.trim(),
        city,
        province,
        cap,
      };
    });
  } catch {
    return [];
  }
}
