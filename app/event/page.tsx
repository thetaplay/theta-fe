'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { EventCard } from '@/components/EventCard'
import { CategoryPills } from '@/components/CategoryPills'
import { BoltFill, DollarsignCircleFill, ChartLineUptrendXyaxis, Magnifyingglass, BellFill } from '@/components/sf-symbols'

import { supabase } from '@/lib/supabaseClient'
import { useAccount } from 'wagmi'
const CATEGORIES = ['All', 'Crypto Events', 'Economic Events', 'Web3']
type DbEvent = {
  id: string
  slug: string | null
  title: string
  category: 'Crypto Events' | 'Economic Events' | 'Web3'
  date: string | null
  impact: 'Low' | 'Medium' | 'High'
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
  const { address, isConnected } = useAccount()
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
    if (isConnected) {
      fetchEvents()
    }
  }, [isConnected])

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesCategory =
      activeCategory === 'All' || event.category === activeCategory
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }), [events, activeCategory, searchQuery])

  return (
    <PageLayout
      title="Events"
    >
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
      {isConnected ? (
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
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">Please connect your wallet to view events</p>
        </div>
      )}
    </PageLayout>
  )
}
