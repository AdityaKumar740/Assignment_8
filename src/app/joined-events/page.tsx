"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, MapPin } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"

export default function JoinedEventsPage(){
 const [events,setEvents]=useState<CommunityEvent[]>([])
 const [loading,setLoading]=useState(true)
 const leaveEvent=(id:string)=>{
  let ids:string[]=[]
  try{ids=JSON.parse(localStorage.getItem("cc-joined")||"[]") as string[]}catch{ids=[]}
  localStorage.setItem("cc-joined",JSON.stringify(ids.filter(joinedId=>joinedId!==id)))
  setEvents(current=>current.filter(event=>event.id!==id))
  window.dispatchEvent(new Event("cc-joined-change"))
  toast.success("You’ve left the event")
 }
 useEffect(()=>{
  const load=()=>{
   let ids:string[]=[]
   try{ids=JSON.parse(localStorage.getItem("cc-joined")||"[]") as string[]}catch{ids=[]}
   fetchEvents()
    .then((items)=>{
     const availableIds=new Set(items.map(event=>event.id))
     const activeIds=ids.filter(id=>availableIds.has(id))
     if(activeIds.length!==ids.length){
      localStorage.setItem("cc-joined",JSON.stringify(activeIds))
     }
     setEvents(items.filter(e=>activeIds.includes(e.id)).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()))
    })
    .catch(()=>setEvents([]))
    .finally(()=>setLoading(false))
  }
  load()
  window.addEventListener("storage",load)
  window.addEventListener("cc-joined-change",load)
  return()=>{
   window.removeEventListener("storage",load)
   window.removeEventListener("cc-joined-change",load)
  }
 },[])
 return <div className="page-shell"><div className="page-title-row"><span className="section-label">Your volunteer journey</span><h1>Joined Events</h1></div>{loading?<div className="events-grid">{[1,2,3].map(n=><div className="skeleton" key={n}/>)}</div>:events.length===0?<div className="empty-state"><h3>You haven&apos;t joined any events yet</h3><p>Explore upcoming opportunities and find a cause you care about.</p><Link className="btn-primary green" style={{width:190,margin:"20px auto 0"}} href="/events">Browse Events</Link></div>:<div className="events-grid">{events.map(e=><article className="event-card" key={e.id}><img className="event-image" src={e.image} alt={e.title}/><div className="event-body"><span className="category">{e.category}</span><h3>{e.title}</h3><div className="event-meta"><span><MapPin size={15}/>{e.location}</span><span><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><div style={{display:"flex",gap:8}}><Link className="card-action" style={{flex:1}} href={`/events/${e.id}`}>View Details</Link><button className="card-action" style={{flex:1,color:"#b42318"}} onClick={()=>leaveEvent(e.id)}>Leave Event</button></div></div></article>)}</div>}</div>
}
