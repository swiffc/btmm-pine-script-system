// .cursor-rules.js - BTMM SCRIPT LIMIT ENFORCEMENT
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