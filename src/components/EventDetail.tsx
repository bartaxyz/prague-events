import Image from "next/image";
import type { LumaEvent } from "@/lib/luma";

interface Props {
  event: LumaEvent;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: Props) {
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);

  const dateStr = start.toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Europe/Prague",
  });
  const startTime = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Prague",
  });
  const endTime = end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Prague",
  });

  return (
    <div className="flex flex-col w-full">
      {/* Mobile close bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      {/* Cover image */}
      {event.cover_url && (
        <div className="w-full aspect-video relative bg-gray-100">
          <Image
            src={event.cover_url}
            alt={event.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 flex flex-col gap-5 max-w-xl">
        {/* Title & price */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold leading-snug">{event.name}</h2>
            <span
              className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium mt-0.5 ${
                event.is_free
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {event.is_free ? "Free" : event.price ? `$${event.price}` : "Paid"}
            </span>
          </div>
        </div>

        {/* Date & time */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">📅</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">🕐</span>
            <span>
              {startTime} – {endTime}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-base">📍</span>
          <span>{event.geo_short}</span>
        </div>

        {/* Hosts */}
        {event.hosts.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Hosted by
            </p>
            <div className="flex flex-col gap-2">
              {event.hosts.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  {h.avatar_url ? (
                    <Image
                      src={h.avatar_url}
                      alt={h.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200" />
                  )}
                  <span className="text-sm text-gray-700">{h.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendees */}
        {event.guest_count > 0 && (
          <p className="text-sm text-gray-400">
            {event.guest_count} attending
          </p>
        )}

        {/* CTA */}
        <a
          href={event.luma_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
        >
          View on Luma →
        </a>
      </div>
    </div>
  );
}
