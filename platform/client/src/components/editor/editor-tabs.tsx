import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Play, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorTab {
  name: string;
  active: boolean;
  hasErrors?: boolean;
}

interface EditorTabsProps {
  files: EditorTab[];
  activeFile: string;
  onFileChange: (filename: string) => void;
  onCloseFile?: (filename: string) => void;
}

export default function EditorTabs({ files, activeFile, onFileChange, onCloseFile }: EditorTabsProps) {
  return (
    <div className="bg-dark-surface border-b border-dark-border">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-1">
          <div className="flex items-center bg-dark-border rounded-lg p-1">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => onFileChange(file.name)}
                className={cn(
                  "px-3 py-1 text-sm rounded font-medium transition-colors flex items-center space-x-2",
                  file.name === activeFile
                    ? "bg-accent-blue text-dark-bg"
                    : "text-dark-text hover:bg-dark-border"
                )}
              >
                <span>{file.name}</span>
                {file.hasErrors && (
                  <AlertCircle className="h-3 w-3 text-accent-red" />
                )}
                {onCloseFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseFile(file.name);
                    }}
                    className="ml-1 hover:bg-black/20 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-dark-muted">
            <div className="w-2 h-2 bg-accent-green rounded-full"></div>
            <span>Pine Script v5</span>
            <Badge variant="secondary" className="text-xs">
              BTMM
            </Badge>
          </div>
          <Button 
            size="sm"
            className="bg-accent-blue text-dark-bg hover:bg-accent-blue/90"
          >
            <Play className="h-3 w-3 mr-1" />
            Validate
          </Button>
        </div>
      </div>
    </div>
  );
}
