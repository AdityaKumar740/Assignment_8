import { NextResponse } from "next/server"
import { serverEvents } from "@/lib/events"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let event = serverEvents.find((item) => item.id === id)
  if (!event && /^[a-f\d]{24}$/i.test(id)) {
    try {
      const response = await fetch(`http://localhost:5000/events/${id}`, { cache: "no-store" })
      if (response.ok) {
        const remote = await response.json() as Record<string, any>
        event = {
          id: String(remote._id ?? remote.id ?? id),
          title: remote.title,
          description: remote.description,
          category: remote.category,
          location: remote.location,
          date: remote.date,
          image: remote.image ?? remote.thumbnail ?? "",
          organizer: remote.organizer ?? { name: "Alex Morgan", role: "Community Organizer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
          attendees: remote.attendees ?? 0,
          createdBy: "demo-user",
        }
      }
    } catch {}
  }
  return event ? NextResponse.json(event) : NextResponse.json({ error: "Event not found" }, { status: 404 })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = serverEvents.findIndex((item) => item.id === id)
  if (index === -1) return NextResponse.json({ error: "Event not found" }, { status: 404 })
  serverEvents.splice(index, 1)
  return NextResponse.json({ success: true })
}
