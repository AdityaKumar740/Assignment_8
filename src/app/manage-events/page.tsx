"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"

export default function ManageEventsPage(){
 const [events,setEvents]=useState<CommunityEvent[]>([]);const [ready,setReady]=useState(false)
 useEffect(()=>{fetch("/api/events").then(r=>r.json()).then((items:CommunityEvent[])=>{const created=JSON.parse(localStorage.getItem("cc-created")||"[]") as string[];setEvents(items.filter(e=>e.createdBy==="demo-user"||created.includes(e.id))) }).finally(()=>setReady(true))},[])
 const remove=async(id:string)=>{if(!confirm("Delete this event? This action cannot be undone."))return;const res=await fetch(`/api/events/${id}`,{method:"DELETE"});if(res.ok){setEvents(v=>v.filter(e=>e.id!==id));toast.success("Event deleted")}else toast.error("Couldn’t delete event")}
 return <div className="page-shell"><div className="page-title-row"><span className="section-label">Organizer dashboard</span><h1>Manage Events</h1></div>{!ready?<div className="events-grid">{[1,2].map(n=><div className="skeleton" key={n}/>)}</div>:events.length===0?<div className="empty-state"><h3>You haven&apos;t created an event yet</h3><p>Bring neighbors together around an idea you care about.</p><Link className="btn-primary green" style={{width:180,margin:"20px auto 0"}} href="/create-event">Create an Event</Link></div>:<div className="events-grid">{events.map(e=><article className="event-card" key={e.id}><img className="event-image" src={e.image} alt={e.title}/><div className="event-body"><span className="category">{e.category}</span><h3>{e.title}</h3><div className="event-meta"><span><MapPin size={15}/>{e.location}</span><span><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><div style={{display:"flex",gap:8,marginTop:18}}><button className="card-action" style={{flex:1}}><Pencil size={14}/> Edit</button><button onClick={()=>remove(e.id)} className="card-action" style={{flex:1,color:"#b42318"}}><Trash2 size={14}/> Delete</button></div></div></article>)}</div>}
 </div>
}
