"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
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

const inputClass = "h-12 w-full rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest"

function CreateEventContent(){
  const router=useRouter()
  const { user } = useAuth()
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<FormData>({resolver:zodResolver(schema)})
  const submit=async(data:FormData)=>{
    try{
      if(!user?.email){toast.error("Please sign in again");return}
      const res=await fetch("/api/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        ...data,attendees:Number(data.attendees),date:`${data.date}T09:00:00`,createdByEmail:user.email.toLowerCase(),
        organizer:{name:user.name,role:"Community Organizer",avatar:user.photo||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
      })})
      if(!res.ok){const body=await res.json().catch(()=>null);throw new Error(body?.message||"Couldn’t create event")}
      toast.success("Event created successfully");router.push("/events")
    }catch(error){toast.error(error instanceof Error?error.message:"We couldn’t create the event. Please try again.");}
  }
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-black uppercase tracking-[.16em] text-forest">Organize your community</span><h1 className="mt-2 mb-6 text-4xl font-black tracking-tight">Create an Event</h1>
        <form className="rounded-2xl border border-(--line) bg-(--background) p-5 shadow-[0_18px_50px_rgba(14,74,48,.06)] md:p-7" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field className="md:col-span-2" label="Event title" error={errors.title?.message}><input className={inputClass} placeholder="e.g. Riverside Community Cleanup" {...register("title")}/></Field>
            <Field className="md:col-span-2" label="Description" error={errors.description?.message}><textarea className="min-h-28 w-full rounded-lg border border-(--line) bg-(--background) px-3.5 py-3 outline-none focus:border-forest" placeholder="Tell volunteers what the event is about..." {...register("description")}/></Field>
            <Field label="Category" error={errors.category?.message}><select className={inputClass} {...register("category")}><option value="">Choose a category</option>{["Cleanup","Plantation","Donation","Community Support","Education","Health & Wellness","Environment","Food Distribution","Other"].map((item)=><option key={item}>{item}</option>)}</select></Field>
            <Field label="Event date" error={errors.date?.message}><input className={inputClass} type="date" min={today} {...register("date")}/></Field>
            <Field label="Expected volunteers" error={errors.attendees?.message}><input className={inputClass} type="number" min="0" step="1" defaultValue="0" {...register("attendees")}/></Field>
            <Field label="Location" error={errors.location?.message}><input className={inputClass} placeholder="Venue or address" {...register("location")}/></Field>
            <Field className="md:col-span-2" label="Thumbnail image URL" error={errors.image?.message}><input className={inputClass} placeholder="https://images.unsplash.com/..." {...register("image")}/></Field>
            <button className="md:col-span-2 h-12 rounded-lg bg-forest font-black text-white disabled:opacity-60" disabled={isSubmitting}>{isSubmitting?"Creating event...":"Create Event"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({label,error,className="",children}:{label:string;error?:string;className?:string;children:React.ReactNode}) {
  return <div className={`flex flex-col gap-2 ${className}`}><label className="text-sm font-extrabold">{label}</label>{children}{error&&<span className="text-xs font-bold text-[#b42318]">{error}</span>}</div>
}

export default function CreateEventPage() { return <PrivateRoute><CreateEventContent /></PrivateRoute> }
