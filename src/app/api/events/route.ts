import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { serverEvents, type CommunityEvent, initialEvents } from "@/lib/events"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    let authorization: string | undefined

    try {
      const tokenResult = await auth.api.getToken({ headers: await headers() })
      if (tokenResult?.token) authorization = `Bearer ${tokenResult.token}`
      console.log("Authorization for events GET:", authorization ?? "UNDEFINED")
    } catch (error) {
      console.log("Events GET token error:", error instanceof Error ? error.message : error)
    }

    const response = await fetch("http://localhost:5000/events", {
      cache: "no-store",
      headers: authorization ? { Authorization: authorization } : {},
    })
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
      createdByEmail: typeof event.createdByEmail === "string" ? event.createdByEmail : undefined,
      joinedByEmails: Array.isArray(event.joinedByEmails)
        ? event.joinedByEmails.map(String)
        : [],
    }))
    return NextResponse.json([...normalized, ...initialEvents])
  } catch {
    return NextResponse.json([...initialEvents, ...serverEvents.filter((event) => event.createdBy === "demo-user")])
  }
}

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  try {
    const tokenResult = await auth.api.getToken({ headers: requestHeaders })
    const token = tokenResult?.token
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch("http://localhost:5000/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...body,
        createdByEmail: session.user.email.toLowerCase(),
      }),
    })

    const responseBody = await response.text()
    const data = responseBody ? JSON.parse(responseBody) : null
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Create event token error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ message: "Event service is unavailable" }, { status: 502 })
  }
}
