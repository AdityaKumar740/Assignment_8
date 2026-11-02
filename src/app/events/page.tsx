"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CalendarDays, MapPin, Search } from "lucide-react"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"

export default function EventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => setError(true)).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => events
    .filter((event) => event.title.toLowerCase().includes(search.toLowerCase()) && (category === "All" || event.category === category))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events, search, category])

  return (
    <div className="mx-auto min-h-[60vh] max-w-[1180px] px-6 py-12">
      <div className="mb-8">
        <span className="text-xs font-black uppercase tracking-[.16em] text-forest">Find your next opportunity</span>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Upcoming Events</h1>
        <p className="mt-2 text-(--muted)">Join neighbors making a real difference, one small action at a time.</p>
      </div>
      <div className="mb-7 grid gap-3 rounded-2xl border border-(--line) bg-(--background) p-3 md:grid-cols-[2fr_1fr_1fr]">
        <label className="flex h-12 items-center gap-2 rounded-lg border border-(--line) px-3.5"><Search size={18}/><input className="w-full bg-transparent outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events by title"/></label>
        <select className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
          {["All","Cleanup","Plantation","Donation","Community Support","Education","Health & Wellness","Animal Welfare","Environment","Food Distribution","Disaster Relief","Youth Mentoring","Senior Support","Arts & Culture","Fundraiser","Other"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <div className="flex h-12 items-center gap-2 rounded-lg border border-(--line) px-3.5"><CalendarDays size={18}/><span className="text-sm">Nearest date</span></div>
      </div>
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((n) => <div className="h-[330px] animate-pulse rounded-2xl bg-(--line)" key={n}/>)}</div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h3 className="text-xl font-bold">We couldn&apos;t load events</h3><p className="mt-2 text-(--muted)">Please check your connection and try again.</p></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h3 className="text-xl font-bold">No events found</h3><p className="mt-2 text-(--muted)">Try another search or event category.</p></div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((event) => (
          <article className="overflow-hidden rounded-2xl border border-(--line) bg-(--background) shadow-[0_10px_30px_rgba(28,65,45,.06)]" key={event.id}>
            <img className="h-[210px] w-full object-cover" src={event.image} alt={event.title}/>
            <div className="p-5"><span className="rounded-full bg-lime/35 px-2.5 py-1 text-xs font-black text-forest">{event.category}</span><h3 className="mt-4 text-lg font-bold">{event.title}</h3><p className="mt-3 text-[13px] leading-6 text-(--muted)">{event.description.slice(0,105)}...</p><div className="mt-3 flex flex-col gap-2 text-[13px] text-(--muted)"><span className="flex items-center gap-2"><MapPin size={15}/>{event.location}</span><span className="flex items-center gap-2"><CalendarDays size={15}/>{new Date(event.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span></div><Link className="mt-4 flex h-[42px] w-full items-center justify-center rounded-lg border border-(--line) text-sm font-extrabold text-forest" href={`/events/${event.id}`}>View Details</Link></div>
          </article>
        ))}</div>
      )}
    </div>
  )
}
