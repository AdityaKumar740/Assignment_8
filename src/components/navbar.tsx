"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, ChevronDown, LogOut, Menu, Moon, Plus, Settings, Ticket, UserRound, X } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
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
  const handleLogout = async () => {
    close()
    await logout()
    router.replace("/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 h-[76px] border-b border-(--line) bg-(--background)/95 backdrop-blur-md">
      <nav className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight" onClick={close} aria-label="Community Connect home">
          <span className="grid size-[38px] place-items-center rounded-full bg-forest"><span className="block h-5 w-[15px] -rotate-[32deg] rounded-[100%_0_100%_0] bg-lime"/></span>
          <span>Community <b className="text-forest">Connect</b></span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link className={`text-sm font-bold text-(--muted) hover:text-forest ${pathname === "/events" ? "!text-forest" : ""}`} href="/events">Upcoming Events</Link>
          <Link className="text-sm font-bold text-(--muted) hover:text-forest" href="/#why-us">About Us</Link>
        </div>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <button className="grid size-[38px] place-items-center rounded-full bg-(--cream) text-(--ink)" onClick={toggleTheme} aria-label="Toggle theme"><Moon size={18} /></button>
          {!user && <Link href="/login" className="grid h-[42px] place-items-center rounded-[10px] bg-forest px-5 text-sm font-extrabold text-white">Log In</Link>}
          <div className="relative">
            <button className="flex items-center gap-1.5 bg-transparent text-(--ink)" onClick={() => setProfileOpen(!profileOpen)} title={profileUser.name}>
              {user?.photo
                ? <img className="size-10 rounded-full border-2 border-lime object-cover" src={user.photo} alt={user.name} />
                : <span className="grid size-10 place-items-center rounded-full border-2 border-lime bg-[#505862] text-white" aria-label="Guest profile"><UserRound size={22} /></span>}
              <ChevronDown size={14} />
            </button>
            {profileOpen && user && (
              <div className="absolute right-0 top-[54px] w-[260px] rounded-2xl border border-(--line) bg-(--background) p-2.5 shadow-[0_18px_50px_rgba(14,74,48,.18)]">
                <div className="mb-2 flex flex-col border-b border-(--line) px-3 pb-3.5 pt-2">
                  <strong>{profileUser.name}</strong>
                </div>
                {[["/create-event", Plus, "Create Event"],["/manage-events", Settings, "Manage Events"],["/joined-events", Ticket, "Joined Events"],["/profile", UserRound, "Profile"]].map(([href, Icon, label]) => {
                  const MenuIcon = Icon as typeof Plus
                  return <Link key={String(href)} className="flex h-11 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-bold text-(--ink) hover:bg-(--cream) hover:text-forest" href={String(href)} onClick={close}><MenuIcon size={17}/>{String(label)}</Link>
                })}
                <button className="mt-1 flex h-11 w-full items-center gap-2.5 border-t border-(--line) px-3 text-sm font-bold text-[#b42318]" onClick={handleLogout}><LogOut size={17}/> Logout</button>
              </div>
            )}
          </div>
        </div>
        <button className="grid size-10 place-items-center md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="absolute left-0 top-[76px] flex w-full flex-col border-b border-(--line) bg-(--background) px-6 py-4 shadow-lg md:hidden">
          <Link className="flex h-11 items-center gap-2.5" href="/events" onClick={close}><CalendarDays size={18}/> Upcoming Events</Link>
          <Link className="flex h-11 items-center" href="/#why-us" onClick={close}>About Us</Link>
          <button className="flex h-11 items-center gap-2.5" onClick={toggleTheme}><Moon size={18}/> Toggle theme</button>
          {!user && <Link className="flex h-11 items-center" href="/login" onClick={close}>Log In</Link>}
          {user && <>
            <Link className="flex h-11 items-center gap-2.5" href="/create-event" onClick={close}><Plus size={18}/> Create Event</Link>
            <Link className="flex h-11 items-center gap-2.5" href="/manage-events" onClick={close}><Settings size={18}/> Manage Events</Link>
            <Link className="flex h-11 items-center gap-2.5" href="/joined-events" onClick={close}><Ticket size={18}/> Joined Events</Link>
            <Link className="flex h-11 items-center gap-2.5" href="/profile" onClick={close}><UserRound size={18}/> Profile</Link>
            <button className="flex h-11 items-center gap-2.5 text-[#b42318]" onClick={handleLogout}><LogOut size={18}/> Logout</button>
          </>}
        </div>
      )}
    </header>
  )
}
