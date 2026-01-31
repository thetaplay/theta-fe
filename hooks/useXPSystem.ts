import { useEffect, useState } from 'react'

export interface XPData {
  currentXP: number
  level: number
  totalXPEarned: number
  lastClaimedDate: string | null
  streakCount: number
  claimedToday: boolean
}

export interface QuestXPReward {
  questId: string
  questName: string
  xpReward: number
  claimed: boolean
  claimedAt: string | null
}

const XP_PER_LEVEL = 1000
const STORAGE_KEY = 'nawasena_xp_data'
const QUEST_REWARDS_KEY = 'nawasena_quest_rewards'

// Initialize default XP data
const defaultXPData: XPData = {
  currentXP: 0,
  level: 0,
  totalXPEarned: 0,
  lastClaimedDate: null,
  streakCount: 0,
  claimedToday: false,
}

// Calculate level from total XP
const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / XP_PER_LEVEL)
}

// Calculate current XP in level (progress to next level)
const calculateCurrentXP = (totalXP: number): number => {
  return totalXP % XP_PER_LEVEL
}

// Check if today is a new day
const isNewDay = (lastClaimedDate: string | null): boolean => {
  if (!lastClaimedDate) return true
  const last = new Date(lastClaimedDate)
  const today = new Date()
  return (
    last.getFullYear() !== today.getFullYear() ||
    last.getMonth() !== today.getMonth() ||
    last.getDate() !== today.getDate()
  )
}

export function useXPSystem() {
  const [xpData, setXpData] = useState<XPData>(defaultXPData)
  const [questRewards, setQuestRewards] = useState<QuestXPReward[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedXPData = localStorage.getItem(STORAGE_KEY)
      const savedQuestRewards = localStorage.getItem(QUEST_REWARDS_KEY)

      const parsedXPData: XPData = savedXPData
        ? JSON.parse(savedXPData)
        : defaultXPData

      // Check if it's a new day and reset claimedToday flag
      if (isNewDay(parsedXPData.lastClaimedDate)) {
        parsedXPData.claimedToday = false
      }

      setXpData(parsedXPData)
      setQuestRewards(savedQuestRewards ? JSON.parse(savedQuestRewards) : [])
    } catch (error) {
      console.error('Failed to load XP data:', error)
      setXpData(defaultXPData)
      setQuestRewards([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save XP data to localStorage
  const saveXPData = (data: XPData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }

  // Save quest rewards to localStorage
  const saveQuestRewards = (rewards: QuestXPReward[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(QUEST_REWARDS_KEY, JSON.stringify(rewards))
    }
  }

  // Claim XP from a quest
  const claimQuestXP = (questId: string, questName: string, xpAmount: number): { success: boolean; message: string } => {
    // Check if already claimed
    const existingReward = questRewards.find((r) => r.questId === questId)
    if (existingReward?.claimed) {
      return { success: false, message: 'Quest XP sudah diklaim' }
    }

    // Update quest rewards
    const updatedRewards = questRewards.filter((r) => r.questId !== questId)
    updatedRewards.push({
      questId,
      questName,
      xpReward: xpAmount,
      claimed: true,
      claimedAt: new Date().toISOString(),
    })

    // Update XP data
    const newTotalXP = xpData.totalXPEarned + xpAmount
    const newLevel = calculateLevel(newTotalXP)
    const newCurrentXP = calculateCurrentXP(newTotalXP)

    const newStreakCount = isNewDay(xpData.lastClaimedDate)
      ? xpData.streakCount + 1
      : xpData.streakCount

    const updatedXPData: XPData = {
      currentXP: newCurrentXP,
      level: newLevel,
      totalXPEarned: newTotalXP,
      lastClaimedDate: new Date().toISOString(),
      streakCount: newStreakCount,
      claimedToday: true,
    }

    setXpData(updatedXPData)
    setQuestRewards(updatedRewards)

    saveXPData(updatedXPData)
    saveQuestRewards(updatedRewards)

    return { success: true, message: `+${xpAmount} XP claimed! Streak: ${newStreakCount}` }
  }

  // Get XP progress to next level
  const getXPProgress = () => {
    return {
      current: xpData.currentXP,
      total: XP_PER_LEVEL,
      percentage: (xpData.currentXP / XP_PER_LEVEL) * 100,
    }
  }

  // Get all unclaimed quest rewards
  const getUnclaimedRewards = (): QuestXPReward[] => {
    return questRewards.filter((r) => !r.claimed)
  }

  // Get total unclaimed XP
  const getTotalUnclaimedXP = (): number => {
    return getUnclaimedRewards().reduce((sum, reward) => sum + reward.xpReward, 0)
  }

  // Reset all data (for testing)
  const resetData = () => {
    const resetData: XPData = { ...defaultXPData }
    setXpData(resetData)
    setQuestRewards([])
    saveXPData(resetData)
    saveQuestRewards([])
  }

  return {
    xpData,
    questRewards,
    isLoading,
    claimQuestXP,
    getXPProgress,
    getUnclaimedRewards,
    getTotalUnclaimedXP,
    resetData,
  }
}
