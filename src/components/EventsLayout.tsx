"use client";

import { useState } from "react";
import type { LumaEvent } from "@/lib/luma";
import EventCard from "./EventCard";
import EventDetail from "./EventDetail";

interface Props {
  grouped: [string, LumaEvent[]][];
}

export default function EventsLayout({ grouped }: Props) {
  const [selected, setSelected] = useState<LumaEvent | null>(null);

  return (
    <div className="flex h-[calc(100vh-61px)]">
      {/* Left: scrollable list */}
      <div className="w-full md:w-[420px] lg:w-[480px] overflow-y-auto flex-shrink-0 border-r border-gray-100">
        {grouped.length === 0 ? (
          <p className="px-6 py-12 text-sm text-gray-400 text-center">
            No upcoming events found in Prague.
          </p>
        ) : (
          grouped.map(([date, events]) => (
            <div key={date}>
              <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-6 py-2 border-b border-gray-100 z-10">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {date}
                </span>
              </div>
              {events.map((ev) => (
                <EventCard
                  key={ev.api_id}
                  event={ev}
                  selected={selected?.api_id === ev.api_id}
                  onClick={() =>
                    setSelected(selected?.api_id === ev.api_id ? null : ev)
                  }
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Right: detail panel (hidden on mobile when nothing selected) */}
      <div className="hidden md:flex flex-1 overflow-y-auto">
        {selected ? (
          <EventDetail event={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-8">
            <p className="text-2xl mb-2">🗓️</p>
            <p className="text-sm text-gray-400">Select an event to see details</p>
          </div>
        )}
      </div>

      {/* Mobile: full-screen overlay when selected */}
      {selected && (
        <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <EventDetail event={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
