# 🔒 Branch Protection & Repository Governance

## 🌳 **Branch Strategy**

### Main Branches
- **`main`** - Production-ready code, protected, release branch
- **`develop`** - Integration branch for features, auto-deploys to staging
- **`feature/*`** - Feature development branches
- **`hotfix/*`** - Critical bug fixes
- **`release/*`** - Release preparation branches

## 🛡️ **Branch Protection Rules**

### Main Branch Protection (Required)
```yaml
Branch: main
Rules:
  - Require pull request reviews before merging (2 approvals)
  - Dismiss stale reviews when new commits pushed
  - Require review from code owners (@CODEOWNERS)
  - Require status checks to pass:
    - ✅ BTMM System Validation
    - ✅ Security & Compliance Scan  
    - ✅ Code Quality Analysis
    - ✅ Integration Health Check (95+ score)
    - ✅ Script Limit Validation (≤10 scripts)
  - Require branches to be up to date before merging
  - Require conversation resolution before merging
  - Restrict pushes that create files larger than 100MB
  - Require signed commits
  - Include administrators in restrictions
```

### Develop Branch Protection
```yaml
Branch: develop
Rules:
  - Require pull request reviews (1 approval)
  - Require status checks to pass:
    - ✅ Code Quality Analysis
    - ✅ BTMM System Validation
  - Allow force pushes (for integration)
  - Delete head branches automatically
```

## 👥 **Code Ownership (CODEOWNERS)**

```bash
# Global ownership
* @swiffc

# Pine Scripts - Require BTMM methodology expert
/scripts/ @swiffc @btmm-expert

# Core system files
/scripts/foundation/ @swiffc @core-team
/scripts/core/ @swiffc @trading-experts

# Automation & DevOps
/automation/ @swiffc @devops-team
/.github/ @swiffc @devops-team

# Documentation
/docs/ @swiffc @documentation-team
README.md @swiffc @documentation-team

# Configuration
/configs/ @swiffc @admin-team
package.json @swiffc @admin-team
```

## 🚀 **Release Process**

### 1. Feature Development
```bash
git checkout develop
git checkout -b feature/new-pattern-detection
# ... development work ...
git push origin feature/new-pattern-detection
# Create PR to develop
```

### 2. Release Preparation
```bash
git checkout develop
git checkout -b release/v2.1.0
# Update version numbers, changelog
git push origin release/v2.1.0
# Create PR to main
```

### 3. Production Release
```bash
# After PR merged to main
git tag -a v2.1.0 -m "Release v2.1.0: Enhanced Pattern Detection"
git push origin v2.1.0
# GitHub Actions automatically deploys to production
```

### 4. Hotfix Process
```bash
git checkout main
git checkout -b hotfix/critical-ema-bug
# ... fix critical issue ...
git push origin hotfix/critical-ema-bug
# Create PR to main (expedited review)
```

## 📋 **Required Status Checks**

### For All Branches
- ✅ **BTMM System Validation** - Ensures 10-script limit, methodology compliance
- ✅ **Pine Script Validation** - Syntax, version compatibility, performance
- ✅ **Integration Health Check** - Cross-script communication, data integrity

### For Main Branch Only
- ✅ **Security Scan** - Vulnerability assessment, compliance check
- ✅ **Production Readiness** - Performance benchmarks, stability tests
- ✅ **Documentation Update** - README, changelogs, API docs current

## 🔐 **Repository Settings**

### Security Settings
```yaml
Security:
  - Require signed commits: ✅ Enabled
  - Vulnerability alerts: ✅ Enabled
  - Dependency review: ✅ Enabled
  - Secret scanning: ✅ Enabled
  - Private vulnerability reporting: ✅ Enabled

Access:
  - Default branch: main
  - Merge options:
    - Allow merge commits: ❌ Disabled
    - Allow squash merging: ✅ Enabled
    - Allow rebase merging: ✅ Enabled
  - Auto-delete head branches: ✅ Enabled
```

### Automation Rules
```yaml
Repository Rules:
  - Protect against force pushes to main/develop
  - Require linear history on main
  - Auto-merge when all checks pass (optional)
  - Require issue linking for all PRs
  - Enforce conventional commit messages
  - Auto-assign reviewers based on files changed
```

## 📊 **Quality Gates**

### Pre-merge Requirements
1. **Code Review**: Minimum 2 approvals for main, 1 for develop
2. **BTMM Compliance**: Must follow Steve Mauro methodology
3. **Script Limit**: Must maintain ≤10 scripts (automatic merge if exceeded)
4. **Health Score**: Integration health ≥95/100
5. **Documentation**: Updated for any public API changes

### Automated Enforcement
```yaml
GitHub Actions:
  - Script counter fails build if >10 scripts
  - Health check fails if score <95
  - Security scan fails on high/critical vulnerabilities
  - Performance regression detection
  - Breaking change detection and notification
```

## 🚨 **Emergency Procedures**

### Hotfix Deployment
1. Create hotfix branch from main
2. Implement critical fix
3. Expedited review process (1 approval + admin override)
4. Deploy directly to production
5. Backport to develop

### Rollback Process
```bash
# Immediate rollback
git revert <commit-hash>
git push origin main

# Or use automation
npm run rollback --version=v2.0.0
```

### Security Incident Response
1. **Immediate**: Remove sensitive data, revoke credentials
2. **Assessment**: Determine impact scope
3. **Notification**: Inform stakeholders
4. **Fix**: Deploy security patch
5. **Review**: Post-incident analysis and prevention

## 📈 **Metrics & Monitoring**

### Repository Health Metrics
- **Lead Time**: Average time from PR creation to merge
- **Deployment Frequency**: How often we deploy to production
- **Mean Time to Recovery**: Average time to resolve incidents
- **Change Failure Rate**: Percentage of deployments causing failures

### Quality Metrics
- **Code Review Coverage**: Percentage of code reviewed
- **Test Coverage**: Percentage of code covered by tests
- **Documentation Coverage**: APIs and features documented
- **Security Score**: Vulnerability assessment rating 