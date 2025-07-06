import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Code, 
  TrendingUp, 
  Shield, 
  Clock,
  ExternalLink,
  Download
} from "lucide-react";

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");

  const documentationSections = [
    {
      id: "btmm-strategy",
      title: "BTMM Strategy Guide",
      description: "Complete guide to Steve Mauro's Beat The Market Maker methodology",
      icon: TrendingUp,
      color: "accent-blue",
      items: [
        "4-Phase Market Structure",
        "Market Maker Psychology", 
        "Session-Based Analysis",
        "Manipulation Detection",
        "Entry and Exit Strategies"
      ]
    },
    {
      id: "pine-script",
      title: "Pine Script v5 Reference",
      description: "Comprehensive Pine Script language documentation and examples",
      icon: Code,
      color: "accent-green",
      items: [
        "Language Syntax",
        "Built-in Functions",
        "Technical Analysis Library",
        "Multi-timeframe Analysis",
        "Alert System"
      ]
    },
    {
      id: "risk-management",
      title: "Risk Management",
      description: "Professional risk management techniques for BTMM trading",
      icon: Shield,
      color: "accent-orange",
      items: [
        "Position Sizing",
        "Stop Loss Strategies",
        "Money Management",
        "Drawdown Control",
        "Portfolio Management"
      ]
    },
    {
      id: "session-analysis",
      title: "Session Analysis",
      description: "Deep dive into Asian, London, and New York trading sessions",
      icon: Clock,
      color: "accent-purple",
      items: [
        "Asian Session Patterns",
        "London Breakouts",
        "New York Trends",
        "Session Overlaps",
        "Time Zone Management"
      ]
    }
  ];

  const quickStart = [
    {
      title: "Setting Up Your Environment",
      description: "Configure Cursor and Windsurf for optimal Pine Script development",
      steps: 4,
      duration: "10 min"
    },
    {
      title: "Your First BTMM Indicator",
      description: "Create a basic market structure indicator using BTMM principles",
      steps: 6,
      duration: "15 min"
    },
    {
      title: "Advanced Session Analysis",
      description: "Build sophisticated session-based trading algorithms",
      steps: 8,
      duration: "25 min"
    }
  ];

  const resources = [
    {
      title: "Official TradingView Pine Script Documentation",
      url: "https://www.tradingview.com/pine-script-docs/",
      type: "External"
    },
    {
      title: "Steve Mauro's BTMM Course",
      url: "https://www.beatthemarketmaker.com/",
      type: "External"
    },
    {
      title: "Pine Script v5 Migration Guide",
      url: "/docs/migration-guide",
      type: "Internal"
    },
    {
      title: "BTMM Strategy Backtesting Results",
      url: "/docs/backtesting",
      type: "Internal"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-dark-text mb-2">Documentation Center</h1>
              <p className="text-dark-muted">
                Everything you need to master BTMM strategy and Pine Script v5 development
              </p>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted h-4 w-4" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-dark-surface border-dark-border text-dark-text"
                />
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-dark-surface">
                <TabsTrigger value="overview" className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="guides" className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg">
                  Guides
                </TabsTrigger>
                <TabsTrigger value="reference" className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg">
                  Reference
                </TabsTrigger>
                <TabsTrigger value="examples" className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg">
                  Examples
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Quick Start */}
                <section>
                  <h2 className="text-2xl font-bold text-dark-text mb-4">Quick Start</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickStart.map((item, index) => (
                      <Card key={index} className="bg-dark-surface border-dark-border hover:border-accent-blue transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-dark-text text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-dark-muted text-sm mb-4">{item.description}</p>
                          <div className="flex items-center justify-between text-xs text-dark-muted">
                            <span>{item.steps} steps</span>
                            <span>{item.duration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Documentation Sections */}
                <section>
                  <h2 className="text-2xl font-bold text-dark-text mb-4">Documentation Sections</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {documentationSections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <Card key={section.id} className="bg-dark-surface border-dark-border hover:border-accent-blue transition-colors cursor-pointer">
                          <CardHeader>
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-${section.color}/20`}>
                                <IconComponent className={`h-6 w-6 text-${section.color}`} />
                              </div>
                              <div>
                                <CardTitle className="text-dark-text">{section.title}</CardTitle>
                                <p className="text-sm text-dark-muted mt-1">{section.description}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {section.items.map((item, index) => (
                                <li key={index} className="text-sm text-dark-muted flex items-center">
                                  <div className="w-1.5 h-1.5 bg-accent-blue rounded-full mr-3"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="guides" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* BTMM Strategy Guides */}
                  <Card className="bg-dark-surface border-dark-border">
                    <CardHeader>
                      <CardTitle className="text-dark-text flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-accent-blue" />
                        BTMM Fundamentals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        "Understanding Market Makers",
                        "4-Phase Market Structure",
                        "Asian Session Analysis", 
                        "London Manipulation Phase",
                        "New York Distribution"
                      ].map((guide, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-dark-border transition-colors cursor-pointer">
                          <span className="text-sm text-dark-text">{guide}</span>
                          <ExternalLink className="h-4 w-4 text-dark-muted" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Pine Script Guides */}
                  <Card className="bg-dark-surface border-dark-border">
                    <CardHeader>
                      <CardTitle className="text-dark-text flex items-center">
                        <Code className="h-5 w-5 mr-2 text-accent-green" />
                        Pine Script v5
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        "Getting Started with v5",
                        "Indicator Development",
                        "Strategy Creation",
                        "Advanced Functions",
                        "Debugging Techniques"
                      ].map((guide, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-dark-border transition-colors cursor-pointer">
                          <span className="text-sm text-dark-text">{guide}</span>
                          <ExternalLink className="h-4 w-4 text-dark-muted" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Development Setup */}
                  <Card className="bg-dark-surface border-dark-border">
                    <CardHeader>
                      <CardTitle className="text-dark-text flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-accent-orange" />
                        Development Setup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        "Cursor Configuration",
                        "Windsurf Setup",
                        "Project Structure",
                        "Version Control",
                        "Export to TradingView"
                      ].map((guide, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-dark-border transition-colors cursor-pointer">
                          <span className="text-sm text-dark-text">{guide}</span>
                          <ExternalLink className="h-4 w-4 text-dark-muted" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reference" className="space-y-6">
                {/* API Reference */}
                <Card className="bg-dark-surface border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-dark-text">Pine Script v5 Function Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-accent-blue mb-2">Technical Analysis</h4>
                        <ul className="space-y-1 text-dark-muted">
                          <li>ta.sma()</li>
                          <li>ta.ema()</li>
                          <li>ta.rsi()</li>
                          <li>ta.macd()</li>
                          <li>ta.atr()</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent-green mb-2">Math Functions</h4>
                        <ul className="space-y-1 text-dark-muted">
                          <li>math.max()</li>
                          <li>math.min()</li>
                          <li>math.abs()</li>
                          <li>math.round()</li>
                          <li>math.pow()</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent-orange mb-2">Session Functions</h4>
                        <ul className="space-y-1 text-dark-muted">
                          <li>session.islondon</li>
                          <li>session.isnewyork</li>
                          <li>session.issydney</li>
                          <li>session.istokyo</li>
                          <li>time_close()</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Code Examples */}
                  {[
                    {
                      title: "Basic BTMM Structure",
                      description: "Simple market structure detection",
                      code: `//@version=5
indicator("BTMM Basic", overlay=true)

// Asian session range
asian_high = ta.highest(high, 20)
asian_low = ta.lowest(low, 20)

// Plot levels
plot(asian_high, color=color.yellow)
plot(asian_low, color=color.yellow)`
                    },
                    {
                      title: "Session Analysis",
                      description: "Detect trading sessions",
                      code: `//@version=5
indicator("Sessions", overlay=true)

// Session detection
in_asian = session.issydney
in_london = session.islondon
in_ny = session.isnewyork

// Background colors
bgcolor(in_asian ? color.new(color.yellow, 90) : na)
bgcolor(in_london ? color.new(color.blue, 90) : na)
bgcolor(in_ny ? color.new(color.green, 90) : na)`
                    }
                  ].map((example, index) => (
                    <Card key={index} className="bg-dark-surface border-dark-border">
                      <CardHeader>
                        <CardTitle className="text-dark-text text-lg">{example.title}</CardTitle>
                        <p className="text-dark-muted text-sm">{example.description}</p>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-dark-deep p-4 rounded-lg text-sm font-mono text-dark-text overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                        <div className="flex justify-end mt-4">
                          <Button size="sm" variant="outline" className="border-dark-border text-dark-text hover:bg-dark-border">
                            <Download className="h-4 w-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* External Resources */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-dark-text mb-4">External Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-dark-surface border border-dark-border rounded-lg hover:border-accent-blue transition-colors">
                    <div>
                      <h4 className="font-medium text-dark-text">{resource.title}</h4>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <ExternalLink className="h-5 w-5 text-dark-muted" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
