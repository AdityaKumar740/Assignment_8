"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, MapPin } from "lucide-react"
import type { CommunityEvent } from "@/lib/events"

export default function JoinedEventsPage(){
 const [events,setEvents]=useState<CommunityEvent[]>([])
 useEffect(()=>{const ids=JSON.parse(localStorage.getItem("cc-joined")||"[]") as string[];fetch("/api/events").then(r=>r.json()).then((items:CommunityEvent[])=>setEvents(items.filter(e=>ids.includes(e.id)).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime())))},[])
 return <div className="page-shell"><div className="page-title-row"><span className="section-label">Your volunteer journey</span><h1>Joined Events</h1></div>{events.length===0?<div className="empty-state"><h3>You haven&apos;t joined any events yet</h3><p>Explore upcoming opportunities and find a cause you care about.</p><Link className="btn-primary green" style={{width:190,margin:"20px auto 0"}} href="/events">Browse Events</Link></div>:<div className="events-grid">{events.map(e=><article className="event-card" key={e.id}><img className="event-image" src={e.image} alt={e.title}/><div className="event-body"><span className="category">{e.category}</span><h3>{e.title}</h3><div className="event-meta"><span><MapPin size={15}/>{e.location}</span><span><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><Link className="card-action" href={`/events/${e.id}`}>View Details</Link></div></article>)}</div>}</div>
}
