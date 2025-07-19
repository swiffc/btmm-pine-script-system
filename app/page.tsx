import Link from 'next/link'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { TrendingUp, BookOpen, Code, Layers } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          BTMM TradingView Script Manager
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete trading system combining Pine Script management, educational workbook, 
          and advanced strategy building in one unified platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Dashboard
            </CardTitle>
            <CardDescription>
              Monitor all BTMM indicators and trading signals in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Open Dashboard</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Workbook
            </CardTitle>
            <CardDescription>
              Learn Steve Mauro's BTMM methodology through interactive chapters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/workbook">
              <Button className="w-full">Start Learning</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Scripts
            </CardTitle>
            <CardDescription>
              Edit and manage Pine Scripts with advanced Monaco Editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/scripts">
              <Button className="w-full">Edit Scripts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Templates
            </CardTitle>
            <CardDescription>
              Browse and use pre-built Pine Script templates and patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/templates">
              <Button className="w-full">Browse Templates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Beat The Market Makers with Professional Tools
        </h2>
        <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
          This platform integrates Steve Mauro's proven BTMM methodology with modern development tools. 
          Manage 10+ Pine Script indicators, learn through interactive tutorials, and build advanced 
          trading strategies—all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/workbook">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">View Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}