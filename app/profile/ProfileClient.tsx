'use client'

import { IOSHeader } from '@/components/IOSHeader'
import { ActivityModal } from '@/components/ActivityModal'
import { PersonFill, ArrowtriangleUpFill, ArrowtriangleDownFill, Award } from '@/components/sf-symbols'
import { useState } from 'react'

interface Activity {
  id: number
  type: 'win' | 'loss' | 'achievement'
  title: string
  description: string
  time: string
  amount?: string
  details?: {
    asset?: string
    prediction?: string
    odds?: string
    outcome?: string
  }
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'win',
    title: 'Bitcoin ETF Approval Win',
    description: 'Predicted BTC above $48k by Jan 25 - Correct!',
    time: '2 hours ago',
    amount: '+$250',
    details: {
      asset: 'BTC Price Event',
      prediction: 'Above $48k',
      odds: '1.85x',
      outcome: 'ITM - Profitable',
    },
  },
  {
    id: 2,
    type: 'loss',
    title: 'FOMC Rate Hike Loss',
    description: 'Predicted Hold but Fed kept rates steady - Wrong prediction',
    time: '1 day ago',
    amount: '-$120',
    details: {
      asset: 'FOMC Decision',
      prediction: 'Rate Hike',
      odds: '2.10x',
      outcome: 'OTM - Loss',
    },
  },
  {
    id: 3,
    type: 'win',
    title: 'Ethereum Shanghai Upgrade Win',
    description: 'Predicted ETH surge post-upgrade - Exercised profitably',
    time: '3 days ago',
    amount: '+$480',
    details: {
      asset: 'ETH Event Option',
      prediction: 'Price above $2,500',
      odds: '1.50x',
      outcome: 'ITM - Profitable',
    },
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Event Prediction Expert',
    description: 'Achieved 10 consecutive profitable event predictions',
    time: '1 week ago',
    details: {
      outcome: 'Achievement Unlocked',
    },
  },
]

export function ProfileClient() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'win':
        return <ArrowtriangleUpFill className="w-5 h-5" />
      case 'loss':
        return <ArrowtriangleDownFill className="w-5 h-5" />
      case 'achievement':
        return <Award className="w-5 h-5" />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'win':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'loss':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      case 'achievement':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    }
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <IOSHeader title="Trading Portfolio" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 mt-0">
        {/* Profile Card */}
        <div className="mb-8 bg-card border border-border rounded-3xl p-6 card-shadow">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <PersonFill size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                Theta Trader
              </h2>
              <p className="text-sm text-muted-foreground">
                0x1234...5678
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">156</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Event Predictions
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">78%</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Accuracy Rate</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-primary">+$2.4k</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Total Winnings</p>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">
            Prediction History
          </h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="w-full bg-card border border-border rounded-2xl p-4 card-shadow shadow-md hover:border-green-500/50 hover:shadow-lg active:scale-95 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {activity.time}
                    </p>
                  </div>

                  {/* Amount */}
                  {activity.amount && (
                    <div className="flex-shrink-0">
                      <p
                        className={`font-bold text-sm ${
                          activity.type === 'win'
                            ? 'text-green-600 dark:text-green-400'
                            : activity.type === 'loss'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-primary'
                        }`}
                      >
                        {activity.amount}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />    </div>
  )
}