# BTMM Pine Script API Reference

*Auto-generated on 2025-07-06*

## Common Functions

### Pattern Detection Functions

#### `detect_m_second_leg()`
Detects the completion of the second leg in M patterns.

**Returns:** `boolean`  
**Usage:** Essential for BTMM M pattern trading setups

#### `detect_w_second_leg()`
Detects the completion of the second leg in W patterns.

**Returns:** `boolean`  
**Usage:** Essential for BTMM W pattern trading setups

### EMA System Functions

#### `ema_food_system()`
Implements the BTMM EMA food naming system.

**EMAs:**
- Mustard: EMA 5
- Ketchup: EMA 13 (Most Important)
- Water: EMA 50
- Mayo: EMA 200
- Blueberry: EMA 800

### Session Analysis Functions

#### `london_session()`
Identifies London trading session (3:30-5:30 AM EST).

**Returns:** `boolean`  
**Usage:** Filter trades during high-impact London session

#### `ny_session()`
Identifies New York trading session (9:30-11:00 AM EST).

**Returns:** `boolean`  
**Usage:** Filter trades during high-impact NY session

### TDI Integration

#### `tdi_divergence()`
Detects regular and hidden divergences using TDI.

**Returns:** `series bool`  
**Usage:** Confluence factor for entry signals

## Input Standards

### Recommended Input Groups

```pinescript
// === EMA SYSTEM ===
mustard_length = input.int(5, "Mustard EMA", group="EMA Food System")
ketchup_length = input.int(13, "Ketchup EMA", group="EMA Food System")
water_length = input.int(50, "Water EMA", group="EMA Food System")
mayo_length = input.int(200, "Mayo EMA", group="EMA Food System")
blueberry_length = input.int(800, "Blueberry EMA", group="EMA Food System")

// === PATTERN DETECTION ===
pattern_sensitivity = input.float(0.5, "Sensitivity", 0.1, 2.0, group="Pattern Detection")
require_second_leg = input.bool(true, "Focus on Second Leg", group="Pattern Detection")

// === SESSION FILTERS ===
london_filter = input.bool(true, "London Session Filter", group="Session Analysis")
ny_filter = input.bool(true, "NY Session Filter", group="Session Analysis")
```

