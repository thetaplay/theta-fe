'use client'

import { useState } from 'react'
import { XMark, CheckmarkCircleFill } from '@/components/sf-symbols'

interface DailyQuestFormData {
  title: string
  type: 'learning' | 'daily' | 'trading'
  totalSteps: number
  xpReward: number
  emoji: string
  description: string
  deadline: string
}

interface DailyQuestModalProps {
  onClose: () => void
  onSubmit: (data: DailyQuestFormData) => void
  initialData?: DailyQuestFormData
}

const EMOJI_OPTIONS = [
  '📚', '📊', '💹', '⚡', '🎯', '💡', '🚀', '🏆',
  '💰', '📈', '🎓', '🔍', '✨', '🌟', '💪', '🎉'
]

const QUEST_TYPES = [
  { value: 'learning', label: 'Learning', color: 'bg-blue-100 text-blue-600' },
  { value: 'daily', label: 'Daily Activity', color: 'bg-purple-100 text-purple-600' },
  { value: 'trading', label: 'Trading', color: 'bg-green-100 text-green-600' },
]

export default function DailyQuestModal({ onClose, onSubmit, initialData }: DailyQuestModalProps) {
  const [formData, setFormData] = useState<DailyQuestFormData>(
    initialData || {
      title: '',
      type: 'learning',
      totalSteps: 1,
      xpReward: 50,
      emoji: '📚',
      description: '',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required'
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    if (formData.totalSteps < 1) {
      newErrors.totalSteps = 'Total steps must be at least 1'
    }
    if (formData.xpReward < 10) {
      newErrors.xpReward = 'XP reward must be at least 10'
    }
    if (formData.xpReward > 500) {
      newErrors.xpReward = 'XP reward cannot exceed 500'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  const questTypeOption = QUEST_TYPES.find(t => t.value === formData.type)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      {/* Fullscreen Modal Content */}
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Daily Quest' : 'Create Daily Quest'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <XMark width={24} height={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 pb-20 space-y-6">
          {/* Quest Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quest Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              placeholder="e.g., Learn: What is a Put?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            <p className="text-gray-500 text-xs mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about this quest (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Quest Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quest Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {QUEST_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFormData({ ...formData, type: type.value as any })}
                  className={`px-4 py-3 rounded-lg font-medium text-sm transition ${
                    formData.type === type.value
                      ? `${type.color} ring-2 ring-offset-2 ring-green-500`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quest Icon Emoji *
            </label>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="text-2xl">{formData.emoji}</span>
              <span className="text-gray-600 text-sm">Select emoji</span>
            </button>

            {showEmojiPicker && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="grid grid-cols-8 gap-3">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setFormData({ ...formData, emoji })
                        setShowEmojiPicker(false)
                      }}
                      className={`text-2xl p-2 rounded-lg transition ${
                        formData.emoji === emoji
                          ? 'bg-green-500 ring-2 ring-green-400'
                          : 'hover:bg-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Total Steps */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Steps *
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFormData({ ...formData, totalSteps: Math.max(1, formData.totalSteps - 1) })}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.totalSteps}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                  setFormData({ ...formData, totalSteps: value })
                  if (errors.totalSteps) setErrors({ ...errors, totalSteps: '' })
                }}
                className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-lg font-semibold"
              />
              <button
                onClick={() => setFormData({ ...formData, totalSteps: Math.min(100, formData.totalSteps + 1) })}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
            {errors.totalSteps && <p className="text-red-500 text-sm mt-1">{errors.totalSteps}</p>}
          </div>

          {/* XP Reward */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              XP Reward *
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFormData({ ...formData, xpReward: Math.max(10, formData.xpReward - 10) })}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                −
              </button>
              <input
                type="number"
                min="10"
                max="500"
                step="10"
                value={formData.xpReward}
                onChange={(e) => {
                  const value = Math.max(10, Math.min(500, parseInt(e.target.value) || 10))
                  setFormData({ ...formData, xpReward: value })
                  if (errors.xpReward) setErrors({ ...errors, xpReward: '' })
                }}
                className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-lg font-semibold"
              />
              <button
                onClick={() => setFormData({ ...formData, xpReward: Math.min(500, formData.xpReward + 10) })}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
            {errors.xpReward && <p className="text-red-500 text-sm mt-1">{errors.xpReward}</p>}
            <p className="text-gray-500 text-xs mt-1">Range: 10 - 500 XP</p>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
            <p className="text-gray-500 text-xs mt-1">
              {new Date(formData.deadline).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-600 uppercase mb-3">Preview</p>
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{formData.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{formData.title || 'Your Quest Title'}</h3>
                  <p className="text-sm text-gray-600">
                    {formData.totalSteps} steps • <span className="text-green-600 font-semibold">{formData.xpReward} XP</span>
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <CheckmarkCircleFill width={20} height={20} />
            {initialData ? 'Update Quest' : 'Create Quest'}
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}
