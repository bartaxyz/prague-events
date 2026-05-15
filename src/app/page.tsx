import { getPragueEvents, groupByDate } from "@/lib/luma";
import EventsLayout from "@/components/EventsLayout";

export default async function Home() {
  const events = await getPragueEvents();
  const grouped = groupByDate(events);

  return (
    <main className="min-h-screen">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Prague Events</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Upcoming events in Prague via{" "}
            <a
              href="https://lu.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Luma
            </a>
          </p>
        </div>
        <span className="text-xs text-gray-400">{events.length} events</span>
      </header>
      <EventsLayout grouped={grouped} />
    </main>
  );
}
