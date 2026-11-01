import Link from "next/link"

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand"><span className="brand-mark"><span /></span><span>Community Connect</span></div>
          <p>Connecting caring people with meaningful ways to strengthen their communities.</p>
        </div>
        <div><h4>Explore</h4><Link href="/events">Upcoming Events</Link><Link href="/create-event">Create an Event</Link><Link href="/#gallery">Community Gallery</Link></div>
        <div><h4>Community</h4><Link href="/#why-us">About Us</Link><Link href="/joined-events">Volunteer Stories</Link><Link href="/profile">Your Profile</Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Community Connect</span><span>Made for stronger communities</span></div>
    </footer>
  )
}
