'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

interface EventCardProps {
  id: string
  icon: ReactNode
  title: string
  date: string
  impact: 'High' | 'Medium' | 'Low'
  category: 'Crypto Events' | 'Economic Events' | 'Web3'
}

const impactColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-blue-100 text-blue-700',
}

const iconContainerColors = {
  'Crypto Events': 'bg-blue-100 text-blue-600',
  'Economic Events': 'bg-orange-100 text-orange-600',
  'Web3': 'bg-[#4CC658]/20 text-[#4CC658]',
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
    iconContainerColors['Crypto Events']

  return (
    <Link href={`/event/${id}`}>
      <div className="group my-2.5 relative bg-gradient-to-br from-card to-muted/20 border border-border rounded-3xl p-4 shadow-[0_4px_0_0_#cbd5e1] hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-4">
        {/* Icon/Photo - Left Side */}
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${containerColor}`}
        >
          <div className={cn("text-3xl")}>{icon}</div>
        </div>

        {/* Content - Middle (Left Aligned) */}
        <div className="flex-1 min-w-0">
          {/* Risk Badge - Top */}
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2 ${impactColors[impact]
              }`}
          >
            {impact}
          </span>

          {/* Title */}
          <h3 className="text-sm font-bold text-foreground truncate">
            {title}
          </h3>

          {/* Predict Description */}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{date}</p>
        </div>
      </div>
    </Link>
  )
}
