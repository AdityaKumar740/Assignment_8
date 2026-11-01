"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"

export default function ManageEventsPage(){
 const [events,setEvents]=useState<CommunityEvent[]>([]);const [ready,setReady]=useState(false)
 useEffect(()=>{fetchEvents().then((items)=>{const created=JSON.parse(localStorage.getItem("cc-created")||"[]") as string[];setEvents(items.filter(e=>created.includes(e.id)))}).catch(()=>setEvents([])).finally(()=>setReady(true))},[])
 const remove=async(id:string)=>{
  if(!confirm("Delete this event? This action cannot be undone."))return
  if(!/^[a-f\d]{24}$/i.test(id)){toast.error("Demo events cannot be deleted");return}
  try{
   const res=await fetch(`http://localhost:5000/events/${id}`,{method:"DELETE"})
   if(!res.ok){const body=await res.json().catch(()=>null);throw new Error(body?.message||"Couldn’t delete event")}
   setEvents(v=>v.filter(e=>e.id!==id))
   const created=JSON.parse(localStorage.getItem("cc-created")||"[]") as string[]
   localStorage.setItem("cc-created",JSON.stringify(created.filter(createdId=>createdId!==id)))
   const cached=JSON.parse(localStorage.getItem("cc-created-events")||"[]") as CommunityEvent[]
   localStorage.setItem("cc-created-events",JSON.stringify(cached.filter(event=>event.id!==id)))
   let joined:string[]=[]
   try{joined=JSON.parse(localStorage.getItem("cc-joined")||"[]") as string[]}catch{joined=[]}
   localStorage.setItem("cc-joined",JSON.stringify(joined.filter(joinedId=>joinedId!==id)))
   toast.success("Event deleted")
  }catch(error){toast.error(error instanceof Error?error.message:"Couldn’t delete event")}
 }
 return <div className="page-shell"><div className="page-title-row"><span className="section-label">Organizer dashboard</span><h1>Manage Events</h1></div>{!ready?<div className="events-grid">{[1,2].map(n=><div className="skeleton" key={n}/>)}</div>:events.length===0?<div className="empty-state"><h3>You haven&apos;t created an event yet</h3><p>Bring neighbors together around an idea you care about.</p><Link className="btn-primary green" style={{width:180,margin:"20px auto 0"}} href="/create-event">Create an Event</Link></div>:<div className="events-grid">{events.map(e=><article className="event-card" key={e.id}><img className="event-image" src={e.image} alt={e.title}/><div className="event-body"><span className="category">{e.category}</span><h3>{e.title}</h3><div className="event-meta"><span><MapPin size={15}/>{e.location}</span><span><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><div style={{display:"flex",gap:8,marginTop:18}}><button className="card-action" style={{flex:1}}><Pencil size={14}/> Edit</button><button onClick={()=>remove(e.id)} className="card-action" style={{flex:1,color:"#b42318"}}><Trash2 size={14}/> Delete</button></div></div></article>)}</div>}
 </div>
}
