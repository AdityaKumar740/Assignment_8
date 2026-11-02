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
      await authClient.getSession()
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
    <div className="mx-auto grid min-h-[680px] max-w-[1180px] grid-cols-1 px-0 md:grid-cols-[1fr_1fr]">
      <div className="hidden flex-col justify-center bg-[linear-gradient(135deg,#176b45,#0e4a30)] px-16 text-white md:flex">
        <span className="text-xs font-black uppercase tracking-[.18em] text-lime">Good things happen together</span>
        <h2 className="mt-5 text-4xl font-black tracking-tight">Make a difference where you live.</h2>
        <p className="mt-4 max-w-md leading-7 text-white/75">Sign in to join events, organize neighbors, and keep track of the positive change you are creating.</p>
      </div>
      <div className="flex items-center justify-center bg-(--cream) px-5 py-12 md:px-12">
        <div className="w-full max-w-[440px] rounded-2xl border border-(--line) bg-(--background) p-7 shadow-[0_18px_50px_rgba(14,74,48,.10)] md:p-10">
          <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
          <p className="mt-2 mb-6 text-sm text-(--muted)">Sign in to your Community Connect account.</p>
          <button className="mb-6 h-12 w-full rounded-lg border border-(--line) bg-(--background) font-extrabold" type="button" onClick={googleLogin}>G&nbsp; Continue with Google</button>
          <form className="flex flex-col gap-4" onSubmit={signIn}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Email address</label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold">Password</label>
              <input className="h-12 rounded-lg border border-(--line) bg-(--background) px-3.5 outline-none focus:border-forest" type="password" placeholder="Enter your password" value={password} onChange={(event)=>setPassword(event.target.value)} required />
            </div>
            <button className="mt-2 h-12 rounded-lg bg-forest font-black text-white disabled:opacity-60" type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
          </form>
          <p className="mt-5 text-center text-sm text-(--muted)">New to Community Connect? <Link className="font-extrabold text-forest" href="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
