# BTMM Cursor IDE Integration & Automation Guide

## 🎯 Overview

This guide covers the complete Cursor IDE integration system for the BTMM trading system, including automated script limit enforcement, intelligent merge operations, and code integrity protection.

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [10-Script Limit Enforcement](#10-script-limit-enforcement)
3. [Intelligent Merge System](#intelligent-merge-system)
4. [Automation Scripts](#automation-scripts)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Daily Maintenance](#daily-maintenance)
7. [Emergency Recovery](#emergency-recovery)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ System Architecture

### Core Components

```
btmm-trading-system/
├── .cursor-rules.js              # Main enforcement rules
├── package.json                  # NPM scripts and automation
├── .vscode/                      # Cursor IDE configuration
│   ├── settings.json            # Workspace settings
│   ├── tasks.json               # Automation tasks
│   └── keybindings.json         # Keyboard shortcuts
└── automation/                   # Protection scripts
    ├── dependency-tracker.js     # Monitors dependencies
    ├── script-limit-enforcer.js  # Enforces 10-script limit
    ├── smart-merger.js           # Intelligent merging
    ├── pre-save-validation.js    # Pre-save checks
    ├── integration-health-check.js # Health monitoring
    └── rollback-system.js        # Emergency recovery
```

### Protected Script Allocation (LOCKED)

```
1. BTMMFoundation.pine          - Core library (NEVER merge others into this)
2. BTMM_EMA_System.pine         - EMA calculations and stack analysis  
3. BTMM_Asian_Range.pine        - Asian session range detection
4. BTMM_HTF_Bias.pine          - Higher timeframe bias analysis
5. BTMM_Pattern_Detection.pine  - Market maker patterns
6. BTMM_Entry_System.pine      - Entry signal generation
7. BTMM_Risk_Management.pine   - Position and risk management
8. BTMM_Stop_Hunt_Detection.pine - Stop hunt and liquidity analysis
9. BTMM_Master_Dashboard.pine  - Comprehensive dashboard
10. BTMM_Alert_System.pine     - Alert management

STATUS: 10/10 SCRIPTS (LIMIT REACHED) - NO NEW SCRIPTS ALLOWED
```

---

## 🔢 10-Script Limit Enforcement

### Automatic Monitoring

The system continuously monitors for new `.pine` file creation:

```bash
# Start monitoring (runs in background)
npm run validate-limit -- --monitor
```

### When Limit is Exceeded

1. **New script detected** → Automatically blocked
2. **Content saved** to `.blocked` file
3. **Merge target suggested** based on functionality
4. **Manual merge required** to integrate

### Manual Script Count Check

```bash
# Quick count check
npm run count-scripts

# Full status report
npm run validate-limit
```

---

## 🔄 Intelligent Merge System

### Automatic Merge Target Detection

The system analyzes functionality and suggests optimal merge targets:

| Functionality Type | Target Script |
|-------------------|---------------|
| EMA/Technical Analysis | `BTMM_EMA_System.pine` |
| Session/Time Analysis | `BTMM_Asian_Range.pine` |
| Bias/Setup Analysis | `BTMM_HTF_Bias.pine` |
| Pattern Recognition | `BTMM_Pattern_Detection.pine` |
| Entry System | `BTMM_Entry_System.pine` |
| Risk Management | `BTMM_Risk_Management.pine` |
| Market Structure | `BTMM_Stop_Hunt_Detection.pine` |
| Dashboard/Visualization | `BTMM_Master_Dashboard.pine` |
| Alert System | `BTMM_Alert_System.pine` |

### Merge Operations

```bash
# Interactive merge with suggestion
npm run merge

# Merge specific files
npm run merge -- "source.pine.blocked" "BTMM_Target_Script.pine"

# Get merge suggestions
npm run suggest-merge
```

### Merge Positions

- `after_settings` - For input declarations and variables
- `after_calculations` - For functions and calculations  
- `after_visuals` - For plot() and visual elements
- `before_data_outputs` - For alert conditions
- `end` - Default append location

---

## 🤖 Automation Scripts

### 1. Dependency Tracker (`dependency-tracker.js`)

**Purpose**: Monitors all data window outputs and input sources

```bash
# Run dependency check
npm run dependency-check

# Features:
# - Scans all data window outputs
# - Validates input.source() connections
# - Detects orphaned dependencies
# - Generates integration health report
```

### 2. Script Limit Enforcer (`script-limit-enforcer.js`)

**Purpose**: Prevents creation of 11th script

```bash
# Check current status
npm run validate-limit

# Start monitoring
npm run validate-limit -- --monitor

# Cleanup old blocked files
npm run validate-limit -- --cleanup
```

### 3. Smart Merger (`smart-merger.js`)

**Purpose**: Intelligently merges functionality into existing scripts

```bash
# Interactive merge
npm run merge

# Direct merge with parameters
node automation/smart-merger.js "source.pine" "target.pine" "after_calculations"
```

### 4. Pre-Save Validation (`pre-save-validation.js`)

**Purpose**: Validates code before saving

```bash
# Validate specific file
npm run pre-save -- "path/to/script.pine"

# Automatic validation on save (configured in settings.json)
```

**Checks performed**:
- Protected function signatures
- Critical data window outputs
- Overlay settings for price indicators
- Basic Pine Script syntax
- Integration health

### 5. Integration Health Check (`integration-health-check.js`)

**Purpose**: Comprehensive system health monitoring

```bash
# Run health check
npm run integration-health

# Start daily monitoring
node automation/integration-health-check.js --monitor
```

**Health scoring** (100 points total):
- Script Availability: 20 points
- Data Window Integrity: 25 points  
- Input Source Integrity: 25 points
- Function Signatures: 15 points
- Cross-Script Communication: 15 points

### 6. Rollback System (`rollback-system.js`)

**Purpose**: Emergency recovery and backup management

```bash
# Backup all scripts
npm run backup-all

# List all backups
npm run rollback -- list

# Restore specific script
npm run rollback -- restore "BTMM_Script.pine"

# Emergency rollback all
npm run rollback -- emergency
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+B` | Validate All Scripts | Run full dependency check |
| `Ctrl+Shift+I` | Integration Health | Check system health |
| `Ctrl+Shift+U` | Auto-Update Dependencies | Update cross-references |
| `Ctrl+Shift+M` | Merge Functionality | Start merge process |
| `Ctrl+Shift+S` | Suggest Merge Target | Get merge recommendations |
| `Ctrl+Shift+C` | Check Script Count | Quick count check |
| `Ctrl+Shift+R` | Rollback Changes | Emergency restore |
| `Ctrl+Shift+T` | Full Validation | Complete system check |
| `Ctrl+Alt+S` | Pre-Save Validation | Validate current file |

---

## 📅 Daily Maintenance

### Automated Daily Checks

The system performs automatic daily monitoring:

```bash
# All validation checks
npm run validate-all

# This runs:
# 1. Script count check
# 2. Dependency validation  
# 3. Integration health check
```

### Weekly Maintenance Checklist

- [ ] **Review backup files** and clean old ones
- [ ] **Test full system integration** on TradingView
- [ ] **Validate alert functionality** across all scripts
- [ ] **Check for Pine Script v5 updates**
- [ ] **Performance benchmarking** on different timeframes

### Monthly Health Review

```bash
# Generate comprehensive reports
npm run integration-health
npm run dependency-check
npm run validate-limit

# Check backup integrity
npm run rollback -- list
```

---

## 🚨 Emergency Recovery

### Emergency Scenarios

1. **Multiple scripts broken** → Emergency rollback
2. **Integration failures** → Restore from backup
3. **Corrupted dependencies** → Re-validate all connections

### Emergency Commands

```bash
# Emergency rollback all scripts
npm run rollback -- emergency

# Restore from specific backup type
npm run rollback -- emergency pre-merge

# Full system validation after recovery
npm run validate-all
```

### Recovery Procedures

1. **Stop all modifications**
2. **Run emergency rollback**
3. **Validate system health**
4. **Check TradingView compilation**
5. **Verify alert functionality**
6. **Document recovery actions**

---

## 🔧 Troubleshooting

### Common Issues

#### "Script limit exceeded"
```bash
# Check current count
npm run count-scripts

# Find blocked files
find . -name "*.blocked" -type f

# Merge blocked content
npm run merge
```

#### "Dependencies broken"
```bash
# Check what's broken
npm run dependency-check

# Full health check
npm run integration-health

# Emergency restore if needed
npm run rollback -- emergency
```

#### "Integration health poor"
```bash
# Detailed health report
npm run integration-health

# Check specific issues
npm run dependency-check

# Validate individual files
npm run pre-save -- "path/to/script.pine"
```

### Debug Mode

Enable verbose logging in automation scripts:

```bash
# Set debug environment
export DEBUG=btmm:*

# Run with debug output
npm run dependency-check
```

### File System Issues

```bash
# Check file permissions
ls -la automation/

# Verify backup directory
ls -la backups/

# Clean up temporary files
npm run validate-limit -- --cleanup
```

---

## 📊 Monitoring Dashboard

### Health Status Indicators

- 🟢 **90-100%**: Excellent health
- 🟡 **75-89%**: Good, minor issues
- 🟠 **50-74%**: Needs attention
- 🔴 **0-49%**: Critical issues

### Key Metrics to Monitor

1. **Script Count**: Always 10/10
2. **Data Window Outputs**: All critical outputs present
3. **Input Sources**: All have matching outputs  
4. **Function Signatures**: Protected functions unchanged
5. **Communication Paths**: No broken dependencies

---

## 🎯 Best Practices

### Development Workflow

1. **Before making changes** → Run health check
2. **During development** → Use pre-save validation
3. **After changes** → Validate integrations
4. **Before commits** → Full system validation

### Merge Strategy

1. **Analyze functionality** first
2. **Check merge target** appropriateness  
3. **Create backup** before merging
4. **Validate after merge**
5. **Test compilation** on TradingView

### Safety Rules

- ✅ **Always backup** before major changes
- ✅ **Validate dependencies** after modifications
- ✅ **Test on TradingView** before finalizing
- ❌ **Never bypass** the 10-script limit
- ❌ **Don't modify** protected function signatures
- ❌ **Avoid removing** critical data window outputs

---

*This integration system ensures your BTMM trading system remains stable, maintainable, and fully functional while enforcing architectural constraints and providing comprehensive automation support.* 