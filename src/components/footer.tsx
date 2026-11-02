import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-auto bg-forest-dark text-white">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-14 md:grid-cols-[1.7fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-extrabold"><span className="grid size-[38px] place-items-center rounded-full bg-forest"><span className="block h-5 w-[15px] -rotate-[32deg] rounded-[100%_0_100%_0] bg-lime"/></span><span>Community Connect</span></div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">Connecting caring people with meaningful ways to strengthen their communities.</p>
        </div>
        <div className="flex flex-col gap-3 text-sm"><h4 className="mb-2 text-base text-lime">Explore</h4><Link className="text-white/70 hover:text-white" href="/events">Upcoming Events</Link><Link className="text-white/70 hover:text-white" href="/create-event">Create an Event</Link><Link className="text-white/70 hover:text-white" href="/#gallery">Community Gallery</Link></div>
        <div className="flex flex-col gap-3 text-sm"><h4 className="mb-2 text-base text-lime">Community</h4><Link className="text-white/70 hover:text-white" href="/#why-us">About Us</Link><Link className="text-white/70 hover:text-white" href="/joined-events">Volunteer Stories</Link><Link className="text-white/70 hover:text-white" href="/profile">Your Profile</Link></div>
      </div>
      <div className="mx-auto flex max-w-[1180px] flex-col justify-between border-t border-white/10 px-6 py-5 text-xs text-white/55 sm:flex-row"><span>© 2026 Community Connect</span><span>Made for stronger communities</span></div>
    </footer>
  )
}
