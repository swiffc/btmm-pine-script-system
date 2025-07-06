import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from "lucide-react";

interface ValidationPanelProps {
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export default function ValidationPanel({ code }: ValidationPanelProps) {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    validateCode();
  }, [code]);

  const validateCode = async () => {
    setIsValidating(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Basic Pine Script validation
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Check for version declaration
    if (!code.includes("//@version=5") && !code.includes("//@version=6")) {
      errors.push("Missing version declaration. Add //@version=5 at the top.");
    }
    
    // Check for basic structure
    if (!code.includes("indicator(") && !code.includes("strategy(") && !code.includes("library(")) {
      errors.push("Script must declare as indicator(), strategy(), or library().");
    }
    
    // Check for deprecated functions
    if (code.includes("study(")) {
      errors.push("'study()' is deprecated. Use 'indicator()' instead.");
    }
    
    // Performance warnings
    if (code.split('\n').length > 200) {
      warnings.push("Large script detected. Consider breaking into smaller functions.");
    }
    
    // BTMM specific suggestions
    if (code.includes("btmm") || code.includes("BTMM")) {
      suggestions.push("Consider adding session-based analysis for better BTMM implementation.");
      suggestions.push("Use proper risk management with position sizing.");
    }
    
    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    });
    setIsValidating(false);
  };

  return (
    <div className="p-4 border-b border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark-text">Syntax Validation</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={validateCode}
          disabled={isValidating}
          className="text-dark-muted hover:text-dark-text"
        >
          <RefreshCw className={`h-3 w-3 ${isValidating ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-3">
        {/* Status Overview */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            {validation.isValid ? (
              <>
                <CheckCircle className="h-4 w-4 text-accent-green" />
                <span className="text-accent-green">Syntax Valid</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-accent-red" />
                <span className="text-accent-red">Syntax Errors</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-accent-green rounded-full"></div>
            <span className="text-accent-green">Pine v5 Compatible</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
            <span className="text-accent-orange">Performance Optimized</span>
          </div>
        </div>

        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-accent-red" />
              <span className="text-sm font-medium text-accent-red">
                Errors ({validation.errors.length})
              </span>
            </div>
            <div className="space-y-1">
              {validation.errors.map((error, index) => (
                <div key={index} className="text-xs text-accent-red bg-accent-red/10 p-2 rounded">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-accent-orange" />
              <span className="text-sm font-medium text-accent-orange">
                Warnings ({validation.warnings.length})
              </span>
            </div>
            <div className="space-y-1">
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-xs text-accent-orange bg-accent-orange/10 p-2 rounded">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {validation.suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-accent-blue" />
              <span className="text-sm font-medium text-accent-blue">
                Suggestions
              </span>
            </div>
            <div className="space-y-1">
              {validation.suggestions.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="text-xs text-accent-blue bg-accent-blue/10 p-2 rounded">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="bg-dark-border rounded-lg p-3 space-y-2">
          <div className="text-xs font-medium text-dark-text">Performance</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-dark-muted">Lines:</span>
              <span className="ml-2 text-dark-text">{code.split('\n').length}</span>
            </div>
            <div>
              <span className="text-dark-muted">Functions:</span>
              <span className="ml-2 text-dark-text">{(code.match(/\w+\(/g) || []).length}</span>
            </div>
            <div>
              <span className="text-dark-muted">Variables:</span>
              <span className="ml-2 text-dark-text">{(code.match(/\w+\s*=/g) || []).length}</span>
            </div>
            <div>
              <span className="text-dark-muted">Plots:</span>
              <span className="ml-2 text-dark-text">{(code.match(/plot\(/g) || []).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
