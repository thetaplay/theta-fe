'use client'

import React from "react"
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { IOSHeader } from '@/components/IOSHeader'
import { ArrowtriangleUpFill, ArrowtriangleDownFill, ExclamationmarkCircle } from '@/components/sf-symbols'
import IOSPageTransition from '@/components/IOSPageTransition'

interface PredictionOption {
  label: string
  icon: React.ReactNode
  description: string
}

const PREDICTION_OPTIONS: PredictionOption[] = [
  {
    label: 'High Volatility',
    icon: <ArrowtriangleUpFill size={24} />,
    description: 'Market will be very volatile',
  },
  {
    label: 'Low Volatility',
    icon: <ArrowtriangleDownFill size={24} />,
    description: 'Market will be stable',
  },
]

const EVENT_DETAILS = {
  '1': {
    title: 'Federal Reserve Rate Decision',
    category: 'Macro',
    date: 'Jan 29, 2:00 PM EST',
    question: 'Will the Fed raise interest rates?',
    whyItMatters: [
      'Affects mortgage rates and borrowing costs',
      'Could impact stock and bond markets',
      'Inflation control policy indicator',
      'Global economic sentiment driver',
    ],
  },
  '2': {
    title: 'Bitcoin Halving Event',
    category: 'Crypto',
    date: 'Feb 15, 12:00 AM UTC',
    question: 'How will Bitcoin price react?',
    whyItMatters: [
      'Supply of new Bitcoin will be cut in half',
      'Historical catalyst for price movements',
      'Impact on mining economics',
      'Broader crypto market sentiment',
    ],
  },
  '3': {
    title: 'Apple Q1 Earnings Report',
    category: 'Corporate',
    date: 'Jan 30, 4:30 PM EST',
    question: 'Will Apple beat earnings estimates?',
    whyItMatters: [
      'Major indicator of tech sector health',
      'Affects AAPL stock and market indices',
      'Consumer spending trends signal',
      'Guidance for next quarter important',
    ],
  },
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const event = EVENT_DETAILS[eventId as keyof typeof EVENT_DETAILS] || EVENT_DETAILS['1']

  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(50)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedPrediction) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)

    // Show success feedback
    alert(`Prediction submitted!\nOption: ${selectedPrediction}\nConfidence: ${confidence}%`)
  }

  return (
    <IOSPageTransition>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <IOSHeader
          title={event.title}
          subtitle={event.date}
          showBack
          onBack={() => router.back()}
          rightContent={<div />}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 mt-0">
          {/* Why It Matters Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">
              Why It Matters
            </h2>
            <div className="bg-card border border-border rounded-3xl p-5 space-y-3">
              {event.whyItMatters.map((point, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">
              {event.question}
            </h2>

            {/* Prediction Options */}
            <div className="grid grid-cols-2 gap-3">
              {PREDICTION_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedPrediction(option.label)}
                  className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                    selectedPrediction === option.label
                      ? option.label === 'High Volatility'
                        ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                        : 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
                      : option.label === 'High Volatility'
                      ? 'border-border bg-yellow-50 dark:bg-yellow-900/10 hover:border-yellow-400'
                      : 'border-border bg-blue-50 dark:bg-blue-900/10 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`flex-shrink-0 text-3xl transition-colors ${
                        selectedPrediction === option.label
                          ? option.label === 'High Volatility'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-blue-600 dark:text-blue-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        {option.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="mb-8 bg-card border border-border rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Your Confidence
              </h3>
              <span className="text-2xl font-bold text-primary">
                {confidence}%
              </span>
            </div>

            {/* Slider Track */}
            <div className="relative mb-4 py-2">
              <div className="absolute inset-0 h-3 bg-muted rounded-full top-1/2 -translate-y-1/2"></div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="relative w-full h-3 rounded-full appearance-none cursor-pointer z-10"
                style={{
                  background: `linear-gradient(to right, hsl(var(--color-primary)) 0%, hsl(var(--color-primary)) ${confidence}%, transparent ${confidence}%, transparent 100%)`,
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedPrediction || isSubmitting}
              className={`w-full mt-6 py-4 font-bold rounded-2xl transition-all duration-200 active:scale-95 ${
                selectedPrediction && !isSubmitting
                  ? 'bg-primary text-white hover:shadow-lg border-b-4 border-primary-dark active:border-b-0 active:translate-y-[2px]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Prediction'}
            </button>
          </div>
        </div>
      </div>
    </IOSPageTransition>
  )
}
