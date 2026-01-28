'use client'

import { useEffect, useMemo, useState } from 'react'
import { IOSHeader } from '@/components/IOSHeader'
import { EventCard } from '@/components/EventCard'
import { CategoryPills } from '@/components/CategoryPills'
import { BoltFill, DollarsignCircleFill, ChartLineUptrendXyaxis, Magnifyingglass, BellFill } from '@/components/sf-symbols'
import IOSPageTransition from '@/components/IOSPageTransition'

import { supabase } from '@/lib/supabaseClient'
const CATEGORIES = ['All', 'Crypto Events', 'Economic Events', 'Web3']
type DbEvent = {
  id: string
  slug: string | null
  title: string
  category: string
  date: string | null
  impact: string | null
  icon: string | null
}

const iconFromName = (name?: string | null) => {
  switch (name) {
    case 'BoltFill':
      return <BoltFill size={24} />
    case 'ChartLineUptrendXyaxis':
      return <ChartLineUptrendXyaxis size={24} />
    case 'DollarsignCircleFill':
      return <DollarsignCircleFill size={24} />
    default:
      return <BoltFill size={24} />
  }
}

export default function EventPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState<DbEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('id, slug, title, category, date, impact, icon')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setEvents(data ?? [])
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesCategory =
      activeCategory === 'All' || event.category === activeCategory
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }), [events, activeCategory, searchQuery])

  return (
    <IOSPageTransition>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <IOSHeader
          title="Events"
          rightContent={
            <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-md active:scale-95 transition-transform">
              <BellFill size={20} />
            </button>
          }
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 mt-0">
          {/* Search */}
          <div className="mb-4 relative">
            <Magnifyingglass
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground soft-shadow focus:outline-none transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <CategoryPills
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Events List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-sm">Failed to load events: {error}</p>
              </div>
            ) : (
              filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    icon={iconFromName(event.icon)}
                    title={event.title}
                    date={event.date ?? ''}
                    impact={(event.impact ?? 'Medium') as 'Low' | 'Medium' | 'High'}
                    category={event.category}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">
                    No events found matching your search
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </IOSPageTransition>
  )
}
