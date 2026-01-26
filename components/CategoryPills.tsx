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
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              isActive
                ? 'bg-green-500 text-white shadow-md shadow-green-500/50'
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
