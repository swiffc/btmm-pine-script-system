# 📜 BTMM Trading System Repository Rules

## 🎯 **Core Principles**

### 1. BTMM Methodology Compliance
- All trading logic must follow Steve Mauro's BTMM principles
- Institutional approach to market analysis required
- Session-based analysis priority: London > New York > Asian
- 3-day cycle framework must be maintained

### 2. Technical Excellence Standards
- Pine Script v5/v6 compliance mandatory
- Code must be production-ready at all times
- Performance benchmarks must be maintained
- Documentation required for all public interfaces

### 3. System Constraints
- **HARD LIMIT**: Maximum 10 Pine Scripts (enforced by automation)
- **HEALTH THRESHOLD**: Integration health score ≥95/100
- **PERFORMANCE**: No degradation >5% in calculation speed
- **COMPATIBILITY**: Must work on TradingView Pro+ plans

## 🔒 **Contribution Rules**

### Pull Request Requirements
1. **Mandatory Checklist Completion**
   - All PR template sections filled out
   - BTMM compliance verified
   - Testing performed across timeframes
   - Documentation updated if needed

2. **Code Review Standards**
   - Minimum 2 approvals for `main` branch
   - Minimum 1 approval for `develop` branch
   - CODEOWNERS review required for critical components
   - All conversations must be resolved

3. **Automated Validation**
   - CI/CD pipeline must pass (all green checks)
   - Script limit validation ≤10 scripts
   - Integration health check ≥95/100
   - Security scan must pass
   - No breaking changes without migration plan

### Commit Standards
```bash
# Conventional Commit Format (Enforced)
type(scope): description

# Examples:
feat(ema): add food naming system for EMA levels
fix(asian): correct session detection logic
docs(readme): update installation instructions
refactor(patterns): optimize M&W detection algorithm
```

### Branch Naming Convention
```bash
# Feature branches
feature/component-description
feature/ema-food-naming
feature/dashboard-enhancements

# Bug fixes
bugfix/component-issue
bugfix/asian-range-calculation
bugfix/alert-system-timing

# Hotfixes (production)
hotfix/critical-issue-description
hotfix/ema-stack-calculation

# Releases
release/vX.Y.Z
release/v2.1.0
```

## 🚫 **Prohibited Actions**

### Automatic Rejection Triggers
1. **Script Limit Violation**: Any PR adding scripts beyond 10/10 limit
2. **Methodology Deviation**: Changes not following BTMM principles
3. **Breaking Changes**: Without proper migration documentation
4. **Performance Regression**: >5% degradation in core calculations
5. **Security Violations**: Hardcoded secrets, unsafe patterns
6. **Incomplete Documentation**: Missing required documentation updates

### Protected Elements
```bash
# Cannot be modified without admin approval
/scripts/foundation/BTMMFoundation.pine   # Core library
/configs/settings.json                    # System configuration
/automation/git/auto-commit-system.js     # Git automation
/.github/workflows/                       # CI/CD pipelines
```

### Restricted Operations
- **Force Push**: Prohibited on `main` and `develop` branches
- **Direct Commits**: Only through pull requests
- **Admin Bypass**: Only for critical hotfixes
- **Merge Without Review**: Prohibited for all branches

## ✅ **Quality Gates**

### Pre-Merge Validation
```yaml
Required Checks:
  - ✅ BTMM System Validation (100% required)
  - ✅ Pine Script Syntax Validation
  - ✅ Integration Health Check (≥95/100)
  - ✅ Script Limit Compliance (≤10/10)
  - ✅ Security & Compliance Scan
  - ✅ Code Style & Standards Check
  - ✅ Documentation Coverage Check
```

### Performance Benchmarks
```yaml
Performance Requirements:
  - EMA Calculation Speed: <100ms per bar
  - Pattern Detection: <200ms per scan
  - Dashboard Rendering: <500ms total
  - Alert Generation: <50ms per alert
  - Memory Usage: <50MB per script
```

## 🔄 **Automation Rules**

### Automatic Actions
1. **Script Merge Strategy**
   - Auto-merge when script count >10
   - Intelligent combination based on functionality
   - Preserve all trading logic
   - Maintain cross-script communication

2. **GitHub Synchronization**
   - Auto-push all commits to GitHub
   - Fail build if GitHub sync fails
   - Maintain backup redundancy

3. **Version Management**
   - Auto-increment patch versions for fixes
   - Auto-tag releases
   - Auto-generate changelogs

### Notification Rules
```yaml
Automatic Notifications:
  - Slack: Critical builds, security alerts
  - Email: Release notifications, breaking changes
  - GitHub: PR assignments, review requests
  - Discord: Community updates, feature releases
```

## 📊 **Monitoring & Metrics**

### Repository Health Metrics
```yaml
Key Performance Indicators:
  - Script Count: Current/Maximum (X/10)
  - Integration Health: Score/100
  - Build Success Rate: Percentage
  - Deploy Frequency: Per week
  - Mean Time to Recovery: Hours
  - Code Review Coverage: Percentage
```

### Quality Metrics
```yaml
Quality Assurance:
  - Test Coverage: Aim for >80%
  - Documentation Coverage: 100% for public APIs
  - Security Score: No high/critical vulnerabilities
  - Performance Score: Baseline ±5%
  - User Satisfaction: Survey feedback
```

## 🚨 **Escalation Procedures**

### Emergency Override Process
1. **Critical Bug**: Security vulnerability or trading halt
2. **Admin Approval**: Repository owner approval required
3. **Expedited Review**: 1-hour maximum review time
4. **Post-Incident**: Required post-mortem analysis

### Conflict Resolution
1. **Technical Disputes**: Architecture team decision
2. **Methodology Questions**: BTMM expert consultation
3. **Performance Issues**: Benchmarking and testing
4. **Breaking Changes**: Community discussion required

## 📋 **Compliance Checklist**

### Before Every Commit
- [ ] Code follows BTMM methodology
- [ ] Performance benchmarks maintained
- [ ] Documentation updated
- [ ] Tests passing locally
- [ ] No hardcoded secrets

### Before Every Release
- [ ] Full integration testing complete
- [ ] Security audit passed
- [ ] Performance regression testing
- [ ] Documentation review complete
- [ ] Changelog updated

### Monthly Reviews
- [ ] Repository health metrics review
- [ ] Security vulnerability assessment
- [ ] Performance benchmark analysis
- [ ] Documentation audit
- [ ] Process improvement identification

## 🔧 **Tools & Enforcement**

### Automated Enforcement Tools
```bash
# Pre-commit hooks
husky + lint-staged         # Code quality
pine-script-validator      # Syntax validation
script-limit-enforcer     # Count validation
security-scanner          # Vulnerability check
```

### Manual Review Tools
```bash
# Code review aids
GitHub CodeQL            # Security analysis
SonarQube               # Code quality
Lighthouse              # Performance
Storybook               # Component review
```

## 📚 **Learning & Development**

### Required Knowledge
- Steve Mauro's BTMM methodology
- Pine Script v5/v6 standards
- TradingView platform limitations
- Git/GitHub best practices
- Trading session analysis

### Recommended Resources
- BTMM Documentation Library
- Pine Script Reference Manual
- TradingView Best Practices
- Institutional Trading Principles
- Risk Management Guidelines 