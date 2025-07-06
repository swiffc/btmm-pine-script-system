# BTMM Pine Script Development Guide
## Product Requirements Document & Best Practices

---

## 📋 TABLE OF CONTENTS
1. [Steve Mauro BTMM Core Concepts](#steve-mauro-btmm-core-concepts)
2. [Pine Script Best Practices](#pine-script-best-practices)
3. [BTMM System Architecture](#btmm-system-architecture)
4. [Code Standards & Conventions](#code-standards--conventions)
5. [Performance Optimization](#performance-optimization)
6. [Testing & Validation](#testing--validation)
7. [Common Patterns & Templates](#common-patterns--templates)

---

## 🎯 STEVE MAURO BTMM CORE CONCEPTS

### The 3-Day Cycle Framework
```
Day 1: ACCUMULATION
- Market makers accumulate positions
- Ranging price action
- Lower volume typically
- Setup preparation phase

Day 2: INSTITUTIONAL SETUPS
- V1 Setup: Bullish above EMA 50 (Balance) during London
- A1 Setup: Bearish below EMA 50 (Balance) during London
- Primary institutional entry day

Day 3: EXTENDED OPPORTUNITIES  
- V2 Setup: Bullish above EMA 200 (Home Base) during trading sessions
- A2 Setup: Bearish below EMA 200 (Home Base) during trading sessions
- Secondary institutional opportunities
```

### EMA System Hierarchy
```
EMA 5 & 13: Signal EMAs (short-term momentum)
EMA 50: Balance Line (institutional balance point)
EMA 200: Home Base (major institutional reference)
EMA 800: Trend Filter (long-term institutional bias)

BULL STACK: 5 > 13 > 50 > 200 > 800 with price > 13
BEAR STACK: 5 < 13 < 50 < 200 < 800 with price < 13
```

### Session Priority
```
ASIAN: 2AM-7AM EST (Range Building - Reference Only)
LONDON: 2AM-12PM EST (Primary Trading - Institutional Activity)
NEW YORK: 8AM-5PM EST (Secondary Trading - Retail/Institutional Overlap)

LONDON KILLZONE: 7AM-10AM GMT (Highest Probability)
NY KILLZONE: 1PM-4PM GMT (Secondary Opportunities)
```

### Market Maker Patterns
```
RAILROAD TRACKS: Two opposite candles of similar size
CORD OF WOODS: Multiple tests of same level with rejection
OTE ZONES: 61.8%-78.6% Fibonacci retracement areas
3-CANDLE SWING: Two same-direction candles + strong reversal
ASIAN RANGE BREAKOUTS: Breaks above/below Asian session range
```

---

## 🔧 PINE SCRIPT BEST PRACTICES

### Code Structure Standards
```pinescript
// @version=5
indicator("BTMM [Module Name]", "[Short Name]", overlay=true, max_labels_count=100, max_lines_count=50)

// ============================================================================
// [MODULE NAME] - [Brief Description]
// Steve Mauro BTMM Implementation
// ============================================================================

import BTMMFoundation as foundation

// ============================================================================
// SETTINGS GROUPS
// ============================================================================
var g_MAIN = "Main Settings"
var g_FILTERS = "Filters"
var g_STYLE = "Visual Settings"
var g_DISPLAY = "Display Control"
var g_EXTERNAL = "External Sources"

// ============================================================================
// INPUT VALIDATION
// ============================================================================
// Always validate inputs with sensible min/max values

// ============================================================================
// CONTEXT & INITIALIZATION
// ============================================================================
// Get session, timeframe, and market context early

// ============================================================================
// CORE LOGIC
// ============================================================================
// Main calculations and signal generation

// ============================================================================
// VISUAL OUTPUT
// ============================================================================
// Plots, labels, tables, backgrounds

// ============================================================================
// ALERTS & DATA OUTPUTS
// ============================================================================
// Alert conditions and data window outputs
```

### Performance Optimization Rules

#### 1. Minimize Calculations
```pinescript
// ❌ BAD: Recalculating every bar
ema13 = ta.ema(close, 13)
if close > ema13
    // logic

// ✅ GOOD: Calculate once, use multiple times
ema13 = ta.ema(close, 13)
above_ema13 = close > ema13
if above_ema13
    // logic
```

#### 2. Use Conditional Execution
```pinescript
// ❌ BAD: Always calculating
expensive_calculation = complex_function()

// ✅ GOOD: Only calculate when needed
expensive_calculation = na
if condition_met
    expensive_calculation := complex_function()
```

#### 3. Efficient Array Management
```pinescript
// ✅ GOOD: Limit array sizes and clean up
var array<float> levels = array.new<float>()
if array.size(levels) > 50
    array.shift(levels)
array.push(levels, new_level)
```

### Variable Naming Conventions
```pinescript
// Booleans: use clear boolean naming
is_bull_stack = ema5 > ema13 and ema13 > ema50
has_pattern = pattern_detected
can_trade = session_valid and setup_ready

// Functions: use verb_noun format
calculate_ema_stack()
detect_patterns()
validate_session()

// Constants: use UPPER_CASE
var int MAX_PATTERNS = 10
var color BULL_COLOR = color.green

// Settings groups: use g_ prefix
var g_SETUP = "Setup Detection"
var g_ENTRY = "Entry Settings"
```

### Memory Management
```pinescript
// ✅ Always clean up visual elements
var line support_line = na
if not na(support_line)
    line.delete(support_line)
support_line := line.new(...)

// ✅ Use var for persistent data
var float last_asian_high = na
var array<float> swing_levels = array.new<float>()

// ✅ Limit historical data
lookback_period = 50
recent_data = ta.highest(high, lookback_period)
```

---

## 🏗️ BTMM SYSTEM ARCHITECTURE

### Module Dependencies
```
BTMMFoundation (Core Library)
    ↓
EMA System ← Asian Range ← HTF Bias
    ↓           ↓           ↓
Pattern Detection ← Stop Hunt Detection
    ↓           ↓
Entry System ← Risk Management
    ↓           ↓
Master Dashboard ← Alert System
```

### Data Flow Pattern
```pinescript
// 1. Context gathering
[session_info] = foundation.session_and_cycle()
[timeframe_info] = foundation.timeframe_classification()

// 2. Market data processing
market_data = process_market_conditions()

// 3. Signal generation
signals = generate_trading_signals(market_data)

// 4. Output formatting
display_results(signals)
export_data_window(signals)
```

### Inter-Module Communication
```pinescript
// ✅ Use data window outputs for module communication
plot(bull_stack ? 1 : 0, "Bull_Stack", display=display.data_window)
plot(setup_ready ? 1 : 0, "Setup_Ready", display=display.data_window)

// ✅ Accept external sources in dependent modules
bull_stack_source = input.source(close, "Bull Stack Source")
external_bull_stack = bull_stack_source > 0
```

---

## 📏 CODE STANDARDS & CONVENTIONS

### Error Handling Patterns
```pinescript
// ✅ Always handle NA values
safe_calculation(value1, value2) =>
    if na(value1) or na(value2)
        na
    else
        value1 / value2

// ✅ Validate external inputs
validate_external_source(source_value, expected_range) =>
    if na(source_value)
        false
    else if source_value < expected_range[0] or source_value > expected_range[1]
        false
    else
        true
```

### Session Handling Template
```pinescript
// ✅ Standard session detection pattern
detect_session_context() =>
    [asian, london, ny, current, cycle] = foundation.session_and_cycle()
    trading_session = london or ny
    optimal_session = (cycle == 2 and london) or (cycle == 3 and trading_session)
    [trading_session, optimal_session, current, cycle]
```

### Pattern Detection Template
```pinescript
// ✅ Standard pattern detection structure
detect_pattern(enable_setting, session_filter, volume_filter) =>
    pattern_detected = false
    pattern_type = ""
    
    if enable_setting and session_filter and volume_filter
        // Pattern logic here
        if pattern_conditions_met
            pattern_detected := true
            pattern_type := "Pattern Name"
    
    [pattern_detected, pattern_type]
```

### Dashboard Template
```pinescript
// ✅ Standard dashboard creation
create_dashboard(position, title, data_array) =>
    if barstate.islast
        var table dash = table.new(position, 2, array.size(data_array) + 1, 
                                  bgcolor=color.white, border_width=1)
        
        table.cell(dash, 0, 0, title, text_color=color.white, 
                  bgcolor=color.navy, text_size=size.small)
        table.cell(dash, 1, 0, timeframe.period, text_color=color.white, 
                  bgcolor=color.navy, text_size=size.small)
        
        for i = 0 to array.size(data_array) - 1
            row_data = array.get(data_array, i)
            table.cell(dash, 0, i + 1, row_data.label, text_size=size.tiny)
            table.cell(dash, 1, i + 1, row_data.value, 
                      bgcolor=row_data.color, text_color=color.white, text_size=size.tiny)
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Conditional Execution Strategy
```pinescript
// ✅ Use timeframe and session filters early
if is_execution_timeframe and trading_session
    // Only run expensive calculations during relevant times
    complex_analysis = perform_detailed_analysis()
    
    if setup_conditions_met
        // Only generate signals when setup is valid
        entry_signals = generate_entry_signals()
```

### Memory Efficient Arrays
```pinescript
// ✅ Efficient array management pattern
manage_level_array(levels_array, new_level, max_size) =>
    if not na(new_level)
        // Remove old levels if array is full
        while array.size(levels_array) >= max_size
            array.shift(levels_array)
        
        // Check for duplicates before adding
        duplicate_found = false
        tolerance = ta.atr(14) * 0.1
        
        for i = 0 to array.size(levels_array) - 1
            if math.abs(array.get(levels_array, i) - new_level) <= tolerance
                duplicate_found := true
                break
        
        if not duplicate_found
            array.push(levels_array, new_level)
```

### Efficient Visual Elements
```pinescript
// ✅ Batch visual element creation
create_risk_lines(entry, stop, target) =>
    var line entry_line = na
    var line stop_line = na
    var line target_line = na
    
    // Delete existing lines
    line.delete(entry_line)
    line.delete(stop_line) 
    line.delete(target_line)
    
    // Create new lines in batch
    if not na(entry)
        entry_line := line.new(bar_index, entry, bar_index + 20, entry, 
                              color=color.blue, width=2)
        stop_line := line.new(bar_index, stop, bar_index + 20, stop, 
                             color=color.red, width=2)
        target_line := line.new(bar_index, target, bar_index + 20, target, 
                               color=color.green, width=2)
```

---

## 🧪 TESTING & VALIDATION

### Unit Testing Pattern
```pinescript
// ✅ Create testable functions
test_ema_stack_calculation() =>
    // Mock data
    test_ema5 = 1.2000
    test_ema13 = 1.1950
    test_ema50 = 1.1900
    test_close = 1.2010
    
    // Test function
    [bull, bear, mixed, strength, status] = foundation.ema_stack_analysis(
        test_ema5, test_ema13, test_ema50, test_ema13 - 0.0100, na)
    
    // Validate results
    expected_bull = true
    expected_status = "BULL STACK"
    
    test_passed = bull == expected_bull and status == expected_status
    test_passed

// Run tests in development
// test_result = test_ema_stack_calculation()
// plot(test_result ? 1 : 0, "Test_Result", display=display.data_window)
```

### Validation Checklist
```pinescript
// ✅ Always validate critical inputs
validate_setup_inputs() =>
    valid = true
    error_msg = ""
    
    // Check timeframe suitability
    if timeframe.in_seconds() < 60
        valid := false
        error_msg := "Timeframe too small for BTMM analysis"
    
    // Check market hours
    if not (asian_session or london_session or ny_session)
        valid := false
        error_msg := "Outside trading sessions"
    
    // Check data availability
    if na(close) or na(high) or na(low) or na(volume)
        valid := false
        error_msg := "Insufficient market data"
    
    [valid, error_msg]
```

---

## 📚 COMMON PATTERNS & TEMPLATES

### Alert Creation Template
```pinescript
// ✅ Comprehensive alert system
create_btmm_alert(alert_type, priority, message, condition) =>
    if condition and not condition[1]
        emoji = priority == "CRITICAL" ? "🚨" : 
                priority == "HIGH" ? "🚀" : 
                priority == "MEDIUM" ? "⭐" : "📊"
        
        full_message = emoji + " " + alert_type + " | " + syminfo.ticker + 
                      " | " + timeframe.period + " | " + message
        
        alert(full_message, alert.freq_once_per_bar)

// Usage
create_btmm_alert("V1 SETUP", "CRITICAL", "Day 2 Bullish London", btmm_v1_ready)
```

### Multi-Timeframe Request Template
```pinescript
// ✅ Safe multi-timeframe data requests
get_htf_data(tf, expression) =>
    request.security(syminfo.tickerid, tf, expression, 
                    lookahead=barmerge.lookahead_off,
                    gaps=barmerge.gaps_off)

// Usage
h4_ema13 = get_htf_data("240", ta.ema(close, 13))
daily_high = get_htf_data("1D", high)
```

### Confluence Scoring Template
```pinescript
// ✅ Standard confluence scoring system
calculate_confluence_score(factors_array) =>
    score = 0
    max_score = array.size(factors_array)
    
    for i = 0 to max_score - 1
        factor = array.get(factors_array, i)
        if factor
            score := score + 1
    
    percentage = max_score > 0 ? score / max_score * 100 : 0
    [score, max_score, percentage]

// Usage
bull_factors = array.from(bull_stack, bullish_setup, pattern_detected, volume_spike)
[bull_score, max_score, bull_percentage] = calculate_confluence_score(bull_factors)
```

### Risk Management Template
```pinescript
// ✅ Standard risk calculation
calculate_position_risk(entry, stop, account_balance, risk_percent) =>
    if na(entry) or na(stop) or account_balance <= 0 or risk_percent <= 0
        [na, na, na]
    else
        risk_amount = account_balance * (risk_percent / 100)
        pip_distance = math.abs(entry - stop) * 10000
        position_size = pip_distance > 0 ? risk_amount / (pip_distance * 1.0) : na
        
        [risk_amount, pip_distance, position_size]
```

---

## 🚀 DEVELOPMENT WORKFLOW

### 1. Planning Phase
- Define module purpose and scope
- Identify dependencies and data sources
- Create input/output specifications
- Design user interface and settings

### 2. Implementation Phase
- Start with BTMMFoundation import
- Implement core logic with error handling
- Add visualization and user interface
- Create comprehensive alerts

### 3. Testing Phase
- Test with historical data
- Validate against BTMM principles
- Check performance on different timeframes
- Verify integration with other modules

### 4. Documentation Phase
- Document all inputs and outputs
- Create usage examples
- Update this PRD if needed
- Version control and change logs

---

## 📋 QUICK REFERENCE CHECKLIST

### Before Publishing Any BTMM Script:
- [ ] BTMMFoundation library imported and used
- [ ] Steve Mauro concepts correctly implemented
- [ ] Session detection and cycle tracking functional
- [ ] Error handling for all edge cases
- [ ] Performance optimized (< 2 second compile time)
- [ ] Visual elements properly managed
- [ ] Alerts comprehensive and non-spamming
- [ ] Data window outputs for integration
- [ ] Settings organized in logical groups
- [ ] Code commented and documented
- [ ] Tested across multiple timeframes
- [ ] Memory usage optimized

### Code Quality Standards:
- [ ] No compilation errors or warnings
- [ ] No infinite loops or expensive operations
- [ ] Proper variable scoping (var, local)
- [ ] Consistent naming conventions
- [ ] Logical code organization
- [ ] Comprehensive input validation
- [ ] Efficient array and visual element management

---

## 🔗 RELATED DOCUMENTATION

### Essential Reading Order:
1. **[Pine Script v5 Guidelines](pine-script-v5-guidelines.md)** - Technical compliance requirements
2. **[BTMM Development Guide](btmm-development-guide.md)** - This document (methodology & patterns)
3. **[API Reference](api-reference.md)** - Function documentation
4. **[Installation Guide](installation-guide.md)** - Setup instructions
5. **[User Manual](user-manual.md)** - Trading guide

### Integration with Pine Script v5 Guidelines:
This development guide focuses on BTMM methodology and Pine Script patterns, while the Pine Script v5 Guidelines document covers technical compliance. Both documents are mandatory reading before any development work.

---

*This document serves as the definitive guide for BTMM Pine Script development. Keep it updated as the system evolves and new best practices are discovered.*

**Last Updated:** December 2024  
**Version:** 1.0  
**Status:** MANDATORY FOR ALL BTMM DEVELOPMENT 