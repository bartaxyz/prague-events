import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(
      "https://api.lu.ma/discover/get-paginated-events?geo_city=Prague&pagination_limit=100",
      { cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ events: [] });

    const data = await res.json();
    const now = new Date();

    const events = (data.entries ?? [])
      .filter((e: {event?: {start_at?: string}}) => e.event?.start_at && new Date(e.event.start_at) >= now)
      .map((e: {
        api_id: string;
        event: {
          name: string;
          start_at: string;
          end_at: string;
          cover_url: string | null;
          url: string;
          geo_address_info?: { short_address?: string; city_state?: string };
        };
        ticket_info?: { is_free?: boolean; price?: number | null };
        hosts?: { name: string; avatar_url: string | null }[];
        guest_count?: number;
      }) => ({
        api_id: e.api_id,
        name: e.event.name,
        start_at: e.event.start_at,
        end_at: e.event.end_at,
        cover_url: e.event.cover_url,
        url: e.event.url,
        geo_short:
          e.event.geo_address_info?.short_address ||
          e.event.geo_address_info?.city_state ||
          "Prague",
        is_free: e.ticket_info?.is_free ?? true,
        price: e.ticket_info?.price ?? null,
        hosts: e.hosts ?? [],
        guest_count: e.guest_count ?? 0,
        luma_url: `https://lu.ma/${e.event.url}`,
      }))
      .sort(
        (a: {start_at: string}, b: {start_at: string}) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
