import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Shield, 
  BookOpen,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from "lucide-react";

export default function StrategyGuide() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const btmmPhases = [
    {
      id: 1,
      name: "Accumulation",
      session: "Asian Session",
      description: "Market makers establish initial high/low ranges during low volatility periods",
      timeframe: "21:00 - 06:00 UTC",
      color: "accent-yellow",
      characteristics: [
        "Low volatility consolidation",
        "Range-bound price action",
        "Minimal volume",
        "Setting daily levels"
      ],
      implementation: [
        "Track session high/low",
        "Calculate range size",
        "Identify midpoint",
        "Monitor volume patterns"
      ]
    },
    {
      id: 2,
      name: "Manipulation",
      session: "London Open",
      description: "False moves designed to trap retail traders and collect stop losses",
      timeframe: "03:00 - 08:00 UTC",
      color: "accent-red",
      characteristics: [
        "False breakouts",
        "Stop hunting moves",
        "Rapid reversals",
        "High volatility spikes"
      ],
      implementation: [
        "Detect range breaks",
        "Monitor for reversals",
        "Track volume spikes",
        "Identify trap patterns"
      ]
    },
    {
      id: 3,
      name: "Distribution",
      session: "London/NY Overlap",
      description: "Real directional move begins with sustained trending price action",
      timeframe: "08:00 - 17:00 UTC",
      color: "accent-green",
      characteristics: [
        "Sustained trends",
        "Consistent direction",
        "Higher volume",
        "6-8 hour moves"
      ],
      implementation: [
        "Confirm trend direction",
        "Enter on pullbacks",
        "Trail stop losses",
        "Monitor momentum"
      ]
    },
    {
      id: 4,
      name: "Markdown",
      session: "End of Day",
      description: "Return to consolidation as major moves complete and cycle resets",
      timeframe: "17:00 - 21:00 UTC",
      color: "accent-purple",
      characteristics: [
        "Decreasing volatility",
        "Profit taking",
        "Range formation",
        "Cycle preparation"
      ],
      implementation: [
        "Close positions",
        "Avoid new entries",
        "Prepare for next cycle",
        "Analyze day's moves"
      ]
    }
  ];

  const keyLevels = [
    {
      name: "Asian High/Low",
      description: "Key levels established during accumulation phase",
      usage: "Primary support/resistance for the day"
    },
    {
      name: "London Breakout",
      description: "Initial break of Asian range (often false)",
      usage: "Watch for reversal and true direction"
    },
    {
      name: "True Breakout",
      description: "Sustained move after manipulation ends",
      usage: "Primary entry signal for trend following"
    },
    {
      name: "Daily Pivot",
      description: "Mathematical pivot point for the session",
      usage: "Additional confluence for trade decisions"
    }
  ];

  const riskRules = [
    "Never risk more than 2% per trade",
    "Use Asian range to calculate position size",
    "Set stops beyond manipulation levels",
    "Take profits at 2:1 or 3:1 risk/reward",
    "Avoid trading during low-volume periods",
    "Close all positions before weekend"
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <div className="p-4 border-b border-dark-border">
        <h3 className="text-sm font-semibold text-dark-text mb-2">BTMM Strategy Guide</h3>
        <Badge variant="secondary" className="text-xs">
          Steve Mauro Methodology
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Tabs defaultValue="phases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-dark-border">
              <TabsTrigger 
                value="phases" 
                className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg text-xs"
              >
                4 Phases
              </TabsTrigger>
              <TabsTrigger 
                value="levels" 
                className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg text-xs"
              >
                Key Levels
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="data-[state=active]:bg-accent-blue data-[state=active]:text-dark-bg text-xs"
              >
                Risk Mgmt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phases" className="space-y-4 mt-4">
              <div className="space-y-3">
                {btmmPhases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedPhase === phase.id
                        ? `border-${phase.color} bg-${phase.color}/10`
                        : "border-dark-border hover:border-dark-muted"
                    }`}
                    onClick={() => setSelectedPhase(
                      selectedPhase === phase.id ? null : phase.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-${phase.color}/20 flex items-center justify-center`}>
                          <span className={`text-${phase.color} font-bold text-sm`}>
                            {phase.id}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-dark-text text-sm">
                            {phase.name}
                          </h4>
                          <p className="text-xs text-dark-muted">
                            {phase.session}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-4 w-4 text-dark-muted transition-transform ${
                          selectedPhase === phase.id ? "rotate-90" : ""
                        }`} 
                      />
                    </div>

                    {selectedPhase === phase.id && (
                      <div className="mt-3 space-y-3">
                        <p className="text-xs text-dark-text">
                          {phase.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <h5 className="text-xs font-medium text-dark-text mb-1">
                              Characteristics
                            </h5>
                            <ul className="space-y-1">
                              {phase.characteristics.map((char, index) => (
                                <li key={index} className="text-xs text-dark-muted flex items-start">
                                  <div className="w-1 h-1 bg-accent-blue rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  {char}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-dark-text mb-1">
                              Implementation
                            </h5>
                            <ul className="space-y-1">
                              {phase.implementation.map((impl, index) => (
                                <li key={index} className="text-xs text-dark-muted flex items-start">
                                  <div className="w-1 h-1 bg-accent-green rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  {impl}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-dark-muted">
                          <Clock className="h-3 w-3 mr-1" />
                          {phase.timeframe}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="levels" className="space-y-4 mt-4">
              <div className="space-y-3">
                {keyLevels.map((level, index) => (
                  <div key={index} className="p-3 bg-dark-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-dark-text text-sm mb-1">
                          {level.name}
                        </h4>
                        <p className="text-xs text-dark-muted mb-2">
                          {level.description}
                        </p>
                        <div className="flex items-center text-xs text-accent-blue">
                          <Target className="h-3 w-3 mr-1" />
                          {level.usage}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
                <h4 className="font-medium text-dark-text text-sm mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-accent-blue" />
                  Confluence Factors
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="text-dark-muted">
                    • Multiple timeframe alignment
                  </div>
                  <div className="text-dark-muted">
                    • Volume confirmation
                  </div>
                  <div className="text-dark-muted">
                    • Fibonacci retracements
                  </div>
                  <div className="text-dark-muted">
                    • Previous day's levels
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="bg-accent-red/10 border border-accent-red/30 p-3 rounded-lg">
                  <h4 className="font-medium text-accent-red text-sm mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Risk Management Rules
                  </h4>
                  <div className="space-y-2">
                    {riskRules.map((rule, index) => (
                      <div key={index} className="text-xs text-dark-text flex items-start">
                        <div className="w-1 h-1 bg-accent-red rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {rule}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-border p-3 rounded-lg">
                  <h4 className="font-medium text-dark-text text-sm mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-accent-green" />
                    Position Sizing Formula
                  </h4>
                  <div className="bg-dark-deep p-2 rounded font-mono text-xs text-dark-text">
                    Position Size = (Account Risk / Stop Distance) × Point Value
                  </div>
                  <div className="mt-2 text-xs text-dark-muted">
                    Where Account Risk = Account Balance × Risk Percentage (2%)
                  </div>
                </div>

                <div className="bg-dark-border p-3 rounded-lg">
                  <h4 className="font-medium text-dark-text text-sm mb-2">
                    Daily Risk Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-dark-muted">Max Daily Risk:</span>
                      <span className="ml-2 text-accent-orange font-medium">6%</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Max Positions:</span>
                      <span className="ml-2 text-accent-orange font-medium">3</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Risk per Trade:</span>
                      <span className="ml-2 text-accent-green font-medium">2%</span>
                    </div>
                    <div>
                      <span className="text-dark-muted">Min R:R Ratio:</span>
                      <span className="ml-2 text-accent-green font-medium">2:1</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Reference Links */}
          <div className="space-y-2">
            <h4 className="font-medium text-dark-text text-sm flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-accent-blue" />
              Quick References
            </h4>
            <div className="space-y-1">
              {[
                "Complete BTMM Strategy Guide",
                "Session Time Converter",
                "Risk Calculator Tool",
                "Backtesting Results"
              ].map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-xs h-8 hover:bg-dark-border"
                >
                  <span className="text-dark-text">{link}</span>
                  <ExternalLink className="h-3 w-3 text-dark-muted" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
