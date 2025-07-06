# TradingView Pine Script v5 Rules for BTMM Trading System
## Comprehensive Development Guidelines & Error Prevention

*MANDATORY: Review and follow these guidelines before updating or creating ANY new Pine Script code.*

---

## 🚨 CRITICAL PINE SCRIPT SYNTAX RULES

### **1. Version Declaration (MANDATORY)**
```pinescript
// ✅ ALWAYS start with this - FIRST LINE ONLY
//@version=5

// ❌ NEVER use old versions
//@version=4  // DEPRECATED
//@version=3  // DEPRECATED
```

### **2. Script Type Declaration (MANDATORY SECOND LINE)**
```pinescript
// ✅ Choose ONE script type
indicator("Name", "Short", overlay=true)     // For indicators
strategy("Name", "Short", overlay=true)      // For strategies (PREMIUM only)
library("LibraryName")                       // For libraries

// ❌ NEVER mix script types or omit declaration
```

### **3. FORCE OVERLAY RULES (CRITICAL FOR PRICE CONNECTION)**
```pinescript
// ✅ ALWAYS use overlay=true for price-based indicators
indicator("BTMM EMA System", "BTMM EMAs", overlay=true)

// ✅ FORCE all plots to use price-based values
plot(ta.ema(close, 13), "EMA 13", color.red)           // Uses price scale
plot(close > ta.ema(close, 50) ? high : na, "Signal")  // Price-relative positioning

// ✅ FORCE labels and shapes to price levels
label.new(bar_index, high + ta.atr(14), "Signal")      // ATR ensures price scaling
plotshape(condition, style=shape.triangleup, location.belowbar, 
         color=color.lime, size=size.normal)            // Automatic price connection

// ❌ NEVER use overlay=false for price-based analysis
indicator("Price Indicator", overlay=false)            // Will disconnect from price

// ❌ AVOID non-price values in overlay indicators
plot(rsi_value, "RSI")                                 // RSI (0-100) breaks price scaling
plot(volume, "Volume")                                 // Volume scale conflicts with price

// ✅ CONVERT oscillators to price-relative if needed
rsi_value = ta.rsi(close, 14)
rsi_on_price = low + (high - low) * (rsi_value / 100)  // Map RSI to price range
plot(rsi_on_price, "RSI on Price", color.blue)
```

### **4. SCALING BEHAVIOR ENFORCEMENT**
```pinescript
// ✅ ENSURE all visual elements scale with price
plot_ema_with_offset(length, offset_atr) =>
    ema_value = ta.ema(close, length)
    offset = ta.atr(14) * offset_atr
    plot(ema_value, "EMA " + str.tostring(length))
    // Labels automatically scale with ATR-based offset
    if ta.crossover(close, ema_value)
        label.new(bar_index, ema_value + offset, "Cross ↗", 
                 style=label.style_label_up, color=color.green)

// ✅ FORCE consistent scale reference
indicator("BTMM System", overlay=true, scale=scale.right)  // Consistent scaling

// ✅ USE price-relative positioning for all elements
atr = ta.atr(14)  // Always use ATR for spacing
support_level = ta.lowest(low, 20)
resistance_level = ta.highest(high, 20)

// All elements use price + ATR for consistent scaling
if condition
    line.new(bar_index, support_level, bar_index + 10, support_level, 
             color=color.green, width=2)
    label.new(bar_index, support_level - atr * 0.5, "Support", 
             style=label.style_label_up, color=color.green)

// ❌ NEVER use fixed pixel or percentage offsets
label.new(bar_index, high + 50, "Label")               // Fixed offset breaks scaling
label.new(bar_index, high * 1.01, "Label")             // Percentage breaks with price range
```

### **5. MULTI-SCALE COMPATIBILITY RULES**
```pinescript
// ✅ DESIGN for all price ranges (Forex, Crypto, Stocks)
dynamic_offset(multiplier = 1.0) =>
    base_atr = ta.atr(14)
    // Ensure minimum visibility across all instruments
    min_offset = close * 0.0001  // 1 pip for forex, small % for others
    math.max(base_atr * multiplier, min_offset)

// ✅ USE percentage-based calculations for universal scaling
price_buffer = close * 0.002   // 0.2% buffer works across all instruments
upper_level = high + price_buffer
lower_level = low - price_buffer

// ✅ ADAPTIVE positioning based on volatility
volatility_atr = ta.atr(14)
volatility_percent = (volatility_atr / close) * 100

// Adjust spacing based on volatility
spacing_multiplier = volatility_percent > 2 ? 1.5 : 
                     volatility_percent > 1 ? 1.0 : 0.5

label_offset = volatility_atr * spacing_multiplier
```

---

## 📏 PINE SCRIPT LANGUAGE CONSTRAINTS

### **Variable Declaration Rules**
```pinescript
// ✅ CORRECT variable declarations
var float my_var = 0.0          // Persistent variable
my_local = 10                   // Local variable
const int MAX_BARS = 500        // Compile-time constant

// ❌ FORBIDDEN patterns
int my_var = 10                 // No type before name (Pine v4 syntax)
my_var := 10                   // Assignment operator (:=) only for reassignment
var my_var                     // Must initialize var variables
```

### **Function Definition Syntax**
```pinescript
// ✅ CORRECT function syntax
my_function(param1, param2) =>
    result = param1 + param2
    result  // Return value (last expression)

// ✅ CORRECT function with explicit type
my_function(float param1, int param2) =>
    param1 * param2

// ❌ FORBIDDEN patterns
function my_function(param1, param2)  // No 'function' keyword
def my_function(param1, param2):      // No 'def' keyword (Python syntax)
my_function(param1, param2) {         // No curly braces (JavaScript syntax)
```

### **Assignment Operators**
```pinescript
// ✅ CORRECT assignment patterns
my_var = 10                    // Declaration/assignment
my_var := 20                   // Reassignment (for var variables)

// ❌ FORBIDDEN patterns
my_var == 10                   // Comparison, not assignment
my_var += 10                   // No compound assignment operators
my_var++                       // No increment operators
```

---

## 🔤 BUILT-IN FUNCTION COMPLIANCE

### **Mathematical Functions**
```pinescript
// ✅ USE Pine Script built-ins
math.abs(-5)                   // NOT abs(-5)
math.max(a, b)                 // NOT max(a, b) 
math.min(a, b)                 // NOT min(a, b)
math.round(3.7)                // NOT round(3.7)
math.floor(3.7)                // NOT floor(3.7)
math.ceil(3.2)                 // NOT ceil(3.2)
math.pow(2, 3)                 // NOT pow(2, 3)
math.sqrt(16)                  // NOT sqrt(16)

// ❌ AVOID generic programming functions
Math.abs()                     // JavaScript syntax
abs()                          // Pine v4 syntax
```

### **Technical Analysis Functions**
```pinescript
// ✅ CORRECT Pine Script TA functions
ta.sma(close, 20)              // Simple Moving Average
ta.ema(close, 20)              // Exponential Moving Average
ta.rsi(close, 14)              // Relative Strength Index
ta.macd(close, 12, 26, 9)      // MACD
ta.atr(14)                     // Average True Range
ta.highest(high, 20)           // Highest value
ta.lowest(low, 20)             // Lowest value
ta.crossover(a, b)             // Crossover detection
ta.crossunder(a, b)            // Crossunder detection
ta.barssince(condition)        // Bars since condition
ta.valuewhen(condition, source, occurrence)

// ❌ FORBIDDEN - these are Pine v4 syntax
sma(close, 20)                 // Use ta.sma()
ema(close, 20)                 // Use ta.ema()
rsi(close, 14)                 // Use ta.rsi()
highest(high, 20)              // Use ta.highest()
crossover(a, b)                // Use ta.crossover()
```

### **Time and Date Functions**
```pinescript
// ✅ CORRECT time functions
time                           // Current bar time
timenow                        // Current time
year                           // Current bar year
month                          // Current bar month
dayofmonth                     // Day of month
dayofweek                      // Day of week (1=Sunday)
hour                           // Current bar hour
minute                         // Current bar minute
second                         // Current bar second

timestamp(timezone, year, month, day, hour, minute, second)
time(timeframe, session)       // Session time
timeframe.period               // Current timeframe
timeframe.in_seconds()         // Timeframe in seconds

// ❌ AVOID JavaScript/Python time functions
Date()                         // JavaScript
datetime.now()                 // Python
```

---

## 🎨 VISUAL ELEMENT CONSTRAINTS

### **Plot Function Rules**
```pinescript
// ✅ CORRECT plot syntax
plot(close, "Close Price", color.blue)
plot(close, title="Close", color=color.blue, linewidth=2)

// Plot with conditional display
plot(condition ? close : na, "Conditional Plot")

// ❌ FORBIDDEN patterns
plot close                     // Missing parentheses
plot(close, color="blue")      // String color (use color.blue)
plot(close, width=2)           // Use linewidth=2
```

### **Shape and Label Constraints (OVERLAY CONNECTED)**
```pinescript
// ✅ CORRECT shape plotting with price connection
plotshape(condition, "Shape", shape.triangleup, location.belowbar, color.green, size=size.normal)
plotchar(condition, "Char", "▲", location.belowbar, color.green, size=size.small)

// ✅ FORCE price-connected label positioning
atr = ta.atr(14)  // ALWAYS use ATR for consistent scaling

if buy_signal
    // Labels automatically move with price when using ATR offsets
    label.new(bar_index, low - atr, "BUY", 
             style=label.style_label_up, color=color.lime, 
             textcolor=color.black, size=size.normal)

if sell_signal
    label.new(bar_index, high + atr, "SELL", 
             style=label.style_label_down, color=color.red, 
             textcolor=color.white, size=size.normal)

// ✅ PRICE-RELATIVE line drawing
support = ta.lowest(low, 20)
resistance = ta.highest(high, 20)

// Lines stay connected to price levels
line.new(bar_index - 10, support, bar_index + 10, support, 
         color=color.green, width=2, style=line.style_solid)
line.new(bar_index - 10, resistance, bar_index + 10, resistance, 
         color=color.red, width=2, style=line.style_solid)

// ❌ NEVER use fixed offsets that break with scaling
label.new(bar_index, 1.2050, "Fixed Price")           // Breaks on zoom
label.new(bar_index, high + 50, "Fixed Offset")       // Breaks with price scaling

// ❌ LIMITED by TradingView but MUST stay price-connected
// Maximum 500 labels on chart - all must use price-relative positioning
// Maximum 500 lines on chart - all must connect to price levels
// Maximum 100 boxes on chart - all must scale with price range
```

### **Table Limitations (OVERLAY CONSIDERATIONS)**
```pinescript
// ✅ CORRECT table usage - OVERLAY COMPATIBLE
var table my_table = table.new(position.top_right, 2, 5, 
                               bgcolor=color.new(color.white, 20), 
                               border_width=1)

if barstate.islast
    // Tables don't interfere with price scaling when positioned correctly
    table.cell(my_table, 0, 0, "Price Level", text_color=color.black, text_size=size.small)
    table.cell(my_table, 1, 0, str.tostring(close, "#.####"), text_color=color.black)

// ✅ ENSURE table transparency doesn't block price action
table_bg_color = color.new(color.white, 15)  // Semi-transparent background

// ❌ LIMITATIONS - OVERLAY IMPACT
// Maximum 1 table per script
// Tables can block price visualization if not transparent
// Position tables away from active price areas
```

### **ADVANCED OVERLAY SCALING TECHNIQUES**
```pinescript
// ✅ ADAPTIVE SCALING SYSTEM
adaptive_scaling_system() =>
    // Calculate dynamic ranges for consistent visual proportion
    price_range = ta.highest(high, 100) - ta.lowest(low, 100)
    current_atr = ta.atr(14)
    
    // Ensure elements scale proportionally across all timeframes
    base_offset = price_range * 0.01        // 1% of price range
    atr_offset = current_atr * 1.0          // 1x ATR
    
    // Use the larger of the two for consistent visibility
    scaling_offset = math.max(base_offset, atr_offset)
    scaling_offset

// ✅ UNIVERSAL INSTRUMENT COMPATIBILITY
universal_offset_calculator() =>
    // Works for Forex (1.xxxx), Crypto (xxxxx), Stocks (xxx)
    tick_size = syminfo.mintick
    price_level = close
    
    // Calculate relative offset based on instrument characteristics
    if syminfo.type == "forex"
        offset = tick_size * 100              // ~10 pips
    else if syminfo.type == "crypto"
        offset = price_level * 0.001          // 0.1% of price
    else
        offset = math.max(tick_size * 10, price_level * 0.002)  // Adaptive for stocks
    
    offset

// ✅ ZOOM-RESISTANT VISUAL ELEMENTS
create_zoom_resistant_elements() =>
    scaling_offset = adaptive_scaling_system()
    
    // Elements that maintain visibility at all zoom levels
    if pattern_detected
        // Triangle size adapts to price scale
        plotshape(true, "Pattern", shape.triangleup, location.belowbar, 
                 color.lime, size=size.normal)
        
        // Label offset adapts to maintain visibility
        label.new(bar_index, low - scaling_offset, "PATTERN", 
                 style=label.style_label_up, color=color.lime, 
                 textcolor=color.black, size=size.normal)
        
        // Line thickness adapts to zoom level
        line.new(bar_index, low, bar_index, low - scaling_offset, 
                color=color.lime, width=2, style=line.style_solid)
```

---

## 🚫 FORBIDDEN PROGRAMMING CONSTRUCTS

### **No Standard Programming Loops**
```pinescript
// ❌ FORBIDDEN - Standard loop syntax
for(int i = 0; i < 10; i++)    // C/Java syntax
for i in range(10):            // Python syntax
while(condition)               // C/Java syntax

// ✅ PINE SCRIPT ONLY supports limited for loops
for i = 0 to 9
    // Limited loop body

// ✅ USE Pine Script alternatives
ta.barssince(condition)        // Instead of counting loops
ta.highest(high, 10)           // Instead of max loops
ta.lowest(low, 10)             // Instead of min loops
```

### **No Object-Oriented Programming**
```pinescript
// ❌ FORBIDDEN - No classes or objects
class MyClass:                 // Python syntax
function MyClass() {           // JavaScript syntax
struct MyStruct {              // C syntax

// ✅ USE Pine Script alternatives
// - User-defined types (UDT)
// - Arrays
// - Simple variables
```

### **No Advanced Data Structures**
```pinescript
// ❌ FORBIDDEN
dict = {}                      // No dictionaries
set = set()                    // No sets
tuple = (1, 2, 3)             // No tuples

// ✅ PINE SCRIPT ONLY supports
array<float> my_array = array.new<float>()
matrix<float> my_matrix = matrix.new<float>(3, 3)
// Simple variables
```

---

## 🔍 RUNTIME LIMITATION RULES

### **Performance Constraints**
```pinescript
// ✅ OPTIMIZE for Pine Script limits
// Maximum 40 seconds compile time
// Maximum 20 seconds execution time per bar
// Limited memory usage

// ❌ AVOID expensive operations in loops
for i = 0 to 1000
    complex_calculation()      // Will timeout

// ✅ USE efficient alternatives
simple_result = ta.sma(close, 20)  // Built-in is optimized
```

### **Request.security() Limitations**
```pinescript
// ✅ CORRECT multi-timeframe usage
higher_tf_close = request.security(syminfo.tickerid, "1D", close, 
                                  lookahead=barmerge.lookahead_off)

// ❌ LIMITATIONS
// Maximum 40 security calls per script
// Cannot request lower timeframes
// Cannot request real-time data in historical bars
```

### **Historical Data Constraints**
```pinescript
// ✅ UNDERSTAND limitations
// Maximum 5000 historical bars on most plans
// Maximum 20000 bars on Premium plans
// Data availability varies by symbol

// ✅ USE efficient historical access
recent_high = ta.highest(high, 50)  // Efficient
// Instead of manual lookback loops
```

---

## 📱 ALERT SYSTEM RULES

### **Alert Function Compliance**
```pinescript
// ✅ CORRECT alert syntax
alert("Message text", alert.freq_once_per_bar)
alert("Message text", alert.freq_once_per_bar_close)
alert("Message text", alert.freq_all)

// ✅ CORRECT alert condition
alertcondition(condition, "Title", "Message")

// ❌ LIMITATIONS
// Maximum 1000 alert() calls per bar
// Alert messages limited to 2000 characters
// Cannot send alerts to external APIs directly
```

---

## 🛡️ ERROR PREVENTION PATTERNS

### **Null/NA Handling**
```pinescript
// ✅ ALWAYS check for NA values
safe_division(a, b) =>
    if na(a) or na(b) or b == 0
        na
    else
        a / b

// ✅ USE nz() for default values
safe_value = nz(potentially_na_value, 0)

// ❌ AVOID direct operations on potential NA
result = value1 / value2       // Can cause runtime errors
```

### **Type Safety Patterns**
```pinescript
// ✅ EXPLICIT type handling
float my_float = 3.14
int my_int = 10
bool my_bool = true
string my_string = "text"
color my_color = color.blue

// ✅ TYPE conversion when needed
float_value = float(int_value)
int_value = int(float_value)
string_value = str.tostring(numeric_value)

// ❌ AVOID implicit type conflicts
my_var = true
my_var := 3.14                 // Type mismatch error
```

### **Array Safety Patterns**
```pinescript
// ✅ SAFE array operations
var array<float> my_array = array.new<float>()

safe_array_get(arr, index) =>
    if array.size(arr) > index and index >= 0
        array.get(arr, index)
    else
        na

// ✅ ALWAYS check array size
if array.size(my_array) > 0
    last_value = array.get(my_array, array.size(my_array) - 1)
```

---

## 📋 PRE-COMMIT CHECKLIST

### **Before Publishing to TradingView:**
- [ ] Script starts with `//@version=5`
- [ ] Proper script type declaration with `overlay=true` for price indicators
- [ ] **ALL visual elements use price-relative positioning (ATR/percentage based)**
- [ ] **NO fixed offsets that break with zoom/scaling**
- [ ] **Labels and shapes maintain connection to price action**
- [ ] No Pine v4 deprecated functions
- [ ] All variables properly declared
- [ ] No forbidden programming constructs
- [ ] Performance optimized (no expensive loops)
- [ ] Proper NA value handling
- [ ] Alert functions used correctly
- [ ] Visual elements within limits AND scale properly
- [ ] Type safety maintained
- [ ] Error handling implemented
- [ ] **Test scaling behavior across different zoom levels**
- [ ] **Verify price connection on multiple instruments (Forex/Crypto/Stocks)**

### **Code Quality Standards:**
- [ ] Consistent indentation (4 spaces)
- [ ] Meaningful variable names
- [ ] Functions documented with comments
- [ ] No compilation errors or warnings
- [ ] Performance under 40 seconds compile time
- [ ] Memory usage optimized
- [ ] Proper input validation
- [ ] **All visual elements use adaptive scaling techniques**
- [ ] **ATR or percentage-based positioning throughout**
- [ ] **No hardcoded price levels or fixed offsets**

### **OVERLAY & SCALING VALIDATION CHECKLIST:**
- [ ] **indicator() declaration includes `overlay=true`**
- [ ] **All plot() functions use price-based values**
- [ ] **Labels positioned with ATR or percentage offsets**
- [ ] **Lines connect actual price levels**
- [ ] **Shapes use location.belowbar/abovebar (not absolute)**
- [ ] **Tables positioned to not block price action**
- [ ] **Test zoom in/out - elements stay connected**
- [ ] **Test on different instruments - scaling works universally**
- [ ] **No fixed numerical offsets anywhere in code**
- [ ] **Background colors use transparency to show price**

---

## 🆘 COMMON ERROR FIXES

### **Compilation Errors:**
```pinescript
// ❌ ERROR: "Undeclared identifier"
result = ta.sma(close, length)

// ✅ FIX: Declare the variable
length = input.int(20, "Length")
result = ta.sma(close, length)
```

```pinescript
// ❌ ERROR: "Cannot use 'plot' in local scope"
if condition
    plot(close)

// ✅ FIX: Use conditional plotting
plot(condition ? close : na)
```

```pinescript
// ❌ ERROR: "Pine cannot determine the referencing length"
for i = 0 to n
    value = close[i]

// ✅ FIX: Use fixed length
for i = 0 to 99
    value = close[i]
```

### **Runtime Errors:**
```pinescript
// ❌ ERROR: Division by zero
result = value1 / value2

// ✅ FIX: Check for zero
result = value2 != 0 ? value1 / value2 : na
```

```pinescript
// ❌ ERROR: Array index out of bounds
value = array.get(my_array, 5)

// ✅ FIX: Check array size
value = array.size(my_array) > 5 ? array.get(my_array, 5) : na
```

### **OVERLAY & SCALING ERRORS:**
```pinescript
// ❌ ERROR: "Indicator disconnects from price when zooming"
label.new(bar_index, 1.2050, "Fixed Price Level")

// ✅ FIX: Use price-relative positioning
current_price = close
atr_offset = ta.atr(14)
label.new(bar_index, current_price + atr_offset, "Dynamic Level")
```

```pinescript
// ❌ ERROR: "Labels disappear or become too small when scaling"
label.new(bar_index, high + 0.001, "Tiny Offset")

// ✅ FIX: Use adaptive offset calculation
adaptive_offset = math.max(ta.atr(14), close * 0.002)
label.new(bar_index, high + adaptive_offset, "Adaptive Offset")
```

```pinescript
// ❌ ERROR: "Shapes not aligned with price action"
plotshape(condition, location=location.absolute, yloc=1.2000)

// ✅ FIX: Use price-relative locations
plotshape(condition, style=shape.triangleup, location=location.belowbar, color=color.lime)
```

```pinescript
// ❌ ERROR: "Lines don't follow price levels"
line.new(bar_index, 100, bar_index + 10, 105)  // Fixed price levels

// ✅ FIX: Connect lines to actual price points
support_level = ta.lowest(low, 20)
resistance_level = ta.highest(high, 20)
line.new(bar_index, support_level, bar_index + 10, support_level, color=color.green)
```

```pinescript
// ❌ ERROR: "Overlay indicator shows in separate pane"
indicator("Price Indicator", overlay=false)

// ✅ FIX: Force overlay for price-based indicators
indicator("Price Indicator", overlay=true, scale=scale.right)
```

### **MULTI-INSTRUMENT SCALING ERRORS:**
```pinescript
// ❌ ERROR: "Offsets work on EURUSD but break on BTCUSD"
fixed_offset = 0.0010  // Works for forex, breaks for crypto

// ✅ FIX: Use instrument-adaptive offsets
adaptive_offset(percentage = 0.1) =>
    close * (percentage / 100)  // Works across all instruments

offset = adaptive_offset(0.05)  // 0.05% works for all instruments
```

```pinescript
// ❌ ERROR: "ATR offset too small on high-priced instruments"
small_atr = ta.atr(14) * 0.1

// ✅ FIX: Ensure minimum visibility across all price ranges
safe_atr_offset(multiplier = 1.0) =>
    base_atr = ta.atr(14) * multiplier
    min_offset = close * 0.0001  // Minimum 0.01% of price
    math.max(base_atr, min_offset)

offset = safe_atr_offset(1.5)
```

---

## 🎯 BTMM SYSTEM SPECIFIC STANDARDS

### **Foundation Library Usage**
```pinescript
// ✅ ALWAYS import foundation for consistency
import BTMMFoundation as foundation

// ✅ USE foundation utilities for scaling
atr = foundation.atr14()                    // Consistent ATR calculation
[session_info] = foundation.session_and_cycle()
[tf_info] = foundation.timeframe_classification()
```

### **Cross-Script Integration Standards**
```pinescript
// ✅ EXPORT data for other scripts via data window
plot(signal_value, "Signal_Name", display=display.data_window)

// ✅ IMPORT external signals consistently
external_signal = input.source(close, "External Signal Source")
```

### **Alert System Integration**
```pinescript
// ✅ STANDARDIZED alert format for BTMM system
alert_message = "BTMM " + script_name + " | " + signal_type + " | " + 
                timeframe.period + " | " + str.tostring(close, "#.####")
alert(alert_message, alert.freq_once_per_bar)
```

---

*MANDATORY COMPLIANCE: All BTMM trading system scripts MUST follow these guidelines. Review this document before any code modifications or new script creation.*

**Last Updated:** December 2024  
**Version:** 1.0  
**Status:** MANDATORY FOR ALL BTMM DEVELOPMENT