"use client";

import { useState, useEffect } from "react";
import type { LumaEvent } from "@/lib/luma";
import { groupByDate } from "@/lib/luma";
import EventCard from "./EventCard";
import EventDetail from "./EventDetail";

export default function EventsLayout() {
  const [events, setEvents] = useState<LumaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LumaEvent | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const grouped = groupByDate(events);

  return (
    <div className="flex h-[calc(100vh-61px)]">
      {/* Left: scrollable list */}
      <div className="w-full md:w-[420px] lg:w-[480px] overflow-y-auto flex-shrink-0 border-r border-gray-100">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-2 py-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <p className="px-6 py-12 text-sm text-gray-400 text-center">
            No upcoming events found in Prague.
          </p>
        ) : (
          grouped.map(([date, evs]) => (
            <div key={date}>
              <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-6 py-2 border-b border-gray-100 z-10">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {date}
                </span>
              </div>
              {evs.map((ev) => (
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

      {/* Right: detail panel */}
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

      {/* Mobile: full-screen overlay */}
      {selected && (
        <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <EventDetail event={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
