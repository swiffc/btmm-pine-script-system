import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowLeft, BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react'

export default function WorkbookPage() {
  const chapters = [
    {
      id: 1,
      title: "Introduction to BTMM Methodology",
      description: "Learn the fundamentals of Steve Mauro's Beat The Market Makers approach",
      status: "completed",
      duration: "15 min",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "EMA Food System Deep Dive",
      description: "Understanding the 5-layer EMA stack: Mustard, Ketchup, Water, Mayo, and Blueberry",
      status: "completed",
      duration: "25 min",
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Market Maker Cycle Phases",
      description: "Accumulation, Manipulation, and Distribution phases explained",
      status: "current",
      duration: "30 min",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      title: "Session Analysis & Timing",
      description: "Asian, London, and New York session characteristics and opportunities",
      status: "locked",
      duration: "20 min",
      difficulty: "Intermediate"
    },
    {
      id: 5,
      title: "OTE Zones & Entry Patterns",
      description: "Optimal Trade Entry zones and confluence trading setups",
      status: "locked",
      duration: "35 min",
      difficulty: "Advanced"
    },
    {
      id: 6,
      title: "M&W Pattern Recognition",
      description: "Identifying and trading M and W patterns across timeframes",
      status: "locked",
      duration: "40 min",
      difficulty: "Advanced"
    },
    {
      id: 7,
      title: "Stop Hunt Detection",
      description: "Recognizing liquidity sweeps and stop hunt patterns",
      status: "locked",
      duration: "30 min",
      difficulty: "Advanced"
    },
    {
      id: 8,
      title: "Risk Management & Position Sizing",
      description: "Professional risk management techniques and position sizing strategies",
      status: "locked",
      duration: "25 min",
      difficulty: "Intermediate"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'current':
        return <PlayCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'current':
        return <Badge className="bg-blue-500">In Progress</Badge>
      default:
        return <Badge variant="outline">Locked</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    }
    return <Badge className={colors[difficulty as keyof typeof colors] || ''}>{difficulty}</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">BTMM Learning Workbook</h1>
          <p className="text-muted-foreground">Master Steve Mauro's methodology through interactive chapters</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Progress
          </CardTitle>
          <CardDescription>Track your progress through the BTMM methodology</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">2</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">1</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">5</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">25%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter List */}
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className={`transition-all ${chapter.status === 'locked' ? 'opacity-60' : 'hover:shadow-md'}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(chapter.status)}
                  <div>
                    <CardTitle className="text-lg">
                      Chapter {chapter.id}: {chapter.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {chapter.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(chapter.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getDifficultyBadge(chapter.difficulty)}
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {chapter.duration}
                  </span>
                </div>
                <div className="flex gap-2">
                  {chapter.status !== 'locked' && (
                    <>
                      <Button variant="outline" size="sm">
                        {chapter.status === 'completed' ? 'Review' : 'Continue'}
                      </Button>
                      {chapter.status === 'current' && (
                        <Button size="sm">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Chapter
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting Started */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ready to Start Learning?</CardTitle>
          <CardDescription>
            Begin your journey with the BTMM methodology. Each chapter builds upon the previous one,
            so we recommend following the sequential order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button size="lg">
              <PlayCircle className="h-4 w-4 mr-2" />
              Continue Current Chapter
            </Button>
            <Button variant="outline" size="lg">
              View All Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}