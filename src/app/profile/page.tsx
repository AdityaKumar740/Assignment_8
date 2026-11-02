"use client"

import { useAuth } from "@/lib/auth-provider"
import { UserRound } from "lucide-react"
import Link from "next/link"
import { PrivateRoute } from "@/components/private-route"

function ProfileContent() {
  const { user, loading } = useAuth()
  if (loading) return <div className="mx-auto max-w-[1180px] px-6 py-12"><div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h2 className="text-xl font-bold">Loading profile...</h2></div></div>
  if (!user) return <div className="mx-auto max-w-[1180px] px-6 py-12"><div className="rounded-2xl border border-dashed border-(--line) p-16 text-center"><h2 className="text-xl font-bold">Log in to view your profile</h2><p className="mt-2 text-(--muted)">Your account details will appear here.</p><Link className="mx-auto mt-5 flex h-12 w-[180px] items-center justify-center rounded-lg bg-forest font-extrabold text-white" href="/login">Log In</Link></div></div>
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <span className="text-xs font-black uppercase tracking-[.16em] text-forest">Account</span><h1 className="mt-2 mb-6 text-4xl font-black tracking-tight">Your Profile</h1>
        <div className="rounded-2xl border border-(--line) bg-(--background) p-10 text-center shadow-[0_18px_50px_rgba(14,74,48,.06)]">
          {user.photo ? <img className="mx-auto mb-5 size-24 rounded-full object-cover" src={user.photo} alt={user.name}/> : <div className="mx-auto mb-5 grid size-24 place-items-center rounded-full border-2 border-lime bg-[#505862] text-white"><UserRound size={42}/></div>}
          <h2 className="mb-2 text-xl font-bold">{user.name}</h2><p className="text-(--muted)">{user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() { return <PrivateRoute><ProfileContent /></PrivateRoute> }
