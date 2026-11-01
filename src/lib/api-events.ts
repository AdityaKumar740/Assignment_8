import type { CommunityEvent } from "@/lib/events"
import { initialEvents } from "@/lib/events"

const fallbackImage = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
const fallbackOrganizer = {
  name: "Community Organizer",
  role: "Community Connect",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
}

export async function fetchEvents(): Promise<CommunityEvent[]> {
  try {
    const response = await fetch("http://localhost:5000/events", { cache: "no-store" })
    if (!response.ok) throw new Error("Failed to fetch events")
    const remoteEvents = await response.json() as Array<Record<string, unknown>>

    const normalizedRemoteEvents = remoteEvents.map((event) => {
      const organizer = event.organizer && typeof event.organizer === "object"
        ? event.organizer as CommunityEvent["organizer"]
        : fallbackOrganizer

      return {
        id: String(event._id ?? event.id ?? ""),
        title: String(event.title ?? ""),
        description: String(event.description ?? ""),
        category: String(event.category ?? "Community Support"),
        location: String(event.location ?? ""),
        date: String(event.date ?? ""),
        image: String(event.image ?? event.thumbnail ?? fallbackImage),
        organizer,
        attendees: Number(event.attendees ?? 0),
      } satisfies CommunityEvent
    })

    const remoteKeys = new Set(
      normalizedRemoteEvents.map((event) =>
        `${event.title.toLowerCase().trim()}|${event.location.toLowerCase().trim()}`
      )
    )
    return [
      ...normalizedRemoteEvents,
      ...initialEvents.filter((event) =>
        !remoteKeys.has(`${event.title.toLowerCase().trim()}|${event.location.toLowerCase().trim()}`)
      ),
    ]
  } catch {
    const localCreatedEvents = typeof window === "undefined"
      ? []
      : JSON.parse(localStorage.getItem("cc-created-events") || "[]") as CommunityEvent[]
    const localKeys = new Set(
      localCreatedEvents.map((event) =>
        `${event.title.toLowerCase().trim()}|${event.location.toLowerCase().trim()}`
      )
    )
    return [
      ...localCreatedEvents,
      ...initialEvents.filter((event) =>
        !localKeys.has(`${event.title.toLowerCase().trim()}|${event.location.toLowerCase().trim()}`)
      ),
    ]
  }
}

export async function fetchEvent(id: string): Promise<CommunityEvent | null> {
  const demoEvent = initialEvents.find((event) => event.id === id)
  const localCreatedEvents = typeof window === "undefined"
    ? []
    : JSON.parse(localStorage.getItem("cc-created-events") || "[]") as CommunityEvent[]
  const localEvent = localCreatedEvents.find((event) => event.id === id)
  try {
    const response = await fetch(`http://localhost:5000/events/${id}`, { cache: "no-store" })
    if (response.ok) {
      const event = await response.json() as Record<string, unknown>
      const organizer = event.organizer && typeof event.organizer === "object"
        ? event.organizer as CommunityEvent["organizer"]
        : fallbackOrganizer

      return {
        id: String(event._id ?? event.id ?? id),
        title: String(event.title ?? ""),
        description: String(event.description ?? ""),
        category: String(event.category ?? "Community Support"),
        location: String(event.location ?? ""),
        date: String(event.date ?? ""),
        image: String(event.image ?? event.thumbnail ?? fallbackImage),
        organizer,
        attendees: Number(event.attendees ?? 0),
        createdBy: "demo-user",
      }
    }
    return demoEvent ?? null
  } catch {
    // Demo event details remain available when the backend is offline.
    return localEvent ?? demoEvent ?? null
  }
}
