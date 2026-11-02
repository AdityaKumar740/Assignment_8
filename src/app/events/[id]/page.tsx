"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { CalendarDays, CheckCircle2, Clock, MapPin, Users } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvent } from "@/lib/api-events"
import { useAuth } from "@/lib/auth-provider"

function EventDetailsContent() {
  const params = useParams<{ id: string }>()
  const { user }=useAuth()
  const [event,setEvent]=useState<CommunityEvent|null>(null)
  const [joined,setJoined]=useState(false)

  useEffect(()=>{ fetchEvent(params.id).then((loaded)=>{setEvent(loaded);setJoined(Boolean(user?.email&&loaded?.joinedByEmails?.some(email=>email.toLowerCase()===user.email.toLowerCase())))})},[params.id,user?.email])

  const setEventJoin=async(action:"join"|"leave")=>{
    if(!user?.email){toast.error("Please log in to join this event");return}
    try{
      const res=await fetch(`/api/events/${params.id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})})
      if(!res.ok)throw new Error()
      setJoined(action==="join");toast.success(action==="join"?"You’ve joined the event!":"You’ve left the event")
      window.dispatchEvent(new Event("cc-joined-change"))
      fetchEvent(params.id).then((loaded)=>loaded&&setEvent(loaded))
    }catch{toast.error(action==="join"?"Couldn’t join the event":"Couldn’t leave the event")}
  }

  if(!event)return <div className="mx-auto max-w-[1180px] px-6 py-12"><div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h2 className="text-xl font-bold">Event not found</h2><p className="mt-2 text-(--muted)">This event may no longer be available.</p></div></div>
  const date=new Date(event.date)
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
        <div>
          <img className="h-[420px] w-full rounded-2xl object-cover" src={event.image} alt={event.title}/>
          <span className="mt-5 inline-block rounded-full bg-lime/35 px-2.5 py-1 text-xs font-black text-forest">{event.category}</span><h1 className="mt-3 text-4xl font-black tracking-tight">{event.title}</h1>
          {event.organizer.name !== "Community Organizer" && event.organizer.name !== "Alex Morgan" && <div className="mt-5 flex items-center gap-3"><img className="size-11 rounded-full object-cover" src={event.organizer.avatar} alt={event.organizer.name}/><div><strong>{event.organizer.name}</strong><span className="block text-xs text-(--muted)">{event.organizer.role}</span></div></div>}
          <h3 className="mt-8 mb-2 text-xl font-bold">About this event</h3><p className="leading-7 text-(--muted)">{event.description}</p>
        </div>
        <aside className="h-fit rounded-2xl border border-(--line) bg-(--background) p-6 shadow-[0_10px_30px_rgba(28,65,45,.08)]">
          <h3 className="mb-2 text-lg font-black">Event details</h3>
          <Detail icon={<CalendarDays size={18}/>} text={date.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}/>
          <Detail icon={<Clock size={18}/>} text={date.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}/>
          <Detail icon={<MapPin size={18}/>} text={event.location}/>
          <Detail icon={<Users size={18}/>} text={`${event.attendees} volunteers attending`}/>
          <button className={`mt-4 flex h-12 w-full items-center justify-center rounded-lg font-black text-white ${joined?"bg-[#b42318] hover:bg-[#9f1c12]":"bg-forest hover:bg-forest-dark"}`} onClick={()=>setEventJoin(joined?"leave":"join")}>{joined?<><CheckCircle2 size={17} className="mr-2"/>Leave Event</>:"Join Event"}</button>
        </aside>
      </div>
    </div>
  )
}

function Detail({icon,text}:{icon:React.ReactNode;text:string}){return <div className="flex items-center gap-2.5 border-b border-(--line) py-3 text-sm text-(--muted) last:border-0"><span className="text-forest">{icon}</span>{text}</div>}

export default function EventDetailsPage(){return <Suspense fallback={<div className="mx-auto max-w-[1180px] px-6 py-12"><div className="h-[330px] animate-pulse rounded-2xl bg-(--line)"/></div>}><EventDetailsContent/></Suspense>}
