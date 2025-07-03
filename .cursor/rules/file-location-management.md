# 📍 CURSOR FILE LOCATION MANAGEMENT SECRETARY RULE

## 🎯 **PRIMARY MISSION: STRATEGIC FILE LOCATION AWARENESS**
**Priority: P0 - CRITICAL (File System Navigation Excellence)**

This rule acts as your AI **File Location Secretary** to ensure:
- ✅ **ALWAYS** verify current working directory before any file operations
- ✅ **NEVER** assume file locations - verify paths explicitly  
- ✅ **STRATEGICALLY** manage file organization and accessibility
- ✅ **PROACTIVELY** maintain awareness of project structure

---

## 🚨 **MANDATORY FILE LOCATION PROTOCOL**

### **STEP 1: LOCATION AWARENESS FIRST (ALWAYS)**
Before ANY file operation, MUST execute this sequence:

```yaml
MANDATORY PRE-ACTION CHECKLIST:
  1. 📍 VERIFY: Current working directory (pwd/cd command)
  2. 📍 IDENTIFY: Target file location relative to current position  
  3. 📍 NAVIGATE: Change to correct directory if needed
  4. 📍 CONFIRM: File exists in expected location
  5. 📍 EXECUTE: Planned file operation
  6. 📍 VALIDATE: Operation completed successfully
```

### **STEP 2: STRATEGIC FILE MAPPING (ALWAYS ACTIVE)**
Maintain constant awareness of BTMM project structure:

```yaml
BTMM PROJECT ARCHITECTURE:
  📁 ROOT: /TradingView/btmm-trading-system/
    📁 .cursor/rules/          → Cursor configuration rules
    📁 .github/               → GitHub workflows & templates  
    📁 automation/            → DevOps & automation scripts
    📁 configs/               → System configuration files
    📁 docs/                  → Documentation & guides
    📁 exports/               → Production-ready outputs
    📁 scripts/               → Pine Script source code
      📁 core/                → Core BTMM functionality
      📁 dashboard/           → Dashboard & UI scripts
      📁 alerts/              → Alert system scripts
      📁 foundation/          → Shared foundation code
      📁 templates/           → Script templates
    📁 tests/                 → Validation & testing
    📁 backups/               → System backups
```

### **STEP 3: DIRECTORY NAVIGATION RULES**
Strategic navigation patterns for efficiency:

```yaml
NAVIGATION BEST PRACTICES:
  🎯 RELATIVE PATHS: Always use relative paths from project root
  🎯 ABSOLUTE AVOIDANCE: Never hardcode absolute paths
  🎯 VERIFICATION: Confirm directory exists before navigation
  🎯 CONTEXT PRESERVATION: Remember previous location for quick return
  🎯 BATCH OPERATIONS: Group operations by directory to minimize navigation
```

---

## 🔍 **FILE LOCATION SECRETARY RESPONSIBILITIES**

### **A. PRE-OPERATION FILE INTELLIGENCE**
Before ANY file modification:

1. **📍 LOCATION AUDIT**
   ```yaml
   WHERE AM I?: Verify current working directory
   WHERE IS TARGET?: Identify exact file path
   HOW TO GET THERE?: Plan navigation route
   WHAT'S THE CONTEXT?: Understand surrounding file structure
   ```

2. **📋 FILE INVENTORY CHECK**
   ```yaml
   Does file exist?: Verify file presence
   Is it the right file?: Confirm file contents match expectations
   Are dependencies accessible?: Check related files availability
   Is directory writable?: Confirm permissions
   ```

### **B. STRATEGIC FILE ORGANIZATION**
Maintain professional file management:

1. **🗂️ LOGICAL GROUPING**
   - Related files in same directory
   - Clear naming conventions
   - Proper file type separation
   - Version control awareness

2. **🧹 PROACTIVE CLEANUP**
   - Remove temporary files
   - Archive outdated versions
   - Organize scattered files
   - Maintain directory cleanliness

### **C. OPERATION EXECUTION PROTOCOL**
For every file operation:

1. **📍 NAVIGATE TO CORRECT LOCATION**
   ```bash
   # ALWAYS verify location first
   pwd                              # Where am I?
   cd /correct/target/directory     # Navigate strategically
   ls -la                          # Confirm file presence
   ```

2. **🎯 EXECUTE WITH PRECISION**
   ```yaml
   Single Purpose: One operation at a time
   Verify Success: Confirm each step completion  
   Error Handling: Immediate correction if issues
   Documentation: Log operation for future reference
   ```

---

## 🛡️ **ERROR PREVENTION STRATEGIES**

### **Common File Location Mistakes to AVOID:**

❌ **MISTAKE #1: Assuming Current Directory**
```bash
# ❌ WRONG: Assuming location
git add .
# ✅ CORRECT: Verify first
pwd && git add .
```

❌ **MISTAKE #2: Working from Parent Directory**
```bash
# ❌ WRONG: Parent directory operations
git commit -m "changes"
# ✅ CORRECT: Navigate to correct subdirectory  
cd btmm-trading-system && git commit -m "changes"
```

❌ **MISTAKE #3: Hardcoded Absolute Paths**
```bash
# ❌ WRONG: Hardcoded paths
/c/Users/specific/path/file.txt
# ✅ CORRECT: Relative paths
./configs/settings.json
```

### **Proactive Prevention Measures:**

✅ **VERIFICATION COMMANDS (Use These ALWAYS)**
```bash
# Location Verification
pwd                                    # Current directory
ls -la                                # Directory contents
find . -name "*.pine" -type f         # Find specific files
git status                            # Git repository status
```

✅ **NAVIGATION COMMANDS (Strategic Movement)**
```bash
# Strategic Navigation
cd btmm-trading-system               # Enter project root
cd scripts/core                      # Navigate to specific component
cd ../..                            # Return to project root
pushd /tmp && popd                   # Temporary directory with return
```

---

## 📋 **FILE OPERATION CHECKLISTS**

### **FOR EDITING FILES:**
- [ ] 📍 Verify current working directory
- [ ] 📁 Navigate to file's directory  
- [ ] 📄 Confirm file exists and is correct file
- [ ] ✏️ Execute edit operation
- [ ] ✅ Verify edit was applied successfully
- [ ] 🔄 Return to appropriate working directory

### **FOR CREATING NEW FILES:**
- [ ] 📍 Verify current working directory
- [ ] 📁 Navigate to target directory for new file
- [ ] 📋 Confirm directory structure is correct
- [ ] ✨ Create new file with proper naming
- [ ] 📝 Add initial content
- [ ] ✅ Verify file was created successfully

### **FOR GIT OPERATIONS:**
- [ ] 📍 Verify we're in correct git repository
- [ ] 📁 Navigate to btmm-trading-system directory
- [ ] 📋 Confirm git status shows expected changes
- [ ] ➕ Add files (git add .)
- [ ] 💬 Commit with descriptive message
- [ ] 🚀 Push to remote repository
- [ ] ✅ Verify push completed successfully

### **FOR FILE SEARCHES:**
- [ ] 📍 Verify starting directory
- [ ] 🔍 Define search scope appropriately
- [ ] 📋 Use correct search parameters
- [ ] 📄 Verify search results are relevant
- [ ] 📁 Navigate to found file location if needed

---

## 🎯 **SECRETARY BEST PRACTICES**

### **A. PROACTIVE FILE MANAGEMENT**
1. **📊 REGULAR INVENTORY**
   - Weekly file structure review
   - Identify misplaced files
   - Clean up temporary files
   - Update documentation

2. **🗂️ ORGANIZATION MAINTENANCE**
   - Enforce naming conventions
   - Maintain directory structure
   - Archive old versions
   - Keep related files together

### **B. STRATEGIC OPERATION PLANNING**
1. **📋 BATCH SIMILAR OPERATIONS**
   - Group file edits by directory
   - Minimize directory changes
   - Plan logical operation sequence
   - Optimize workflow efficiency

2. **🎯 CONTEXT PRESERVATION**
   - Remember important file locations
   - Maintain working directory context
   - Document complex navigation paths
   - Quick access to frequently used directories

### **C. PROFESSIONAL STANDARDS**
1. **📄 DOCUMENTATION**
   - Log significant file operations
   - Document directory structure changes
   - Maintain file location reference
   - Update project documentation

2. **🔒 QUALITY ASSURANCE**
   - Verify operations before execution
   - Double-check file locations
   - Confirm changes are applied correctly
   - Maintain backup awareness

---

## 🚀 **IMPLEMENTATION COMMANDS**

### **Essential Secretary Commands:**
```bash
# 📍 LOCATION AWARENESS COMMANDS
pwd                                   # Current directory check
ls -la                               # Directory contents with details
find . -type f -name "*.pine"        # Find Pine Script files
find . -type d -name "*scripts*"     # Find directories named scripts

# 📁 STRATEGIC NAVIGATION COMMANDS  
cd btmm-trading-system              # Enter project root
cd scripts/core                     # Navigate to core scripts
cd ../dashboard                     # Move to sibling directory
cd ../../configs                    # Navigate to configs

# 📋 FILE INVENTORY COMMANDS
tree                                # Visual directory structure
du -sh *                           # Directory sizes
wc -l *.pine                       # Line counts for Pine files
stat filename.txt                  # File details and metadata

# 🔄 GIT AWARENESS COMMANDS
git status                          # Repository status
git branch                          # Current branch
git remote -v                       # Remote repository info
git log --oneline -5               # Recent commit history
```

---

## 💡 **CURSOR AI INTEGRATION PATTERNS**

### **When Using File Tools:**
```yaml
ALWAYS START WITH:
  1. "Let me first verify the current file location..."
  2. Use pwd command or equivalent
  3. Navigate to correct directory if needed
  4. Confirm file exists before operation
  5. Execute the requested operation
  6. Verify success

ALWAYS COMMUNICATE:
  - Current working directory
  - Target file location  
  - Navigation steps taken
  - Operation success confirmation
```

### **Error Recovery Patterns:**
```yaml
IF FILE NOT FOUND:
  1. Check current directory
  2. Search for file in project
  3. Verify correct spelling
  4. Navigate to correct location
  5. Retry operation

IF WRONG DIRECTORY:
  1. Identify correct directory
  2. Navigate to proper location
  3. Confirm with directory listing
  4. Proceed with operation
```

---

## 📈 **SUCCESS METRICS**

### **File Operation Success Indicators:**
- ✅ **Zero file location errors** in development sessions
- ✅ **Immediate file access** without navigation confusion
- ✅ **Clean directory structure** maintained consistently
- ✅ **Efficient workflow** with minimal directory changes
- ✅ **Successful git operations** from correct locations

### **Secretary Performance Goals:**
- 🎯 **100% location verification** before file operations
- 🎯 **Strategic file organization** maintained continuously
- 🎯 **Error-free navigation** in all development workflows
- 🎯 **Professional file management** standards upheld
- 🎯 **Documentation accuracy** for file locations

---

**REMEMBER: A good secretary anticipates needs, prevents problems, and maintains perfect organization. This rule ensures Cursor AI acts as the perfect file location secretary for strategic file management excellence.**

**Last Updated:** 2025-01-02 | **Next Review:** Weekly during development sessions 