export interface LumaEvent {
  api_id: string;
  name: string;
  start_at: string;
  end_at: string;
  cover_url: string | null;
  url: string;
  geo_short: string;
  is_free: boolean;
  price: number | null;
  hosts: { name: string; avatar_url: string | null }[];
  guest_count: number;
  luma_url: string;
}

interface LumaApiEntry {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    end_at: string;
    cover_url: string | null;
    url: string;
    geo_address_info?: {
      short_address?: string;
      city_state?: string;
    };
  };
  ticket_info?: {
    is_free?: boolean;
    price?: number | null;
  };
  hosts?: { name: string; avatar_url: string | null }[];
  guest_count?: number;
}

export async function getPragueEvents(): Promise<LumaEvent[]> {
  const url =
    "https://api.lu.ma/discover/get-paginated-events?geo_city=Prague&pagination_limit=100";

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return [];

  const data = await res.json();
  const now = new Date();

  const events: LumaEvent[] = (data.entries as LumaApiEntry[])
    .filter((e) => new Date(e.event.start_at) >= now)
    .map((e) => ({
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
    }));

  return events.sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );
}

export function groupByDate(events: LumaEvent[]): [string, LumaEvent[]][] {
  const map = new Map<string, LumaEvent[]>();
  for (const ev of events) {
    const key = new Date(ev.start_at).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Prague",
    });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return Array.from(map.entries());
}
