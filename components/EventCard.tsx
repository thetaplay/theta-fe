'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface EventCardProps {
  id: string
  icon: ReactNode
  title: string
  date: string
  impact: 'High' | 'Medium' | 'Low'
  category: string
}

const impactColors = {
  High: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
}

const iconContainerColors = {
  Macro: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Crypto: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  Corporate: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  Other: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
}

export function EventCard({
  id,
  icon,
  title,
  date,
  impact,
  category,
}: EventCardProps) {
  const containerColor =
    iconContainerColors[category as keyof typeof iconContainerColors] ||
    iconContainerColors.Other

  return (
    <Link href={`/event/${id}`}>
      <div className="group my-2.5 relative bg-card border border-border rounded-3xl p-4 card-shadow hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer">
        {/* Risk Badge - Top Right */}
        <div className="flex justify-end mb-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
              impactColors[impact]
            }`}
          >
            {impact}
          </span>
        </div>

        <div className="flex items-start gap-3">
          {/* Trade Button - Left Side */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="btn-icon flex-shrink-0 text-xs font-bold whitespace-nowrap"
          >
            Trade
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{date}</p>
          </div>

          {/* Icon Container - Right Side */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${containerColor}`}
          >
            <div className="text-lg">{icon}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
