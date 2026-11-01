"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, MapPin } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"
import { PrivateRoute } from "@/components/private-route"
import { useAuth } from "@/lib/auth-provider"

function JoinedEventsContent(){
 const {user}=useAuth()
 const [events,setEvents]=useState<CommunityEvent[]>([])
 const [loading,setLoading]=useState(true)
 const leaveEvent=async(id:string)=>{
  if(!user?.email)return
  try{
   const res=await fetch(`http://localhost:5000/events/${id}/leave`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:user.email.toLowerCase()})})
   if(!res.ok)throw new Error()
   setEvents(current=>current.filter(event=>event.id!==id))
   toast.success("You’ve left the event")
  }catch{toast.error("Couldn’t leave the event")}
 }

 useEffect(()=>{
  const load=()=>{
   if(!user?.email)return
   const email=user.email.toLowerCase()
   fetchEvents()
    .then((items)=>{
     setEvents(items.filter(event=>event.joinedByEmails?.some(joinedEmail=>joinedEmail.toLowerCase()===email)).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()))
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
 },[user?.email])
 return <div className="page-shell"><div className="page-title-row"><span className="section-label">Your volunteer journey</span><h1>Joined Events</h1></div>{loading?<div className="events-grid">{[1,2,3].map(n=><div className="skeleton" key={n}/>)}</div>:events.length===0?<div className="empty-state"><h3>You haven&apos;t joined any events yet</h3><p>Explore upcoming opportunities and find a cause you care about.</p><Link className="btn-primary green" style={{width:190,margin:"20px auto 0"}} href="/events">Browse Events</Link></div>:<div className="events-grid">{events.map(e=><article className="event-card" key={e.id}><img className="event-image" src={e.image} alt={e.title}/><div className="event-body"><span className="category">{e.category}</span><h3>{e.title}</h3><div className="event-meta"><span><MapPin size={15}/>{e.location}</span><span><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><div style={{display:"flex",gap:8}}><Link className="card-action" style={{flex:1}} href={`/events/${e.id}`}>View Details</Link><button className="card-action" style={{flex:1,color:"#b42318"}} onClick={()=>leaveEvent(e.id)}>Leave Event</button></div></div></article>)}</div>}</div>
}

export default function JoinedEventsPage() {
 return <PrivateRoute><JoinedEventsContent /></PrivateRoute>
}
