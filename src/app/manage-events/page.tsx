"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Pencil, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { fetchEvents } from "@/lib/api-events"
import { PrivateRoute } from "@/components/private-route"
import { useAuth } from "@/lib/auth-provider"

function ManageEventsContent() {
  const { user }=useAuth()
  const [events,setEvents]=useState<CommunityEvent[]>([])
  const [ready,setReady]=useState(false)
  const [editing,setEditing]=useState<CommunityEvent|null>(null)
  const [saving,setSaving]=useState(false)

  useEffect(()=>{
    if(!user?.email)return
    fetchEvents().then(items=>setEvents(items.filter(event=>event.createdByEmail?.toLowerCase()===user.email.toLowerCase()))).catch(()=>setEvents([])).finally(()=>setReady(true))
  },[user?.email])

  const remove=async(id:string)=>{
    if(!confirm("Delete this event? This action cannot be undone.")||!user?.email)return
    try{
      const res=await fetch(`/api/events/${id}?email=${encodeURIComponent(user.email.toLowerCase())}`,{method:"DELETE"})
      const body=await res.json().catch(()=>null)
      if(!res.ok)throw new Error(body?.message||"Couldn’t delete event")
      setEvents(current=>current.filter(event=>event.id!==id));toast.success("Event deleted")
    }catch(error){toast.error(error instanceof Error?error.message:"Couldn’t delete event")}
  }

  const saveEdit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    if(!editing||!user?.email)return
    setSaving(true)
    try{
      const res=await fetch(`/api/events/${editing.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...editing,email:user.email.toLowerCase()})})
      const body=await res.json().catch(()=>null)
      if(!res.ok)throw new Error(body?.message||"Couldn’t update event")
      setEvents(current=>current.map(item=>item.id===editing.id?editing:item));setEditing(null);toast.success("Event updated successfully")
    }catch(error){toast.error(error instanceof Error?error.message:"Couldn’t update event")}
    finally{setSaving(false)}
  }

  return (
    <div className="mx-auto min-h-[60vh] max-w-[1180px] px-6 py-12">
      <span className="text-xs font-black uppercase tracking-[.16em] text-forest">Organizer dashboard</span><h1 className="mt-2 mb-8 text-4xl font-black tracking-tight">Manage Events</h1>
      {!ready?<div className="grid gap-5 md:grid-cols-3">{[1,2].map(n=><div className="h-[330px] animate-pulse rounded-2xl bg-(--line)" key={n}/>)}</div>:events.length===0?<div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h3 className="text-xl font-bold">You haven&apos;t created an event yet</h3><p className="mt-2 text-(--muted)">Bring neighbors together around an idea you care about.</p><Link className="mx-auto mt-5 flex h-12 w-[180px] items-center justify-center rounded-lg bg-forest font-extrabold text-white" href="/create-event">Create an Event</Link></div>:<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{events.map(e=><article className="overflow-hidden rounded-2xl border border-(--line) bg-(--background)" key={e.id}><img className="h-[210px] w-full object-cover" src={e.image} alt={e.title}/><div className="p-5"><span className="rounded-full bg-lime/35 px-2.5 py-1 text-xs font-black text-forest">{e.category}</span><h3 className="mt-4 text-lg font-bold">{e.title}</h3><div className="mt-3 flex flex-col gap-2 text-[13px] text-(--muted)"><span className="flex items-center gap-2"><MapPin size={15}/>{e.location}</span><span className="flex items-center gap-2"><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><div className="mt-4 grid grid-cols-2 gap-2"><button className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-(--line) text-sm font-extrabold text-forest" onClick={()=>setEditing(e)}><Pencil size={14}/>Edit</button><button onClick={()=>remove(e.id)} className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-(--line) text-sm font-extrabold text-[#b42318]"><Trash2 size={14}/>Delete</button></div></div></article>)}</div>}
      {editing&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" onMouseDown={()=>setEditing(null)}><form className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--line) bg-(--background) p-6 shadow-2xl" onMouseDown={event=>event.stopPropagation()} onSubmit={saveEdit}><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">Edit Event</h2><button type="button" className="grid size-10 place-items-center rounded-full hover:bg-(--cream)" onClick={()=>setEditing(null)} aria-label="Close"><X/></button></div><div className="grid gap-4 md:grid-cols-2"><label className="md:col-span-2 flex flex-col gap-2 text-sm font-extrabold">Title<input className="h-12 rounded-lg border border-(--line) px-3" value={editing.title} onChange={event=>setEditing({...editing,title:event.target.value})} required/></label><label className="md:col-span-2 flex flex-col gap-2 text-sm font-extrabold">Description<textarea className="min-h-24 rounded-lg border border-(--line) px-3 py-2" value={editing.description} onChange={event=>setEditing({...editing,description:event.target.value})} required/></label><label className="flex flex-col gap-2 text-sm font-extrabold">Category<input className="h-12 rounded-lg border border-(--line) px-3" value={editing.category} onChange={event=>setEditing({...editing,category:event.target.value})} required/></label><label className="flex flex-col gap-2 text-sm font-extrabold">Location<input className="h-12 rounded-lg border border-(--line) px-3" value={editing.location} onChange={event=>setEditing({...editing,location:event.target.value})} required/></label><label className="md:col-span-2 flex flex-col gap-2 text-sm font-extrabold">Thumbnail URL<input className="h-12 rounded-lg border border-(--line) px-3" type="url" value={editing.image} onChange={event=>setEditing({...editing,image:event.target.value})} required/></label></div><button className="mt-5 h-12 w-full rounded-lg bg-forest font-black text-white disabled:opacity-60" disabled={saving}>{saving?"Saving...":"Save Changes"}</button></form></div>}
    </div>
  )
}

export default function ManageEventsPage() { return <PrivateRoute><ManageEventsContent /></PrivateRoute> }
