'use client'

import { useState } from 'react'
import { XMark, CheckmarkCircleFill, PlayFill } from '@/components/sf-symbols'

interface WatchTutorialModalProps {
  onClose: () => void
  onComplete: () => void
  title: string
  topic: string
  youtubeVideoId?: string
}

export default function WatchTutorialModal({ onClose, onComplete, title, topic, youtubeVideoId = 'pF5eW4nX0QA' }: WatchTutorialModalProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  const handleComplete = () => {
    setIsCompleted(true)
    setTimeout(() => {
      onComplete()
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-green-100 text-sm mt-0.5">{topic}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-full transition"
          >
            <XMark width={24} height={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: isVideoPlaying ? '100%' : '0%' }}
          />
        </div>

        {/* Content - Video Player Simulation */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-20 flex flex-col items-center justify-center">
          {/* Video Player */}
          <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center relative">
              {!isVideoPlaying ? (
                <>
                  {!thumbnailError && (
                    <img 
                      src={`https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`}
                      alt="Video thumbnail"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={() => setThumbnailError(true)}
                    />
                  )}
                  {thumbnailError && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white font-semibold">Tutorial Video</p>
                        <p className="text-gray-400 text-sm mt-1">Click to play</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition group z-10"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition">
                      <PlayFill size={32} className="text-white ml-1" />
                    </div>
                  </button>
                </>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
          </div>

          {/* Video Details */}
          <div className="w-full bg-gray-50 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Video Overview</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This tutorial covers the fundamentals of put options, including:
              </p>
            </div>
            
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700 text-sm">What put options are and how they work</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700 text-sm">Key components: strike price, premium, and expiration</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700 text-sm">Practical examples of put options in trading</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-gray-700 text-sm">How to use puts for risk management</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Duration: 5 minutes</p>
            </div>
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="w-full bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 text-center animate-pulse">
              <p className="text-green-900 font-bold text-lg">Tutorial Completed!</p>
              <p className="text-green-700 text-sm mt-1">+30 XP Earned</p>
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
            {isCompleted ? 'Completed' : 'Watch Tutorial'}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
