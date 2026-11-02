"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      })
      if (result.error) {
        toast.error(result.error.message || "Invalid email or password")
        return
      }
      toast.success("Logged in successfully")
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl")
      router.push(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/")
      router.refresh()
    } catch {
      toast.error("Unable to sign in. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    })
  }

  return (
    <div className="auth-layout min-h-[680px]">
      <div className="auth-panel">
        <span className="eyebrow">Good things happen together</span>
        <h2>Make a difference where you live.</h2>
        <p>Sign in to join events, organize neighbors, and keep track of the positive change you are creating.</p>
      </div>
      <div className="auth-side">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p>Sign in to your Community Connect account.</p>
          <button className="google-btn" type="button" onClick={googleLogin}>G&nbsp; Continue with Google</button>
          <form onSubmit={signIn}>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(event)=>setPassword(event.target.value)} required />
            </div>
            <button className="submit" type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
          </form>
          <p className="auth-switch">New to Community Connect? <Link href="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
