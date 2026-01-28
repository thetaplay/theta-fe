'use client'

import { ReactNode } from 'react'

interface CategoryPillsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryPills({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isActive = category === activeCategory

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              isActive
                ? 'bg-[#4CC658] text-slate-900 shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px]'
                : 'bg-muted text-foreground border border-border'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
