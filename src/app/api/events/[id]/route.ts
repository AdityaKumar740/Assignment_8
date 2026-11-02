import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { serverEvents } from "@/lib/events"
import { auth } from "@/lib/auth"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  let authorization: string | undefined

  try {
    const token = await auth.api.getToken({
      headers: await headers(),
    })
    authorization = token.token ? `Bearer ${token.token}` : undefined
    console.log("Authorization for event GET:", authorization ?? "UNDEFINED")
  } catch (error) {
    console.log("Token error:", error instanceof Error ? error.message : error)
  }

  const { id } = await params
  let event = serverEvents.find((item) => item.id === id)
  if (!event && /^[a-f\d]{24}$/i.test(id)) {
    try {
      const response = await fetch(`http://localhost:5000/events/${id}`, {
        cache: "no-store",
        headers: authorization ? { Authorization: authorization } : {},
      })
      if (response.ok) {
        const remote = await response.json() as {
          _id?: string
          id?: string
          title: string
          description: string
          category: string
          location: string
          date: string
          image?: string
          thumbnail?: string
          attendees?: number
          organizer?: {
            name: string
            role: string
            avatar: string
          }
          createdByEmail?: string
          joinedByEmails?: unknown[]
        }
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
          createdByEmail: typeof remote.createdByEmail === "string" ? remote.createdByEmail : undefined,
          joinedByEmails: Array.isArray(remote.joinedByEmails)
            ? remote.joinedByEmails.map(String)
            : [],
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session?.user) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 })
  }

  const { id } = await params
  const { action } = await request.json() as { action?: string }

  if (action !== "join" && action !== "leave") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  try {
    const tokenResult = await auth.api.getToken({ headers: requestHeaders })
    let token = tokenResult?.token

    if (!token) {
      const signedResult = await auth.api.signJWT({
        body: {
          payload: {
            sub: session.user.id,
            email: session.user.email.toLowerCase(),
            name: session.user.name ?? "",
          },
        },
      })
      token = signedResult?.token
    }

    console.log("Generated JWT value:", token ?? "UNDEFINED")

    if (!token) {
      console.log("JWT generation returned no token for:", session.user.email)
      return NextResponse.json({ error: "Unable to generate JWT" }, { status: 401 })
    }

    console.log("Backend request URL:", `http://localhost:5000/events/${id}/${action}`)
    const authorization = `Bearer ${token}`
    console.log("Authorization sent to backend:", authorization)
    const response = await fetch(`http://localhost:5000/events/${id}/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({ email: session.user.email.toLowerCase() }),
    })

    const responseBody = await response.text()
    let data: unknown = null

    if (responseBody) {
      try {
        data = JSON.parse(responseBody)
      } catch {
        data = responseBody
      }
    }

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { error: "Event service is unavailable" },
      { status: 502 }
    )
  }
}
