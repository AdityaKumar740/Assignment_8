"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, ChevronDown, LogOut, Menu, Moon, Plus, Settings, Ticket, UserRound, X } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"

export function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const pathname = usePathname()
  const profileUser = user ?? {
    id: "",
    name: "Community Connect",
    photo: "",
  }

  useEffect(() => {
    const saved = localStorage.getItem("cc-theme") === "dark"
    setDark(saved)
    document.documentElement.classList.toggle("dark", saved)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("cc-theme", next ? "dark" : "light")
  }

  const close = () => { setMenuOpen(false); setProfileOpen(false) }

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="nav-shell mx-auto flex items-center justify-between">
        <Link href="/" className="brand" onClick={close} aria-label="Community Connect home">
          <span className="brand-mark"><span /></span>
          <span>Community <b>Connect</b></span>
        </Link>
        <div className="nav-links desktop-nav">
          <Link className={pathname === "/events" ? "active" : ""} href="/events">Upcoming Events</Link>
          <Link href="/#why-us">About Us</Link>
        </div>
        <div className="nav-actions desktop-nav">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme"><Moon size={18} /></button>
          {!user && <Link href="/login" className="login-btn">Log In</Link>}
          <div className="profile-wrap">
            <button className="profile-button" onClick={() => setProfileOpen(!profileOpen)} title={profileUser.name}>
              {user?.photo
                ? <img src={user.photo} alt={user.name} />
                : <span className="profile-placeholder" aria-label="Guest profile"><UserRound size={22} /></span>}
              <ChevronDown size={14} />
            </button>
            {profileOpen && user && (
              <div className="profile-menu">
                <div className="profile-menu-head">
                  <strong>{profileUser.name}</strong>
                </div>
                <Link href="/create-event" onClick={close}><Plus size={17}/> Create Event</Link>
                <Link href="/manage-events" onClick={close}><Settings size={17}/> Manage Events</Link>
                <Link href="/joined-events" onClick={close}><Ticket size={17}/> Joined Events</Link>
                <Link href="/profile" onClick={close}><UserRound size={17}/> Profile</Link>
                <button className="logout-row" onClick={() => { logout(); close(); window.location.href="/login" }}><LogOut size={17}/> Logout</button>
              </div>
            )}
          </div>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/events" onClick={close}><CalendarDays size={18}/> Upcoming Events</Link>
          <Link href="/#why-us" onClick={close}>About Us</Link>
          <button onClick={toggleTheme}><Moon size={18}/> Toggle theme</button>
          {!user && <Link href="/login" onClick={close}>Log In</Link>}
          {user && <>
            <Link href="/create-event" onClick={close}><Plus size={18}/> Create Event</Link>
            <Link href="/manage-events" onClick={close}><Settings size={18}/> Manage Events</Link>
            <Link href="/joined-events" onClick={close}><Ticket size={18}/> Joined Events</Link>
            <Link href="/profile" onClick={close}><UserRound size={18}/> Profile</Link>
            <button onClick={() => { logout(); close(); window.location.href="/login" }}><LogOut size={18}/> Logout</button>
          </>}
        </div>
      )}
    </header>
  )
}
