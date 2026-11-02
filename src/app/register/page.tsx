"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function RegisterPage() {
 const router=useRouter()
 const [name,setName]=useState("")
 const [email,setEmail]=useState("")
 const [image,setImage]=useState("")
 const [password,setPassword]=useState("")
 const [confirmPassword,setConfirmPassword]=useState("")
 const [loading,setLoading]=useState(false)

 const register=async(event:React.FormEvent)=>{
  event.preventDefault()
  if(password.length<6){toast.error("Password must be at least 6 characters");return}
  if(!/[A-Z]/.test(password)||!/[a-z]/.test(password)){toast.error("Password must contain uppercase and lowercase letters");return}
  if(password!==confirmPassword){toast.error("Passwords do not match");return}
  setLoading(true)
  const normalizedEmail=email.trim().toLowerCase()
  const result=await authClient.signUp.email({name:name.trim(),email:normalizedEmail,password,image:image.trim()||undefined})
  setLoading(false)
  if(result.error){toast.error(result.error.message||"Registration failed");return}
  authClient.hydrateSession(null)
  await authClient.signOut()
  toast.success("Account created successfully. Please log in.")
  router.replace("/login")
  router.refresh()
 }

 const googleRegister=async()=>{
  await authClient.signIn.social({
    provider:"google",
  })
 }
  return (
    <div className="mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-1 md:grid-cols-[1fr_1fr]">
      <div className="hidden flex-col justify-center bg-[linear-gradient(135deg,#176b45,#0e4a30)] px-16 text-white md:flex">
        <span className="text-xs font-black uppercase tracking-[.18em] text-lime">Your community needs you</span>
        <h2 className="mt-5 text-4xl font-black tracking-tight">Turn care into action.</h2>
        <p className="mt-4 max-w-md leading-7 text-white/75">Create your account and discover all the ways you can show up for your neighborhood.</p>
      </div>
      <div className="flex items-center justify-center bg-(--cream) px-5 py-12 md:px-12">
        <div className="w-full max-w-[440px] rounded-2xl border border-(--line) bg-(--background) p-7 shadow-[0_18px_50px_rgba(14,74,48,.10)] md:p-10">
          <h1 className="text-3xl font-black tracking-tight">Create your account</h1>
          <p className="mt-2 mb-6 text-sm text-(--muted)">Start making a positive difference today.</p>
          <button className="mb-6 h-12 w-full rounded-lg border border-(--line) bg-(--background) font-extrabold" type="button" onClick={googleRegister}>G&nbsp; Sign up with Google</button>
          <form className="flex flex-col gap-4" onSubmit={register}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Full name</label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="text" placeholder="Alex Morgan" value={name} onChange={(event)=>setName(event.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Email address</label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Profile photo URL <span className="font-normal text-(--muted)">(optional)</span></label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="url" placeholder="https://example.com/profile.jpg" value={image} onChange={(event)=>setImage(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Password</label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="password" placeholder="At least 6 characters" value={password} onChange={(event)=>setPassword(event.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Confirm password</label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(event)=>setConfirmPassword(event.target.value)} required />
            </div>
            <button className="mt-2 h-12 rounded-lg bg-forest font-black text-white disabled:opacity-60" type="submit" disabled={loading}>{loading?"Creating account...":"Create Account"}</button>
          </form>
          <p className="mt-5 text-center text-sm text-(--muted)">Already have an account? <Link className="font-extrabold text-forest" href="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}
