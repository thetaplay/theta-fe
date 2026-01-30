'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { Flame } from '@/components/sf-symbols'
import { useFearGreedIndex } from '@/hooks/useFearGreedIndex'

const sentimentConfig = {
  'extreme-fear': { color: '#DC2626', label: 'Extreme Fear' },
  'fear': { color: '#F97316', label: 'Fear' },
  'neutral': { color: '#FBBF24', label: 'Neutral' },
  'greed': { color: '#84CC16', label: 'Greed' },
  'extreme-greed': { color: '#22C55E', label: 'Extreme Greed' },
}

// Map API classification to sentiment keys
const mapClassificationToSentiment = (classification: string): keyof typeof sentimentConfig => {
  const lower = classification.toLowerCase()
  if (lower.includes('extreme fear')) return 'extreme-fear'
  if (lower.includes('fear')) return 'fear'
  if (lower.includes('neutral')) return 'neutral'
  if (lower.includes('greed') && lower.includes('extreme')) return 'extreme-greed'
  if (lower.includes('greed')) return 'greed'
  return 'neutral' // Default
}

export function MarketSentimentCard() {
  const { data, isLoading, error } = useFearGreedIndex(300000) // Refresh every 5 minutes

  // Default values while loading
  const score = data ? parseInt(data.value.toString()) : 50
  const sentiment = data ? mapClassificationToSentiment(data.value_classification) : 'neutral'
  const config = sentimentConfig[sentiment]

  // Calculate volatility based on distance from neutral (50)
  const volatility = Math.abs(score - 50) * 2 // 0-100 scale

  if (error) {
    return (
      <div className="w-full bg-card border border-border rounded-3xl p-6 card-shadow">
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-red-500">Failed to load market sentiment data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Market Sentiment Analysis
          </h3>
          <h2 className="text-2xl font-bold text-foreground">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-lg">Loading...</span>
              </div>
            ) : (
              config.label
            )}
          </h2>
        </div>
        <div className="text-right">
          {!isLoading && (
            <>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 rounded-full bg-[#4CC658] animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Live</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Semi-circle Gauge */}
      <div className="mb-4 relative">
        <div className="relative w-full h-32 flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 120"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradient from red (fear) to green (greed) */}
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
                <stop offset="25%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                <stop offset="75%" style={{ stopColor: '#84CC16', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#22C55E', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Background track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              stroke="currentColor"
              strokeWidth="16"
              fill="none"
              className="text-border opacity-30"
            />

            {/* Colored gauge with gradient */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              stroke="url(#gaugeGradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
            />

            {/* Indicator needle */}
            <g transform={`translate(100, 100) rotate(${(score / 100) * 180 - 90})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke={config.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="0" cy="0" r="5" fill={config.color} />
              <circle cx="0" cy="0" r="3" fill="white" />
            </g>

            {/* Center score */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="fill-foreground font-bold"
              style={{ fontSize: '20px' }}
            >
              {isLoading ? '...' : score}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: '10px' }}
            >
              Fear & Greed
            </text>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs font-semibold text-muted-foreground px-1 mb-4">
        <span className="text-red-600">Extreme Fear</span>
        <span className="text-[#4CC658]">Extreme Greed</span>
      </div>

      {/* Volatility Bar */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-2">
            <Flame width={14} />
            Market Intensity
          </span>
          <span className="text-sm font-bold text-foreground">{volatility.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 via-yellow-400 to-[#4CC658]"
            style={{ width: `${volatility}%` }}
          />
        </div>
      </div>

      {/* Data source */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Data from Alternative.me • Updates every 5 min
        </p>
      </div>
    </div>
  )
}
