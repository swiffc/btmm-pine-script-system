import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { ArrowLeft, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
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
          <h1 className="text-3xl font-bold">BTMM Signal Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of all BTMM indicators and signals</p>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">All Systems Operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Scripts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">10/10</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Bias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Badge variant="secondary">Bullish</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BTMM Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>EMA Food System</CardTitle>
            <CardDescription>Steve Mauro's 5-layer EMA stack analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">5 EMA (Mustard)</span>
                <Badge className="bg-yellow-500">Above Price</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">13 EMA (Ketchup)</span>
                <Badge className="bg-red-500">Above Price</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">50 EMA (Water)</span>
                <Badge className="bg-blue-500">Below Price</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">200 EMA (Mayo)</span>
                <Badge className="bg-green-500">Below Price</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">800 EMA (Blueberry)</span>
                <Badge className="bg-purple-500">Below Price</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Stack Strength</span>
                <Badge variant="default">6/8 - Bullish</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Sessions</CardTitle>
            <CardDescription>Global trading session analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Asian Session</span>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Closed
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">London Session</span>
                <Badge variant="secondary">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">New York Session</span>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Opening Soon
                </Badge>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                Next key event: NY Open in 2h 15m
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Pine Scripts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Pine Scripts (10/10)</CardTitle>
          <CardDescription>All BTMM indicators are running and providing signals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              'BTMM_Master_Controller',
              'BTMM_EMA_System', 
              'BTMM_Session_Analysis',
              'BTMM_OTE_Zones',
              'BTMM_MW_Patterns',
              'BTMM_TDI_Divergence',
              'BTMM_Custom_Candles',
              'BTMM_Market_Maker_Phases',
              'BTMM_Signal_Dashboard',
              'BTMM_Alert_System'
            ].map((script) => (
              <div key={script} className="flex items-center gap-2 p-2 border rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs">{script.replace('BTMM_', '').replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}