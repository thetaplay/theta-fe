'use client'

import { useState } from 'react'
import { XMark, CheckmarkCircleFill } from './sf-symbols'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface QuizModalProps {
  questions: QuizQuestion[]
  title: string
  onClose: () => void
  onComplete: (score: number) => void
}

export default function QuizModal({
  questions,
  title,
  onClose,
  onComplete,
}: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isCorrect = selectedAnswer === question.correct

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index)
      setShowResult(true)
      if (index === question.correct) {
        setScore(score + 1)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      onComplete(score)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-card rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <XMark size={20} className="text-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1}/{questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4CC658] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === question.correct

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${
                    !showResult
                      ? 'bg-muted hover:bg-muted/80 cursor-pointer'
                      : isSelected
                        ? isCorrect
                          ? 'bg-[#4CC658] text-white'
                          : 'bg-red-500 text-white'
                        : isCorrectAnswer
                          ? 'bg-[#4CC658]/20 border border-[#4CC658]'
                          : 'bg-muted opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && showResult && isCorrect && (
                      <CheckmarkCircleFill size={20} className="text-white" />
                    )}
                    {isSelected && showResult && !isCorrect && (
                      <XMark size={20} className="text-white" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation */}
        {showResult && (
          <div
            className={`p-4 rounded-2xl mb-6 ${
              isCorrect
                ? 'bg-[#4CC658]/10 border border-[#4CC658]'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isCorrect ? 'text-[#4CC658]' : 'text-red-600'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <button
            onClick={handleNext}
            className="w-full bg-[#4CC658] shadow-[0_4px_0_0_#3a9a48] active:shadow-none active:translate-y-[4px] text-white font-bold py-4 rounded-2xl transition-all"
          >
            {currentQuestion === questions.length - 1
              ? 'Complete Quiz'
              : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
