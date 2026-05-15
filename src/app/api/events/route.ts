import { NextResponse } from "next/server";

export const revalidate = 0;

// Prague coordinates + city name. Both params sent so Luma can't fall back to server IP.
const LUMA_URL =
  "https://api.lu.ma/discover/get-paginated-events" +
  "?geo_city=Prague&geo_latitude=50.0755&geo_longitude=14.4378&pagination_limit=100";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEntry(e: any, now: Date) {
  const geo = e.event?.geo_address_info ?? {};
  // Hard filter: only Czech Republic events
  if (geo.country_code && geo.country_code !== "CZ") return null;
  if (!e.event?.start_at || new Date(e.event.start_at) < now) return null;

  return {
    api_id: e.api_id,
    name: e.event.name,
    start_at: e.event.start_at,
    end_at: e.event.end_at,
    cover_url: e.event.cover_url ?? null,
    url: e.event.url,
    geo_short: geo.short_address || geo.city_state || "Prague",
    is_free: e.ticket_info?.is_free ?? true,
    price: e.ticket_info?.price ?? null,
    hosts: e.hosts ?? [],
    guest_count: e.guest_count ?? 0,
    luma_url: `https://lu.ma/${e.event.url}`,
  };
}

export async function GET() {
  try {
    const res = await fetch(LUMA_URL, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ events: [] });

    const data = await res.json();
    const now = new Date();

    const events = (data.entries ?? [])
      .map((e: unknown) => mapEntry(e, now))
      .filter(Boolean)
      .sort(
        (a: { start_at: string }, b: { start_at: string }) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
