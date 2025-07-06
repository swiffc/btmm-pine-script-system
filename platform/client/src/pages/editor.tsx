import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import CodeEditor from "@/components/editor/code-editor";
import EditorTabs from "@/components/editor/editor-tabs";
import TemplateLibrary from "@/components/templates/template-library";
import ValidationPanel from "@/components/btmm/validation-panel";
import StrategyGuide from "@/components/btmm/strategy-guide";
import { Button } from "@/components/ui/button";
import { Download, Plus, Book, Upload } from "lucide-react";

export default function Editor() {
  const [activeFile, setActiveFile] = useState("BTMM_MarketStructure.pine");
  const [code, setCode] = useState(`//@version=5
indicator("BTMM Market Structure", shorttitle="BTMM-MS", overlay=true)

// ═══════════════════════════════════════════════════════════════════
// BTMM STRATEGY INPUTS
// Steve Mauro's Beat The Market Maker methodology
// ═══════════════════════════════════════════════════════════════════

group_btmm = "BTMM Configuration"
show_manipulation = input.bool(true, "Show Manipulation Zones", group=group_btmm)
asian_session = input.session("2100-0600", "Asian Session", group=group_btmm)
london_session = input.session("0300-1200", "London Session", group=group_btmm)
ny_session = input.session("0800-1700", "New York Session", group=group_btmm)

// ═══════════════════════════════════════════════════════════════════
// MARKET MAKER DETECTION ALGORITHM
// ═══════════════════════════════════════════════════════════════════

atr_length = input.int(14, "ATR Length", minval=1)
atr_value = ta.atr(atr_length)

// Four-phase market structure detection
is_asian = session.islondon or session.issydney
is_london = session.islondon
is_newyork = session.isnewyork

// Market maker manipulation detection
manipulation_detected = ta.crossover(close, ta.highest(high, 20)) or 
                      ta.crossunder(close, ta.lowest(low, 20))

// ═══════════════════════════════════════════════════════════════════
// CONFLUENCE FACTORS
// ═══════════════════════════════════════════════════════════════════

ema_fast = ta.ema(close, 8)
ema_slow = ta.ema(close, 21)
rsi_value = ta.rsi(close, 14)

// Multi-timeframe analysis
htf_trend = request.security(syminfo.tickerid, "4H", ta.ema(close, 50))
is_bullish_bias = close > htf_trend

// ═══════════════════════════════════════════════════════════════════
// PLOTTING AND VISUALIZATION
// ═══════════════════════════════════════════════════════════════════

plot(ema_fast, color=color.aqua, linewidth=2, title="EMA 8")
plot(ema_slow, color=color.orange, linewidth=2, title="EMA 21")

// Market manipulation alerts
plotshape(manipulation_detected, style=shape.diamond, 
          color=color.red, size=size.small, title="Manipulation")

// Session backgrounds
asian_color = is_asian ? color.new(color.yellow, 95) : na
london_color = is_london ? color.new(color.blue, 95) : na
ny_color = is_newyork ? color.new(color.green, 95) : na

bgcolor(asian_color, title="Asian Session")
bgcolor(london_color, title="London Session")
bgcolor(ny_color, title="NY Session")

// BTMM Alert conditions
alertcondition(manipulation_detected, title="BTMM Manipulation", 
              message="Market Maker manipulation detected on {{ticker}}")`);

  const openFiles = [
    { name: "BTMM_MarketStructure.pine", active: true },
    { name: "SessionAnalysis.pine", active: false },
    { name: "RiskManager.pine", active: false }
  ];

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          <EditorTabs 
            files={openFiles} 
            activeFile={activeFile}
            onFileChange={setActiveFile}
          />
          
          <div className="flex-1 flex">
            <div className="flex-1 bg-dark-bg">
              <div className="h-full p-6">
                <CodeEditor 
                  value={code}
                  onChange={setCode}
                  filename={activeFile}
                />
              </div>
            </div>
            
            <div className="w-80 bg-dark-surface border-l border-dark-border flex flex-col">
              <TemplateLibrary />
              <ValidationPanel code={code} />
              <StrategyGuide />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <Button
          size="icon"
          className="fab w-12 h-12 bg-accent-blue text-dark-bg rounded-full hover:bg-accent-blue/90"
          title="Generate New Indicator"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="fab w-12 h-12 bg-accent-green text-dark-bg rounded-full hover:bg-accent-green/90"
          title="Export to TradingView"
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="fab w-12 h-12 bg-accent-purple text-dark-bg rounded-full hover:bg-accent-purple/90"
          title="Documentation"
        >
          <Book className="h-5 w-5" />
        </Button>
      </div>

      {/* Status Bar */}
      <footer className="bg-dark-surface border-t border-dark-border px-6 py-2">
        <div className="flex items-center justify-between text-xs text-dark-muted">
          <div className="flex items-center space-x-4">
            <span>Ready</span>
            <span>•</span>
            <span>Pine Script v5</span>
            <span>•</span>
            <span>BTMM Strategy Active</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Cursor Rules: Enabled</span>
            <span>•</span>
            <span>Windsurf: Connected</span>
            <span>•</span>
            <span>Last Export: 2 hours ago</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
