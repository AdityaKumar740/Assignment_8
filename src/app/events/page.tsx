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

  const filtered = useMemo(() => events.filter((event) => event.title.toLowerCase().includes(search.toLowerCase()) && (category === "All" || event.category === category)).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events, search, category])

  return (
    <div className="page-shell">
      <div className="page-title-row"><span className="section-label">Find your next opportunity</span><h1>Upcoming Events</h1><p style={{color:"var(--muted)"}}>Join neighbors making a real difference, one small action at a time.</p></div>
      <div className="filters">
        <label className="field-control"><Search size={18}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search events by title"/></label>
        <label className="field-control"><select value={category} onChange={(e)=>setCategory(e.target.value)}><option>All</option><option>Cleanup</option><option>Plantation</option><option>Donation</option><option>Community Support</option><option>Education</option><option>Health &amp; Wellness</option><option>Animal Welfare</option><option>Environment</option><option>Food Distribution</option><option>Disaster Relief</option><option>Youth Mentoring</option><option>Senior Support</option><option>Arts &amp; Culture</option><option>Fundraiser</option><option>Other</option></select></label>
        <label className="field-control"><CalendarDays size={18}/><select defaultValue="nearest"><option value="nearest">Nearest date</option></select></label>
      </div>
      {loading ? <div className="events-grid">{[1,2,3,4,5,6].map((n)=><div className="skeleton" key={n}/>)}</div> :
        error ? <div className="empty-state"><h3>We couldn&apos;t load events</h3><p>Please check your connection and try again.</p></div> :
        filtered.length === 0 ? <div className="empty-state"><h3>No events found</h3><p>Try another search or event category.</p></div> :
        <div className="events-grid">{filtered.map((event)=><article className="event-card" key={event.id}>
          <img className="event-image" src={event.image} alt={event.title}/>
          <div className="event-body"><span className="category">{event.category}</span><h3>{event.title}</h3><p style={{color:"var(--muted)",lineHeight:1.5,fontSize:13}}>{event.description.slice(0,105)}...</p><div className="event-meta"><span><MapPin size={15}/>{event.location}</span><span><CalendarDays size={15}/>{new Date(event.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span></div><Link className="card-action" href={`/events/${event.id}`}>View Details</Link></div>
        </article>)}</div>}
    </div>
  )
}
