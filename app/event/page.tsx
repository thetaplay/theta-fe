'use client'

import { useState } from 'react'
import { IOSHeader } from '@/components/IOSHeader'
import { EventCard } from '@/components/EventCard'
import { CategoryPills } from '@/components/CategoryPills'
import { BoltFill, DollarsignCircleFill, ChartLineUptrendXyaxis, Magnifyingglass, BellFill } from '@/components/sf-symbols'
import IOSPageTransition from '@/components/IOSPageTransition'

const CATEGORIES = ['All', 'Crypto Events', 'Economic Events', 'Web3']

const EVENTS = [
  {
    id: '1',
    icon: <BoltFill size={24} />,
    title: 'Bitcoin ETF Approval Price Surge',
    date: 'Predict: BTC above $48k by Feb 1',
    impact: 'High' as const,
    category: 'Crypto Events',
  },
  {
    id: '2',
    icon: <ChartLineUptrendXyaxis size={24} />,
    title: 'FOMC Interest Rate Decision',
    date: 'Predict: Rate cut vs Hold vs Hike - Jan 29',
    impact: 'High' as const,
    category: 'Economic Events',
  },
  {
    id: '3',
    icon: <BoltFill size={24} />,
    title: 'Ethereum Shanghai Upgrade Impact',
    date: 'Predict: ETH price movement post-upgrade',
    impact: 'Medium' as const,
    category: 'Web3',
  },
  {
    id: '4',
    icon: <DollarsignCircleFill size={24} />,
    title: 'US GDP Growth Report',
    date: 'Predict: Growth rate - Feb 29',
    impact: 'Medium' as const,
    category: 'Economic Events',
  },
  {
    id: '5',
    icon: <BoltFill size={24} />,
    title: 'Solana Network Performance',
    date: 'Predict: TPS above 10k vs below',
    impact: 'Low' as const,
    category: 'Web3',
  },
  {
    id: '6',
    icon: <ChartLineUptrendXyaxis size={24} />,
    title: 'Fed Inflation CPI Release',
    date: 'Predict: Inflation rate - Mar 1',
    impact: 'Medium' as const,
    category: 'Economic Events',
  },
]

export default function EventPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = EVENTS.filter((event) => {
    const matchesCategory =
      activeCategory === 'All' || event.category === activeCategory
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground soft-shadow focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  No events found matching your search
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </IOSPageTransition>
  )
}
