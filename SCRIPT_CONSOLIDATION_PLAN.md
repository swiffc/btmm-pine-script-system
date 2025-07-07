# 🔀 BTMM Script Consolidation Plan

## 🚨 **Current Issue**
- **93 total scripts** in repository
- **TradingView limit**: 5-25 scripts (plan dependent)
- **Target**: 10 core protected scripts
- **Status**: CRITICAL - Immediate consolidation required

## 🎯 **10 Protected Core Scripts (Final Target)**

### 1. `BTMMFoundation.pine` ✅
- **Status**: Keep as-is (foundation library)
- **Size**: 11KB
- **Function**: Core utilities and shared functions

### 2. `BTMM_EMA_System.pine` 🔀
- **Status**: MERGE TARGET for trend analysis
- **Size**: 20KB
- **Merge Candidates**:
  - `BTMM_TDI_Divergence.pine` → EMA/divergence analysis
  - `BTMM_Session_Analysis.pine` → Session-based trend analysis

### 3. `BTMM_Asian_Range.pine` 🔀
- **Status**: MERGE TARGET for session analysis
- **Size**: 17KB
- **Merge Candidates**:
  - `BTMM_Session_Analysis.pine` → Overlap with session logic
  - Range-based components from other scripts

### 4. `BTMM_HTF_Bias.pine` 🔀
- **Status**: MERGE TARGET for bias analysis
- **Size**: 22KB
- **Merge Candidates**:
  - `BTMM_SecondLeg_Analysis.pine` → Higher timeframe leg analysis
  - HTF components from pattern scripts

### 5. `BTMM_Pattern_Detection.pine` 🔀
- **Status**: MERGE TARGET for all pattern logic
- **Size**: 31KB
- **Merge Candidates**:
  - `BTMM_MW_Patterns.pine` → Market maker weekly patterns
  - `BTMM_Market_Maker_Phases.pine` → MM phase detection
  - `BTMM_Custom_Candles.pine` → Custom candle patterns

### 6. `BTMM_Entry_System.pine` 🔀
- **Status**: MERGE TARGET for all entry logic
- **Size**: 35KB
- **Merge Candidates**:
  - Entry components from various scripts
  - Signal generation logic

### 7. `BTMM_Risk_Management.pine` ✅
- **Status**: Keep as-is (specialized risk logic)
- **Size**: 20KB
- **Function**: Position sizing, stop losses, risk calculations

### 8. `BTMM_Stop_Hunt_Detection.pine` 🔀
- **Status**: MERGE TARGET for market structure
- **Size**: 12KB
- **Merge Candidates**:
  - `BTMM_OTE_Zones.pine` → Optimal trade entry zones
  - Liquidity detection from other scripts

### 9. `BTMM_Master_Dashboard.pine` 🔀
- **Status**: PRIMARY MERGE TARGET (largest)
- **Size**: 62KB
- **Merge Candidates**:
  - `BTMM_Master_Dashboard_SecondLeg.pine` → Dashboard variants
  - `BTMM_Signal_Dashboard.pine` → Signal displays
  - `BTMM_Master_Controller.pine` → Control logic
  - All visualization components

### 10. `BTMM_Alert_System.pine` ✅
- **Status**: Keep as-is (specialized alert logic)
- **Size**: 17KB
- **Function**: Notifications, conditions, alert management

---

## 🚀 **Consolidation Commands**

### Phase 1: Dashboard Consolidation
```bash
node automation/management/smart-merger.js merge "BTMM_Master_Dashboard_SecondLeg.pine" "BTMM_Master_Dashboard.pine"
node automation/management/smart-merger.js merge "BTMM_Signal_Dashboard.pine" "BTMM_Master_Dashboard.pine"
node automation/management/smart-merger.js merge "BTMM_Master_Controller.pine" "BTMM_Master_Dashboard.pine"
```

### Phase 2: Pattern Consolidation
```bash
node automation/management/smart-merger.js merge "BTMM_MW_Patterns.pine" "BTMM_Pattern_Detection.pine"
node automation/management/smart-merger.js merge "BTMM_Market_Maker_Phases.pine" "BTMM_Pattern_Detection.pine"
node automation/management/smart-merger.js merge "BTMM_Custom_Candles.pine" "BTMM_Pattern_Detection.pine"
```

### Phase 3: Analysis Consolidation
```bash
node automation/management/smart-merger.js merge "BTMM_TDI_Divergence.pine" "BTMM_EMA_System.pine"
node automation/management/smart-merger.js merge "BTMM_SecondLeg_Analysis.pine" "BTMM_HTF_Bias.pine"
node automation/management/smart-merger.js merge "BTMM_OTE_Zones.pine" "BTMM_Stop_Hunt_Detection.pine"
```

### Phase 4: Session Consolidation
```bash
node automation/management/smart-merger.js merge "BTMM_Session_Analysis.pine" "BTMM_Asian_Range.pine"
```

---

## 📊 **Size Impact Analysis**

| Script | Current Size | Post-Merge Size | Impact |
|--------|-------------|----------------|---------|
| BTMM_Master_Dashboard.pine | 62KB | ~85KB | +37% |
| BTMM_Pattern_Detection.pine | 31KB | ~65KB | +110% |
| BTMM_EMA_System.pine | 20KB | ~43KB | +115% |
| BTMM_HTF_Bias.pine | 22KB | ~34KB | +55% |
| BTMM_Asian_Range.pine | 17KB | ~38KB | +124% |
| BTMM_Stop_Hunt_Detection.pine | 12KB | ~33KB | +175% |

**Total Reduction**: 93 scripts → 10 scripts (-89% script count)

---

## ⚠️ **Critical Actions Required**

1. **Immediate**: Activate Script Limit Enforcer to prevent new script creation
2. **Priority 1**: Consolidate dashboard scripts (largest impact)
3. **Priority 2**: Merge pattern detection scripts
4. **Priority 3**: Archive unused/experimental scripts
5. **Final**: Deploy 10-script package to TradingView

---

## 🔒 **Post-Consolidation Monitoring**

- Script Limit Enforcer: **ACTIVE**
- Max Scripts: **10 (enforced)**
- New Script Creation: **BLOCKED** (must merge into existing)
- Backup System: **ACTIVE** (auto-backup before merges)

This plan reduces 93 scripts to the optimal 10-script limit while preserving all functionality through intelligent merging.
