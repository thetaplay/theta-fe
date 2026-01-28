'use client'

import React from "react"
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
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

type DbEventDetail = {
  id: string
  title: string
  category: string
  date: string | null
  question: string | null
  why_it_matters: string[] | null
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [event, setEvent] = useState<DbEventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('id, title, category, date, question, why_it_matters')
        .eq('id', eventId)
        .maybeSingle()

      if (error) {
        setError(error.message)
      } else {
        setEvent(data as unknown as DbEventDetail)
      }
      setLoading(false)
    }
    if (eventId) fetchEvent()
  }, [eventId])

  const [selectedPrediction, setSelectedPrediction] = useState<string | null>('High Volatility')
  const [confidence, setConfidence] = useState(75)
  const [amount, setAmount] = useState('')
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
          title={event?.title ?? 'Event'}
          subtitle={event?.date ?? ''}
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
              {event?.why_it_matters?.map((point, index) => (
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

          {/* Amount Input */}
          <div className="mb-8 bg-card border border-border rounded-3xl p-6 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Trade Amount
            </h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-foreground">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-muted border-2 border-border rounded-2xl text-lg font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Enter the amount you want to trade
            </p>
          </div>

          {/* Prediction Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">
              {event?.question ?? ''}
            </h2>

            {/* Prediction Options */}
            <div className="grid grid-cols-2 gap-3">
              {PREDICTION_OPTIONS.map((option) => (
                <div
                  key={option.label}
                  className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selectedPrediction === option.label
                      ? option.label === 'High Volatility'
                        ? 'border-yellow-500 bg-yellow-100'
                        : 'border-blue-500 bg-blue-100'
                      : option.label === 'High Volatility'
                      ? 'border-border bg-yellow-50 hover:border-yellow-400'
                      : 'border-border bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`flex-shrink-0 text-3xl transition-colors ${
                        selectedPrediction === option.label
                          ? option.label === 'High Volatility'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
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
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Level */}
          <div className="mb-8 bg-card border border-border rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Confidence Level
              </h3>
              <span className="text-2xl font-bold text-primary">
                {confidence}%
              </span>
            </div>

            {/* Slider Track - Read Only */}
            <div className="relative mb-4 py-2">
              <div className="absolute inset-0 h-3 bg-muted rounded-full top-1/2 -translate-y-1/2"></div>
              <div 
                className="absolute h-3 bg-primary rounded-full top-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${confidence}%` }}
              ></div>
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
              disabled={!amount || !selectedPrediction || isSubmitting}
              className={`w-full mt-6 py-4 font-bold rounded-2xl transition-all duration-200 active:scale-95 ${
                amount && selectedPrediction && !isSubmitting
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
