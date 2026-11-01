"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const today = new Date().toISOString().slice(0,10)
const schema=z.object({
  title:z.string().min(3,"Event title must be at least 3 characters"),
  description:z.string().min(20,"Description must be at least 20 characters"),
  category:z.string().min(1,"Choose an event category"),
  image:z.string().url("Enter a valid image URL"),
  location:z.string().min(3,"Location is required"),
  date:z.string().refine((v)=>v>=today,"Event date cannot be in the past"),
})
type FormData=z.infer<typeof schema>

export default function CreateEventPage(){
  const router=useRouter()
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<FormData>({resolver:zodResolver(schema)})
  const submit=async(data:FormData)=>{
    try{const res=await fetch("http://localhost:5000/create-event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,date:`${data.date}T09:00:00`})});if(!res.ok)throw new Error();const event=await res.json();const created=JSON.parse(localStorage.getItem("cc-created")||"[]");localStorage.setItem("cc-created",JSON.stringify([...created,event.id ?? event._id]));toast.success("Event created successfully");router.push("/events")}
    catch{toast.error("We couldn’t create the event. Please try again.");}
  }
  return <div className="page-shell"><div className="form-shell"><div className="page-title-row"><span className="section-label">Organize your community</span><h1>Create an Event</h1></div><form className="form-card" onSubmit={handleSubmit(submit)}><div className="form-grid">
    <div className="form-group full"><label>Event title</label><input placeholder="e.g. Riverside Community Cleanup" {...register("title")}/>{errors.title&&<span className="error-text">{errors.title.message}</span>}</div>
    <div className="form-group full"><label>Description</label><textarea placeholder="Tell volunteers what the event is about..." {...register("description")}/>{errors.description&&<span className="error-text">{errors.description.message}</span>}</div>
    <div className="form-group"><label>Category</label><select {...register("category")}><option value="">Choose a category</option><option>Cleanup</option><option>Plantation</option><option>Donation</option><option>Community Support</option></select>{errors.category&&<span className="error-text">{errors.category.message}</span>}</div>
    <div className="form-group"><label>Event date</label><input type="date" min={today} {...register("date")}/>{errors.date&&<span className="error-text">{errors.date.message}</span>}</div>
    <div className="form-group full"><label>Location</label><input placeholder="Venue or address" {...register("location")}/>{errors.location&&<span className="error-text">{errors.location.message}</span>}</div>
    <div className="form-group full"><label>Thumbnail image URL</label><input placeholder="https://images.unsplash.com/..." {...register("image")}/>{errors.image&&<span className="error-text">{errors.image.message}</span>}</div>
    <div className="form-group full"><button className="join-btn" disabled={isSubmitting}>{isSubmitting?"Creating event...":"Create Event"}</button></div>
  </div></form></div></div>
}
