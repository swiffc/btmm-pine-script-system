"use client";

import { useState } from "react";
import { Download, Code, Copy, Star, Filter, Search } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "EMA System" | "Session Analysis" | "Pattern Detection" | "Risk Management" | "Alerts";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  code: string;
  downloads: number;
  rating: number;
  tags: string[];
  preview: string;
}

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [templates] = useState<Template[]>([
    {
      id: "1",
      name: "BTMM EMA Food System",
      description: "Complete implementation of Steve Mauro's 5-13-50-200-800 EMA stack system",
      category: "EMA System",
      difficulty: "Beginner",
      downloads: 1247,
      rating: 4.8,
      tags: ["EMA", "Trend", "Stack", "BTMM"],
      preview: "Perfect Stack detection with bias calculation",
      code: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM EMA Food System", shorttitle="BTMM EMA", overlay=true)

// EMA Food System
ema5 = ta.ema(close, 5)   // Mustard
ema13 = ta.ema(close, 13) // Ketchup
ema50 = ta.ema(close, 50) // Water
ema200 = ta.ema(close, 200) // Mayo
ema800 = ta.ema(close, 800) // Blueberry

// Perfect Stack Detection
bullishStack = ema5 > ema13 and ema13 > ema50 and ema50 > ema200 and ema200 > ema800
bearishStack = ema5 < ema13 and ema13 < ema50 and ema50 < ema200 and ema200 < ema800

// Plot EMAs with BTMM colors
plot(ema5, "Mustard (5)", color=color.yellow, linewidth=2)
plot(ema13, "Ketchup (13)", color=color.red, linewidth=2)
plot(ema50, "Water (50)", color=color.blue, linewidth=2)
plot(ema200, "Mayo (200)", color=color.white, linewidth=2)
plot(ema800, "Blueberry (800)", color=color.purple, linewidth=2)

// Background coloring
bgcolor(bullishStack ? color.new(color.green, 95) : bearishStack ? color.new(color.red, 95) : na)`
    },
    {
      id: "2",
      name: "Market Session Analyzer",
      description: "Asian, London, and NY session analysis with institutional flow detection",
      category: "Session Analysis",
      difficulty: "Intermediate",
      downloads: 892,
      rating: 4.6,
      tags: ["Sessions", "Time", "Institutional", "Flow"],
      preview: "Real-time session analysis and breakout detection",
      code: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM Session Analyzer", shorttitle="Sessions", overlay=true)

// Session Times (EST)
asianStart = timestamp("GMT-5", year, month, dayofmonth, 17, 0)
asianEnd = timestamp("GMT-5", year, month, dayofmonth, 23, 59)
londonStart = timestamp("GMT-5", year, month, dayofmonth, 2, 0) 
londonEnd = timestamp("GMT-5", year, month, dayofmonth, 9, 0)
nyStart = timestamp("GMT-5", year, month, dayofmonth, 9, 30)
nyEnd = timestamp("GMT-5", year, month, dayofmonth, 17, 0)

// Session Detection
inAsian = time >= asianStart and time <= asianEnd
inLondon = time >= londonStart and time <= londonEnd  
inNY = time >= nyStart and time <= nyEnd

// Session Highlighting
bgcolor(inAsian ? color.new(color.yellow, 90) : na, title="Asian Session")
bgcolor(inLondon ? color.new(color.blue, 90) : na, title="London Session")
bgcolor(inNY ? color.new(color.green, 90) : na, title="NY Session")`
    },
    {
      id: "3",
      name: "OTE Zone Detection",
      description: "Optimal Trade Entry zones based on Fibonacci and institutional levels",
      category: "Pattern Detection",
      difficulty: "Advanced",
      downloads: 634,
      rating: 4.9,
      tags: ["OTE", "Fibonacci", "Levels", "Entry"],
      preview: "Automatic OTE zone identification and alerts",
      code: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM OTE Zones", shorttitle="OTE", overlay=true)

// OTE Levels (62%-79% retracement)
var float swingHigh = na
var float swingLow = na

// Swing point detection
if ta.pivothigh(high, 5, 5)
    swingHigh := high[5]
if ta.pivotlow(low, 5, 5)
    swingLow := low[5]

// OTE Zone calculation
oteHigh = swingLow + (swingHigh - swingLow) * 0.79
oteLow = swingLow + (swingHigh - swingLow) * 0.62

// Plot OTE zones
plot(oteHigh, "OTE High", color=color.orange, linewidth=2)
plot(oteLow, "OTE Low", color=color.orange, linewidth=2)
fill(plot(oteHigh), plot(oteLow), color=color.new(color.orange, 85), title="OTE Zone")`
    },
    {
      id: "4",
      name: "8-Point Bias Calculator",
      description: "Steve Mauro's bias algorithm with dynamic strength measurement",
      category: "EMA System",
      difficulty: "Intermediate",
      downloads: 1089,
      rating: 4.7,
      tags: ["Bias", "Algorithm", "Strength", "Trend"],
      preview: "Real-time bias calculation and trend strength",
      code: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM 8-Point Bias", shorttitle="Bias", overlay=false)

// EMA System
ema5 = ta.ema(close, 5)
ema13 = ta.ema(close, 13)
ema50 = ta.ema(close, 50)
ema200 = ta.ema(close, 200)
ema800 = ta.ema(close, 800)

// Bias Points Calculation
bias_points = 0
bias_points := (close > ema5 ? 1 : 0)
bias_points := bias_points + (close > ema13 ? 1 : 0)
bias_points := bias_points + (close > ema50 ? 1 : 0)
bias_points := bias_points + (close > ema200 ? 1 : 0)
bias_points := bias_points + (close > ema800 ? 1 : 0)

// Perfect Stack Bonus
perfectBull = ema5 > ema13 and ema13 > ema50 and ema50 > ema200 and ema200 > ema800
perfectBear = ema5 < ema13 and ema13 < ema50 and ema50 < ema200 and ema200 < ema800
bias_points := bias_points + (perfectBull ? 3 : perfectBear ? -3 : 0)

// Plot bias
plot(bias_points, "Bias Points", color=bias_points > 5 ? color.green : bias_points < 3 ? color.red : color.yellow, linewidth=3)
hline(6, "Bullish Threshold", color=color.green, linestyle=hline.style_dashed)
hline(2, "Bearish Threshold", color=color.red, linestyle=hline.style_dashed)`
    },
    {
      id: "5",
      name: "Stop Hunt Detector",
      description: "Identify liquidity sweeps and stop hunting patterns",
      category: "Pattern Detection",
      difficulty: "Advanced",
      downloads: 567,
      rating: 4.5,
      tags: ["Stop Hunt", "Liquidity", "Sweeps", "Patterns"],
      preview: "Advanced stop hunt and liquidity sweep detection",
      code: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM Stop Hunt Detector", shorttitle="Stop Hunt", overlay=true)

// Lookback period for swing points
lookback = input.int(20, "Lookback Period", minval=5)

// Previous session high/low
prevHigh = ta.highest(high, lookback)
prevLow = ta.lowest(low, lookback)

// Stop hunt detection
stopHuntHigh = high > prevHigh and close < prevHigh
stopHuntLow = low < prevLow and close > prevLow

// Visual alerts
plotshape(stopHuntHigh, "Stop Hunt High", shape.triangledown, location.abovebar, color=color.red, size=size.small)
plotshape(stopHuntLow, "Stop Hunt Low", shape.triangleup, location.belowbar, color=color.green, size=size.small)

// Previous levels
plot(prevHigh, "Previous High", color=color.red, linestyle=line.style_dashed)
plot(prevLow, "Previous Low", color=color.green, linestyle=line.style_dashed)`
    }
  ]);

  const categories = ["All", "EMA System", "Session Analysis", "Pattern Detection", "Risk Management", "Alerts"];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            BTMM Pine Script Templates
          </h1>
          <p className="text-gray-300 text-lg">
            Pre-built Pine Script templates implementing Steve Mauro&apos;s BTMM methodology
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-2xl font-bold text-blue-400 mb-1">{templates.length}</div>
            <div className="text-sm text-gray-400">Total Templates</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {templates.reduce((acc, t) => acc + t.downloads, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Downloads</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {(templates.reduce((acc, t) => acc + t.rating, 0) / templates.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{filteredTemplates.length}</div>
            <div className="text-sm text-gray-400">Filtered Results</div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-200">
              {/* Template Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                      template.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-300">{template.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-white">
                  {template.name}
                </h3>
                
                <p className="text-gray-300 text-sm mb-3">
                  {template.description}
                </p>

                <div className="text-sm text-blue-400 mb-4">
                  {template.preview}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{template.downloads.toLocaleString()} downloads</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.category === 'EMA System' ? 'bg-blue-900/30 text-blue-400' :
                    template.category === 'Session Analysis' ? 'bg-green-900/30 text-green-400' :
                    template.category === 'Pattern Detection' ? 'bg-purple-900/30 text-purple-400' :
                    'bg-orange-900/30 text-orange-400'
                  }`}>
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-2">
                <button
                  onClick={() => handleCopyCode(template.code)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Copy className="h-4 w-4" />
                  Copy Code
                </button>
                <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;