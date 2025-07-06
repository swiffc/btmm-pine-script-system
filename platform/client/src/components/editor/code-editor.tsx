import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  filename: string;
}

export default function CodeEditor({ value, onChange, filename }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Simple syntax highlighting for Pine Script
      const highlightSyntax = () => {
        // This would be replaced with Monaco Editor or similar in production
        // For now, we'll use a simple textarea with syntax highlighting CSS
      };
      highlightSyntax();
    }
  }, [value]);

  const lineNumbers = value.split('\n').map((_, index) => index + 1);

  return (
    <div className="code-editor rounded-lg h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
        <h3 className="text-sm font-medium text-dark-text">{filename}</h3>
        <div className="flex items-center space-x-2 text-xs text-dark-muted">
          <span>Lines: {lineNumbers.length}</span>
          <span>•</span>
          <span>Pine Script v5</span>
          <div className="flex items-center space-x-1 ml-4">
            <div className="w-2 h-2 bg-accent-green rounded-full"></div>
            <span className="text-accent-green">Valid</span>
          </div>
        </div>
      </div>
      
      <div className="flex h-full">
        {/* Line Numbers */}
        <div className="bg-dark-surface px-4 py-4 border-r border-dark-border text-right font-mono text-sm text-dark-muted min-w-[60px]">
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber} className="leading-6">
              {lineNumber}
            </div>
          ))}
        </div>
        
        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 bg-transparent text-dark-text font-mono text-sm leading-6 resize-none outline-none"
            style={{ 
              fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
              tabSize: 4
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          
          {/* Syntax Highlighting Overlay */}
          <div 
            className="absolute inset-0 p-4 pointer-events-none font-mono text-sm leading-6 whitespace-pre-wrap"
            style={{ 
              fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
              color: 'transparent'
            }}
            dangerouslySetInnerHTML={{ 
              __html: highlightPineScript(value) 
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Simple Pine Script syntax highlighter
function highlightPineScript(code: string): string {
  return code
    // Comments
    .replace(/(\/\/.*$)/gm, '<span class="text-dark-muted">$1</span>')
    // Strings
    .replace(/(".*?")/g, '<span class="text-accent-green">$1</span>')
    // Keywords
    .replace(/\b(indicator|strategy|library|var|varip|if|else|for|while|true|false|na|input|plot|bgcolor|alertcondition)\b/g, '<span class="text-accent-purple">$1</span>')
    // Functions
    .replace(/\b(ta\.|math\.|str\.|array\.|color\.|session\.|syminfo\.|timeframe\.|request\.)\w+/g, '<span class="text-accent-blue">$&</span>')
    // Numbers
    .replace(/\b\d+\.?\d*\b/g, '<span class="text-accent-orange">$&</span>')
    // Operators
    .replace(/[=+\-*\/><]/g, '<span class="text-accent-red">$&</span>');
}
