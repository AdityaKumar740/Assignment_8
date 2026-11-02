"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, Search, Sprout } from "lucide-react"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"

function EventCard({ event }: { event: CommunityEvent }) {
  const date = new Date(event.date)
  return (
    <article className="overflow-hidden rounded-2xl border border-(--line) bg-(--background) shadow-[0_10px_30px_rgba(28,65,45,.06)] transition hover:-translate-y-1">
      <img className="h-[210px] w-full object-cover" src={event.image} alt={event.title} />
      <div className="p-5">
        <span className="rounded-full bg-lime/35 px-2.5 py-1 text-xs font-black text-forest">{event.category}</span>
        <h3 className="mt-4 mb-3 text-lg font-bold">{event.title}</h3>
        <div className="flex flex-col gap-2 text-[13px] text-(--muted)">
          <span><MapPin size={15}/>{event.location}</span>
          <span><CalendarDays size={15}/>{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
        <Link href={`/events/${event.id}`} className="mt-4 flex h-[42px] w-full items-center justify-center rounded-lg border border-(--line) text-sm font-extrabold text-forest">View Details <ArrowRight size={14}/></Link>
      </div>
    </article>
  )
}

export default function Home() {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  useEffect(() => {
    fetchEvents().then((data) => setEvents(data.slice(0, 6))).catch(() => setEvents([]))
  }, [])

  return (
    <>
      <section className="relative mx-auto mt-6 min-h-[530px] max-w-[1180px] overflow-hidden rounded-3xl bg-[linear-gradient(90deg,rgba(10,55,35,.92),rgba(10,55,35,.72)_48%,rgba(10,55,35,.08)_78%),url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=88')] bg-cover bg-center">
        <div className="w-full px-6 py-16 text-white md:w-[58%] md:px-[76px] md:py-24">
          <span className="text-xs font-black uppercase tracking-[.18em] text-lime">Together, we make more possible</span>
          <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-.05em] md:text-[68px]">Small Actions.<br/>Big Changes.</h1>
          <p className="mt-5 max-w-[510px] text-base leading-7 text-white/80 md:text-[17px]">Discover meaningful ways to serve your community, meet passionate neighbors, and turn a little time into lasting impact.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events" className="flex h-[50px] items-center justify-center gap-2 rounded-[10px] bg-lime px-5 text-sm font-extrabold text-[#163d29]">Explore Events <ArrowRight size={16}/></Link>
            <Link href="/create-event" className="flex h-[50px] items-center justify-center gap-2 rounded-[10px] border border-white/40 bg-white/12 px-5 text-sm font-extrabold text-white">Create Event <PlusIcon /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div><span className="text-xs font-black uppercase tracking-[.16em] text-forest">Make a difference nearby</span><h2 className="mt-2 text-4xl font-black tracking-tight">Upcoming Events</h2></div>
          <Link href="/events" className="hidden items-center gap-2 font-extrabold text-forest sm:flex">View All Events <ArrowRight size={15}/></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{events.slice(0, 6).map((event) => <EventCard key={event.id} event={event}/>)}</div>
      </section>

      <section className="bg-(--cream) py-20" id="why-us">
        <div className="mx-auto mb-8 max-w-[1180px] px-6">
          <span className="text-xs font-black uppercase tracking-[.16em] text-forest">Why choose us</span><h2 className="mt-2 text-4xl font-black tracking-tight">Community starts with you</h2>
        </div>
        <div className="mx-auto grid max-w-[1180px] gap-5 px-6 md:grid-cols-3">
          <article className="rounded-2xl border border-(--line) bg-(--background) p-8"><div className="grid size-[52px] place-items-center rounded-[14px] bg-lime text-forest-dark"><Search size={24}/></div><h3 className="mt-5 mb-2 text-xl font-bold">Discover Local Events</h3><p className="leading-7 text-(--muted)">Find hands-on opportunities near you, from neighborhood cleanups to food drives and mentoring programs.</p></article>
          <article className="rounded-2xl border border-(--line) bg-(--background) p-8"><div className="grid size-[52px] place-items-center rounded-[14px] bg-lime text-forest-dark"><HeartHandshake size={24}/></div><h3 className="mt-5 mb-2 text-xl font-bold">Connect With Volunteers</h3><p className="leading-7 text-(--muted)">Meet generous people who share your interests and build lasting connections through service.</p></article>
          <article className="rounded-2xl border border-(--line) bg-(--background) p-8"><div className="grid size-[52px] place-items-center rounded-[14px] bg-lime text-forest-dark"><Sprout size={24}/></div><h3 className="mt-5 mb-2 text-xl font-bold">Create Positive Change</h3><p className="leading-7 text-(--muted)">Turn small acts of participation into visible improvements for people and places that matter.</p></article>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-20" id="gallery">
        <div className="mb-8"><span className="text-xs font-black uppercase tracking-[.16em] text-forest">Our community in action</span><h2 className="mt-2 text-4xl font-black tracking-tight">Moments that matter</h2></div>
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
          <img className="h-full w-full rounded-2xl object-cover md:col-span-2 md:row-span-2" src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=85" alt="Volunteers working together"/>
          <img className="h-full w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=85" alt="Community planting trees"/>
          <img className="h-full w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=85" alt="Children supported by volunteers"/>
          <img className="h-full w-full rounded-2xl object-cover md:col-span-2" src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=85" alt="Neighbors serving together"/>
          <img className="hidden h-full w-full rounded-2xl object-cover md:block" src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=85" alt="Food donation drive"/>
        </div>
      </section>

    </>
  )
}

function PlusIcon() { return <span className="text-[18px]">+</span> }
