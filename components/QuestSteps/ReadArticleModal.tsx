'use client'

import { useState } from 'react'
import { XMark, CheckmarkCircleFill } from '@/components/sf-symbols'

interface ReadArticleModalProps {
  onClose: () => void
  onComplete: () => void
  title: string
  topic: string
}

export default function ReadArticleModal({ onClose, onComplete, title, topic }: ReadArticleModalProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const progress = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100
    setScrollProgress(Math.min(progress, 100))
  }

  const handleComplete = () => {
    setIsCompleted(true)
    setTimeout(() => {
      onComplete()
      onClose()
    }, 1500)
  }

  const articles = {
    'Learn: What is a Put?': {
      topic: 'Understanding Put Options',
      content: [
        {
          section: 'What is a Put Option?',
          text: 'A put option is a financial contract that gives the holder the right, but not the obligation, to sell an underlying asset (such as a stock) at a predetermined price (called the strike price) on or before a specific expiration date. Put options are used by investors to hedge against potential declines in asset prices or to profit from anticipated price decreases.'
        },
        {
          section: 'Key Components of a Put Option',
          items: [
            'Underlying Asset: The stock or commodity that the put option is based on',
            'Strike Price: The predetermined price at which the asset can be sold',
            'Expiration Date: The last date on which the option can be exercised',
            'Premium: The price paid for the put option contract',
            'Intrinsic Value: The value if exercised immediately'
          ]
        },
        {
          section: 'How Put Options Work',
          text: 'When you buy a put option, you pay a premium upfront. If the underlying asset\'s price falls below the strike price before expiration, the option becomes valuable. You can then either exercise the option to sell at the higher strike price, or sell the option itself for a profit. If the price stays above the strike price, the option expires worthless.'
        },
        {
          section: 'Put vs Call Options',
          text: 'While a call option gives you the right to buy, a put option gives you the right to sell. Put options profit when prices decline, whereas call options profit when prices rise. Both are essential tools for different market strategies.'
        },
        {
          section: 'Real-World Example',
          text: 'Imagine a stock trading at $100. You buy a put option with a strike price of $95 and pay $2 premium. If the stock drops to $85, your put is now worth at least $10 ($95 - $85), which is a significant profit on your $2 investment. This is why investors use puts as insurance against falling prices.'
        },
        {
          section: 'Risk and Reward',
          text: 'The maximum profit from buying a put is limited (the strike price minus the premium), while the maximum loss is limited to the premium paid. This makes puts a calculated risk with defined boundaries, making them attractive for risk management.'
        }
      ]
    }
  }

  const articleContent = articles['Learn: What is a Put?']

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-green-100 text-sm mt-0.5">{articleContent.topic}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition"
          >
            <XMark width={24} height={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Content */}
        <div 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-20"
        >
          {articleContent.content.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900">{section.section}</h3>
              
              {'text' in section ? (
                <p className="text-base text-gray-700 leading-relaxed">
                  {section.text}
                </p>
              ) : 'items' in section ? (
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3 text-gray-700">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          {/* Completion Message */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 text-center animate-pulse">
              <div className="flex justify-center mb-3">
                <CheckmarkCircleFill width={48} height={48} className="text-green-600" />
              </div>
              <p className="text-green-900 font-bold text-lg">Article Completed!</p>
              <p className="text-green-700 text-sm mt-1">+50 XP Earned</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className="w-full px-6 py-3 bg-[#4CC658] hover:bg-[#45B950] disabled:bg-[#4CC658]/60 text-black font-semibold rounded-full shadow-[0_4px_0_0_#3BAE4B] active:shadow-none active:translate-y-[4px] transition flex items-center justify-center gap-2"
          >
            {isCompleted ? (
              <>
                <CheckmarkCircleFill width={20} height={20} />
                Completed
              </>
            ) : (
              <>
                Mark as Read
              </>
            )}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
