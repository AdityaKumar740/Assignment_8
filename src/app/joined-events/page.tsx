"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, LogOut, MapPin } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"
import { PrivateRoute } from "@/components/private-route"
import { useAuth } from "@/lib/auth-provider"

function JoinedEventsContent() {
  const { user } = useAuth()
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)

  const leaveEvent = async (id: string) => {
    if (!user?.email) return
    try {
      const res = await fetch(`/api/events/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "leave" }) })
      if (!res.ok) throw new Error()
      setEvents((current) => current.filter((event) => event.id !== id))
      toast.success("You’ve left the event")
    } catch { toast.error("Couldn’t leave the event") }
  }

  useEffect(() => {
    const load = () => {
      if (!user?.email) return
      const email = user.email.toLowerCase()
      fetchEvents().then((items) => setEvents(items.filter((event) => event.joinedByEmails?.some((joinedEmail) => joinedEmail.toLowerCase() === email)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))).catch(() => setEvents([])).finally(() => setLoading(false))
    }
    load()
    window.addEventListener("storage", load)
    window.addEventListener("cc-joined-change", load)
    return () => { window.removeEventListener("storage", load); window.removeEventListener("cc-joined-change", load) }
  }, [user?.email])

  return (
    <div className="mx-auto min-h-[60vh] max-w-[1180px] px-6 py-12">
      <div className="mb-8"><span className="text-xs font-black uppercase tracking-[.16em] text-forest">Your volunteer journey</span><h1 className="mt-2 text-4xl font-black tracking-tight">Joined Events</h1></div>
      {loading ? <div className="grid gap-5 md:grid-cols-3">{[1,2,3].map((n) => <div className="h-[330px] animate-pulse rounded-2xl bg-(--line)" key={n}/>)}</div> :
      events.length === 0 ? <div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h3 className="text-xl font-bold">You haven&apos;t joined any events yet</h3><p className="mt-2 text-(--muted)">Explore upcoming opportunities and find a cause you care about.</p><Link className="mx-auto mt-5 flex h-12 w-[190px] items-center justify-center rounded-lg bg-forest font-extrabold text-white" href="/events">Browse Events</Link></div> :
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{events.map((event) => <article className="overflow-hidden rounded-2xl border border-(--line) bg-(--background)" key={event.id}><img className="h-[210px] w-full object-cover" src={event.image} alt={event.title}/><div className="p-5"><span className="rounded-full bg-lime/35 px-2.5 py-1 text-xs font-black text-forest">{event.category}</span><h3 className="mt-4 text-lg font-bold">{event.title}</h3><div className="mt-3 flex flex-col gap-2 text-[13px] text-(--muted)"><span className="flex items-center gap-2"><MapPin size={15}/>{event.location}</span><span className="flex items-center gap-2"><CalendarDays size={15}/>{new Date(event.date).toLocaleDateString()}</span></div><div className="mt-4 grid grid-cols-2 gap-2"><Link className="flex h-[42px] items-center justify-center rounded-lg border border-(--line) text-sm font-extrabold text-forest" href={`/events/${event.id}`}>View Details</Link><button className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-[#efc7c3] bg-[#fffafa] text-sm font-extrabold text-[#b42318] dark:border-[#70433d] dark:bg-[#342725] dark:text-[#f3a9a1]" onClick={() => leaveEvent(event.id)}><LogOut size={16}/>Leave Event</button></div></div></article>)}</div>}
    </div>
  )
}

export default function JoinedEventsPage() { return <PrivateRoute><JoinedEventsContent /></PrivateRoute> }
