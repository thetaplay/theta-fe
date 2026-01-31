'use client'

import { useState } from 'react'
import { XMark, CheckmarkCircleFill } from '@/components/sf-symbols'

interface TakeQuizModalProps {
  onClose: () => void
  onComplete: () => void
  title: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

export default function TakeQuizModal({ onClose, onComplete, title }: TakeQuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the primary purpose of a put option?',
      options: [
        'To buy an asset at a predetermined price',
        'To sell an asset at a predetermined price',
        'To borrow money at a fixed rate',
        'To receive dividends from stocks'
      ],
      correct: 1,
      explanation: 'A put option gives the holder the right to SELL an underlying asset at the strike price. This is different from a call option, which gives the right to buy.'
    },
    {
      id: 2,
      question: 'Which of the following is NOT a component of a put option contract?',
      options: [
        'Strike Price',
        'Expiration Date',
        'Dividend Yield',
        'Premium'
      ],
      correct: 2,
      explanation: 'While dividend yield is important in stock valuation, it is not a required component of a put option contract. The key components are strike price, expiration date, and premium.'
    },
    {
      id: 3,
      question: 'When does a put option become profitable if purchased?',
      options: [
        'When the asset price rises above the strike price',
        'When the asset price falls below the strike price minus the premium',
        'When the asset price equals the strike price',
        'When the option expires'
      ],
      correct: 1,
      explanation: 'A purchased put becomes profitable when the asset price falls below (strike price - premium paid). At that point, the intrinsic value exceeds what you paid for it.'
    },
    {
      id: 4,
      question: 'What is the maximum loss when buying a put option?',
      options: [
        'Unlimited',
        'The strike price',
        'The premium paid',
        'The strike price minus the current asset price'
      ],
      correct: 2,
      explanation: 'The maximum loss when buying a put option is limited to the premium you paid upfront. If the option expires worthless, you lose the premium but nothing more.'
    }
  ]

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return

    const newAnswers = { ...answers, [currentQuestion]: optionIndex }
    setAnswers(newAnswers)
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    const currentAnswer = answers[currentQuestion]
    if (currentAnswer === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    const finalScore = answers[currentQuestion] === questions[currentQuestion].correct 
      ? score + 1 
      : score
    setScore(finalScore)
    setIsCompleted(true)
    setTimeout(() => {
      onComplete()
      onClose()
    }, 2000)
  }

  const question = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const isCorrect = selectedAnswer === question.correct
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col items-center justify-center py-12 px-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
            passed ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <CheckmarkCircleFill 
              width={56} 
              height={56} 
              className={passed ? 'text-green-600' : 'text-yellow-600'}
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          
          <div className="text-center mb-8">
            <p className="text-5xl font-bold text-blue-600">{percentage}%</p>
            <p className="text-gray-600 mt-2">
              {score} out of {questions.length} correct
            </p>
          </div>

          <div className={`w-full p-4 rounded-xl mb-6 ${
            passed 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`text-center font-semibold ${
              passed ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {passed 
                ? '🎉 Great job! You passed the quiz!' 
                : '📚 Keep learning! Try again to improve your score.'}
            </p>
          </div>

          <button
            onClick={() => {
              onComplete()
              onClose()
            }}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-green-100 text-sm mt-0.5">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <XMark width={24} height={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{question.question}</h3>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isQuestionCorrect = question.correct === idx

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                      isSelected && isQuestionCorrect
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : isSelected && !isQuestionCorrect
                        ? 'bg-red-50 border-red-500 text-red-900'
                        : showExplanation && isQuestionCorrect
                        ? 'bg-green-50 border-green-300 text-gray-900'
                        : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-blue-300'
                    } disabled:opacity-100`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                        isSelected && isQuestionCorrect
                          ? 'bg-green-500 border-green-500 text-white'
                          : isSelected && !isQuestionCorrect
                          ? 'bg-red-500 border-red-500 text-white'
                          : showExplanation && isQuestionCorrect
                          ? 'bg-green-200 border-green-300 text-green-900'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && isQuestionCorrect ? '✓' : isSelected && !isQuestionCorrect ? '✗' : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-xl border-l-4 ${
              isCorrect
                ? 'bg-green-50 border-green-500'
                : 'bg-blue-50 border-blue-500'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${
                isCorrect ? 'text-green-900' : 'text-blue-900'
              }`}>
                {isCorrect ? '✓ Correct!' : 'Explanation:'}
              </p>
              <p className={`text-sm ${
                isCorrect ? 'text-green-800' : 'text-blue-800'
              }`}>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === undefined}
            className="w-full px-6 py-3 bg-[#4CC658] hover:bg-[#45B950] disabled:bg-[#4CC658]/60 text-black font-semibold rounded-full shadow-[0_4px_0_0_#3BAE4B] active:shadow-none active:translate-y-[4px] transition flex items-center justify-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
