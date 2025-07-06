import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DevelopmentResource {
  id: string;
  title: string;
  description: string;
  category: 'template' | 'prompt' | 'guide';
  icon: string;
  content?: string;
}

const developmentResources: DevelopmentResource[] = [
  {
    id: 'ema-system',
    title: 'BTMM EMA System',
    description: 'Steve Mauro\'s 5-EMA food system foundation',
    category: 'template',
    icon: '🍯',
    content: `// BTMM EMA Food System - Pine Script v5
//@version=5
indicator("BTMM EMA System", shorttitle="BTMM_EMA", overlay=true)

// EMA Periods (Food System)
ema5 = ta.ema(close, 5)    // Mustard
ema13 = ta.ema(close, 13)  // Ketchup  
ema50 = ta.ema(close, 50)  // Water
ema200 = ta.ema(close, 200) // Mayo
ema800 = ta.ema(close, 800) // Blueberry

// Plot EMAs with food colors
plot(ema5, title="Mustard (5)", color=color.yellow, linewidth=1)
plot(ema13, title="Ketchup (13)", color=color.red, linewidth=2)
plot(ema50, title="Water (50)", color=color.blue, linewidth=2)
plot(ema200, title="Mayo (200)", color=color.white, linewidth=3)
plot(ema800, title="Blueberry (800)", color=color.purple, linewidth=3)

// Bias Detection
bullishBias = ema5 > ema13 and ema13 > ema50 and ema50 > ema200 and ema200 > ema800
bearishBias = ema5 < ema13 and ema13 < ema50 and ema50 < ema200 and ema200 < ema800

// Background bias coloring
bgcolor(bullishBias ? color.new(color.green, 95) : bearishBias ? color.new(color.red, 95) : na)`
  },
  {
    id: 'mw-pattern',
    title: 'M&W Pattern Detection',
    description: 'Second leg pattern detection system',
    category: 'template',
    icon: '📈',
    content: `// M&W Pattern Detection - Pine Script v5
//@version=5
indicator("BTMM M&W Patterns", shorttitle="MW_Patterns", overlay=true)

// Pattern Detection Settings
lookback = input.int(20, "Lookback Period", minval=5, maxval=50)
ema13 = ta.ema(close, 13)

// Higher High/Lower Low Detection
isHH = high > ta.highest(high[1], lookback)
isLL = low < ta.lowest(low[1], lookback)

// M Pattern (Double Top)
var float mTop1 = na
var float mTop2 = na
var bool mPattern = false

if isHH and close > ema13
    if na(mTop1)
        mTop1 := high
    else if high > mTop1 * 0.99 and high < mTop1 * 1.01
        mTop2 := high
        mPattern := true

// W Pattern (Double Bottom)
var float wBot1 = na
var float wBot2 = na
var bool wPattern = false

if isLL and close < ema13
    if na(wBot1)
        wBot1 := low
    else if low < wBot1 * 1.01 and low > wBot1 * 0.99
        wBot2 := low
        wPattern := true

// Plot Patterns
plotshape(mPattern, title="M Pattern", location=location.abovebar, 
          style=shape.labeldown, color=color.red, text="M", size=size.small)
plotshape(wPattern, title="W Pattern", location=location.belowbar, 
          style=shape.labelup, color=color.green, text="W", size=size.small)

// Reset patterns after detection
if mPattern
    mTop1 := na
    mTop2 := na
    mPattern := false

if wPattern
    wBot1 := na
    wBot2 := na
    wPattern := false`
  },
  {
    id: 'tdi-divergence',
    title: 'TDI Divergence Scanner',
    description: 'Traders Dynamic Index with divergence detection',
    category: 'template',
    icon: '🔍',
    content: `// TDI Divergence Scanner - Pine Script v5
//@version=5
indicator("BTMM TDI Divergence", shorttitle="TDI_DIV")

// TDI Settings
rsiLength = input.int(14, "RSI Length")
rsiSmooth = input.int(5, "RSI Smoothing")
signalLength = input.int(21, "Signal Length")

// Calculate TDI Components
rsi = ta.rsi(close, rsiLength)
rsiSmoothed = ta.sma(rsi, rsiSmooth)
signal = ta.sma(rsiSmoothed, signalLength)

// Plot TDI
plot(rsiSmoothed, title="TDI", color=color.blue, linewidth=2)
plot(signal, title="Signal", color=color.red, linewidth=1)
hline(50, "Mid Line", color=color.gray, linestyle=hline.style_dashed)
hline(70, "Overbought", color=color.red, linestyle=hline.style_dotted)
hline(30, "Oversold", color=color.green, linestyle=hline.style_dotted)

// Divergence Detection
pivotHigh = ta.pivothigh(high, 5, 5)
pivotLow = ta.pivotlow(low, 5, 5)
rsiHigh = ta.pivothigh(rsiSmoothed, 5, 5)
rsiLow = ta.pivotlow(rsiSmoothed, 5, 5)

// Bullish Divergence
bullDiv = not na(pivotLow) and not na(rsiLow) and 
          pivotLow < pivotLow[1] and rsiLow > rsiLow[1]

// Bearish Divergence  
bearDiv = not na(pivotHigh) and not na(rsiHigh) and 
          pivotHigh > pivotHigh[1] and rsiHigh < rsiHigh[1]

// Plot Divergences
plotshape(bullDiv, title="Bullish Divergence", location=location.bottom, 
          style=shape.triangleup, color=color.green, size=size.small)
plotshape(bearDiv, title="Bearish Divergence", location=location.top, 
          style=shape.triangledown, color=color.red, size=size.small)

// Alerts
alertcondition(bullDiv, title="Bullish Divergence Alert", 
               message="TDI Bullish Divergence Detected")
alertcondition(bearDiv, title="Bearish Divergence Alert", 
               message="TDI Bearish Divergence Detected")`
  },
  {
    id: 'session-analysis',
    title: 'Session-Based Analysis',
    description: 'Asian/London/NY session tracking with BTMM methodology',
    category: 'template',
    icon: '🌍',
    content: `// Session Analysis - Pine Script v5
//@version=5
indicator("BTMM Session Analysis", shorttitle="Sessions", overlay=true)

// Session Times (GMT)
asianStart = input.session("2000-0600", "Asian Session")
londonStart = input.session("0600-1200", "London Session") 
nyStart = input.session("1200-2000", "NY Session")

// Session Detection
inAsian = time(timeframe.period, asianStart)
inLondon = time(timeframe.period, londonStart)
inNY = time(timeframe.period, nyStart)

// Session High/Low Tracking
var float asianHigh = na
var float asianLow = na
var float londonHigh = na
var float londonLow = na

// Reset and track session ranges
if inAsian and not inAsian[1]
    asianHigh := high
    asianLow := low
else if inAsian
    asianHigh := math.max(asianHigh, high)
    asianLow := math.min(asianLow, low)

if inLondon and not inLondon[1]
    londonHigh := high
    londonLow := low
else if inLondon
    londonHigh := math.max(londonHigh, high)
    londonLow := math.min(londonLow, low)

// Plot Session Boxes
bgcolor(inAsian ? color.new(color.yellow, 90) : na, title="Asian Session")
bgcolor(inLondon ? color.new(color.blue, 90) : na, title="London Session")
bgcolor(inNY ? color.new(color.green, 90) : na, title="NY Session")

// Plot Session Levels
plot(asianHigh, title="Asian High", color=color.yellow, linewidth=1)
plot(asianLow, title="Asian Low", color=color.yellow, linewidth=1)
plot(londonHigh, title="London High", color=color.blue, linewidth=1)
plot(londonLow, title="London Low", color=color.blue, linewidth=1)

// OTE Zone Detection (Optimal Trade Entry)
oteHigh = asianHigh * 1.01
oteLow = asianLow * 0.99

// Stop Hunt Detection
stopHunt = (high > asianHigh and close < asianHigh) or 
           (low < asianLow and close > asianLow)

plotshape(stopHunt, title="Stop Hunt", location=location.abovebar, 
          style=shape.diamond, color=color.orange, size=size.small)`
  }
];

export default function IndicatorBuilder() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedResource, setSelectedResource] = useState<DevelopmentResource | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
      description: "Content copied successfully"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pine Script v5 Indicator Builder</h1>
          <p className="text-muted-foreground">Build custom BTMM indicators with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.open('/documentation', '_blank')}>
            📖 Documentation
          </Button>
          <Button onClick={() => window.open('/templates', '_blank')}>
            🔧 Templates
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">📋 Templates</TabsTrigger>
          <TabsTrigger value="builder">🔨 Builder</TabsTrigger>
          <TabsTrigger value="guides">📚 Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pine Script v5 Templates</CardTitle>
              <CardDescription>
                Ready-to-use BTMM indicator templates for TradingView
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {developmentResources.filter(r => r.category === 'template').map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedResource(template)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {template.icon}
                        {template.title}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{template.category}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(template.content || '');
                          }}
                        >
                          Copy Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Indicator Builder</CardTitle>
              <CardDescription>
                Configure and generate custom BTMM indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-4">Interactive Builder Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  Visual drag-and-drop interface for creating custom indicators
                </p>
                <Button variant="outline">
                  🔧 Use Templates for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Development Guides</CardTitle>
              <CardDescription>
                Step-by-step guides for BTMM indicator development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-4">BTMM Development Guidelines</h3>
                  <p className="text-muted-foreground mb-6">
                    Follow Steve Mauro's methodology for professional indicator development
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">🍯 EMA Food System</h4>
                      <p className="text-sm text-muted-foreground">
                        Use 5, 13, 50, 200, 800 EMAs with food names for bias detection
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">📈 M&W Patterns</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on second leg patterns with 13 EMA confirmation
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">🌍 Session Timing</h4>
                      <p className="text-sm text-muted-foreground">
                        Asian range, London breakout, NY continuation analysis
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">🔍 OTE Zones</h4>
                      <p className="text-sm text-muted-foreground">
                        Optimal Trade Entry levels within session ranges
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {selectedResource.icon}
                  {selectedResource.title}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedResource(null)}
                >
                  ✕
                </Button>
              </div>
              <CardDescription>{selectedResource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard(selectedResource.content || '')}
                  >
                    Copy Content
                  </Button>
                  <Badge variant="secondary">{selectedResource.category}</Badge>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {selectedResource.content}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}