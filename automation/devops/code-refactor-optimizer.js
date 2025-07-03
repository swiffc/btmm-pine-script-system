// code-refactor-optimizer.js - BTMM Code Refactoring Optimization Tool
const fs = require('fs');
const path = require('path');

class CodeRefactorOptimizer {
  constructor() {
    this.rootDir = process.cwd();
    this.scriptsDir = path.join(this.rootDir, 'scripts');
    this.optimizations = [];
  }

  // Main optimization function
  async optimizeCodebase() {
    console.log('🔧 BTMM Code Refactor Optimizer');
    console.log('================================');
    
    try {
      await this.scanForOptimizations();
      this.generateOptimizationReport();
      return true;
    } catch (error) {
      console.error('❌ Optimization failed:', error.message);
      return false;
    }
  }

  // Scan for potential optimizations
  async scanForOptimizations() {
    const scriptFiles = this.getAllPineScripts();
    
    for (const filePath of scriptFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      await this.analyzeScript(filePath, content);
    }
  }

  // Get all Pine Script files
  getAllPineScripts() {
    const scripts = [];
    
    function walkDir(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith('.pine')) {
          scripts.push(fullPath);
        }
      }
    }
    
    if (fs.existsSync(this.scriptsDir)) {
      walkDir(this.scriptsDir);
    }
    
    return scripts;
  }

  // Analyze individual script for optimizations
  async analyzeScript(filePath, content) {
    const scriptName = path.basename(filePath);
    const lines = content.split('\n');
    
    // Check for duplicate calculations
    this.checkDuplicateCalculations(scriptName, content);
    
    // Check for unused variables
    this.checkUnusedVariables(scriptName, content);
    
    // Check for performance issues
    this.checkPerformanceIssues(scriptName, content);
    
    // Check for code style improvements
    this.checkCodeStyle(scriptName, lines);
  }

  // Check for duplicate calculations
  checkDuplicateCalculations(scriptName, content) {
    const calculations = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.includes('ta.') && trimmed.includes('=')) {
        const calculation = trimmed.split('=')[1]?.trim();
        if (calculation && calculations.includes(calculation)) {
          this.optimizations.push({
            type: 'DUPLICATE_CALCULATION',
            file: scriptName,
            line: index + 1,
            description: `Duplicate calculation: ${calculation}`,
            suggestion: 'Consider extracting to a variable'
          });
        } else if (calculation) {
          calculations.push(calculation);
        }
      }
    });
  }

  // Check for unused variables
  checkUnusedVariables(scriptName, content) {
    const lines = content.split('\n');
    const variables = new Set();
    const usedVariables = new Set();
    
    // First pass: collect variable declarations
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('=') && !trimmed.startsWith('//')) {
        const varName = trimmed.split('=')[0]?.trim();
        if (varName && !varName.includes('(')) {
          variables.add(varName);
        }
      }
    });
    
    // Second pass: check usage
    lines.forEach(line => {
      variables.forEach(varName => {
        if (line.includes(varName) && !line.trim().startsWith(varName + ' =')) {
          usedVariables.add(varName);
        }
      });
    });
    
    // Report unused variables
    variables.forEach(varName => {
      if (!usedVariables.has(varName)) {
        this.optimizations.push({
          type: 'UNUSED_VARIABLE',
          file: scriptName,
          description: `Potentially unused variable: ${varName}`,
          suggestion: 'Consider removing if not needed'
        });
      }
    });
  }

  // Check for performance issues
  checkPerformanceIssues(scriptName, content) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for nested security calls
      if (trimmed.includes('request.security') && trimmed.includes('request.security')) {
        this.optimizations.push({
          type: 'PERFORMANCE_ISSUE',
          file: scriptName,
          line: index + 1,
          description: 'Nested security calls detected',
          suggestion: 'Cache security data in variables'
        });
      }
      
      // Check for expensive operations in loops
      if (trimmed.includes('for ') && trimmed.includes('ta.')) {
        this.optimizations.push({
          type: 'PERFORMANCE_ISSUE',
          file: scriptName,
          line: index + 1,
          description: 'Technical analysis function inside loop',
          suggestion: 'Move calculations outside loop if possible'
        });
      }
    });
  }

  // Check code style improvements
  checkCodeStyle(scriptName, lines) {
    lines.forEach((line, index) => {
      // Check line length
      if (line.length > 120) {
        this.optimizations.push({
          type: 'STYLE_IMPROVEMENT',
          file: scriptName,
          line: index + 1,
          description: 'Line too long (>120 characters)',
          suggestion: 'Break into multiple lines'
        });
      }
      
      // Check for missing comments on complex logic
      if (line.trim().includes('?') && line.trim().includes(':') && 
          !lines[index - 1]?.trim().startsWith('//')) {
        this.optimizations.push({
          type: 'STYLE_IMPROVEMENT',
          file: scriptName,
          line: index + 1,
          description: 'Complex ternary operator without comment',
          suggestion: 'Add explanatory comment'
        });
      }
    });
  }

  // Generate optimization report
  generateOptimizationReport() {
    console.log('\n📊 OPTIMIZATION ANALYSIS RESULTS');
    console.log('================================');
    
    if (this.optimizations.length === 0) {
      console.log('✅ No optimizations needed - code is well optimized!');
      return;
    }
    
    const typeGroups = {};
    this.optimizations.forEach(opt => {
      if (!typeGroups[opt.type]) {
        typeGroups[opt.type] = [];
      }
      typeGroups[opt.type].push(opt);
    });
    
    Object.keys(typeGroups).forEach(type => {
      console.log(`\n🔍 ${type} (${typeGroups[type].length} issues)`);
      typeGroups[type].forEach(opt => {
        console.log(`   📄 ${opt.file}${opt.line ? `:${opt.line}` : ''}`);
        console.log(`   💡 ${opt.description}`);
        console.log(`   🎯 ${opt.suggestion}`);
        console.log('');
      });
    });
    
    console.log(`\n📈 SUMMARY: ${this.optimizations.length} optimization opportunities found`);
  }
}

// CLI Interface
if (require.main === module) {
  const optimizer = new CodeRefactorOptimizer();
  optimizer.optimizeCodebase()
    .then(() => {
      console.log('\n✅ Code refactor optimization completed!');
    })
    .catch((error) => {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    });
}

module.exports = CodeRefactorOptimizer;
