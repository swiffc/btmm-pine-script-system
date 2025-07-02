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
      "Must include indicator(), strategy(), or library() declaration with descriptive title",
      "All brackets must be properly matched: (), [], {}",
      "Maximum line length: 120 characters",
      "Use 4-space indentation consistently",
      "No trailing whitespace",
      "Proper overlay and scale parameters set",
      "Include shorttitle for chart clarity"
    ],
    "validation": "Check syntax before save and deployment",
    "action": "BLOCK save if syntax errors found"
  },

  "naming-conventions": {
    "rule": "ENFORCE consistent and descriptive naming conventions",
    "standards": {
      "variables": "camelCase (fastLength, slowEma, rsiValue)",
      "constants": "UPPERCASE (DEFAULT_LENGTH, OVERBOUGHT_LEVEL)", 
      "inputs": "descriptive prefixes (maLength, rsiPeriod, signalThreshold)",
      "functions": "descriptive purpose (priceAboveMa not flag1)",
      "forbidden": ["flag1, temp, x, y, data, val, num"]
    },
    "validation": "Scan for non-descriptive variable names",
    "action": "WARN about unclear naming"
  },

  "input-parameters": {
    "rule": "IMPLEMENT proper input parameter best practices",
    "requirements": [
      "Provide sensible default values based on common usage",
      "Include min/max constraints to prevent invalid inputs", 
      "Use descriptive titles and helpful tooltips",
      "Group related inputs logically with group parameter",
      "Validate inputs at script start with runtime.error()"
    ],
    "examples": [
      "maLength = input.int(20, 'MA Length', minval=1, maxval=200, group='Moving Average')",
      "rsiOverbought = input.float(70.0, 'Overbought Level', minval=50, maxval=95, group='RSI')"
    ],
    "validation": "Check for proper input validation",
    "action": "SUGGEST input validation improvements"
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

  "code-structure": {
    "rule": "ENFORCE proper Pine Script code organization and flow",
    "logical-flow": [
      "1. Version declaration and script setup",
      "2. Input parameters (grouped logically)", 
      "3. Variable declarations and constants",
      "4. Mathematical calculations and logic",
      "5. Plotting and visual elements",
      "6. Alerts and notifications"
    ],
    "performance-rules": [
      "Use 'var' for variables that don't need recalculation on every bar",
      "Avoid unnecessary calculations in loops",
      "Cache complex calculations when used multiple times",
      "Minimize security() function calls",
      "Use built-in functions over custom implementations"
    ],
    "validation": "Check code organization and structure",
    "action": "SUGGEST reorganization for better flow"
  },

  "error-handling": {
    "rule": "IMPLEMENT comprehensive error handling and validation",
    "requirements": [
      "Always validate inputs at script start",
      "Handle division by zero scenarios", 
      "Check for sufficient data before calculations",
      "Use proper 'na' handling for series functions",
      "Include runtime.error() for invalid inputs",
      "Safe historical references with bounds checking"
    ],
    "patterns": [
      "if maLength < 1 runtime.error('MA Length must be greater than 0')",
      "rsiValue = maLength > 0 ? ta.rsi(close, maLength) : na",
      "hasSufficientData = bar_index >= maLength",
      "prevClose = bar_index > 0 ? close[1] : close"
    ],
    "validation": "Scan for error handling patterns",
    "action": "WARN about missing error handling"
  },

  "visual-standards": {
    "rule": "MAINTAIN consistent visual design and plotting standards",
    "requirements": [
      "Use consistent color schemes throughout indicators",
      "Implement appropriate transparency for overlays",
      "Choose proper line styles and widths for clarity", 
      "Ensure plots are distinguishable from price action",
      "Use dynamic colors based on market conditions",
      "Proper scale and overlay management"
    ],
    "color-standards": [
      "bullishColor = color.new(color.green, 0)",
      "bearishColor = color.new(color.red, 0)", 
      "neutralColor = color.new(color.gray, 50)"
    ],
    "plotting-best-practices": [
      "plot(smaValue, 'SMA', color=bullishColor, linewidth=2)",
      "plotshape(buySignal, 'Buy', shape.triangleup, location.belowbar)"
    ],
    "validation": "Check plotting and visual consistency",
    "action": "SUGGEST visual improvements"
  },

  "documentation-standards": {
    "rule": "REQUIRE comprehensive documentation and comments",
    "header-requirements": [
      "Include comprehensive header with purpose and methodology",
      "Comment complex mathematical formulas",
      "Explain non-standard calculations", 
      "Document expected behavior and limitations",
      "Include author, version, and date information"
    ],
    "header-template": [
      "// =============================================================================",
      "// [INDICATOR NAME]", 
      "// =============================================================================",
      "// Purpose: [Description of what the indicator does]",
      "// Method: [Technical analysis methodology used]",
      "// Author: BTMM Development Team",
      "// Version: [Version number]",
      "// Date: [Date]",
      "// ============================================================================="
    ],
    "inline-documentation": [
      "Explain complex logic sections",
      "Document parameter choices and reasoning",
      "Include references to technical analysis sources",
      "Add TODO comments for future improvements"
    ],
    "validation": "Check documentation completeness",
    "action": "REQUIRE proper documentation headers"
  },

  "alert-implementation": {
    "rule": "IMPLEMENT proper alert system with best practices",
    "requirements": [
      "Create clear, actionable alert messages",
      "Include relevant context (price, indicator values, timeframe)",
      "Use proper alert conditions to avoid spam",
      "Test alert logic thoroughly"
    ],
    "alert-template": [
      "alertMessage = 'Signal Name\\n' +",
      "              'Symbol: ' + syminfo.ticker + '\\n' +", 
      "              'Price: ' + str.tostring(close, '#.##') + '\\n' +",
      "              'Indicator: ' + str.tostring(indicatorValue, '#.##') + '\\n' +",
      "              'Timeframe: ' + timeframe.period"
    ],
    "validation": "Check alert implementation quality",
    "action": "SUGGEST alert improvements"
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