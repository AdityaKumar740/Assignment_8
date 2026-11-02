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
  fetchEvents().then(items=>{
   const email=user.email.toLowerCase()
   setEvents(items.filter(event=>event.createdByEmail?.toLowerCase()===email))
  }).catch(()=>setEvents([])).finally(()=>setReady(true))
 },[user?.email])

 const remove=async(id:string)=>{
  if(!confirm("Delete this event? This action cannot be undone.")||!user?.email)return
  try{
   const res=await fetch(`/api/events/${id}?email=${encodeURIComponent(user.email.toLowerCase())}`,{method:"DELETE"})
   const body=await res.json().catch(()=>null)
   if(!res.ok)throw new Error(body?.message||"Couldn’t delete event")
   setEvents(current=>current.filter(event=>event.id!==id))
   toast.success("Event deleted")
  }catch(error){toast.error(error instanceof Error?error.message:"Couldn’t delete event")}
 }

 const saveEdit=async(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault()
  if(!editing||!user?.email)return
  setSaving(true)
  try{
   const date=new Date(editing.date)
   if(date<=new Date())throw new Error("Event date must be in the future")
   const res=await fetch(`/api/events/${editing.id}`,{
    method:"PATCH",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({...editing,email:user.email.toLowerCase()})
   })
   const body=await res.json().catch(()=>null)
   if(!res.ok)throw new Error(body?.message||"Couldn’t update event")
   setEvents(current=>current.map(item=>item.id===editing.id?editing:item))
   setEditing(null);toast.success("Event updated successfully")
  }catch(error){toast.error(error instanceof Error?error.message:"Couldn’t update event")}
  finally{setSaving(false)}
 }

 return <div className="page-shell">
  <div className="page-title-row"><span className="section-label">Organizer dashboard</span><h1>Manage Events</h1></div>
  {!ready?<div className="events-grid">{[1,2].map(n=><div className="skeleton" key={n}/>)}</div>:events.length===0?<div className="empty-state"><h3>You haven&apos;t created an event yet</h3><p>Bring neighbors together around an idea you care about.</p><Link className="btn-primary green" style={{width:180,margin:"20px auto 0"}} href="/create-event">Create an Event</Link></div>:<div className="events-grid">{events.map(e=><article className="event-card" key={e.id}><img className="event-image" src={e.image} alt={e.title}/><div className="event-body"><span className="category">{e.category}</span><h3>{e.title}</h3><div className="event-meta"><span><MapPin size={15}/>{e.location}</span><span><CalendarDays size={15}/>{new Date(e.date).toLocaleDateString()}</span></div><div style={{display:"flex",gap:8,marginTop:18}}><button className="card-action" style={{flex:1}} onClick={()=>setEditing(e)}><Pencil size={14}/> Edit</button><button onClick={()=>remove(e.id)} className="card-action" style={{flex:1,color:"#b42318"}}><Trash2 size={14}/> Delete</button></div></div></article>)}</div>}
  {editing&&<div className="modal-backdrop" onMouseDown={()=>setEditing(null)}><form className="form-card modal-card" onMouseDown={event=>event.stopPropagation()} onSubmit={saveEdit}><button type="button" className="modal-close" onClick={()=>setEditing(null)} aria-label="Close"><X/></button><h2>Edit Event</h2><div className="form-grid"><div className="form-group full"><label>Title</label><input value={editing.title} onChange={event=>setEditing({...editing,title:event.target.value})} required/></div><div className="form-group full"><label>Description</label><textarea value={editing.description} onChange={event=>setEditing({...editing,description:event.target.value})} required/></div><div className="form-group"><label>Category</label><input value={editing.category} onChange={event=>setEditing({...editing,category:event.target.value})} required/></div><div className="form-group"><label>Date</label><input type="datetime-local" value={editing.date.slice(0,16)} min={new Date(Date.now()+60000).toISOString().slice(0,16)} onChange={event=>setEditing({...editing,date:event.target.value})} required/></div><div className="form-group"><label>Location</label><input value={editing.location} onChange={event=>setEditing({...editing,location:event.target.value})} required/></div><div className="form-group"><label>Thumbnail URL</label><input type="url" value={editing.image} onChange={event=>setEditing({...editing,image:event.target.value})} required/></div><div className="form-group full"><button className="join-btn" disabled={saving}>{saving?"Saving...":"Save Changes"}</button></div></div></form></div>}
 </div>
}

export default function ManageEventsPage() {
 return <PrivateRoute><ManageEventsContent /></PrivateRoute>
}
