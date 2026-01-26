'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Flame } from 'lucide-react'

interface MarketSentimentCardProps {
  volatility: number // 0-100
  trend24h: number // positive or negative
  sentiment: 'calm' | 'windy' | 'storm'
}

const sentimentConfig = {
  calm: { color: '#86EFB0', label: 'Calm', description: 'Low volatility' },
  windy: { color: '#FBBF24', label: 'Windy', description: 'Moderate volatility' },
  storm: { color: '#FCA5A5', label: 'Storm', description: 'High volatility' },
}

export function MarketSentimentCard({ volatility, trend24h, sentiment }: MarketSentimentCardProps) {
  const config = sentimentConfig[sentiment]

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Market Sentiment
          </h3>
          <h2 className="text-3xl font-bold text-foreground">{config.label}</h2>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-2">
            {trend24h >= 0 ? (
              <TrendingUp className="text-green-500" size={20} fill="currentColor" />
            ) : (
              <TrendingDown className="text-red-500" size={20} fill="currentColor" />
            )}
            <span
              className={`text-xl font-bold ${
                trend24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trend24h >= 0 ? '+' : ''}{trend24h.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">24h change</p>
        </div>
      </div>

      {/* Semi-circle Gauge */}
      <div className="mb-6">
        <div className="relative w-full h-24">
          {/* Background semi-circle */}
          <svg
            className="w-full h-full"
            viewBox="0 0 300 150"
            preserveAspectRatio="none"
          >
            {/* Background track */}
            <path
              d="M 30 140 A 110 110 0 0 1 270 140"
              stroke="currentColor"
              strokeWidth="20"
              fill="none"
              className="text-border"
            />

            {/* Colored segments */}
            <path
              d="M 30 140 A 110 110 0 0 1 110 60"
              stroke="#86EFB0"
              strokeWidth="20"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 110 60 A 110 110 0 0 1 190 60"
              stroke="#FBBF24"
              strokeWidth="20"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 190 60 A 110 110 0 0 1 270 140"
              stroke="#FCA5A5"
              strokeWidth="20"
              fill="none"
              opacity="0.3"
            />

            {/* Indicator needle */}
            <g transform={`translate(150, 140) rotate(${(volatility / 100) * 180 - 90})`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-95"
                stroke={config.color}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="0" cy="0" r="6" fill={config.color} />
            </g>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs font-semibold text-muted-foreground px-2">
        <span>Calm</span>
        <span>Moderate</span>
        <span>Storm</span>
      </div>

      {/* Volatility Bar */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-2">
            <Flame size={14} className="text-orange-500" />
            Volatility Index
          </span>
          <span className="text-sm font-bold text-foreground">{volatility}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"
            style={{ width: `${volatility}%` }}
          />
        </div>
      </div>
    </div>
  )
}
