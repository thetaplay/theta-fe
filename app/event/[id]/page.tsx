'use client'

import React from "react"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { IOSHeader } from '@/components/layout/IOSHeader'
import { ExclamationmarkCircle, BoltFill } from '@/components/sf-symbols'
import IOSPageTransition from '@/components/layout/IOSPageTransition'
import { Waves, Lightbulb, Loader2 } from "lucide-react"
import { useMockUSDC } from '@/hooks/useMockUSDC'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from "@/lib/utils"
import { PageLayout } from "@/components/layout/PageLayout"

interface PredictionOption {
  label: string
  icon: React.ReactNode
  description: string
  style: string
}

const PREDICTION_OPTIONS: PredictionOption[] = [
  {
    label: 'High Volatility',
    icon: <BoltFill className="text-yellow-600 p-3 bg-yellow-100 rounded-full" size={48} />,
    description: 'Market will be very volatile',
    style: 'border-yellow-500 bg-white',
  },
  {
    label: 'Low Volatility',
    icon: <Waves className="text-blue-600 p-3 bg-blue-100 rounded-full" size={48} />,
    description: 'Market will be stable',
    style: 'border-blue-500 bg-white',
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
  const [recommendation, setRecommendation] = useState<any>(null)

  // Get user balance
  const { balance, isLoading: balanceLoading } = useMockUSDC()
  const userBalance = parseFloat(balance || '0')

  // Zod validation schema
  const formSchema = z.object({
    amount: z.string()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(parseFloat(val)), { message: 'Please enter a valid number' })
      .refine((val) => parseFloat(val) > 0, { message: 'Amount must be greater than 0' })
      .refine((val) => parseFloat(val) >= 1, { message: 'Minimum amount is $1' })
      .refine((val) => parseFloat(val) <= 10000, { message: 'Maximum amount is $10,000' })
      .refine((val) => parseFloat(val) <= userBalance, {
        message: `Insufficient balance. You have $${userBalance.toFixed(2)}`
      }),
    prediction: z.string().min(1, 'Please select a prediction option'),
    confidence: z.number()
      .min(1, 'Confidence must be at least 1%')
      .max(100, 'Confidence cannot exceed 100%'),
  })

  type FormData = z.infer<typeof formSchema>

  // React Hook Form
  const {
    handleSubmit: handleFormSubmit,
    formState: { errors: formErrors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      prediction: '', // Default: tidak ada yang dipilih
      confidence: 0, // Default 75%
    },
    mode: 'onChange', // Validate on change
  })

  // Watch form values
  const selectedPrediction = watch('prediction')
  const confidence = watch('confidence')
  const amount = watch('amount')

  // Fetch event data
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

  // Handle confidence slider change
  const handleConfidenceChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value))
    setValue('confidence', clampedValue, { shouldValidate: true })
  }

  // Handle prediction selection
  const handlePredictionSelect = (prediction: string) => {
    setValue('prediction', prediction, { shouldValidate: true })
  }

  // Form submit handler
  const onSubmit = async (data: FormData) => {
    try {
      // Map prediction and confidence to API format
      const goal = data.prediction === 'High Volatility' ? 'CAPTURE_UPSIDE' : 'PROTECT_ASSET'
      const confidenceLevel = data.confidence < 33 ? 'LOW' : data.confidence < 66 ? 'MID' : 'HIGH'
      const riskComfort = data.confidence < 33 ? 'CONSERVATIVE' : data.confidence < 66 ? 'MODERATE' : 'AGGRESSIVE'

      // Call recommendations API
      const params = new URLSearchParams({
        goal,
        riskComfort,
        confidence: confidenceLevel,
        amount: data.amount,
      })

      const res = await fetch(`/api/recommendations?${params}`)
      if (!res.ok) throw new Error('Failed to fetch recommendations')

      const { recommendations } = await res.json()

      // Get first recommendation
      if (recommendations && recommendations.length > 0) {
        setRecommendation(recommendations[0])

        // Success feedback with recommendation details
        const option = recommendations[0]
        alert(
          `Prediction submitted successfully!\n\n` +
          `Option: ${data.prediction}\n` +
          `Amount: $${data.amount}\n` +
          `Confidence: ${data.confidence}%\n\n` +
          `Recommended: ${option.type.toUpperCase()}\n` +
          `Strike: $${option.strike}\n` +
          `Premium: $${option.premium}\n` +
          `Potential Profit: $${option.maxProfit}`
        )
      }
    } catch (error) {
      console.error('Failed to get recommendation:', error)
      alert('Failed to get recommendation. Please try again.')
    }
  }

  return (
    <PageLayout title={event?.title ?? 'Event'} subtitle={event?.date ?? ''} withTransition={true} showBack onBack={() => router.back()} >
      {/* Main Content */}
      <form
        onSubmit={handleFormSubmit(onSubmit)}
        className=""
      >
        {/* Why It Matters Section */}
        <div className="mb-8">
          <div className="bg-card border border-border rounded-3xl p-5 space-y-3">
            <h2 className="text-xl font-bold text-foreground mb-4 text-center">
              <Lightbulb className="inline-block mr-2 text-primary" size={24} /> Why It Matters
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : event?.why_it_matters?.map((point, index) => (
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Trade Amount (USDC)
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Balance:</span>
              {balanceLoading ? (
                <div className="w-16 h-4 bg-muted animate-pulse rounded" />
              ) : (
                <span className="text-sm font-bold text-primary">
                  ${userBalance.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-foreground">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setValue('amount', e.target.value, { shouldValidate: true })}
              placeholder="0.00"
              min="1"
              max={Math.min(10000, userBalance)}
              step="0.01"
              className={`w-full pl-10 pr-4 py-4 bg-muted border-2 rounded-2xl text-lg font-bold text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${formErrors.amount ? 'border-red-500 focus:border-red-600' : 'border-border focus:border-primary'
                }`}
            />
          </div>
          {formErrors.amount && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <ExclamationmarkCircle width={12} />
              {formErrors.amount.message}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>Min: $1</span>
            <span>Max: ${Math.min(10000, userBalance).toFixed(2)}</span>
          </div>
        </div>

        {/* Prediction Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">
            {event?.question ?? ''} market volatility will be..
          </h2>

          {/* Prediction Options */}
          <div className="grid grid-cols-2 gap-3">
            {PREDICTION_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => handlePredictionSelect(option.label)}
                className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 text-left ${selectedPrediction === option.label
                  ? option.style
                  : 'border-border bg-card hover:border-primary/30'
                  }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex-shrink-0 text-3xl">
                    {option.icon}
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-semibold text-sm">
                      {option.label}
                    </p>
                    <p className={`text-xs mt-1 ${selectedPrediction === option.label ? 'opacity-90' : 'text-muted-foreground'
                      }`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Prediction Error */}
          {formErrors.prediction && (
            <p className="text-xs text-red-500 mt-3 flex items-center gap-1">
              <ExclamationmarkCircle width={12} />
              {formErrors.prediction.message}
            </p>
          )}
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

          {/* Interactive Slider */}
          <div className="relative mb-4 py-2">
            {/* Background Track */}
            <div className="absolute inset-0 h-3 bg-muted rounded-full top-1/2 -translate-y-1/2"></div>

            {/* Filled Track */}
            <div
              className="absolute h-3 bg-primary rounded-full top-1/2 -translate-y-1/2 transition-all duration-150"
              style={{ width: `${confidence}%` }}
            ></div>

            {/* Hidden Range Input (for functionality) */}
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => handleConfidenceChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Visible Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg transition-all duration-150 pointer-events-none"
              style={{ left: `calc(${confidence}% - 12px)` }}
            ></div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-muted-foreground font-medium mb-4">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          {/* Confidence Description */}
          <div className={cn("rounded-xl p-3 mb-4", confidence < 33 ? "bg-red-100 text-red-500" : confidence < 66 ? "bg-yellow-100 text-yellow-500" : "bg-green-100 text-green-500")}>
            <p className="text-xs text-center">
              {confidence < 33 && "Low confidence - You're uncertain about this prediction"}
              {confidence >= 33 && confidence < 66 && "Medium confidence - You have some conviction"}
              {confidence >= 66 && "High confidence - You're very sure about this prediction"}
            </p>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-4 font-bold rounded-2xl transition-all duration-200 active:scale-95 ${isValid && !isSubmitting
              ? 'bg-primary text-white hover:shadow-lg border-b-4 border-primary-dark active:border-b-0 active:translate-y-[2px]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              'Submit Prediction'
            )}
          </button>
        </div>
      </form>
    </PageLayout>
  )
}
