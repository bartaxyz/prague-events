import Image from "next/image";
import type { LumaEvent } from "@/lib/luma";

interface Props {
  event: LumaEvent;
  selected: boolean;
  onClick: () => void;
}

export default function EventCard({ event, selected, onClick }: Props) {
  const start = new Date(event.start_at);
  const time = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Prague",
  });
  const host = event.hosts[0];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 flex gap-4 items-start border-b border-gray-50 transition-colors hover:bg-gray-50 ${
        selected ? "bg-gray-50" : "bg-white"
      }`}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
        {event.cover_url ? (
          <Image
            src={event.cover_url}
            alt={event.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            🗓️
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug line-clamp-2 text-gray-900">
          {event.name}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {time} · {event.geo_short}
        </p>
        {host && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {host.avatar_url && (
              <Image
                src={host.avatar_url}
                alt={host.name}
                width={14}
                height={14}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-gray-400 truncate">{host.name}</span>
          </div>
        )}
      </div>

      {/* Price badge */}
      <div className="flex-shrink-0 pt-0.5">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            event.is_free
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {event.is_free ? "Free" : event.price ? `$${event.price}` : "Paid"}
        </span>
      </div>
    </button>
  );
}
