import { PageLayout } from '@/components/layout/PageLayout'
import { BookFill, PlayFill, Award } from '@/components/sf-symbols'

export default function LearnPage() {
  const courses = [
    {
      id: 1,
      title: 'Web3 Fundamentals',
      description: 'Learn blockchain, smart contracts, and DeFi basics',
      lessons: 8,
      icon: <BookFill width={24} />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      title: 'Event Prediction Strategy',
      description: 'Master predicting crypto and economic events',
      lessons: 12,
      icon: <PlayFill width={24} />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 3,
      title: 'Risk Management for Theta',
      description: 'Manage your portfolio and minimize losses',
      lessons: 6,
      icon: <Award width={24} />,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <PageLayout title="Learn Theta Trading">
      {/* Intro Section */}
      <div>
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
    </PageLayout>
  )
}
