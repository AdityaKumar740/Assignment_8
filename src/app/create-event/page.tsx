"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { CommunityEvent } from "@/lib/events"
import { PrivateRoute } from "@/components/private-route"
import { useAuth } from "@/lib/auth-provider"

const today = new Date().toISOString().slice(0,10)
const schema=z.object({
  title:z.string().min(3,"Event title must be at least 3 characters"),
  description:z.string().min(20,"Description must be at least 20 characters"),
  category:z.string().min(1,"Choose an event category"),
  image:z.string().url("Enter a valid image URL"),
  location:z.string().min(3,"Location is required"),
  date:z.string().refine((v)=>v>=today,"Event date cannot be in the past"),
  attendees:z.string().regex(/^\d+$/,"Enter a whole number of volunteers"),
})
type FormData=z.infer<typeof schema>

function CreateEventContent(){
  const router=useRouter()
  const { user } = useAuth()
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<FormData>({resolver:zodResolver(schema)})
  const submit=async(data:FormData)=>{
    try{
      if(!user?.email){toast.error("Please sign in again");return}
      const volunteerCount=Number(data.attendees)
      const res=await fetch("http://localhost:5000/create-event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        ...data,attendees:volunteerCount,date:`${data.date}T09:00:00`,
        createdByEmail:user.email.toLowerCase(),
        organizer:{name:user.name,role:"Community Organizer",avatar:user.photo||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
      })})
      if(!res.ok){const body=await res.json().catch(()=>null);throw new Error(body?.message||"Couldn’t create event")}
      toast.success("Event created successfully");router.push("/events")
    }catch(error){toast.error(error instanceof Error?error.message:"We couldn’t create the event. Please try again.");}
  }
  return <div className="page-shell"><div className="form-shell"><div className="page-title-row"><span className="section-label">Organize your community</span><h1>Create an Event</h1></div><form className="form-card" onSubmit={handleSubmit(submit)}><div className="form-grid">
    <div className="form-group full"><label>Event title</label><input placeholder="e.g. Riverside Community Cleanup" {...register("title")}/>{errors.title&&<span className="error-text">{errors.title.message}</span>}</div>
    <div className="form-group full"><label>Description</label><textarea placeholder="Tell volunteers what the event is about..." {...register("description")}/>{errors.description&&<span className="error-text">{errors.description.message}</span>}</div>
    <div className="form-group"><label>Category</label><select {...register("category")}><option value="">Choose a category</option><option>Cleanup</option><option>Plantation</option><option>Donation</option><option>Community Support</option><option>Education</option><option>Health &amp; Wellness</option><option>Animal Welfare</option><option>Environment</option><option>Food Distribution</option><option>Disaster Relief</option><option>Youth Mentoring</option><option>Senior Support</option><option>Arts &amp; Culture</option><option>Fundraiser</option><option>Other</option></select>{errors.category&&<span className="error-text">{errors.category.message}</span>}</div>
    <div className="form-group"><label>Event date</label><input type="date" min={today} {...register("date")}/>{errors.date&&<span className="error-text">{errors.date.message}</span>}</div>
    <div className="form-group"><label>Expected volunteers</label><input type="number" min="0" step="1" defaultValue="0" placeholder="0" {...register("attendees")}/>{errors.attendees&&<span className="error-text">{errors.attendees.message}</span>}</div>
    <div className="form-group full"><label>Location</label><input placeholder="Venue or address" {...register("location")}/>{errors.location&&<span className="error-text">{errors.location.message}</span>}</div>
    <div className="form-group full"><label>Thumbnail image URL</label><input placeholder="https://images.unsplash.com/..." {...register("image")}/>{errors.image&&<span className="error-text">{errors.image.message}</span>}</div>
    <div className="form-group full"><button className="join-btn" disabled={isSubmitting}>{isSubmitting?"Creating event...":"Create Event"}</button></div>
  </div></form></div></div>
}

export default function CreateEventPage() {
  return <PrivateRoute><CreateEventContent /></PrivateRoute>
}
