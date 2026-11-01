export type CommunityEvent = {
  id: string
  title: string
  description: string
  category: string
  location: string
  date: string
  image: string
  organizer: {
    name: string
    role: string
    avatar: string
  }
  attendees: number
  createdBy?: string
}

export const initialEvents: CommunityEvent[] = [
  {
    id: "riverside-cleanup",
    title: "Riverside Community Cleanup",
    description: "Join neighbors for a morning of restoring our beloved riverfront park. Gloves, bags, refreshments, and tools will be provided.",
    category: "Cleanup",
    location: "Riverside Park, Austin",
    date: "2026-11-08T09:00:00",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85",
    organizer: { name: "Maya Thompson", role: "Austin Green Alliance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    attendees: 48,
  },
  {
    id: "city-tree-planting",
    title: "City Tree Planting Day",
    description: "Help create a greener, cooler neighborhood by planting native trees with local urban forestry volunteers.",
    category: "Plantation",
    location: "Zilker Botanical Garden",
    date: "2026-11-14T08:30:00",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85",
    organizer: { name: "Daniel Kim", role: "Canopy Collective", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    attendees: 36,
  },
  {
    id: "food-drive",
    title: "Neighborhood Food Drive",
    description: "Pack and distribute nourishing food boxes for families across the east side of our community.",
    category: "Donation",
    location: "Eastside Community Hall",
    date: "2026-11-21T10:00:00",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85",
    organizer: { name: "Priya Shah", role: "Good Neighbor Project", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
    attendees: 62,
  },
  {
    id: "weekend-youth",
    title: "Weekend Youth Mentoring",
    description: "Spend a meaningful afternoon helping young students discover confidence through reading, art, and play.",
    category: "Community Support",
    location: "North Loop Learning Center",
    date: "2026-11-28T13:00:00",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85",
    organizer: { name: "Elena Garcia", role: "Bright Futures Austin", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    attendees: 24,
  },
  {
    id: "community-garden",
    title: "Community Garden Build",
    description: "Build raised beds and welcome a new shared garden that will serve residents throughout the year.",
    category: "Community Support",
    location: "Mueller Community Garden",
    date: "2026-12-05T09:30:00",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=85",
    organizer: { name: "Marcus Green", role: "Mueller Growers", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    attendees: 41,
  },
  {
    id: "winter-warmth",
    title: "Winter Warmth Drive",
    description: "Sort clothing donations and assemble warm-care kits for neighbors experiencing housing insecurity.",
    category: "Donation",
    location: "Central Baptist Outreach",
    date: "2026-12-12T11:00:00",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=85",
    organizer: { name: "Aisha Brooks", role: "Warm Welcome Austin", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
    attendees: 55,
  },
]

export const serverEvents: CommunityEvent[] = [...initialEvents]
