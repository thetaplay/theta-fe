'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { BoltFill, Flame } from '@/components/sf-symbols'

interface MarketSentimentCardProps {
  volatility: number // 0-100
  trend24h: number // positive or negative
  sentiment: 'extreme-fear' | 'fear' | 'neutral' | 'greed' | 'extreme-greed'
}

const sentimentConfig = {
  'extreme-fear': { color: '#DC2626', label: 'Extreme Fear', score: 10 },
  'fear': { color: '#F97316', label: 'Fear', score: 35 },
  'neutral': { color: '#FBBF24', label: 'Neutral', score: 50 },
  'greed': { color: '#84CC16', label: 'Greed', score: 75 },
  'extreme-greed': { color: '#22C55E', label: 'Extreme Greed', score: 90 },
}

export function MarketSentimentCard({ volatility, trend24h, sentiment }: MarketSentimentCardProps) {
  const config = sentimentConfig[sentiment]
  const score = config.score

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Market Sentiment Analysis
          </h3>
          <h2 className="text-2xl font-bold text-foreground">{config.label}</h2>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-1">
            {trend24h >= 0 ? (
              <TrendingUp className="text-[#4CC658]" size={18} fill="currentColor" />
            ) : (
              <TrendingDown className="text-red-500" size={18} fill="currentColor" />
            )}
            <span
              className={`text-lg font-bold ${
                trend24h >= 0 ? 'text-[#4CC658]' : 'text-red-500'
              }`}
            >
              {trend24h >= 0 ? '+' : ''}{trend24h.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">24h change</p>
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
              {score}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: '10px' }}
            >
              Market Score
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
            <Flame size={14} />
            Volatility Index
          </span>
          <span className="text-sm font-bold text-foreground">{volatility}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 via-yellow-400 to-[#4CC658]"
            style={{ width: `${volatility}%` }}
          />
        </div>
      </div>
    </div>
  )
}
