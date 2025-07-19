import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ArrowLeft, Code, Download, Eye, Star, Layers, TrendingUp, AlertTriangle } from 'lucide-react'

export default function TemplatesPage() {
  const templates = {
    'BTMM Core': [
      {
        name: 'EMA Food System',
        description: 'Complete implementation of Steve Mauro\'s 5-layer EMA system',
        author: 'BTMM Team',
        downloads: 1250,
        rating: 4.9,
        difficulty: 'Beginner',
        type: 'Indicator',
        tags: ['EMA', 'Trend', 'Core'],
        category: 'btmm-core'
      },
      {
        name: 'Market Maker Phases',
        description: 'Detect accumulation, manipulation, and distribution phases',
        author: 'BTMM Team',
        downloads: 890,
        rating: 4.8,
        difficulty: 'Intermediate',
        type: 'Indicator',
        tags: ['Market Structure', 'Phases', 'Analysis'],
        category: 'btmm-core'
      },
      {
        name: 'Session Analysis',
        description: 'Asian, London, and NY session analysis with key levels',
        author: 'BTMM Team',
        downloads: 1100,
        rating: 4.7,
        difficulty: 'Beginner',
        type: 'Indicator',
        tags: ['Sessions', 'Time', 'Levels'],
        category: 'btmm-core'
      }
    ],
    'Pattern Recognition': [
      {
        name: 'M&W Pattern Detector',
        description: 'Automatic detection of M and W patterns across timeframes',
        author: 'BTMM Team',
        downloads: 750,
        rating: 4.6,
        difficulty: 'Advanced',
        type: 'Strategy',
        tags: ['Patterns', 'M&W', 'Structure'],
        category: 'patterns'
      },
      {
        name: 'Stop Hunt Detection',
        description: 'Identify liquidity sweeps and stop hunt patterns',
        author: 'BTMM Team',
        downloads: 680,
        rating: 4.5,
        difficulty: 'Advanced',
        type: 'Indicator',
        tags: ['Liquidity', 'Stop Hunt', 'Analysis'],
        category: 'patterns'
      },
      {
        name: 'CHoCH & BOS Scanner',
        description: 'Change of Character and Break of Structure detection',
        author: 'BTMM Team',
        downloads: 920,
        rating: 4.8,
        difficulty: 'Intermediate',
        type: 'Indicator',
        tags: ['Structure', 'CHoCH', 'BOS'],
        category: 'patterns'
      }
    ],
    'Risk Management': [
      {
        name: 'Position Size Calculator',
        description: 'Calculate optimal position sizes based on account risk',
        author: 'BTMM Team',
        downloads: 1350,
        rating: 4.9,
        difficulty: 'Beginner',
        type: 'Utility',
        tags: ['Risk', 'Position Size', 'Management'],
        category: 'risk'
      },
      {
        name: 'Multi-Timeframe RR',
        description: 'Risk-reward analysis across multiple timeframes',
        author: 'BTMM Team',
        downloads: 540,
        rating: 4.4,
        difficulty: 'Intermediate',
        type: 'Indicator',
        tags: ['Risk', 'Reward', 'MTF'],
        category: 'risk'
      },
      {
        name: 'Dynamic Stop Loss',
        description: 'Adaptive stop loss based on market volatility',
        author: 'BTMM Team',
        downloads: 670,
        rating: 4.6,
        difficulty: 'Advanced',
        type: 'Strategy',
        tags: ['Stop Loss', 'Volatility', 'Adaptive'],
        category: 'risk'
      }
    ]
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Indicator': return <TrendingUp className="h-4 w-4" />
      case 'Strategy': return <Layers className="h-4 w-4" />
      case 'Utility': return <AlertTriangle className="h-4 w-4" />
      default: return <Code className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Pine Script Templates</h1>
          <p className="text-muted-foreground">Browse and use pre-built BTMM Pine Script templates and patterns</p>
        </div>
      </div>

      <Tabs defaultValue="btmm-core" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="btmm-core">BTMM Core</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        {Object.entries(templates).map(([category, templateList]) => (
          <TabsContent key={category} value={category.toLowerCase().replace(' ', '-')} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templateList.map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getTypeIcon(template.type)}
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Rating and Stats */}
                      <div className="flex items-center justify-between">
                        {renderStars(template.rating)}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Download className="h-4 w-4" />
                          {template.downloads.toLocaleString()}
                        </div>
                      </div>

                      {/* Tags and Difficulty */}
                      <div className="flex flex-wrap gap-1">
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Badge variant="outline">{template.type}</Badge>
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Author and Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          by {template.author}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Featured Template */}
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Template: Complete BTMM System
          </CardTitle>
          <CardDescription>
            The complete BTMM trading system combining all core indicators in one powerful script
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Includes:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• EMA Food System (5-13-50-200-800)</li>
                <li>• Market Maker Phase Detection</li>
                <li>• Session Analysis & Timing</li>
                <li>• OTE Zone Identification</li>
                <li>• M&W Pattern Recognition</li>
                <li>• Stop Hunt Detection</li>
                <li>• Comprehensive Alert System</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Perfect for:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Traders following BTMM methodology</li>
                <li>• Multi-timeframe analysis</li>
                <li>• Institutional trading approach</li>
                <li>• Complete market structure analysis</li>
              </ul>
              <div className="flex gap-2 mt-4">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download Complete System
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}