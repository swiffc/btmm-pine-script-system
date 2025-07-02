// .cursor-rules.js - BTMM SCRIPT LIMIT ENFORCEMENT & QUALITY STANDARDS
module.exports = {
  "max-scripts": {
    "limit": 10,
    "action": "MERGE_ONLY",
    "rule": "NEVER create new .pine files beyond 10 scripts",
    "enforcement": "BLOCK creation of 11th script"
  },
  
  "merge-strategy": {
    "rule": "All new functionality MUST be merged into existing scripts",
    "priority": "Maintain script purpose and logical grouping",
    "validation": "Check script count before any new file creation"
  },

  // CRITICAL: Never modify working code without explicit approval
  "preserve-working-code": {
    "rule": "NEVER modify functions that have active dependencies",
    "action": "ASK before changing any function signature",
    "validation": "Run dependency check before any modification"
  },
  
  // Preserve all working integrations
  "maintain-integrations": {
    "rule": "ALL data window outputs must remain consistent",
    "action": "Auto-update dependent files when source changes",
    "validation": "Check all input.source() references"
  },

  // =================== PINE SCRIPT QUALITY STANDARDS ===================
  "pine-script-syntax": {
    "rule": "ALL Pine Script files MUST pass syntax validation",
    "requirements": [
      "Must start with //@version=5",
      "Must include indicator(), strategy(), or library() declaration",
      "All brackets must be properly matched: (), [], {}",
      "Maximum line length: 120 characters",
      "Use 4-space indentation consistently",
      "No trailing whitespace"
    ],
    "validation": "Check syntax before save and deployment",
    "action": "BLOCK save if syntax errors found"
  },

  "anti-repainting": {
    "rule": "PREVENT look-ahead bias and repainting issues",
    "required-practices": [
      "Use barstate.isconfirmed for historical accuracy",
      "Avoid request.security() with lookahead=barmerge.lookahead_on",
      "Use proper series declarations (var, varip, series)",
      "Validate all ta.valuewhen() and ta.barssince() usage",
      "Ensure calculations don't change on historical bars"
    ],
    "forbidden-patterns": [
      "lookahead=barmerge.lookahead_on",
      "Calculations that change historical values",
      "Future data references"
    ],
    "validation": "Scan for anti-repainting violations",
    "action": "WARN and suggest corrections"
  },

  "performance-optimization": {
    "rule": "USE efficient coding techniques and built-in functions",
    "best-practices": [
      "Use built-in ta.* functions instead of custom implementations",
      "Prefer math.* functions for mathematical operations", 
      "Use array.* and map.* for data structures",
      "Limit complex calculations and nested loops",
      "Cache expensive calculations in variables",
      "Use series declarations appropriately"
    ],
    "required-built-ins": [
      "ta.sma() instead of custom SMA",
      "ta.ema() instead of custom EMA", 
      "ta.rsi() instead of custom RSI",
      "math.max(), math.min(), math.abs()",
      "array.* for array operations",
      "map.* for key-value storage"
    ],
    "limits": {
      "max-calculations-per-bar": 500,
      "max-loop-iterations": 100,
      "max-nested-loops": 2
    },
    "validation": "Check for optimization opportunities",
    "action": "SUGGEST built-in alternatives"
  },

  "code-quality": {
    "rule": "MAINTAIN high code quality and documentation standards",
    "requirements": [
      "All functions must have descriptive comments",
      "Variable names must be descriptive and consistent",
      "Include input validation for user parameters",
      "Add error handling for edge cases",
      "Document all exported functions",
      "Use consistent naming conventions"
    ],
    "naming-conventions": {
      "functions": "snake_case or camelCase",
      "variables": "descriptive_names",
      "constants": "UPPER_CASE",
      "inputs": "user_friendly_names"
    },
    "validation": "Check code quality metrics",
    "action": "SUGGEST improvements for clarity"
  },

  "github-automation": {
    "rule": "AUTOMATICALLY commit and push all validated changes",
    "workflow": [
      "1. Validate syntax and quality",
      "2. Run integration health check", 
      "3. Create automatic backup",
      "4. Commit with descriptive message",
      "5. Push to GitHub repository",
      "6. Tag deployment if applicable"
    ],
    "commit-patterns": {
      "syntax-fix": "Fix: Pine Script syntax errors in {filename}",
      "optimization": "Optimize: Performance improvements in {filename}",
      "anti-repaint": "Fix: Anti-repainting improvements in {filename}",
      "feature": "Add: New functionality in {filename}",
      "merge": "Merge: {source} functionality into {target}"
    },
    "auto-push": true,
    "validation": "All changes must pass quality checks before GitHub push"
  },

  // Current 10-script allocation (LOCKED)
  "script-allocation": {
    "1": "BTMMFoundation.pine - Core library (NEVER merge others into this)",
    "2": "BTMM_EMA_System.pine - EMA calculations and stack analysis",
    "3": "BTMM_Asian_Range.pine - Asian session range detection", 
    "4": "BTMM_HTF_Bias.pine - Higher timeframe bias analysis",
    "5": "BTMM_Pattern_Detection.pine - Market maker patterns",
    "6": "BTMM_Entry_System.pine - Entry signal generation",
    "7": "BTMM_Risk_Management.pine - Position and risk management",
    "8": "BTMM_Stop_Hunt_Detection.pine - Stop hunt and liquidity analysis",
    "9": "BTMM_Master_Dashboard.pine - Comprehensive dashboard",
    "10": "BTMM_Alert_System.pine - Alert management",
    "status": "10/10 SCRIPTS (LIMIT REACHED) - NO NEW SCRIPTS ALLOWED"
  }
};

// Merge strategy matrix - Where to merge new functionality
const MERGE_TARGETS = {
  // Technical Analysis additions
  "ema_variations": "BTMM_EMA_System.pine",
  "moving_averages": "BTMM_EMA_System.pine",
  "trend_analysis": "BTMM_EMA_System.pine",
  
  // Session and time-based features
  "session_analysis": "BTMM_Asian_Range.pine",
  "time_filters": "BTMM_Asian_Range.pine", 
  "session_statistics": "BTMM_Asian_Range.pine",
  
  // Bias and setup enhancements
  "setup_variations": "BTMM_HTF_Bias.pine",
  "confluence_analysis": "BTMM_HTF_Bias.pine",
  "multi_timeframe": "BTMM_HTF_Bias.pine",
  
  // Pattern recognition additions
  "new_patterns": "BTMM_Pattern_Detection.pine",
  "pattern_filters": "BTMM_Pattern_Detection.pine",
  "candlestick_analysis": "BTMM_Pattern_Detection.pine",
  
  // Entry system enhancements
  "entry_filters": "BTMM_Entry_System.pine",
  "signal_generation": "BTMM_Entry_System.pine",
  "timing_analysis": "BTMM_Entry_System.pine",
  
  // Risk and money management
  "position_sizing": "BTMM_Risk_Management.pine",
  "portfolio_management": "BTMM_Risk_Management.pine",
  "drawdown_analysis": "BTMM_Risk_Management.pine",
  
  // Market structure analysis
  "liquidity_analysis": "BTMM_Stop_Hunt_Detection.pine",
  "market_structure": "BTMM_Stop_Hunt_Detection.pine",
  "order_flow": "BTMM_Stop_Hunt_Detection.pine",
  
  // Dashboard and visualization
  "new_dashboards": "BTMM_Master_Dashboard.pine",
  "data_visualization": "BTMM_Master_Dashboard.pine",
  "statistics_display": "BTMM_Master_Dashboard.pine",
  
  // Alert and notification features
  "new_alerts": "BTMM_Alert_System.pine",
  "notification_systems": "BTMM_Alert_System.pine",
  "alert_management": "BTMM_Alert_System.pine"
};

// Function to determine merge target
function getMergeTarget(functionality) {
  for (const [category, target] of Object.entries(MERGE_TARGETS)) {
    if (functionality.toLowerCase().includes(category.split('_')[0])) {
      return target;
    }
  }
  
  // Default fallback logic
  if (functionality.includes('dashboard') || functionality.includes('display')) {
    return "BTMM_Master_Dashboard.pine";
  }
  if (functionality.includes('alert') || functionality.includes('notification')) {
    return "BTMM_Alert_System.pine";
  }
  
  // If unclear, suggest the most appropriate script
  return "BTMM_Master_Dashboard.pine"; // Most flexible for general features
}

module.exports.MERGE_TARGETS = MERGE_TARGETS;
module.exports.getMergeTarget = getMergeTarget; 