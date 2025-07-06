# Contributing to BTMM Pine Script Development Template

Thank you for your interest in contributing to the BTMM (Beat The Market Maker) Pine Script development system! This project implements Steve Mauro's institutional trading methodology through comprehensive Pine Script and MT4 indicators.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [BTMM System Architecture](#btmm-system-architecture)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites
- Basic understanding of Pine Script v5
- Familiarity with Steve Mauro's BTMM methodology
- TradingView account (Pro+ recommended for development)
- Git knowledge for version control

### BTMM Core Concepts
Before contributing, understand these key BTMM principles:
- **EMA Food System**: 5 (Mustard), 13 (Ketchup), 50 (Water), 200 (Mayo), 800 (Blueberry)
- **M&W Second Leg Patterns**: Focus on pattern completion, not initial formation
- **Session Analysis**: Asian, London, New York with proper timing
- **Institutional Logic**: Market maker phases and stop hunt detection

## Development Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd btmm-pine-script-system
   ```

2. **Install development dependencies**
   ```bash
   npm install
   ```

3. **Verify system health**
   ```bash
   npm run status
   npm run validate
   ```

## BTMM System Architecture

### 10-File Pine Script Architecture
The system maintains exactly 10 Pine Script files with corresponding MT4 versions:

1. **BTMM_Master_Controller** - Core system coordination
2. **BTMM_EMA_System** - EMA food system and bias calculations
3. **BTMM_MW_Patterns** - M&W pattern detection engine
4. **BTMM_TDI_Divergence** - TDI divergence analysis
5. **BTMM_OTE_Zones** - Optimal Trade Entry zones
6. **BTMM_Session_Analysis** - Session timing and analysis
7. **BTMM_Custom_Candles** - Custom candlestick visualization
8. **BTMM_Market_Maker_Phases** - Market maker cycle detection
9. **BTMM_Signal_Dashboard** - Multi-timeframe dashboard
10. **BTMM_Alert_System** - Comprehensive alert management

### Cross-Platform Synchronization
**CRITICAL**: All changes must be applied to both Pine Script AND MT4 files simultaneously to maintain platform parity.

## Contribution Guidelines

### Types of Contributions
- **Bug Fixes**: Corrections to existing functionality
- **Feature Enhancements**: New BTMM-compliant features
- **Documentation**: Improvements to guides and documentation
- **Testing**: Additional test cases and validation
- **Performance**: Optimization improvements

### BTMM Compliance Requirements
All contributions must:
- Follow Steve Mauro's BTMM methodology principles
- Maintain the 10-file architecture limit
- Use proper EMA food system configuration
- Implement session-based analysis correctly
- Focus on M&W second leg patterns
- Include proper error handling and validation

## Code Standards

### Pine Script Standards
```pinescript
//@version=5
indicator("BTMM_[Component_Name]", overlay=true)

// === CONFIGURATION ===
// Use clear section headers

// === INPUT PARAMETERS ===
// Follow BTMM parameter naming

// === EMA SYSTEM ===
ema_5 = ta.ema(close, 5)    // Mustard
ema_13 = ta.ema(close, 13)  // Ketchup
// ... continue pattern

// === PATTERN DETECTION ===
// Implement M&W second leg logic

// === ALERTS ===
// Include comprehensive alert conditions
```

### Naming Conventions
- **Variables**: `snake_case` (e.g., `ema_13`, `pattern_detected`)
- **Constants**: `UPPER_CASE` (e.g., `MAX_BARS`, `DEFAULT_SENSITIVITY`)
- **Functions**: `descriptive_names()` (e.g., `detect_m_pattern()`)

### Cross-Platform Requirements
When modifying functionality:
1. Update Pine Script file first
2. Apply equivalent changes to MT4 file
3. Test both platforms
4. Update documentation
5. Verify synchronization

## Testing Requirements

### Pre-Submission Testing
- [ ] Pine Script compiles without errors
- [ ] MT4 compiles without errors (if applicable)
- [ ] Tested on multiple timeframes (15M, 1H, 4H, Daily)
- [ ] Tested across different market sessions
- [ ] Pattern detection accuracy verified
- [ ] Alert system functionality confirmed

### Validation Commands
```bash
# Validate Pine Script syntax and BTMM compliance
npm run validate

# Run comprehensive system health check
npm run quality:check

# Test deployment process
npm run deploy [script-name] test
```

## Pull Request Process

### Before Submitting
1. **Test thoroughly** on TradingView (and MT4 if applicable)
2. **Update documentation** if functionality changes
3. **Follow naming conventions** and coding standards
4. **Verify cross-platform sync** if both platforms affected
5. **Add/update tests** for new functionality

### PR Checklist
- [ ] Descriptive title with [PINE], [MT4], [DOC], or [DEVOPS] prefix
- [ ] Clear description of changes and motivation
- [ ] BTMM methodology compliance verified
- [ ] Cross-platform synchronization maintained
- [ ] Testing performed and documented
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)

### Review Process
1. **Automated Testing**: CI/CD pipeline validation
2. **Code Review**: Manual review for BTMM compliance
3. **Testing Verification**: Platform-specific testing
4. **Documentation Review**: Accuracy and completeness
5. **Final Approval**: Maintainer approval and merge

## Development Commands

```bash
# System Status
npm run status              # Check system health
npm run git-status         # Check Git status

# Validation
npm run validate           # Validate Pine Scripts
npm run quality:check      # Full quality assessment

# Development
npm run deploy [script]    # Deploy specific script
npm run deploy-all         # Deploy all scripts

# Git Operations
npm run git-commit         # Intelligent commit
npm run git-push          # Push changes
npm run git-sync          # Complete sync workflow
```

## Getting Help

### Resources
- **Documentation**: `/docs` directory
- **Examples**: `/examples` directory
- **BTMM Strategy Guide**: `/docs/BTMM-Strategy-Guide.md`
- **Pine Script Reference**: `/docs/Pine-Script-v5-Reference.md`

### Support Channels
- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check existing documentation first

## Code of Conduct

This project follows professional trading development standards:
- Respect for Steve Mauro's BTMM methodology
- Accurate implementation of trading concepts
- Professional code quality and documentation
- Collaborative and respectful communication

## License

This project is focused on educational and development purposes for implementing Steve Mauro's BTMM methodology in Pine Script and MT4 platforms.

---

Thank you for contributing to the BTMM Pine Script development system! Your contributions help make institutional trading concepts more accessible to retail traders.