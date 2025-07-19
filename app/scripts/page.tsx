'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowLeft, Code, Save, Play, Download, FolderOpen, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] bg-muted animate-pulse rounded-md" />
  }
)

export default function ScriptsPage() {
  const [selectedScript, setSelectedScript] = useState('BTMM_Master_Controller')
  const [editorValue, setEditorValue] = useState('')
  const editorRef = useRef(null)

  const scripts = [
    {
      name: 'BTMM_Master_Controller',
      category: 'Core',
      description: 'Central coordination and EMA bias control',
      lastModified: '2 hours ago',
      size: '15.2 KB'
    },
    {
      name: 'BTMM_EMA_System',
      category: 'Analysis',
      description: 'Steve Mauro\'s EMA food system implementation',
      lastModified: '1 day ago',
      size: '12.8 KB'
    },
    {
      name: 'BTMM_Session_Analysis',
      category: 'Analysis',
      description: 'Market session analysis and timing',
      lastModified: '3 days ago',
      size: '9.4 KB'
    },
    {
      name: 'BTMM_OTE_Zones',
      category: 'Strategy',
      description: 'Optimal Trade Entry zone detection',
      lastModified: '1 week ago',
      size: '11.1 KB'
    },
    {
      name: 'BTMM_MW_Patterns',
      category: 'Strategy',
      description: 'M&W pattern recognition system',
      lastModified: '1 week ago',
      size: '13.7 KB'
    }
  ]

  const samplePineScript = `//@version=5
indicator("BTMM Sample Script", shorttitle="BTMM", overlay=true)

// BTMM EMA Food System
ema5 = ta.ema(close, 5)    // Mustard
ema13 = ta.ema(close, 13)  // Ketchup  
ema50 = ta.ema(close, 50)  // Water
ema200 = ta.ema(close, 200) // Mayo
ema800 = ta.ema(close, 800) // Blueberry

// Plot EMAs
plot(ema5, "5 EMA", color.yellow, 2)
plot(ema13, "13 EMA", color.red, 2)
plot(ema50, "50 EMA", color.blue, 2)
plot(ema200, "200 EMA", color.green, 2)
plot(ema800, "800 EMA", color.purple, 2)

// BTMM Stack Analysis
bull_stack = close > ema5 and ema5 > ema13 and ema13 > ema50 and ema50 > ema200
bear_stack = close < ema5 and ema5 < ema13 and ema13 < ema50 and ema50 < ema200

// Background color for stack conditions
bgcolor(bull_stack ? color.new(color.green, 90) : bear_stack ? color.new(color.red, 90) : na)

// Stack strength calculation
stack_strength = 0
stack_strength := (close > ema5 ? 1 : 0) + (close > ema13 ? 1 : 0) + (close > ema50 ? 1 : 0) + (close > ema200 ? 1 : 0) + (close > ema800 ? 1 : 0)

// Plot stack strength
plotchar(stack_strength, "Stack Strength", "●", location.top, size=size.small)`

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor
    setEditorValue(samplePineScript)
  }

  const handleSave = () => {
    console.log('Saving script:', selectedScript)
    // In a real app, this would save to a backend
  }

  const handleRun = () => {
    console.log('Running script:', selectedScript)
    // In a real app, this would deploy to TradingView
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
          <h1 className="text-3xl font-bold">Pine Script Editor</h1>
          <p className="text-muted-foreground">Edit and manage BTMM Pine Scripts with advanced Monaco Editor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Explorer */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderOpen className="h-5 w-5" />
                Scripts
              </CardTitle>
              <CardDescription>Select a script to edit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  New Script
                </Button>
                
                <div className="space-y-1 mt-4">
                  {scripts.map((script) => (
                    <button
                      key={script.name}
                      onClick={() => setSelectedScript(script.name)}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                        selectedScript === script.name 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="font-medium">{script.name.replace('BTMM_', '').replace('_', ' ')}</div>
                      <div className="text-xs opacity-70">{script.category} • {script.size}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {selectedScript.replace('BTMM_', '').replace('_', ' ')}
                  </CardTitle>
                  <CardDescription>
                    {scripts.find(s => s.name === selectedScript)?.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" onClick={handleRun}>
                    <Play className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="mt-4">
                  <div className="border rounded-md overflow-hidden">
                    <MonacoEditor
                      height="600px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={editorValue}
                      onChange={(value) => setEditorValue(value || '')}
                      onMount={handleEditorMount}
                      options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="script-name">Script Name</Label>
                        <Input 
                          id="script-name" 
                          defaultValue={selectedScript}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="script-version">Pine Script Version</Label>
                        <Input 
                          id="script-version" 
                          defaultValue="5"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="script-desc">Description</Label>
                      <Input 
                        id="script-desc" 
                        defaultValue={scripts.find(s => s.name === selectedScript)?.description}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline">Overlay: True</Badge>
                      <Badge variant="outline">Max Bars Back: 5000</Badge>
                      <Badge variant="outline">Timeframe: All</Badge>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-4">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Recent changes to this script:</div>
                    {[
                      { time: '2 hours ago', action: 'Updated EMA calculations', user: 'System' },
                      { time: '1 day ago', action: 'Added stack strength indicator', user: 'System' },
                      { time: '3 days ago', action: 'Fixed background coloring', user: 'System' },
                    ].map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <div className="text-sm font-medium">{entry.action}</div>
                          <div className="text-xs text-muted-foreground">{entry.time} by {entry.user}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}