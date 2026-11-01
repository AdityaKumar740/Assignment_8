"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, Search, Sprout } from "lucide-react"
import type { CommunityEvent } from "@/lib/events"
import { initialEvents } from "@/lib/events"

function EventCard({ event }: { event: CommunityEvent }) {
  const date = new Date(event.date)
  return (
    <article className="event-card">
      <img className="event-image" src={event.image} alt={event.title} />
      <div className="event-body">
        <span className="category">{event.category}</span>
        <h3>{event.title}</h3>
        <div className="event-meta">
          <span><MapPin size={15}/>{event.location}</span>
          <span><CalendarDays size={15}/>{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
        <Link href={`/events/${event.id}`} className="card-action">View Details <ArrowRight size={14}/></Link>
      </div>
    </article>
  )
}

export default function Home() {
  const [events, setEvents] = useState<CommunityEvent[]>(initialEvents)
  useEffect(() => {
    fetch("/api/events").then((res) => res.ok ? res.json() : Promise.reject()).then((data) => setEvents(data.slice(0, 6))).catch(() => {})
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Together, we make more possible</span>
          <h1>Small Actions.<br/>Big Changes.</h1>
          <p>Discover meaningful ways to serve your community, meet passionate neighbors, and turn a little time into lasting impact.</p>
          <div className="hero-actions">
            <Link href="/events" className="btn-primary">Explore Events <ArrowRight size={16}/></Link>
            <Link href="/create-event" className="btn-secondary">Create Event <PlusIcon /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div><span className="section-label">Make a difference nearby</span><h2>Upcoming Events</h2></div>
          <Link href="/events" className="text-link">View All Events <ArrowRight size={15}/></Link>
        </div>
        <div className="events-grid">{events.slice(0, 6).map((event) => <EventCard key={event.id} event={event}/>)}</div>
      </section>

      <section className="section why-section" id="why-us">
        <div className="section-head">
          <div><span className="section-label">Why choose us</span><h2>Community starts with you</h2></div>
        </div>
        <div className="why-grid">
          <article className="why-card"><div className="why-icon"><Search size={24}/></div><h3>Discover Local Events</h3><p>Find hands-on opportunities near you, from neighborhood cleanups to food drives and mentoring programs.</p></article>
          <article className="why-card"><div className="why-icon"><HeartHandshake size={24}/></div><h3>Connect With Volunteers</h3><p>Meet generous people who share your interests and build lasting connections through service.</p></article>
          <article className="why-card"><div className="why-icon"><Sprout size={24}/></div><h3>Create Positive Change</h3><p>Turn small acts of participation into visible improvements for people and places that matter.</p></article>
        </div>
      </section>

      <section className="section" id="gallery">
        <div className="section-head"><div><span className="section-label">Our community in action</span><h2>Moments that matter</h2></div></div>
        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=85" alt="Volunteers working together"/>
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=85" alt="Community planting trees"/>
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=85" alt="Children supported by volunteers"/>
          <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=85" alt="Neighbors serving together"/>
          <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=85" alt="Food donation drive"/>
        </div>
      </section>

      <section className="newsletter">
        <div><h2>Good news, straight to your inbox.</h2><p>Monthly events, volunteer stories, and ways to help.</p></div>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); }}><input type="email" placeholder="Enter your email address" required/><button type="submit">Subscribe</button></form>
      </section>
    </>
  )
}

function PlusIcon() { return <span style={{ fontSize: 18 }}>+</span> }
