'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { BookFill, BoltFill, CheckmarkCircleFill, ChartLineUptrendXyaxis } from '@/components/sf-symbols'
import { useXPSystem } from '@/hooks/useXPSystem'
import QuizModal from '@/components/QuizModal'
import QuestCompletion from '@/components/QuestCompletion'
import DailyQuestModal from '@/components/DailyQuestModal'
import WatchTutorialModal from '@/components/QuestSteps/WatchTutorialModal'
import ReadArticleModal from '@/components/QuestSteps/ReadArticleModal'
import TakeQuizModal from '@/components/QuestSteps/TakeQuizModal'
import ViewMarketOverviewModal from '@/components/QuestSteps/ViewMarketOverviewModal'
import OpenTradeModal from '@/components/QuestSteps/OpenTradeModal'

export default function LearnPage() {
  const [selectedChapter, setSelectedChapter] = useState<{ moduleId: number; chapterId: number } | null>(null)
  const [completedQuest, setCompletedQuest] = useState<{ xp: number; title: string } | null>(null)
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [editingQuest, setEditingQuest] = useState<any>(null)
  const [claimMessage, setClaimMessage] = useState<string>('')
  const [showClaimMessage, setShowClaimMessage] = useState(false)

  // XP System
  const { xpData, questRewards, claimQuestXP, getXPProgress, getTotalUnclaimedXP } = useXPSystem()

  // Quest Step Modals
  const [activeStep, setActiveStep] = useState<{ questId: number; stepIndex: number } | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Record<number, number[]>>({})
  const [expandedQuestId, setExpandedQuestId] = useState<number | null>(null)

  // Daily Quests
  const dailyQuests = [
    {
      id: 1,
      title: 'Learn: What is a Put?',
      type: 'learning',
      xpReward: 50,
      symbol: 'BookFill',
      description: 'Understand put options and how they work in trading strategies',
      steps: [
        { name: 'Watch Tutorial' },
        { name: 'Read Article' },
        { name: 'Take Quiz' }
      ],
      difficulty: 'Intermediate',
      duration: '15 mins'
    },
    {
      id: 2,
      title: 'Check Market Pulse',
      type: 'daily',
      xpReward: 20,
      symbol: 'ChartLineUptrendXyaxis',
      description: 'Review market trends and sentiment for the day',
      steps: [
        { name: 'View Market Overview' }
      ],
      difficulty: 'Easy',
      duration: '5 mins'
    },
    {
      id: 3,
      title: 'Complete a Trade',
      type: 'trading',
      xpReward: 75,
      symbol: 'BoltFill',
      description: 'Execute a real or practice trade to learn trading mechanics',
      steps: [
        { name: 'Open Trade' }
      ],
      difficulty: 'Advanced',
      duration: '20 mins'
    },
  ]

  const milestones = [
    { id: 1, title: 'First Trade', completed: true, xp: 100 },
    { id: 2, title: 'Master Seller', completed: false, level: 6, xp: 200 },
    { id: 3, title: 'Prediction Expert', completed: false, level: 8, xp: 300 },
  ]

  const quizQuestions = [
    {
      id: 1,
      question: 'What is the primary purpose of a blockchain?',
      options: [
        'To store cryptocurrencies',
        'To create a decentralized, immutable ledger of transactions',
        'To replace traditional databases',
        'To increase internet speed',
      ],
      correct: 1,
      explanation:
        'A blockchain is a distributed ledger that records transactions across many computers, making it nearly impossible to alter past records.',
    },
    {
      id: 2,
      question: 'What is gas in Ethereum?',
      options: [
        'A type of cryptocurrency',
        'The fee paid to execute transactions on the network',
        'A storage mechanism for smart contracts',
        'A consensus algorithm',
      ],
      correct: 1,
      explanation:
        'Gas represents the computational effort required to execute transactions or smart contracts on the Ethereum network.',
    },
    {
      id: 3,
      question: 'Which of the following is NOT a consensus mechanism?',
      options: [
        'Proof of Work',
        'Proof of Stake',
        'Proof of Authority',
        'Proof of Balance',
      ],
      correct: 3,
      explanation:
        'Proof of Balance is not a recognized consensus mechanism. The main ones are Proof of Work, Proof of Stake, and Proof of Authority.',
    },
  ]

  const xpProgress = getXPProgress()
  const totalUnclaimedXP = getTotalUnclaimedXP()

  const handleClaimQuestXP = (questId: number, questName: string, xpAmount: number) => {
    const result = claimQuestXP(`quest-${questId}`, questName, xpAmount)
    setClaimMessage(result.message)
    setShowClaimMessage(true)
    setTimeout(() => setShowClaimMessage(false), 3000)
  }

  return (
    <>
      <PageLayout title="Learn">
        {/* Level & Progress Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold opacity-90">Current Level</p>
              <h2 className="text-4xl font-extrabold">Level {xpData.level}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Streak</p>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <BoltFill size={24} className="text-yellow-300" />
                {xpData.streakCount}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-300 rounded-full transition-all duration-300"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span>{xpProgress.current} XP</span>
              <span>{xpProgress.total} XP</span>
            </div>
          </div>

          <p className="text-xs mt-3 opacity-90">
            {xpProgress.total - xpProgress.current} XP to Level {xpData.level + 1}
          </p>
        </div>

        {/* Unclaimed XP Section */}
        {totalUnclaimedXP > 0 && (
          <div className="mb-6 bg-green-50 border-2 border-[#4CC658] rounded-3xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#4CC658]">Unclaimed XP</p>
                <p className="text-2xl font-extrabold text-[#4CC658] mt-1">+{totalUnclaimedXP} XP</p>
                <p className="text-xs text-[#4CC658]/70 mt-1">Complete quests to claim</p>
              </div>
              <div className="text-4xl">🎁</div>
            </div>
          </div>
        )}

        {/* Claim Message Toast */}
        {showClaimMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#4CC658] text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce flex items-center gap-2">
            <BoltFill size={20} className="text-yellow-300" />
            <p className="font-bold text-sm">{claimMessage}</p>
          </div>
        )}

        {/* Daily Quests Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-foreground">Daily Quests</h3>
            <span className="text-xs font-semibold bg-[#4CC658]/10 text-[#4CC658] px-3 py-1 rounded-full">
              Resets in 4h
            </span>
          </div>
          <div className="space-y-4">
            {dailyQuests.map((quest) => {
              const questCompletedSteps = (completedSteps[quest.id] || []).length
              const progressPercentage = quest.steps.length
                ? (questCompletedSteps / quest.steps.length) * 100
                : 0
              const firstIncompleteStepIndex = quest.steps.findIndex(
                (_, idx) => !(completedSteps[quest.id] || []).includes(idx)
              )
              const allStepsCompleted = firstIncompleteStepIndex === -1
              const questReward = questRewards.find((r) => r.questId === `quest-${quest.id}`)
              const isQuestClaimed = questReward?.claimed

              return (
                <button
                  key={quest.id}
                  onClick={() =>
                    setExpandedQuestId(expandedQuestId === quest.id ? null : quest.id)
                  }
                  className="w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_6px_0_0_#e5e7eb] transition-all duration-200 active:shadow-none active:translate-y-[4px] text-left"
                >
                  {/* Header */}
                  <div className="bg-white p-4 border-b border-gray-200/50">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-green-100 text-[#4CC658]">
                        {quest.symbol === 'BookFill' && <BookFill size={24} />}
                        {quest.symbol === 'ChartLineUptrendXyaxis' && (
                          <ChartLineUptrendXyaxis size={24} />
                        )}
                        {quest.symbol === 'BoltFill' && <BoltFill size={24} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-base text-foreground">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{quest.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`px-2.5 py-1 rounded-lg ${
                        isQuestClaimed ? '' : 'bg-white/80'
                        }`}>
                          <span
                            className={`text-sm font-bold ${
                              isQuestClaimed
                                ? 'text-[#4CC658] line-through'
                                : 'text-[#4CC658]'
                            }`}
                          >
                            {isQuestClaimed ? '✓' : `+${quest.xpReward}`}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                          {quest.difficulty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content - Only show if expanded */}
                  {expandedQuestId === quest.id && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-200/50">
                      {/* Steps */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            Steps
                          </p>
                          <span className="text-xs font-bold text-[#4CC658]">
                            {questCompletedSteps}/{quest.steps.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {quest.steps.map((step, idx) => {
                            const isCompleted = completedSteps[quest.id]?.includes(idx)
                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveStep({ questId: quest.id, stepIndex: idx })
                                }}
                                className="w-full flex items-center gap-3 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition text-left cursor-pointer"
                              >
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                                    isCompleted
                                      ? 'bg-[#4CC658] text-white'
                                      : 'border-2 border-muted-foreground/30'
                                  }`}
                                >
                                  {isCompleted && <span className="text-xs">✓</span>}
                                </div>
                                <span
                                  className={`text-sm font-medium flex-1 ${
                                    isCompleted
                                      ? 'text-muted-foreground line-through'
                                      : 'text-foreground'
                                  }`}
                                >
                                  {step.name}
                                </span>
                                <span className="text-xs text-[#4CC658] font-bold">→</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            Progress
                          </p>
                          <span className="text-xs font-bold text-foreground">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#4CC658] to-green-400 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                              Duration
                            </p>
                            <p className="text-sm font-bold text-foreground">{quest.duration}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                              Type
                            </p>
                            <p className="text-sm font-bold capitalize text-foreground">
                              {quest.type}
                            </p>
                          </div>
                        </div>
                        {allStepsCompleted && !isQuestClaimed ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClaimQuestXP(quest.id, quest.title, quest.xpReward)
                            }}
                            className="px-4 py-2 bg-[#4CC658] hover:bg-[#45B950] text-black font-semibold rounded-full text-sm shadow-[0_3px_0_0_#3BAE4B] active:shadow-none active:translate-y-[3px] transition"
                          >
                            Claim XP
                          </button>
                        ) : allStepsCompleted && isQuestClaimed ? (
                          <button
                            disabled
                            className="px-4 py-2 bg-[#4CC658]/30 text-black font-semibold rounded-full text-sm cursor-default"
                          >
                            ✓ Claimed
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveStep({
                                questId: quest.id,
                                stepIndex: firstIncompleteStepIndex,
                              })
                            }}
                            className="px-4 py-2 bg-[#4CC658] hover:bg-[#45B950] text-black font-semibold rounded-full text-sm shadow-[0_3px_0_0_#3BAE4B] active:shadow-none active:translate-y-[3px] transition"
                          >
                            Continue
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Milestones Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-3">Milestones</h3>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  milestone.completed
                    ? 'bg-card border-border shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px]'
                    : 'bg-muted/30 border-dashed border-border opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      milestone.completed ? 'bg-[#4CC658]/20' : 'bg-slate-200/50'
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckmarkCircleFill size={20} className="text-[#4CC658]" />
                    ) : (
                      <span className="text-slate-400">🔒</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-sm ${
                        milestone.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {milestone.completed
                        ? 'Completed'
                        : `Unlock at Level ${milestone.level}`}
                    </p>
                  </div>
                  <div className="bg-[#4CC658]/10 px-2 py-1 rounded-lg">
                    <span className="text-xs font-bold text-[#4CC658]">+{milestone.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>

      {/* Quiz Modal */}
      {selectedChapter && (
        <QuizModal
          questions={quizQuestions}
          title="Web3 Fundamentals Quiz"
          onClose={() => setSelectedChapter(null)}
          onComplete={(score) => {
            const xpReward = score * 25 + 25
            setCompletedQuest({
              xp: xpReward,
              title: 'Web3 Fundamentals Quiz',
            })
            setSelectedChapter(null)
          }}
        />
      )}

      {/* Quest Completion Modal */}
      {completedQuest && (
        <QuestCompletion
          xpGained={completedQuest.xp}
          newLevel={
            xpProgress.current + completedQuest.xp > xpProgress.total
              ? xpData.level + 1
              : undefined
          }
          questTitle={completedQuest.title}
          onClose={() => setCompletedQuest(null)}
        />
      )}

      {/* Daily Quest Modal */}
      {showQuestModal && (
        <DailyQuestModal
          onClose={() => {
            setShowQuestModal(false)
            setEditingQuest(null)
          }}
          onSubmit={(questData) => {
            console.log('Quest submitted:', questData)
            setShowQuestModal(false)
          }}
          initialData={editingQuest}
        />
      )}

      {/* Quest Step Modals */}
      {activeStep && activeStep.questId === 1 && activeStep.stepIndex === 0 && (
        <WatchTutorialModal
          onClose={() => setActiveStep(null)}
          onComplete={() => {
            setCompletedSteps({
              ...completedSteps,
              1: [...(completedSteps[1] || []), 0].filter(
                (v, i, a) => a.indexOf(v) === i
              ),
            })
          }}
          title="Learn: What is a Put?"
          topic="Understanding Put Options"
          youtubeVideoId="tlcCPX4t9y0"
        />
      )}

      {activeStep && activeStep.questId === 1 && activeStep.stepIndex === 1 && (
        <ReadArticleModal
          onClose={() => setActiveStep(null)}
          onComplete={() => {
            setCompletedSteps({
              ...completedSteps,
              1: [...(completedSteps[1] || []), 1].filter(
                (v, i, a) => a.indexOf(v) === i
              ),
            })
          }}
          title="Learn: What is a Put?"
          topic="Understanding Put Options"
        />
      )}

      {activeStep && activeStep.questId === 1 && activeStep.stepIndex === 2 && (
        <TakeQuizModal
          onClose={() => setActiveStep(null)}
          onComplete={() => {
            setCompletedSteps({
              ...completedSteps,
              1: [...(completedSteps[1] || []), 2].filter(
                (v, i, a) => a.indexOf(v) === i
              ),
            })
          }}
          title="Put Options Quiz"
        />
      )}

      {activeStep && activeStep.questId === 2 && activeStep.stepIndex === 0 && (
        <ViewMarketOverviewModal
          onClose={() => setActiveStep(null)}
          onComplete={() => {
            setCompletedSteps({
              ...completedSteps,
              2: [...(completedSteps[2] || []), 0].filter(
                (v, i, a) => a.indexOf(v) === i
              ),
            })
          }}
        />
      )}

      {activeStep && activeStep.questId === 3 && activeStep.stepIndex === 0 && (
        <OpenTradeModal
          onClose={() => setActiveStep(null)}
          onComplete={() => {
            setCompletedSteps({
              ...completedSteps,
              3: [...(completedSteps[3] || []), 0].filter(
                (v, i, a) => a.indexOf(v) === i
              ),
            })
          }}
        />
      )}
    </>
  )
}
