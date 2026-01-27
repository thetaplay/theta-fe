import { IOSHeader } from '@/components/IOSHeader'
import { BookFill, PlayFill, Award } from '@/components/sf-symbols'
import IOSPageTransition from '@/components/IOSPageTransition' // Import IOSPageTransition

export default function LearnPage() {
  const courses = [
    {
      id: 1,
      title: 'Web3 Fundamentals',
      description: 'Learn blockchain, smart contracts, and DeFi basics',
      lessons: 8,
      icon: <BookFill size={24} />,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      title: 'Event Prediction Strategy',
      description: 'Master predicting crypto and economic events',
      lessons: 12,
      icon: <PlayFill size={24} />,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      id: 3,
      title: 'Risk Management for Theta',
      description: 'Manage your portfolio and minimize losses',
      lessons: 6,
      icon: <Award size={24} />,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <IOSPageTransition>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <IOSHeader title="Learn Theta Trading" />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-24 mt-0">
          {/* Intro Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground mb-2">
              Master Event Prediction
            </h2>
            <p className="text-sm text-muted-foreground">
              Learn Web3 and event prediction strategies to increase your winnings. Learn from our curated courses and become a better trader.
            </p>
          </div>

          {/* Courses */}
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-3xl p-5 soft-shadow hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${course.color}`}>
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        {course.lessons} lessons
                      </span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-primary rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resources Section */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Quick Resources
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="#"
                className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors"
              >
                <p className="font-semibold text-sm text-foreground">
                  Market Glossary
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  100+ terms explained
                </p>
              </a>
              <a
                href="#"
                className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors"
              >
                <p className="font-semibold text-sm text-foreground">
                  Video Tutorials
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Learn by watching
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </IOSPageTransition>
  )
}
