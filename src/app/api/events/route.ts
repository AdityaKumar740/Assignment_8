import { NextResponse } from "next/server"
import { serverEvents, type CommunityEvent, initialEvents } from "@/lib/events"

export async function GET() {
  try {
    const response = await fetch("http://localhost:5000/events", { cache: "no-store" })
    if (!response.ok) throw new Error("External events request failed")
    const remoteEvents = await response.json() as Array<Record<string, any>>
    const normalized: CommunityEvent[] = remoteEvents.map((event) => ({
      id: String(event._id ?? event.id),
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      date: event.date,
      image: event.image ?? event.thumbnail ?? event.thumbnailImageUrl ?? initialEvents[0].image,
      organizer: event.organizer ?? { name: "Alex Morgan", role: "Community Organizer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
      attendees: event.attendees ?? 0,
      createdBy: "demo-user",
    }))
    return NextResponse.json([...initialEvents, ...normalized])
  } catch {
    return NextResponse.json([...initialEvents, ...serverEvents.filter((event) => event.createdBy === "demo-user")])
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const event: CommunityEvent = {
    ...body,
    id: `${body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`,
    organizer: { name: "Alex Morgan", role: "Community Organizer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
    attendees: 0,
    createdBy: "demo-user",
  }
  serverEvents.push(event)
  return NextResponse.json(event, { status: 201 })
}
