"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, Save, FolderOpen, Plus, Code, Settings } from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-800 rounded-lg animate-pulse" />,
});

interface PineScript {
  id: string;
  name: string;
  content: string;
  lastModified: Date;
  category: "indicator" | "strategy" | "library";
}

const ScriptManager = () => {
  const [selectedScript, setSelectedScript] = useState<PineScript | null>(null);
  const [scripts, setScripts] = useState<PineScript[]>([
    {
      id: "1",
      name: "BTMM_Master_Controller",
      content: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM Master Controller", shorttitle="BTMM MC", overlay=true)

// EMA Configuration
ema5 = ta.ema(close, 5)
ema13 = ta.ema(close, 13)
ema50 = ta.ema(close, 50)
ema200 = ta.ema(close, 200)
ema800 = ta.ema(close, 800)

// Plot EMAs with BTMM colors
plot(ema5, "5 EMA (Mustard)", color=color.yellow, linewidth=2)
plot(ema13, "13 EMA (Ketchup)", color=color.red, linewidth=2)
plot(ema50, "50 EMA (Water)", color=color.blue, linewidth=2)
plot(ema200, "200 EMA (Mayo)", color=color.white, linewidth=2)
plot(ema800, "800 EMA (Blueberry)", color=color.purple, linewidth=2)

// Perfect Stack Detection
bullishStack = ema5 > ema13 and ema13 > ema50 and ema50 > ema200 and ema200 > ema800
bearishStack = ema5 < ema13 and ema13 < ema50 and ema50 < ema200 and ema200 < ema800

// 8-Point Bias Algorithm
bias_points = 0
bias_points := (close > ema5 ? 1 : 0) + (close > ema13 ? 1 : 0) + (close > ema50 ? 1 : 0) + (close > ema200 ? 1 : 0) + (close > ema800 ? 1 : 0)
bias_points := bias_points + (bullishStack ? 3 : bearishStack ? -3 : 0)

// Signal Generation
bullishSignal = bullishStack and bias_points >= 6
bearishSignal = bearishStack and bias_points <= 2

// Visual Signals
plotshape(bullishSignal, "Bullish Signal", shape.triangleup, location.belowbar, color=color.green, size=size.normal)
plotshape(bearishSignal, "Bearish Signal", shape.triangledown, location.abovebar, color=color.red, size=size.normal)

// Background coloring based on stack
bgcolor(bullishStack ? color.new(color.green, 95) : bearishStack ? color.new(color.red, 95) : na)`,
      lastModified: new Date(),
      category: "indicator"
    },
    {
      id: "2", 
      name: "BTMM_EMA_System",
      content: `// © 2024 BTMM Trading System
//@version=5
indicator("BTMM EMA System", shorttitle="BTMM EMA", overlay=true)

// EMA Food System Implementation
ema5 = ta.ema(close, 5)   // Mustard
ema13 = ta.ema(close, 13) // Ketchup  
ema50 = ta.ema(close, 50) // Water
ema200 = ta.ema(close, 200) // Mayo
ema800 = ta.ema(close, 800) // Blueberry

// Plot EMAs
plot(ema5, "Mustard (5)", color=color.yellow)
plot(ema13, "Ketchup (13)", color=color.red) 
plot(ema50, "Water (50)", color=color.blue)
plot(ema200, "Mayo (200)", color=color.white)
plot(ema800, "Blueberry (800)", color=color.purple)`,
      lastModified: new Date(),
      category: "indicator"
    }
  ]);

  const [editorContent, setEditorContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedScript) {
      setEditorContent(selectedScript.content);
    }
  }, [selectedScript]);

  const handleSaveScript = () => {
    if (!selectedScript) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const updatedScripts = scripts.map(script => 
        script.id === selectedScript.id 
          ? { ...script, content: editorContent, lastModified: new Date() }
          : script
      );
      setScripts(updatedScripts);
      setSelectedScript({ ...selectedScript, content: editorContent, lastModified: new Date() });
      setIsLoading(false);
    }, 500);
  };

  const handleCreateNewScript = () => {
    const newScript: PineScript = {
      id: Date.now().toString(),
      name: `New Script ${scripts.length + 1}`,
      content: `// © 2024 BTMM Trading System
//@version=5
indicator("New BTMM Indicator", shorttitle="BTMM", overlay=true)

// Your Pine Script code here
plot(close, "Close", color=color.blue)`,
      lastModified: new Date(),
      category: "indicator"
    };
    
    setScripts([...scripts, newScript]);
    setSelectedScript(newScript);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold mb-4">Pine Script Manager</h2>
            <button
              onClick={handleCreateNewScript}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Script
            </button>
          </div>

          {/* Script List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  onClick={() => setSelectedScript(script)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedScript?.id === script.id
                      ? "bg-blue-600 border border-blue-500"
                      : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-sm">{script.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {script.category} • {script.lastModified.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {scripts.length} scripts • BTMM System v2.1.0
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {selectedScript ? (
            <>
              {/* Editor Header */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">{selectedScript.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedScript.category === 'indicator' ? 'bg-blue-900/30 text-blue-400' :
                    selectedScript.category === 'strategy' ? 'bg-green-900/30 text-green-400' :
                    'bg-purple-900/30 text-purple-400'
                  }`}>
                    {selectedScript.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveScript}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors">
                    <Play className="h-4 w-4" />
                    Test
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 bg-gray-900">
                <MonacoEditor
                  height="100%"
                  defaultLanguage="javascript"
                  value={editorContent}
                  onChange={(value) => setEditorContent(value || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: true },
                    wordWrap: "on",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    renderWhitespace: "selection",
                    bracketPairColorization: { enabled: true },
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">Select a Pine Script</h3>
                <p className="text-gray-500">Choose a script from the sidebar to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptManager;