'use client'

import { useState } from 'react'
import IOSPageTransition from '@/components/IOSPageTransition'

type TradeStep = 'goal' | 'risk' | 'strategy' | 'preview' | 'success'

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
    color: 'bg-emerald-100',
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
    title: 'The Safety Shield',
    subtitle: 'Protective Put',
    description: 'Keeps your profits safe even if the market crashes. Like insurance for your assets.',
    icon: '🛡️',
  },
  {
    id: 'steady-climber',
    title: 'The Steady Climber',
    subtitle: 'Covered Call',
    description: 'Earn steady extra income while you wait for your assets to grow slowly.',
    icon: '📈',
  },
  {
    id: 'moonshot',
    title: 'Moonshot Booster',
    subtitle: 'Call Spread',
    description: 'Magnify your gains when you\'re feeling very confident about a price jump.',
    icon: '🚀',
  },
]

export default function TradePage() {
  const [step, setStep] = useState<TradeStep>('goal')
  const [selectedGoal, setSelectedGoal] = useState<string | null>('upside')
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)
  const [tradeAmount, setTradeAmount] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>('safety-shield')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleContinue = () => {
    if (step === 'goal' && selectedGoal) setStep('risk')
    else if (step === 'risk' && selectedRisk && tradeAmount) setStep('strategy')
    else if (step === 'strategy' && selectedStrategy) setStep('preview')
    else if (step === 'preview' && agreedToTerms) setStep('success')
  }

  const handleBack = () => {
    if (step === 'risk') setStep('goal')
    else if (step === 'strategy') setStep('risk')
    else if (step === 'preview') setStep('strategy')
  }

  const getStepNumber = () => {
    switch (step) {
      case 'goal': return 1
      case 'risk': return 2
      case 'strategy': return 3
      case 'preview': return 4
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
        <div className="w-full h-screen flex flex-col bg-slate-50">
          {/* Header with Progress */}
          <div className="px-6 pt-12 pb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: getProgressWidth() }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Step 1 of 3
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24">
            <div className="text-center mb-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center text-5xl">
                💭
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">What's your goal?</h1>
              <p className="text-slate-500 font-medium">I'll help you find the best strategy.</p>
            </div>

            <div className="space-y-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full text-left p-6 rounded-3xl border-2 flex items-center gap-5 transition-all ${
                    selectedGoal === goal.id
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
                  {selectedGoal === goal.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-900 font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 pt-10">
            <button
              onClick={handleContinue}
              disabled={!selectedGoal}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-200 text-slate-900 disabled:text-slate-400 font-extrabold py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Continue →
            </button>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'risk') {
    return (
      <IOSPageTransition>
        <div className="w-full h-screen flex flex-col bg-slate-50">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-white/95 border-b border-slate-100 z-10">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              ←
            </button>
            <div className="flex-1 px-8">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: '50%' }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-400 w-10 text-right">2/4</span>
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
                  onClick={() => setSelectedRisk(risk.id)}
                  className={`w-full text-left p-5 rounded-3xl border-2 flex items-center gap-4 transition-all ${
                    selectedRisk === risk.id
                      ? 'border-primary bg-white ring-4 ring-primary/20'
                      : 'border-slate-100 bg-white/50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    risk.id === 'conservative' ? 'bg-blue-50' :
                    risk.id === 'moderate' ? 'bg-purple-50' : 'bg-orange-50'
                  }`}>
                    {risk.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{risk.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{risk.description}</p>
                  </div>
                  {selectedRisk === risk.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-slate-900 font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-soft">
              <label className="block text-sm font-extrabold text-slate-900 mb-3">Amount to trade</label>
              <div className="relative flex items-center mb-3">
                <span className="absolute left-4 text-2xl font-bold text-slate-900">$</span>
                <input
                  type="text"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Available: $10,000.00</span>
                <span className="text-primary font-bold">{tradeAmount ? `$${tradeAmount}` : '$0.00'}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50">
            <button
              onClick={handleContinue}
              disabled={!selectedRisk || !tradeAmount}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-200 text-slate-900 disabled:text-slate-400 font-extrabold py-5 rounded-2xl shadow-xl transition-all active:scale-95"
            >
              Continue
            </button>
            <p className="text-center mt-4 text-xs font-medium text-slate-400">Step 2 of the guided setup</p>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'strategy') {
    return (
      <IOSPageTransition>
        <div className="w-full h-screen flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              ←
            </button>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Step 3 of 4</span>
              <div className="flex gap-1">
                <div className="h-1.5 w-4 rounded-full bg-primary"></div>
                <div className="h-1.5 w-4 rounded-full bg-primary"></div>
                <div className="h-1.5 w-8 rounded-full bg-primary"></div>
                <div className="h-1.5 w-4 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">✨ AI Recommended</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Choose your protection</h1>
              <p className="text-slate-500 font-medium">Pick the strategy that fits your goal</p>
            </div>

            <div className="space-y-4">
              {STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => setSelectedStrategy(strategy.id)}
                  className={`w-full text-left p-5 rounded-3xl border-2 flex gap-4 transition-all ${
                    selectedStrategy === strategy.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{strategy.title}</h3>
                      {selectedStrategy === strategy.id && <span className="text-primary">✓</span>}
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
              disabled={!selectedStrategy}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-200 text-slate-900 disabled:text-slate-400 py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Continue →
            </button>
            <div className="flex items-center justify-center gap-2">
              <span>⚡</span>
              <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Fast execution enabled</p>
            </div>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'preview') {
    return (
      <IOSPageTransition>
        <div className="w-full h-screen flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              ←
            </button>
            <h2 className="text-slate-900 font-extrabold text-lg">Preview</h2>
            <div className="w-10"></div>
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
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase">Balanced</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-600">Potential Reward</span>
                    <span className="text-xl font-black text-primary">High</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-primary h-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-600">Potential Risk</span>
                    <span className="text-xl font-black text-purple-500">Low</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-purple-500 h-full w-[30%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  🛡️
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">Market Drops</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">Protected by your shield strategy</p>
                </div>
                <span className="text-primary">✓</span>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  🚀
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">Market Rises</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">Unlimited upside potential</p>
                </div>
                <span className="text-purple-500">📈</span>
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
              onClick={handleContinue}
              disabled={!agreedToTerms}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-200 text-slate-900 disabled:text-slate-400 py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Execute Trade ⚡
            </button>
            <div className="flex items-center justify-center gap-2">
              <span>🔒</span>
              <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Secure Transaction</p>
            </div>
          </div>
        </div>
      </IOSPageTransition>
    )
  }

  if (step === 'success') {
    return (
      <IOSPageTransition>
        <div className="w-full h-screen flex flex-col bg-slate-50 items-center justify-center relative overflow-hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

          <div className="relative w-[90%] max-w-[400px] bg-white rounded-[40px] p-8 shadow-2xl z-10 flex flex-col items-center text-center">
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
                onClick={() => window.location.href = '/profile'}
                className="w-full bg-primary hover:bg-primary/90 text-slate-900 py-5 rounded-3xl font-black text-lg shadow-xl transition-all active:scale-95"
              >
                View Portfolio
              </button>
              <button
                onClick={() => window.location.href = '/'}
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
