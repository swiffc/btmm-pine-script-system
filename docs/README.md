# BTMM Pine Script Trading System

A comprehensive Pine Script implementation of Steve Mauro's Beat the Market Makers (BTMM) trading methodology for TradingView, featuring complete Cursor IDE integration and enterprise-grade version control.

## 🎯 System Overview

This system implements the complete BTMM framework with intelligent automation, 10-script limit enforcement, and seamless TradingView deployment workflow.

### 📊 Core BTMM Components
- **3-Day Cycle Analysis** - Accumulation, V1/A1, V2/A2 setups
- **EMA Stack System** - 5, 13, 50, 200, 800 EMAs with institutional logic
- **Asian Range Detection** - Session-based range analysis and breakouts
- **Market Maker Pattern Recognition** - Advanced pattern detection algorithms
- **Higher Timeframe Bias Analysis** - Multi-timeframe confluence
- **Stop Hunt Detection** - Liquidity sweep identification
- **Comprehensive Risk Management** - Position sizing and protection

## 📋 Pine Script Architecture (10 Scripts)

### **Protected 10-Script System**
1. **BTMMFoundation.pine** - Core library and utilities (foundation/)
2. **BTMM_Core_Signals_v2.pine** - Master control system with toggle switches (core/)
3. **BTMM_Asian_Range.pine** - Comprehensive EMA and Asian session analysis (core/)
4. **BTMM_HTF_Bias.pine** - Higher timeframe bias determination (core/)
5. **BTMM_Pattern_Detection.pine** - Market maker pattern recognition (core/)
6. **BTMM_Entry_System.pine** - Trade entry signal generation (core/)
7. **BTMM_Risk_Management.pine** - Position and risk management (core/)
8. **BTMM_Stop_Hunt_Detection.pine** - Liquidity sweep detection (core/)
9. **BTMM_Master_Dashboard.pine** - Multi-panel dashboard system (dashboard/)
10. **BTMM_Alert_System.pine** - Centralized alert management (alerts/)

## 🚀 Quick Start

### Prerequisites
- **Node.js 14+** installed
- **Git** installed and configured
- **TradingView** account
- **Cursor IDE** (recommended) or VS Code

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/btmm-pine-script-system.git
cd btmm-pine-script-system

# Install dependencies and initialize system
npm run setup

# Connect to your GitHub repository (optional)
npm run setup-github https://github.com/YOUR_USERNAME/btmm-pine-script-system.git
```

### First Deployment
```bash
# Deploy a single script with Git integration
npm run deploy BTMM_EMA_System auto

# Deploy all scripts with automatic backup and Git tracking
npm run deploy-all
```

## 🔄 Enhanced Development Workflow

### **Daily Development with Git Integration**
```bash
# 1. Save your work with automatic backup and Git commit
Ctrl+Shift+V  # Save version + Git commit

# 2. Deploy to TradingView with Git tagging
Ctrl+Shift+D  # Deploy script with Git integration

# 3. Push to GitHub with automatic sync
Ctrl+Shift+G  # Git commit & push to GitHub
```

### **Development Commands**
```bash
# System validation
npm run validate-all          # Full system health check
npm run integration-health    # Dependency validation
npm run count-scripts         # Verify 10-script limit

# Version management with Git
npm run backup-all           # Local backup
npm run git-auto-commit      # Auto-commit changes
npm run sync                 # Commit and push to GitHub

# Deployment with validation
npm run deploy <script>      # Deploy single script
npm run deploy-all          # Deploy all scripts
```

## 🛠️ Advanced Features

### **Intelligent Script Limit Enforcement**
- **Real-time monitoring** prevents 11th script creation
- **Smart merger** consolidates functionality automatically
- **Dependency tracking** maintains cross-script connections
- **Integration health** 100-point scoring system

### **Git & GitHub Integration**
- **Automatic commits** on deployment
- **Release tagging** for version management
- **Cloud backup** to GitHub
- **Change tracking** with full history
- **Collaborative development** with team members

### **Cursor IDE Integration**
- **12 keyboard shortcuts** for common tasks
- **Automated tasks** for deployment and validation
- **Pine Script optimization** settings
- **Real-time validation** before save

## 📈 Steve Mauro BTMM Methodology

### **3-Day Cycle Framework**
- **Day 1**: Accumulation phase - Market makers build positions
- **Day 2**: V1/A1 Setups - Primary London session opportunities
- **Day 3**: V2/A2 Setups - Extended and alternative setups

### **EMA System Logic**
- **Signal EMAs (5, 13)**: Short-term momentum and direction
- **Balance EMA (50)**: Institutional equilibrium level
- **Home Base EMA (200)**: Major institutional reference
- **Trend EMA (800)**: Long-term bias and major trend

### **Session Priority Structure**
- **London Session**: Primary trading (2AM-12PM EST)
- **New York Session**: Secondary opportunities (8AM-5PM EST)
- **Asian Session**: Range building and setup (2AM-7AM EST)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+D` | Deploy Script | Deploy to TradingView with Git |
| `Ctrl+Shift+A` | Deploy All | Deploy all scripts with validation |
| `Ctrl+Shift+G` | Git Sync | Commit and push to GitHub |
| `Ctrl+Shift+V` | Save & Commit | Backup and Git commit |
| `Ctrl+Shift+P` | Git Status | Check repository status |
| `Ctrl+Shift+L` | Git Log | View commit history |
| `Ctrl+Shift+E` | Create Release | Tag and release version |
| `Ctrl+Shift+B` | Validate All | Full system validation |
| `Ctrl+Shift+I` | Health Check | Integration health report |
| `Ctrl+Shift+M` | Merge Scripts | Smart merge functionality |

## 🔧 Configuration & Customization

### **Cursor IDE Setup**
The system includes complete Cursor IDE optimization:
- **Pine Script v5** syntax highlighting and validation
- **Auto-deployment** to TradingView with one click
- **Real-time validation** before saving
- **Integrated backup** and version control

### **Git Configuration**
```bash
# Check Git status
npm run git-status

# View repository information
npm run git-info

# Manual commit with message
npm run git-commit "Your commit message"

# Create release
npm run release 1.0.0 "Release description"
```

### **System Monitoring**
```bash
# Complete system status
npm run status

# Health monitoring
npm run integration-health

# Dependency validation
npm run dependency-check
```

## 📊 System Health Monitoring

### **Health Scoring (100 Points)**
- **Script Count (20 pts)**: 10/10 scripts maintained
- **Dependencies (25 pts)**: All cross-script connections valid
- **Data Outputs (20 pts)**: All data window outputs functional
- **Integration (20 pts)**: Cross-script communication healthy
- **Validation (15 pts)**: All scripts compile successfully

### **Automated Monitoring**
- **Real-time dependency tracking**
- **Integration health alerts**
- **Script limit enforcement**
- **Backup verification**

## 🛡️ Backup & Recovery

### **Multi-Layer Backup System**
```bash
# Local backups
npm run backup-all          # Create timestamped backups

# Git version control
npm run git-auto-commit     # Commit current state

# GitHub cloud backup
npm run sync               # Push to GitHub

# Emergency recovery
npm run rollback           # Restore from backups
```

### **Recovery Procedures**
1. **Local Recovery**: `npm run rollback` from local backups
2. **Git Recovery**: `git reset --hard <commit-hash>`
3. **GitHub Recovery**: `git pull origin main`
4. **Emergency Recovery**: Full system restoration from multiple backup points

## 📚 Usage Examples

### **Basic Development Workflow**
```bash
# 1. Start development
npm run validate-all        # Ensure system health

# 2. Make changes to Pine scripts
# Edit scripts in Cursor IDE with real-time validation

# 3. Save and deploy
Ctrl+Shift+V               # Save with backup and Git commit
Ctrl+Shift+D               # Deploy to TradingView

# 4. Sync to GitHub
Ctrl+Shift+G               # Push to GitHub repository
```

### **Release Management**
```bash
# Create a new release
npm run release 1.2.0 "Enhanced stop hunt detection with multi-timeframe analysis"

# Deploy all scripts for release
npm run deploy-all

# Verify system health
npm run integration-health
```

### **Troubleshooting**
```bash
# Check system status
npm run status

# Validate all components
npm run validate-all

# Check integration health
npm run integration-health

# Emergency recovery if needed
npm run rollback emergency
```

## 🔗 Integration with TradingView

### **Seamless Deployment Process**
1. **Validation**: Automatic Pine Script v5 validation
2. **Optimization**: Code optimization for TradingView
3. **Clipboard**: Automatic copy to clipboard
4. **Browser**: Auto-open TradingView Pine Editor
5. **Tracking**: Log deployment with Git information

### **TradingView-Specific Features**
- **Overlay detection** for price-based indicators
- **Input source validation** for cross-script communication
- **Data window output** preservation
- **Alert condition** protection
- **Version headers** with deployment information

## 📋 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes with system validation
4. Test thoroughly on TradingView
5. Commit with descriptive message
6. Push and create Pull Request

### **Code Standards**
- **Pine Script v5** compliance required
- **Function documentation** for all exports
- **Data window outputs** must be preserved
- **Integration testing** before merge
- **Backup verification** for all changes

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links & Resources

- [TradingView Pine Script Documentation](https://www.tradingview.com/pine-script-docs/)
- [Steve Mauro BTMM Methodology](https://www.marketmakersmethod.com/)
- [Issues & Bug Reports](https://github.com/YOUR_USERNAME/btmm-pine-script-system/issues)
- [Project Documentation](docs/)

## 📞 Support & Community

### **Getting Help**
1. Check the [Documentation](docs/) for detailed guides
2. Search [Issues](https://github.com/YOUR_USERNAME/btmm-pine-script-system/issues) for similar problems
3. Create new issue with detailed description and relevant code

### **Community Guidelines**
- **Be respectful** and professional
- **Provide context** when asking questions
- **Include relevant code** and error messages
- **Test thoroughly** before reporting issues

---

## 🏆 System Status

**Current Status**: ✅ **Production Ready**
- **Scripts**: 10/10 (Target Achieved)
- **Health Score**: 100/100 (Excellent)
- **Integration**: ✅ All dependencies validated
- **Git**: ✅ Full version control enabled
- **Deployment**: ✅ Automated workflow operational

Built with ❤️ for the BTMM trading community 