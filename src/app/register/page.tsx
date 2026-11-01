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
  toast.success("Account created successfully")
  router.push("/")
  router.refresh()
 }

 const googleRegister=async()=>{
  await authClient.signIn.social({provider:"google",callbackURL:"/"})
 }
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <span className="eyebrow">Your community needs you</span>
        <h2>Turn care into action.</h2>
        <p>Create your account and discover all the ways you can show up for your neighborhood.</p>
      </div>
      <div className="auth-side">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p>Start making a positive difference today.</p>
          <button className="google-btn" type="button" onClick={googleRegister}>G&nbsp; Sign up with Google</button>
          <form onSubmit={register}>
            <div className="form-group">
              <label>Full name</label>
              <input type="text" placeholder="Alex Morgan" value={name} onChange={(event)=>setName(event.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} required />
            </div>
            <div className="form-group">
              <label>Profile photo URL <span className="optional-label">(optional)</span></label>
              <input type="url" placeholder="https://example.com/profile.jpg" value={image} onChange={(event)=>setImage(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="At least 6 characters" value={password} onChange={(event)=>setPassword(event.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(event)=>setConfirmPassword(event.target.value)} required />
            </div>
            <button className="submit" type="submit" disabled={loading}>{loading?"Creating account...":"Create Account"}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}
