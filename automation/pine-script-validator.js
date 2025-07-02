// pine-script-validator.js - Comprehensive Pine Script Quality Validator
const fs = require('fs');
const path = require('path');

class PineScriptValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
    this.metrics = {
      linesOfCode: 0,
      complexity: 0,
      calculations: 0,
      builtInUsage: 0
    };
  }

  // Main validation function
  validateScript(filePath) {
    console.log(`🔍 Validating Pine Script: ${path.basename(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      this.errors.push(`File not found: ${filePath}`);
      return this.getValidationResult();
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Reset metrics
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
    this.metrics = { linesOfCode: lines.length, complexity: 0, calculations: 0, builtInUsage: 0 };

    // Run all validation checks
    this.checkSyntaxRequirements(content, lines);
    this.checkAntiRepainting(content);
    this.checkPerformanceOptimization(content);
    this.checkCodeQuality(content, lines);
    this.checkBracketMatching(content);
    this.checkLineLength(lines);
    this.checkIndentation(lines);
    this.analyzeComplexity(content);
    
    return this.getValidationResult();
  }

  // Check basic syntax requirements
  checkSyntaxRequirements(content, lines) {
    // Check version declaration
    if (!content.startsWith('//@version=5')) {
      this.errors.push('Missing //@version=5 declaration at the beginning');
    }

    // Check script type declaration
    const scriptTypes = ['indicator(', 'strategy(', 'library('];
    const hasScriptType = scriptTypes.some(type => content.includes(type));
    if (!hasScriptType) {
      this.errors.push('Missing script type declaration (indicator, strategy, or library)');
    }

    // Check for trailing whitespace
    lines.forEach((line, index) => {
      if (line.endsWith(' ') || line.endsWith('\t')) {
        this.warnings.push(`Line ${index + 1}: Trailing whitespace detected`);
      }
    });
  }

  // Check for anti-repainting and look-ahead bias
  checkAntiRepainting(content) {
    // Check for dangerous lookahead usage
    if (content.includes('lookahead=barmerge.lookahead_on')) {
      this.errors.push('Dangerous lookahead usage detected - can cause repainting');
    }

    // Check for proper historical confirmation
    const hasHistoricalCheck = content.includes('barstate.isconfirmed') || 
                              content.includes('not barstate.islast');
    if (!hasHistoricalCheck && content.includes('request.security(')) {
      this.warnings.push('Consider using barstate.isconfirmed for historical accuracy with request.security()');
    }

    // Check for proper series declarations
    const seriesDeclarations = ['var ', 'varip ', 'series '];
    let hasProperSeries = false;
    seriesDeclarations.forEach(decl => {
      if (content.includes(decl)) {
        hasProperSeries = true;
        this.metrics.builtInUsage += (content.match(new RegExp(decl, 'g')) || []).length;
      }
    });

    // Warn about potential repainting functions
    const repaintingFunctions = ['ta.valuewhen(', 'ta.barssince(', 'ta.highest(', 'ta.lowest('];
    repaintingFunctions.forEach(func => {
      if (content.includes(func)) {
        this.warnings.push(`Potential repainting function detected: ${func} - ensure proper usage`);
      }
    });
  }

  // Check performance optimization
  checkPerformanceOptimization(content) {
    // Check for built-in function usage
    const builtInFunctions = {
      'ta.sma(': 'Simple Moving Average',
      'ta.ema(': 'Exponential Moving Average',
      'ta.rsi(': 'Relative Strength Index',
      'ta.macd(': 'MACD',
      'ta.stoch(': 'Stochastic',
      'math.max(': 'Maximum function',
      'math.min(': 'Minimum function',
      'math.abs(': 'Absolute value',
      'array.': 'Array operations',
      'map.': 'Map operations'
    };

    let builtInCount = 0;
    Object.keys(builtInFunctions).forEach(func => {
      const matches = (content.match(new RegExp(func.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      builtInCount += matches;
    });
    this.metrics.builtInUsage = builtInCount;

    // Check for custom implementations that could use built-ins
    if (content.includes('for ') && content.includes('sum')) {
      this.suggestions.push('Consider using ta.sma() instead of manual sum calculation');
    }

    // Check for array usage efficiency
    const arrayOperations = (content.match(/array\./g) || []).length;
    if (arrayOperations > 10) {
      this.suggestions.push('Consider optimizing array operations for better performance');
    }

    // Count calculations per bar (rough estimate)
    const calculationPatterns = ['+', '-', '*', '/', 'math.', 'ta.'];
    let calculationCount = 0;
    calculationPatterns.forEach(pattern => {
      calculationCount += (content.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    });
    this.metrics.calculations = calculationCount;

    if (calculationCount > 500) {
      this.warnings.push(`High calculation count (${calculationCount}) may impact performance`);
    }
  }

  // Check code quality standards
  checkCodeQuality(content, lines) {
    // Check for function documentation
    const functions = content.match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*\(/gm) || [];
    const comments = content.match(/\/\/[^\n]*/g) || [];
    
    if (functions.length > comments.length / 2) {
      this.suggestions.push('Consider adding more comments to document functions and logic');
    }

    // Check variable naming
    const variables = content.match(/(?:var|varip|series)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g) || [];
    variables.forEach(variable => {
      const varName = variable.split(' ').pop();
      if (varName.length < 3) {
        this.suggestions.push(`Variable '${varName}' could have a more descriptive name`);
      }
    });

    // Check for input validation
    const inputs = (content.match(/input\./g) || []).length;
    const validations = (content.match(/if.*input/g) || []).length;
    
    if (inputs > 0 && validations === 0) {
      this.suggestions.push('Consider adding input validation for user parameters');
    }

    // Check for error handling
    const errorHandling = content.includes('na(') || content.includes('nz(') || content.includes('if na');
    if (!errorHandling) {
      this.suggestions.push('Consider adding error handling for edge cases (na values)');
    }
  }

  // Check bracket matching
  checkBracketMatching(content) {
    const brackets = {
      '(': ')',
      '[': ']',
      '{': '}'
    };

    Object.entries(brackets).forEach(([open, close]) => {
      const openCount = (content.match(new RegExp('\\' + open, 'g')) || []).length;
      const closeCount = (content.match(new RegExp('\\' + close, 'g')) || []).length;
      
      if (openCount !== closeCount) {
        this.errors.push(`Mismatched ${open}${close} brackets: ${openCount} opening, ${closeCount} closing`);
      }
    });
  }

  // Check line length
  checkLineLength(lines) {
    lines.forEach((line, index) => {
      if (line.length > 120) {
        this.warnings.push(`Line ${index + 1}: Line too long (${line.length} characters, max 120)`);
      }
    });
  }

  // Check indentation consistency
  checkIndentation(lines) {
    let expectedIndent = 0;
    lines.forEach((line, index) => {
      if (line.trim() === '') return; // Skip empty lines
      
      const spaces = line.match(/^ */)[0].length;
      const tabs = line.match(/^\t*/)[0].length;
      
      if (tabs > 0) {
        this.warnings.push(`Line ${index + 1}: Use spaces instead of tabs for indentation`);
      }
      
      if (spaces % 4 !== 0 && line.trim() !== '') {
        this.warnings.push(`Line ${index + 1}: Indentation should be multiples of 4 spaces`);
      }
    });
  }

  // Analyze code complexity
  analyzeComplexity(content) {
    // Count control structures
    const controlStructures = ['if ', 'for ', 'while ', 'switch '];
    let complexity = 1; // Base complexity
    
    controlStructures.forEach(structure => {
      complexity += (content.match(new RegExp(structure, 'g')) || []).length;
    });
    
    this.metrics.complexity = complexity;
    
    if (complexity > 20) {
      this.warnings.push(`High cyclomatic complexity (${complexity}) - consider refactoring`);
    }
  }

  // Get validation result
  getValidationResult() {
    const isValid = this.errors.length === 0;
    const score = this.calculateQualityScore();
    
    return {
      isValid: isValid,
      score: score,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions,
      metrics: this.metrics,
      summary: this.generateSummary(isValid, score)
    };
  }

  // Calculate quality score (0-100)
  calculateQualityScore() {
    let score = 100;
    
    // Deduct for errors and warnings
    score -= this.errors.length * 15;
    score -= this.warnings.length * 5;
    
    // Bonus for built-in usage
    score += Math.min(this.metrics.builtInUsage * 2, 20);
    
    // Penalty for high complexity
    if (this.metrics.complexity > 15) {
      score -= (this.metrics.complexity - 15) * 2;
    }
    
    // Penalty for too many calculations
    if (this.metrics.calculations > 300) {
      score -= Math.floor((this.metrics.calculations - 300) / 50) * 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  // Generate validation summary
  generateSummary(isValid, score) {
    let status = 'EXCELLENT';
    if (score < 90) status = 'GOOD';
    if (score < 75) status = 'FAIR';
    if (score < 60) status = 'POOR';
    if (!isValid) status = 'FAILED';
    
    return {
      status: status,
      isValid: isValid,
      score: score,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      suggestionCount: this.suggestions.length
    };
  }

  // Validate all BTMM scripts
  validateAllScripts() {
    console.log('🔍 Running comprehensive Pine Script validation...\n');
    
    const scriptsToValidate = [
      'scripts/foundation/BTMMFoundation.pine',
      'scripts/BTMM_EMA_System.pine',
      'scripts/BTMM_Asian_Range.pine',
      'scripts/BTMM_HTF_Bias.pine',
      'scripts/BTMM_Pattern_Detection.pine',
      'scripts/BTMM_Entry_System.pine',
      'scripts/BTMM_Risk_Management.pine',
      'scripts/BTMM_Stop_Hunt_Detection.pine',
      'scripts/dashboard/BTMM_Master_Dashboard.pine',
      'scripts/alerts/BTMM_Alert_System.pine'
    ];

    const results = {};
    let totalScore = 0;
    let validCount = 0;

    scriptsToValidate.forEach(scriptPath => {
      if (fs.existsSync(scriptPath)) {
        const result = this.validateScript(scriptPath);
        results[path.basename(scriptPath)] = result;
        totalScore += result.score;
        if (result.isValid) validCount++;
        
        console.log(`📄 ${path.basename(scriptPath)}: ${result.summary.status} (${result.score}/100)`);
        
        if (result.errors.length > 0) {
          console.log(`   ❌ Errors: ${result.errors.length}`);
          result.errors.forEach(error => console.log(`      - ${error}`));
        }
        
        if (result.warnings.length > 0) {
          console.log(`   ⚠️  Warnings: ${result.warnings.length}`);
        }
        
        console.log('');
      }
    });

    const overallScore = Math.round(totalScore / scriptsToValidate.length);
    
    console.log('📊 Validation Summary:');
    console.log(`   Overall Score: ${overallScore}/100`);
    console.log(`   Valid Scripts: ${validCount}/${scriptsToValidate.length}`);
    console.log(`   Status: ${overallScore >= 90 ? '💚 EXCELLENT' : overallScore >= 75 ? '🟡 GOOD' : '🔴 NEEDS IMPROVEMENT'}`);
    
    return {
      overallScore: overallScore,
      validCount: validCount,
      totalCount: scriptsToValidate.length,
      results: results,
      allValid: validCount === scriptsToValidate.length
    };
  }
}

// CLI Usage
if (require.main === module) {
  const validator = new PineScriptValidator();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Validate all scripts
    const results = validator.validateAllScripts();
    process.exit(results.allValid ? 0 : 1);
  } else {
    // Validate specific script
    const result = validator.validateScript(args[0]);
    console.log(`\n📊 Validation Result: ${result.summary.status} (${result.score}/100)`);
    process.exit(result.isValid ? 0 : 1);
  }
}

module.exports = PineScriptValidator; 