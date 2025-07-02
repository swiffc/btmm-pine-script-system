// smart-merger.js - BTMM Smart Merge System
const fs = require('fs');
const path = require('path');

class BTMMSmartMerger {
  constructor() {
    this.scriptsDir = path.join(__dirname, '..', 'scripts');
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.ensureBackupDirectory();
  }

  ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Main merge function
  mergeIntoExistingScript(sourceFile, targetScript, mergePosition = "end") {
    console.log(`🔀 Merging functionality into ${targetScript}`);
    console.log(`📁 Source: ${sourceFile}`);
    console.log(`🎯 Target: ${targetScript}\n`);
    
    try {
      // 1. Validate inputs
      if (!this.validateMergeInputs(sourceFile, targetScript)) {
        return false;
      }

      // 2. Create backup
      this.createBackup(targetScript);
      
      // 3. Analyze existing structure
      const structure = this.analyzeScriptStructure(targetScript);
      
      // 4. Read and prepare new content
      const newContent = this.prepareNewContent(sourceFile);
      
      // 5. Determine optimal insertion point
      const insertionPoint = this.findOptimalInsertionPoint(structure, newContent, mergePosition);
      
      // 6. Merge with proper integration
      const success = this.performMerge(targetScript, newContent, insertionPoint);
      
      // 7. Validate merge success
      if (success && this.validateMergedScript(targetScript)) {
        console.log(`✅ Merge completed successfully\n`);
        return true;
      } else {
        console.log(`❌ Merge failed, restoring backup\n`);
        this.restoreBackup(targetScript);
        return false;
      }
    } catch (error) {
      console.error(`🚨 Merge error: ${error.message}`);
      this.restoreBackup(targetScript);
      return false;
    }
  }

  validateMergeInputs(sourceFile, targetScript) {
    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`❌ Source file not found: ${sourceFile}`);
      return false;
    }

    // Find target script
    const targetPath = this.findScriptPath(targetScript);
    if (!targetPath) {
      console.error(`❌ Target script not found: ${targetScript}`);
      return false;
    }

    // Check source content
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');
    if (sourceContent.trim().length === 0) {
      console.error(`❌ Source file is empty: ${sourceFile}`);
      return false;
    }

    console.log(`✅ Validation passed`);
    return true;
  }

  analyzeScriptStructure(scriptPath) {
    const fullPath = this.findScriptPath(scriptPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    
    const structure = {
      hasVersionDeclaration: content.includes('//@version=5'),
      hasIndicatorDeclaration: content.includes('indicator('),
      hasImports: content.includes('import '),
      hasSettings: content.includes('var g_') || content.includes('input.'),
      hasCalculations: content.includes('// ============================================================================'),
      hasVisuals: content.includes('plot(') || content.includes('label.'),
      hasAlerts: content.includes('alertcondition('),
      hasDataOutputs: content.includes('display=display.data_window'),
      lineCount: lines.length,
      settingsEnd: this.findSectionEnd(lines, 'settings'),
      calculationsEnd: this.findSectionEnd(lines, 'calculations'),
      visualsEnd: this.findSectionEnd(lines, 'visuals'),
      alertsEnd: this.findSectionEnd(lines, 'alerts')
    };

    console.log(`📊 Script structure analysis:`);
    console.log(`   Lines: ${structure.lineCount}`);
    console.log(`   Has settings: ${structure.hasSettings}`);
    console.log(`   Has calculations: ${structure.hasCalculations}`);
    console.log(`   Has visuals: ${structure.hasVisuals}`);
    console.log(`   Has alerts: ${structure.hasAlerts}\n`);
    
    return structure;
  }

  findSectionEnd(lines, sectionType) {
    const patterns = {
      settings: [/^var\s+g_/, /^input\./, /^\/\/.*[Ss]ettings/],
      calculations: [/^\/\/.*[Cc]alculat/, /^\/\/.*[Ff]unction/, /^[a-zA-Z_]\w*\s*=/],
      visuals: [/^plot\s*\(/, /^label\./, /^line\./],
      alerts: [/^alertcondition\s*\(/]
    };

    const sectionPatterns = patterns[sectionType] || [];
    let lastMatch = -1;

    lines.forEach((line, index) => {
      if (sectionPatterns.some(pattern => pattern.test(line.trim()))) {
        lastMatch = index;
      }
    });

    return lastMatch;
  }

  prepareNewContent(sourceFile) {
    let content = fs.readFileSync(sourceFile, 'utf8');
    
    // Remove version declaration if present (target should already have it)
    content = content.replace(/^\/\/@version=5\s*\n/, '');
    
    // Remove indicator declaration if present (target should already have it)
    content = content.replace(/^indicator\([^)]+\)\s*\n/, '');
    
    // Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return content.trim();
  }

  findOptimalInsertionPoint(structure, newContent, preference) {
    console.log(`🎯 Determining insertion point...`);
    
    // Analyze new content to determine best placement
    if (newContent.includes('input.') || newContent.includes('var g_')) {
      console.log(`   → After settings (contains input/variable declarations)`);
      return 'after_settings';
    }
    if (newContent.includes('plot(') || newContent.includes('label.')) {
      console.log(`   → After visuals (contains plot/visual elements)`);
      return 'after_visuals';
    }
    if (newContent.includes('alertcondition(')) {
      console.log(`   → Before data outputs (contains alert conditions)`);
      return 'before_data_outputs';
    }
    if (newContent.includes('function ') || newContent.includes('=>')) {
      console.log(`   → After calculations (contains functions/calculations)`);
      return 'after_calculations';
    }
    
    console.log(`   → Using preference: ${preference}`);
    return preference;
  }

  performMerge(targetScript, newCode, insertionPoint) {
    const targetPath = this.findScriptPath(targetScript);
    const content = fs.readFileSync(targetPath, 'utf8');
    const lines = content.split('\n');
    
    // Find insertion index based on insertion point
    let insertIndex = this.findInsertionIndex(lines, insertionPoint);
    
    console.log(`📍 Inserting at line ${insertIndex + 1}`);
    
    // Prepare new code with proper formatting
    const formattedNewCode = this.formatCodeForMerge(newCode, insertionPoint);
    
    // Insert the new code
    const newLines = formattedNewCode.split('\n');
    lines.splice(insertIndex, 0, ...newLines);
    
    // Write back to file
    fs.writeFileSync(targetPath, lines.join('\n'));
    
    console.log(`✅ Merged ${newLines.length} lines into ${targetScript}`);
    return true;
  }

  findInsertionIndex(lines, insertionPoint) {
    switch (insertionPoint) {
      case 'after_settings':
        // Find last input or variable declaration
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes('input.') || lines[i].includes('var g_')) {
            return i + 1;
          }
        }
        return this.findAfterIndicator(lines);
        
      case 'after_calculations':
        // Find last function or calculation
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes('=>') || lines[i].includes('= ') || 
              lines[i].includes('function ')) {
            return i + 1;
          }
        }
        return this.findAfterSettings(lines);
        
      case 'after_visuals':
        // Find last plot, label, or visual element
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes('plot(') || lines[i].includes('label.') || 
              lines[i].includes('line.')) {
            return i + 1;
          }
        }
        return this.findAfterCalculations(lines);
        
      case 'before_data_outputs':
        // Find first data window output
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('display=display.data_window')) {
            return i;
          }
        }
        return lines.length;
        
      default:
        return lines.length; // Append at end
    }
  }

  findAfterIndicator(lines) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('indicator(')) {
        return i + 1;
      }
    }
    return 0;
  }

  findAfterSettings(lines) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('input.') || lines[i].includes('var g_')) {
        return i + 1;
      }
    }
    return this.findAfterIndicator(lines);
  }

  findAfterCalculations(lines) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('=>') || lines[i].includes('= ')) {
        return i + 1;
      }
    }
    return this.findAfterSettings(lines);
  }

  formatCodeForMerge(newCode, insertionPoint) {
    // Add appropriate section headers and spacing
    const sectionHeaders = {
      'after_settings': '\n// ============================================================================\n// MERGED FUNCTIONALITY - SETTINGS\n// ============================================================================',
      'after_calculations': '\n// ============================================================================\n// MERGED FUNCTIONALITY - CALCULATIONS\n// ============================================================================',
      'after_visuals': '\n// ============================================================================\n// MERGED FUNCTIONALITY - VISUALS\n// ============================================================================',
      'before_data_outputs': '\n// ============================================================================\n// MERGED FUNCTIONALITY - ALERTS\n// ============================================================================'
    };

    const header = sectionHeaders[insertionPoint] || '\n// ============================================================================\n// MERGED FUNCTIONALITY\n// ============================================================================';
    return header + '\n\n' + newCode + '\n';
  }

  validateMergedScript(scriptPath) {
    console.log(`🧪 Validating merged script...`);
    
    const targetPath = this.findScriptPath(scriptPath);
    const content = fs.readFileSync(targetPath, 'utf8');
    
    const validations = {
      hasVersionDeclaration: content.startsWith('//@version=5'),
      hasIndicatorDeclaration: content.includes('indicator('),
      noSyntaxErrors: !content.includes('ERROR') && !content.includes('SYNTAX'), 
      withinLineLimits: content.split('\n').length < 2000,
      balancedBraces: this.checkBalancedBraces(content),
      noDoubleDeclarations: this.checkForDoubleDeclarations(content)
    };

    const isValid = Object.values(validations).every(v => v);
    
    if (isValid) {
      console.log(`✅ Validation passed`);
    } else {
      console.log(`❌ Validation failed:`);
      Object.entries(validations).forEach(([check, passed]) => {
        if (!passed) {
          console.log(`   - ${check}: FAILED`);
        }
      });
    }

    return isValid;
  }

  checkBalancedBraces(content) {
    let count = 0;
    for (const char of content) {
      if (char === '(') count++;
      if (char === ')') count--;
      if (count < 0) return false;
    }
    return count === 0;
  }

  checkForDoubleDeclarations(content) {
    const lines = content.split('\n');
    const declarations = new Set();
    
    for (const line of lines) {
      const match = line.match(/^([a-zA-Z_]\w*)\s*=/);
      if (match) {
        const varName = match[1];
        if (declarations.has(varName)) {
          console.log(`⚠️  Duplicate declaration found: ${varName}`);
          return false;
        }
        declarations.add(varName);
      }
    }
    return true;
  }

  createBackup(scriptPath) {
    const targetPath = this.findScriptPath(scriptPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${path.basename(scriptPath)}.pre-merge-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupFileName);
    
    fs.copyFileSync(targetPath, backupPath);
    console.log(`💾 Backup created: ${backupFileName}`);
    return backupPath;
  }

  restoreBackup(scriptPath) {
    const targetPath = this.findScriptPath(scriptPath);
    const backupPattern = `${path.basename(scriptPath)}.pre-merge-`;
    
    const backupFiles = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith(backupPattern))
      .sort()
      .reverse();

    if (backupFiles.length > 0) {
      const latestBackup = path.join(this.backupDir, backupFiles[0]);
      fs.copyFileSync(latestBackup, targetPath);
      console.log(`🔄 Restored from backup: ${backupFiles[0]}`);
      return true;
    }
    
    console.log(`❌ No backup found for ${scriptPath}`);
    return false;
  }

  findScriptPath(scriptName) {
    const possiblePaths = [
      path.join(this.scriptsDir, scriptName),
      path.join(this.scriptsDir, 'core', scriptName),
      path.join(this.scriptsDir, 'foundation', scriptName),
      path.join(this.scriptsDir, 'dashboard', scriptName),
      path.join(this.scriptsDir, 'alerts', scriptName),
      path.join(this.scriptsDir, 'analytics', scriptName),
      path.join(this.scriptsDir, 'tools', scriptName)
    ];

    return possiblePaths.find(p => fs.existsSync(p));
  }

  // Batch merge multiple files
  batchMerge(mergeList) {
    console.log(`🔄 Starting batch merge of ${mergeList.length} items\n`);
    
    const results = [];
    
    for (const merge of mergeList) {
      const result = this.mergeIntoExistingScript(
        merge.source, 
        merge.target, 
        merge.position || 'end'
      );
      
      results.push({
        source: merge.source,
        target: merge.target,
        success: result
      });
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    console.log(`\n📊 Batch merge summary:`);
    console.log(`   Successful: ${successful}/${results.length}`);
    console.log(`   Failed: ${results.length - successful}/${results.length}\n`);

    return results;
  }
}

// Usage
if (require.main === module) {
  const merger = new BTMMSmartMerger();
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node smart-merger.js <source-file> <target-script> [position]');
    console.log('Position options: after_settings, after_calculations, after_visuals, before_data_outputs, end');
    process.exit(1);
  }
  
  const [sourceFile, targetScript, position] = args;
  const success = merger.mergeIntoExistingScript(sourceFile, targetScript, position);
  
  process.exit(success ? 0 : 1);
}

module.exports = BTMMSmartMerger; 