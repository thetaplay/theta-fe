'use client'

import { useState } from 'react'
import IOSPageTransition from '@/components/layout/IOSPageTransition'
import { OptionsDisplay } from '@/components/trade/OptionsDisplay'
import { useMockUSDC } from '@/hooks/useMockUSDC'
import { ExclamationmarkCircle } from '@/components/sf-symbols'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

type TradeStep = 'goal' | 'risk' | 'strategy' | 'preview' | 'options' | 'success'

const GOALS = [
  {
    id: 'protect',
    title: 'Protect my assets',
    description: 'Hedge against market drops',
    icon: '🛡️',
    color: 'bg-orange-100',
  },
  {
    id: 'upside',
    title: 'Capture upside',
    description: 'Profit from price increases',
    icon: '📈',
    color: 'bg-blue-100',
  },
  {
    id: 'earn',
    title: 'Earn safely',
    description: 'Generate steady income',
    icon: '💰',
    color: 'bg-[#4CC658]/20',
  },
]

const RISK_LEVELS = [
  {
    id: 'conservative',
    title: 'Conservative',
    description: 'Safe & steady',
    icon: '🛡️',
  },
  {
    id: 'moderate',
    title: 'Moderate',
    description: 'A balanced mix',
    icon: '⚖️',
  },
  {
    id: 'aggressive',
    title: 'Aggressive',
    description: 'Higher potential, higher swings',
    icon: '⚡',
  },
]

const STRATEGIES = [
  {
    id: 'safety-shield',
    confidence: 'LOW',
    title: 'The Safety Shield',
    subtitle: 'Protective Put',
    description: 'Keeps your profits safe even if the market crashes. Like insurance for your assets.',
    icon: '🛡️',
  },
  {
    id: 'steady-climber',
    confidence: "MID",
    title: 'The Steady Climber',
    subtitle: 'Covered Call',
    description: 'Earn steady extra income while you wait for your assets to grow slowly.',
    icon: '📈',
  },
  {
    id: 'moonshot',
    confidence: 'HIGH',
    title: 'Moonshot Booster',
    subtitle: 'Call Spread',
    description: 'Magnify your gains when you\'re feeling very confident about a price jump.',
    icon: '🚀',
  },
]

export default function TradePage() {
  const [step, setStep] = useState<TradeStep>('goal')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { balance, isLoading: balanceLoading } = useMockUSDC()
  const userBalance = parseFloat(balance || '0')

  const router = useRouter()

  // Zod schema for form validation
  const formSchema = z.object({
    goal: z.string().min(1, 'Please select a goal'),
    risk: z.string().min(1, 'Please select a risk level'),
    strategy: z.string().min(1, 'Please select a strategy'),
    amount: z.string()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(parseFloat(val)), { message: 'Please enter a valid number' })
      .refine((val) => parseFloat(val) > 0, { message: 'Amount must be greater than 0' })
      .refine((val) => parseFloat(val) >= 1, { message: 'Minimum amount is $1' })
      .refine((val) => parseFloat(val) <= 10000, { message: 'Maximum amount is $10,000' })
      .refine((val) => parseFloat(val) <= userBalance, {
        message: `Insufficient balance. You have $${userBalance.toFixed(2)}`
      }),
  })

  type FormData = z.infer<typeof formSchema>

  // React Hook Form
  const {
    formState: { errors: formErrors },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: '',
      risk: '',
      strategy: '',
      amount: '',
    },
    mode: 'onChange',
  })

  // Watch form values
  const selectedGoal = watch('goal')
  const selectedRisk = watch('risk')
  const selectedStrategy = watch('strategy')
  const selectedAmount = watch('amount')

  // Check if current step is valid
  const isStepValid = () => {
    switch (step) {
      case 'goal':
        return !!selectedGoal && !formErrors.goal
      case 'risk':
        return !!selectedRisk && !formErrors.risk
      case 'strategy':
        return !!selectedStrategy && !formErrors.strategy
      case 'preview':
        return !!selectedAmount && !formErrors.amount && agreedToTerms
      default:
        return false
    }
  }

  const handleContinue = async () => {
    // Validate current step fields before proceeding
    let isValid = false

    if (step === 'goal') {
      isValid = await trigger('goal')
      if (isValid) setStep('risk')
    } else if (step === 'risk') {
      isValid = await trigger('risk')
      if (isValid) setStep('strategy')
    } else if (step === 'strategy') {
      isValid = await trigger('strategy')
      if (isValid) setStep('preview')
    } else if (step === 'preview') {
      isValid = await trigger('amount')
      if (isValid && agreedToTerms) setStep('options')
    }
  }

  const handleBack = () => {
    if (step === 'risk') setStep('goal')
    else if (step === 'strategy') setStep('risk')
    else if (step === 'preview') setStep('strategy')
    else if (step === 'options') setStep('preview')
  }

  const getStepNumber = () => {
    switch (step) {
      case 'goal': return 1
      case 'risk': return 2
      case 'strategy': return 3
      case 'preview': return 4
      case 'options': return 4
      default: return 0
    }
  }

  const getProgressWidth = () => {
    const stepNum = getStepNumber()
    return stepNum > 0 ? `${(stepNum / 4) * 100}%` : '0%'
  }

  if (step === 'goal') {
    return (
      <IOSPageTransition>
        <div className="fixed inset-0 w-screen h-screen flex flex-col bg-slate-50 z-[9999]">
          {/* Header with Progress */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-white/95 border-b border-slate-100 z-10">
            <div className="w-10"></div>
            <div className="flex-1 px-4">
              <div className="flex gap-1 justify-center">
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">What's your goal?</h2>
              <p className="text-sm font-medium text-slate-500">I'll help you find the best strategy.</p>
            </div>

            <div className="space-y-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setValue('goal', goal.id, { shouldValidate: true })}
                  className={`w-full text-left p-6 rounded-3xl border-2 flex items-center gap-5 transition-all ${selectedGoal === goal.id
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/20 shadow-lg'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${goal.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-extrabold text-slate-900 leading-tight">{goal.title}</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">{goal.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 pt-10">
            <button
              onClick={handleContinue}
              disabled={!isStepValid()}
              className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'risk') {
    return (
      <IOSPageTransition>
        <div className="fixed inset-0 w-screen h-screen flex flex-col bg-slate-50 z-[9999]">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-white/95 border-b border-slate-100 z-10">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              ←
            </button>
            <div className="flex-1 px-4">
              <div className="flex gap-1 justify-center">
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">How much risk are you comfortable with?</h2>
              <p className="text-sm font-medium text-slate-500">Pick your style to see personalized options.</p>
            </div>

            <div className="space-y-4 mb-8">
              {RISK_LEVELS.map((risk) => (
                <button
                  key={risk.id}
                  onClick={() => setValue('risk', risk.id, { shouldValidate: true })}
                  className={`w-full text-left p-5 rounded-3xl border-2 flex items-center gap-4 transition-all ${selectedRisk === risk.id
                    ? 'border-primary bg-white ring-4 ring-primary/20'
                    : 'border-slate-100 bg-white/50 hover:border-slate-200'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${risk.id === 'conservative' ? 'bg-blue-50' :
                    risk.id === 'moderate' ? 'bg-purple-50' : 'bg-orange-50'
                    }`}>
                    {risk.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{risk.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{risk.description}</p>
                  </div>
                </button>
              ))}
            </div>


          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50">
            <button
              onClick={handleContinue}
              disabled={!isStepValid()}
              className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'strategy') {
    return (
      <IOSPageTransition>
        <div className="fixed inset-0 w-screen h-screen flex flex-col bg-white z-[9999]">
          {/* Header */}
          <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex gap-1 justify-center">
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
                <div className="h-1.5 w-6 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Which protection strategy suits your needs?</h1>
              <p className="text-slate-500 font-medium">AI recommended based on your profile</p>
            </div>

            <div className="space-y-4">
              {STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => setValue('strategy', strategy.id, { shouldValidate: true })}
                  className={`w-full text-left p-5 rounded-3xl border-2 flex gap-4 transition-all ${selectedStrategy === strategy.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{strategy.title}</h3>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{strategy.subtitle}</p>
                    <p className="text-sm font-medium text-slate-600 mt-2 leading-snug">{strategy.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white space-y-4">
            <button
              onClick={handleContinue}
              disabled={!selectedGoal}
              className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'preview') {
    // Risk profile mapping based on selections
    const getRiskProfile = () => {
      const profiles = {
        'protect-conservative': { label: 'Very Conservative', reward: 'Low', rewardPercent: 30, risk: 'Very Low', riskPercent: 15 },
        'protect-moderate': { label: 'Conservative', reward: 'Medium', rewardPercent: 50, risk: 'Low', riskPercent: 30 },
        'protect-aggressive': { label: 'Balanced', reward: 'High', rewardPercent: 70, risk: 'Medium', riskPercent: 50 },
        'upside-conservative': { label: 'Balanced', reward: 'Medium', rewardPercent: 55, risk: 'Low', riskPercent: 35 },
        'upside-moderate': { label: 'Moderate', reward: 'High', rewardPercent: 75, risk: 'Medium', riskPercent: 55 },
        'upside-aggressive': { label: 'Aggressive', reward: 'Very High', rewardPercent: 90, risk: 'High', riskPercent: 75 },
        'earn-conservative': { label: 'Very Conservative', reward: 'Low', rewardPercent: 25, risk: 'Very Low', riskPercent: 10 },
        'earn-moderate': { label: 'Conservative', reward: 'Medium', rewardPercent: 45, risk: 'Low', riskPercent: 25 },
        'earn-aggressive': { label: 'Balanced', reward: 'Medium-High', rewardPercent: 65, risk: 'Medium', riskPercent: 45 },
      }

      const key = `${selectedGoal}-${selectedRisk}` as keyof typeof profiles
      return profiles[key] || profiles['protect-moderate']
    }

    // Scenarios based on strategy
    const getScenarios = () => {
      const scenarios = {
        'safety-shield': {
          scenario1: { icon: '🛡️', title: 'Market Drops', description: 'Protected by your shield strategy', emoji: '✓', bg: 'bg-primary/10' },
          scenario2: { icon: '📊', title: 'Market Stable', description: 'Minimal loss from premium paid', emoji: '➖', bg: 'bg-slate-100' },
        },
        'steady-climber': {
          scenario1: { icon: '💰', title: 'Market Stable', description: 'Earn steady premium income', emoji: '✓', bg: 'bg-green-100' },
          scenario2: { icon: '📈', title: 'Market Rises Moderately', description: 'Keep premium + asset gains', emoji: '✓', bg: 'bg-primary/10' },
        },
        'moonshot': {
          scenario1: { icon: '🚀', title: 'Market Rises', description: 'Magnified upside potential', emoji: '📈', bg: 'bg-purple-100' },
          scenario2: { icon: '📉', title: 'Market Drops', description: 'Limited downside exposure', emoji: '⚠️', bg: 'bg-orange-100' },
        },
      }

      return scenarios[selectedStrategy as keyof typeof scenarios] || scenarios['safety-shield']
    }

    const riskProfile = getRiskProfile()
    const scenarios = getScenarios()

    return (
      <IOSPageTransition>
        <div className="fixed inset-0 w-screen h-screen flex flex-col bg-white z-[9999]">
          {/* Header */}
          <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex gap-1 justify-center">
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
                <div className="h-1.5 w-6 rounded-full bg-primary"></div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="text-center space-y-1 mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900">Ready to go?</h1>
              <p className="text-slate-500 font-medium">Double-check your setup</p>
            </div>

            {/* Risk Profile Card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase text-slate-400">Risk Profile</span>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase">
                  {riskProfile.label}
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-600">Potential Reward</span>
                    <span className="text-xl font-black text-primary">{riskProfile.reward}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${riskProfile.rewardPercent}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-600">Potential Risk</span>
                    <span className="text-xl font-black text-purple-500">{riskProfile.risk}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${riskProfile.riskPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden mb-6">
              <div className={`p-4 border-b border-slate-200 flex items-center gap-4`}>
                <div className={`w-10 h-10 ${scenarios.scenario1.bg} rounded-xl flex items-center justify-center`}>
                  {scenarios.scenario1.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">{scenarios.scenario1.title}</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">{scenarios.scenario1.description}</p>
                </div>
                <span className="text-primary">{scenarios.scenario1.emoji}</span>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 ${scenarios.scenario2.bg} rounded-xl flex items-center justify-center`}>
                  {scenarios.scenario2.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">{scenarios.scenario2.title}</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">{scenarios.scenario2.description}</p>
                </div>
                <span className="text-purple-500">{scenarios.scenario2.emoji}</span>
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
                  value={selectedAmount}
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

            {/* Terms Checkbox */}
            <label className="flex items-center gap-4 bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-6 h-6 rounded"
              />
              <span className="text-sm font-bold text-slate-900">I've reviewed my possible outcomes</span>
            </label>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white space-y-4">
            <button
              onClick={() => {
                const selectedStrategyObj = STRATEGIES.find(s => s.id === selectedStrategy)
                const profile = {
                  goal: selectedGoal || 'protect',
                  riskComfort: selectedRisk || 'conservative',
                  confidence: selectedStrategyObj?.confidence || 'MID',
                  amount: parseFloat(selectedAmount) || 100,
                }
                console.log(profile)
                handleContinue()
              }}
              disabled={!isStepValid()}
              className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Find Options like my References 🔍
            </button>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'options') {
    const selectedStrategyObj = STRATEGIES.find(s => s.id === selectedStrategy)

    const profile = {
      goal: selectedGoal || 'protect',
      riskComfort: selectedRisk || 'conservative',
      confidence: selectedStrategyObj?.confidence || 'MID',
      amount: parseFloat(selectedAmount) || 100,
    }

    return (
      <OptionsDisplay
        profile={profile}
        onBack={handleBack}
        onSuccess={() => setStep('success')}
      />
    )
  }

  if (step === 'success') {
    return (
      <IOSPageTransition>
        <div className="fixed inset-0 w-screen h-screen flex flex-col bg-slate-50 items-center justify-center z-[9999] overflow-hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

          <div className="relative w-[90%] max-w-[400px] bg-white rounded-[40px] p-8 shadow-2xl z-50 flex flex-col items-center text-center">
            {/* Confetti */}
            <div className="absolute top-0 inset-x-0 h-32 pointer-events-none overflow-hidden">
              <div className="absolute w-2 h-2 bg-blue-400 rounded-sm top-4 left-10 rotate-45"></div>
              <div className="absolute w-2 h-2 bg-yellow-400 rounded-sm top-10 left-20 -rotate-12"></div>
              <div className="absolute w-2 h-2 bg-red-400 rounded-sm top-6 right-16 rotate-12"></div>
            </div>

            {/* Icon */}
            <div className="relative mt-4 mb-6">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-6xl">🎉</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white border-4 border-primary rounded-full flex items-center justify-center">
                <span>👍</span>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2 mb-8">
              <h1 className="text-3xl font-black text-slate-900">Trade Executed!</h1>
              <p className="text-slate-500 font-bold">Your position is now active.</p>
            </div>

            {/* Achievement */}
            <div className="w-full bg-purple-50 border-2 border-purple-200 rounded-3xl p-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  ⭐
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-purple-600 uppercase">Achievement</p>
                  <p className="text-sm font-black text-slate-900">Trade Master</p>
                </div>
              </div>
              <span className="text-purple-600 font-black text-lg">+50 XP</span>
            </div>

            {/* Buttons */}
            <div className="w-full space-y-4">
              <button
                onClick={() => router.push('/profile')}
                className="w-full py-4 px-6 bg-[#4CC658] text-slate-900 font-bold rounded-2xl shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] transition-all"
              >
                View Portfolio
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full text-slate-400 hover:text-slate-600 font-black text-lg py-2"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  return null
}
