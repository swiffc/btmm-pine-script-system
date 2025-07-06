# BTMM Market Maker Weekly Cycle Implementation

## Overview
Complete implementation of Steve Mauro's Market Maker Weekly Cycle methodology based on the 3-day cycle framework, PFH/PFL pattern analysis, ADR-based predictions, and institutional market maker psychology.

## Core Concepts Implemented

### 1. Typical MM Weekly Cycle (3-Day Cycle)

#### **Day 1: Reversal Day** 
- **Characteristics**: Peak Formation High (PFH) or Peak Formation Low (PFL)
- **Behavior**: Start of new cycle with potential reversal
- **Psychology**: Level 1 - MM shows direction once
- **Trading Focus**: Look for false moves and stop hunts at week beginning
- **Confluence Weight**: High (2 points) for counter-trend setups

#### **Day 2: Continuation Day**
- **Characteristics**: Trend continuation or consolidation
- **Behavior**: Price development in established direction
- **Psychology**: Level 2 - MM shows direction again to convince traders
- **Trading Focus**: Traditional technical analysis most effective
- **Confluence Weight**: Medium (1 point) for trend continuation

#### **Day 3: Completion Day**
- **Characteristics**: Trend completion and potential reversal setup
- **Psychology**: Level 3 - MM shows direction third time for full commitment
- **Behavior**: Price acceleration and separation from moving averages
- **Trading Focus**: Look for reversal signals and trend exhaustion
- **Confluence Weight**: High (2 points) for reversal setups

### 2. PFH/PFL Pattern Detection

#### **Peak Formation High (PFH)**
- **Definition**: Significant weekly high formation
- **Detection**: Highest point reached during uptrend cycle
- **Visual**: Green triangle above price
- **Significance**: Potential reversal point for downtrend initiation
- **Usage**: Watch for accumulation phase and distribution signals

#### **Peak Formation Low (PFL)**
- **Definition**: Significant weekly low formation  
- **Detection**: Lowest point reached during downtrend cycle
- **Visual**: Red triangle below price
- **Significance**: Potential reversal point for uptrend initiation
- **Usage**: Watch for distribution phase and accumulation signals

### 3. ADR (Average Daily Range) Analysis

#### **ADR Calculation Method**
- **Period**: 15-day rolling average (configurable 10-30 days)
- **Formula**: Average of daily high-low ranges over specified period
- **Range Tightening Detection**: When recent 5-day average < 80% of ADR
- **Usage**: Predicts reversal zones and target levels

#### **ADR-Based Target Zones**
- **Level 1 Target**: Daily Open ± 1x ADR
- **Level 2 Target**: Daily Open ± 2x ADR  
- **Level 3 Target**: Daily Open ± 3x ADR
- **Reversal Zone**: 3x ADR from daily open (high probability reversal)
- **Intraday Push**: ADR ÷ 3 (typical intraday movement target)

#### **ADR Trading Rules**
- **Range Expansion**: Expect 3 intraday pushes when ADR is met
- **Range Contraction**: Market preparing for significant move
- **New York Reversal**: ADR more useful for NY session reversals
- **Level Counting**: Use ADR to count levels and predict targets
- **Support/Resistance**: ADR acts as target once trade is active

### 4. Market Maker Psychology Framework

#### **3-Level Rule Implementation**
Human psychology drives MM to move price in same direction for 3 levels:

**Level 1: "Show Something Once"**
- **Psychology**: Initial direction shown to market
- **Trader Reaction**: May or may not believe the move
- **MM Strategy**: Plant seed of directional bias

**Level 2: "Show Again to Convince"**
- **Psychology**: Repeated direction to build conviction
- **Trader Reaction**: Starting to believe and follow
- **MM Strategy**: Build trader confidence in direction

**Level 3: "Full Commitment"**
- **Psychology**: Third confirmation gets full trader commitment
- **Trader Reaction**: Fully convinced, heavy positioning
- **MM Strategy**: Maximum trader participation before reversal

**Reversal Phase: "Opposite Direction"**
- **Psychology**: Wide range to cause panic and fear
- **Trader Reaction**: Realize they took wrong direction
- **MM Strategy**: Reverse to opposite direction after full commitment

### 5. Trend Reset Detection

#### **Trend Reset Criteria**
- **Trigger**: Market Makers book profit after 3 days/levels
- **Detection**: No change or reverse in market direction
- **Chart Pattern**: New anchor point (Peak Formation) established
- **Timing**: Usually appears on chart as landmark (MA 200/800)
- **Psychology**: Retail orders building up at these levels

#### **Post-Reset Behavior**
- **Movement Requirement**: MM moves one level after trend reset
- **Reversal Confirmation**: MM may reverse after one level of rise/fall
- **Level Identification**: Up to 3 levels might be identified after reset
- **Confirmation**: Confirmed reset when MM rises one level after 3-4 levels of drop

### 6. Consolidation and Accumulation Detection

#### **Consolidation Characteristics**
- **Range**: Price movement within 0.6 ATR (configurable)
- **Duration**: Minimum 12 bars (configurable 6-48)
- **Volume**: Drying up volume pattern
- **Purpose**: Accumulation or distribution phase
- **Breakout**: High probability directional move after consolidation

#### **Accumulation vs Distribution**
- **Accumulation**: Smart money buying at lower prices
- **Distribution**: Smart money selling at higher prices
- **Detection**: Volume analysis and price action within range
- **Outcome**: Significant move expected after completion

### 7. False Move and Stop Hunt Detection

#### **False Move Detection**
- **Timing**: Typically occurs at week beginning (Day 1)
- **Pattern**: Initial direction followed by immediate reversal
- **Volume**: Requires above-average volume confirmation
- **Psychology**: Catches traders following traditional strategies
- **Usage**: Indicates weak setup, reduces confluence scoring

#### **Stop Hunt Detection**
- **Pattern**: Price spikes beyond recent high/low then quickly reverses
- **Trigger**: Price beyond 20-period high/low + 0.5 ATR
- **Confirmation**: Quick reversal within 0.3 ATR of spike
- **Volume**: Requires 1.5x average volume
- **Psychology**: MM collecting stop losses before real move

### 8. Advanced Features

#### **Range Tightening Analysis**
- **Detection**: Recent 5-day average < 80% of full ADR
- **Significance**: Market preparing for expansion
- **Trading Implication**: Expect significant breakout soon
- **Risk Management**: Reduce position sizes during tight ranges

#### **Midweek Reversal Detection**
- **Timing**: Typically Tuesday/Wednesday
- **Pattern**: Change in weekly trend direction
- **Confluence**: Higher weight for reversal setups
- **Psychology**: MM changing weekly narrative

#### **Head & Shoulders Pattern Integration**
- **Detection**: Classical reversal pattern within cycle context
- **Enhanced Analysis**: Combined with cycle day and psychology level
- **Confirmation**: Volume and ADR target alignment
- **Trading**: Higher confluence when aligned with cycle completion

## System Integration

### Enhanced Confluence Scoring

#### **Base Confluence (5 Points)**
- Setup Signal: 1 point
- Pattern Detection: 1 point  
- EMA Stack: 1 point
- HTF Bias: 1 point
- Volume: 1 point

#### **Level Confluence (7 Points)**
- Level 1 Formation: 1 point
- Level 2 Formation: 1 point
- Level 3 Formation: 2 points
- Level Test: 1 point
- Level Break: 2 points

#### **MM Cycle Confluence (12 Points)**
- PFH/PFL Signal: 2 points
- Trend Reset: 3 points
- Psychology Complete: 3 points
- Reversal Zone (3x ADR): 2 points
- Cycle Day Weight: 1-2 points
- False Move Penalty: -2 points

#### **Total Possible Score: 24 Points**
- **Strong Signal**: 70% (17+ points)
- **Moderate Signal**: 50% (12+ points)
- **Weak Signal**: <50% (<12 points)

### Cross-Script Communication

#### **Data Window Outputs**
- `Cycle_Day`: Current cycle day (1, 2, or 3)
- `PFH_Signal`: Peak Formation High detection
- `PFL_Signal`: Peak Formation Low detection
- `Trend_Reset`: Trend reset signal
- `Levels_Completed`: Number of levels completed (0-3)
- `MM_Psychology_Level`: Current psychology level
- `Psychology_Complete`: Psychology cycle completion
- `Consolidation_Active`: Active consolidation phase
- `False_Move`: False move detection
- `Stop_Hunt`: Stop hunt pattern
- `Reversal_Zone`: ADR reversal zone active
- `Range_Tightening`: Range tightening detected
- `ADR_Value`: Current ADR calculation
- `Intraday_Push_Target`: Expected intraday movement

#### **Alert System**
- **Cycle Alerts**: Day 1 start, PFH/PFL signals
- **Psychology Alerts**: Cycle completion, reversal warnings
- **ADR Alerts**: Reversal zone entry, range tightening
- **Pattern Alerts**: False moves, stop hunts, consolidation

### Visual Implementation

#### **Chart Display**
- **Background Colors**: Day 1 (Blue), Day 2 (Orange), Day 3 (Red)
- **PFH/PFL Markers**: Large triangles at formation points
- **ADR Target Lines**: Dashed lines for 1x, 2x; solid for 3x ADR
- **Consolidation Boxes**: Gray shaded areas during accumulation
- **Reversal Zones**: Purple background when in 3x ADR zone

#### **Information Dashboard**
- **Cycle Status**: Current day, trend direction, levels completed
- **MM Psychology**: Current phase and completion status
- **ADR Analysis**: Current ADR, range status, targets
- **Session Info**: Current session and confluence factors

## Trading Applications

### **Day 1 Strategy**
- Watch for false moves and stop hunts
- Higher confluence for counter-trend setups
- Look for PFH/PFL formation signals
- Avoid trend-following strategies

### **Day 2 Strategy**
- Traditional technical analysis most effective
- Trend continuation setups preferred
- Monitor for midweek reversal signals
- Consolidation breakout opportunities

### **Day 3 Strategy**  
- Watch for trend completion signals
- Higher confluence for reversal setups
- Psychology cycle completion alerts
- 3x ADR reversal zone monitoring

### **Risk Management**
- Reduce position size during range tightening
- Increase position size at psychology completion
- Use ADR targets for profit taking
- Avoid trading during false move periods

## Performance Optimization

### **Computational Efficiency**
- Conditional execution based on user settings
- Efficient ADR calculation with rolling arrays
- Optimized cycle detection algorithms
- Strategic use of variables and memory

### **Multi-Timeframe Compatibility**
- Works on all timeframes with dynamic scaling
- ATR-based measurements for universal application
- Session-aware calculations
- Instrument-specific ADR calculations

### **Integration Benefits**
- Seamless integration with existing BTMM modules
- Enhanced confluence scoring system
- Professional visual presentation
- Comprehensive alert system
- Real-time analysis and feedback

This implementation provides a complete, professional-grade Market Maker Weekly Cycle analysis system that precisely follows Steve Mauro's methodology while maintaining the modular architecture and technical standards of the BTMM trading system. 