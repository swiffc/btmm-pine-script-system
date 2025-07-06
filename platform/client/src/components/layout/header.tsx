import { Button } from "@/components/ui/button";
import { Download, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="trading-header sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-dark-bg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-text">BTMM Pine Script v5</h1>
                <p className="text-xs text-dark-muted">Professional Trading Development Platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-accent-green text-dark-bg hover:bg-accent-green/90">
              <Download className="h-4 w-4 mr-2" />
              Export to TradingView
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-dark-muted hover:text-dark-text hover:bg-dark-surface"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
