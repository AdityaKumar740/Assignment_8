"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, CheckCircle2, Clock, MapPin, Users } from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvent } from "@/lib/api-events"
import { useAuth } from "@/lib/auth-provider"

function EventDetailsContent() {
  const params = useParams<{ id: string }>()
  const {user}=useAuth()
  const [event, setEvent] = useState<CommunityEvent | null>(null)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    fetchEvent(params.id).then((loadedEvent) => {
      setEvent(loadedEvent)
      setJoined(Boolean(user?.email && loadedEvent?.joinedByEmails?.some(email=>email.toLowerCase()===user.email.toLowerCase())))
    })
  }, [params.id,user?.email])

  const join = async () => {
    if (joined||!user?.email) {
      if(!user) toast.error("Please log in to join this event")
      return
    }
    try{
      const res=await fetch(`/api/events/${params.id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"join"})})
      if(!res.ok)throw new Error()
      setJoined(true);toast.success("You’ve joined the event!")
      window.dispatchEvent(new Event("cc-joined-change"))
      fetchEvent(params.id).then((loadedEvent)=>loadedEvent&&setEvent(loadedEvent))
    }catch{toast.error("Couldn’t join the event")}
  }

  const leave = async () => {
    if (!joined) return
    if(!user?.email)return
    try{
      const res=await fetch(`/api/events/${params.id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"leave"})})
      if(!res.ok)throw new Error()
      setJoined(false);toast.success("You’ve left the event")
      window.dispatchEvent(new Event("cc-joined-change"))
      fetchEvent(params.id).then((loadedEvent)=>loadedEvent&&setEvent(loadedEvent))
    }catch{toast.error("Couldn’t leave the event")}
  }

  if (!event) return <div className="page-shell"><div className="empty-state"><h2>Event not found</h2><p>This event may no longer be available.</p></div></div>
  const date = new Date(event.date)
  return (
    <div className="page-shell">
      <div className="details-grid">
        <div className="details-content">
          <img className="details-image" src={event.image} alt={event.title}/>
          <span className="category" style={{display:"inline-block",marginTop:18}}>{event.category}</span>
          <h1>{event.title}</h1>
          {event.organizer.name !== "Community Organizer" && event.organizer.name !== "Alex Morgan" && (
            <div className="organizer"><img src={event.organizer.avatar} alt={event.organizer.name}/><div><strong>{event.organizer.name}</strong><span>{event.organizer.role}</span></div></div>
          )}
          <h3 style={{marginTop:32}}>About this event</h3><p>{event.description}</p>
        </div>
        <aside className="detail-card">
          <h3>Event details</h3>
          <div className="detail-row"><CalendarDays size={18}/><span>{date.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</span></div>
          <div className="detail-row"><Clock size={18}/><span>{date.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</span></div>
          <div className="detail-row"><MapPin size={18}/><span>{event.location}</span></div>
          <div className="detail-row"><Users size={18}/><span>{event.attendees} volunteers attending</span></div>
          <button className={`join-btn${joined ? " joined" : ""}`} onClick={joined ? leave : join}>{joined ? <><CheckCircle2 size={17} style={{marginRight:6}}/> Leave Event</> : "Join Event"}</button>
          {joined && <p style={{fontSize:12,textAlign:"center",color:"var(--green)"}}>You’re on the volunteer list. Click to leave.</p>}
        </aside>
      </div>
    </div>
  )
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<div className="page-shell"><div className="skeleton"/></div>}>
      <EventDetailsContent />
    </Suspense>
  )
}
