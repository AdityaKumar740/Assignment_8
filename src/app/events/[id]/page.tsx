"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, CheckCircle2, Clock, MapPin, Users } from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvent } from "@/lib/api-events"

function EventDetailsContent() {
  const params = useParams<{ id: string }>()
  const [event, setEvent] = useState<CommunityEvent | null>(null)
  const [joined, setJoined] = useState(() => {
    if (typeof window === "undefined") return false
    let joinedIds: string[] = []
    try { joinedIds = JSON.parse(localStorage.getItem("cc-joined") || "[]") as string[] } catch { joinedIds = [] }
    return joinedIds.includes(params.id)
  })

  useEffect(() => {
    fetchEvent(params.id).then((loadedEvent) => {
      setEvent(loadedEvent)
      if (!loadedEvent) {
        let joinedIds: string[] = []
        try { joinedIds = JSON.parse(localStorage.getItem("cc-joined") || "[]") as string[] } catch { joinedIds = [] }
        localStorage.setItem("cc-joined", JSON.stringify(joinedIds.filter((id) => id !== params.id)))
        setJoined(false)
      }
    })
  }, [params.id])

  const join = () => {
    if (joined) return
    let joinedIds: string[] = []
    try { joinedIds = JSON.parse(localStorage.getItem("cc-joined") || "[]") as string[] } catch { joinedIds = [] }
    if (!joinedIds.includes(params.id)) {
      localStorage.setItem("cc-joined", JSON.stringify([...joinedIds, params.id]))
      window.dispatchEvent(new Event("cc-joined-change"))
    }
    setJoined(true)
    toast.success("You’ve joined the event!")
  }

  const leave = () => {
    if (!joined) return
    let joinedIds: string[] = []
    try { joinedIds = JSON.parse(localStorage.getItem("cc-joined") || "[]") as string[] } catch { joinedIds = [] }
    localStorage.setItem("cc-joined", JSON.stringify(joinedIds.filter((id) => id !== params.id)))
    setJoined(false)
    window.dispatchEvent(new Event("cc-joined-change"))
    toast.success("You’ve left the event")
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
          <div className="organizer"><img src={event.organizer.avatar} alt={event.organizer.name}/><div><strong>{event.organizer.name}</strong><span>{event.organizer.role}</span></div></div>
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
