'use client'

import React from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HouseFill, BoltFill, Calendar, BookFill, PersonFill } from './sf-symbols'

interface TabItem {
  icon: React.ReactNode
  label: string
  href: string
  isSpecial?: boolean
}

const tabs: TabItem[] = [
  {
    icon: <HouseFill size={24} />,
    label: 'Home',
    href: '/home',
  },
  {
    icon: <Calendar size={24} />,
    label: 'Event',
    href: '/event',
  },
  {
    icon: <BoltFill size={28} />,
    label: 'Trade',
    href: '/trade',
    isSpecial: true,
  },
  {
    icon: <BookFill size={24} />,
    label: 'Learn',
    href: '/learn',
  },
  {
    icon: <PersonFill size={24} />,
    label: 'Profile',
    href: '/profile',
  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      <div className="glass rounded-t-3xl border-t pointer-events-auto">
        <div className="flex items-end justify-between px-4 lg:px-12 py-3 safe-area-bottom max-w-6xl mx-auto w-full">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            const isSpecial = tab.isSpecial

            if (isSpecial) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center -mt-8"
                >
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#4CC658] rounded-full blur-xl opacity-30 group-active:scale-110 transition-transform duration-200" />
                    {/* Button */}
                    <div className="relative bg-[#4CC658] text-white rounded-full p-4 group-active:scale-90 transition-transform duration-150">
                      {tab.icon}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {tab.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl active:bg-muted/50 transition-colors duration-150"
              >
                <div
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-[#4CC658]' : 'text-muted-foreground'
                  }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive ? 'text-[#4CC658] font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BottomTabBar
