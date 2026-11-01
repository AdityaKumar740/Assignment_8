"use client"

import { useAuth } from "@/lib/auth-provider"
import { UserRound } from "lucide-react"
import Link from "next/link"
import { PrivateRoute } from "@/components/private-route"

function ProfileContent(){
 const {user,loading}=useAuth()
 if(loading)return <div className="page-shell"><div className="empty-state"><h2>Loading profile...</h2></div></div>
 if(!user)return <div className="page-shell"><div className="empty-state"><h2>Log in to view your profile</h2><p>Your account details will appear here.</p><Link className="btn-primary green" style={{width:180,margin:"20px auto 0"}} href="/login">Log In</Link></div></div>
 return <div className="page-shell"><div className="form-shell"><div className="page-title-row"><span className="section-label">Account</span><h1>Your Profile</h1></div><div className="form-card" style={{textAlign:"center"}}>{user.photo?<img src={user.photo} alt={user.name} style={{width:96,height:96,borderRadius:"50%",objectFit:"cover",margin:"0 auto 18px"}}/>:<div className="profile-placeholder" style={{width:96,height:96,margin:"0 auto 18px"}}><UserRound size={42}/></div>}<h2 style={{margin:"0 0 8px"}}>{user.name}</h2><p style={{color:"var(--muted)"}}>{user.email}</p></div></div></div>
}

export default function ProfilePage() {
 return <PrivateRoute><ProfileContent /></PrivateRoute>
}
