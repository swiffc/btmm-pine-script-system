// pre-save-validation.js - BTMM Pre-Save Validation System
const fs = require('fs');
const path = require('path');

class PreSaveValidator {
  constructor() {
    this.protectedFunctions = [
      'session_and_cycle',
      'timeframe_classification', 
      'ema_stack_analysis',
      'volume_analysis'
    ];
    
    this.criticalOutputs = [
      'Bull_Stack', 'Bear_Stack', 'HTF_Bias', 'Bullish_Setup', 'Bearish_Setup',
      'Stack_Strength', 'Integration_Errors', 'Asian_Range', 'Session_Active'
    ];
  }

  // Main validation function
  validateBeforeSave(filePath) {
    console.log(`🔍 Pre-save validation for: ${path.basename(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found');
      return false;
    }

    if (!filePath.endsWith('.pine')) {
      console.log('✅ Non-Pine file, skipping validation');
      return true;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // 1. Check if protected functions were modified
    const functionIssues = this.checkProtectedFunctions(content, path.basename(filePath));
    issues.push(...functionIssues);

    // 2. Check if data window outputs were removed
    const outputIssues = this.checkDataWindowOutputs(content, path.basename(filePath));
    issues.push(...outputIssues);

    // 3. Check overlay settings for price-based indicators
    const overlayIssues = this.checkOverlaySettings(content, path.basename(filePath));
    issues.push(...overlayIssues);

    // 4. Check Pine Script syntax basics
    const syntaxIssues = this.checkBasicSyntax(content);
    issues.push(...syntaxIssues);

    // 5. Check for integration health
    const integrationIssues = this.checkIntegrationHealth(content);
    issues.push(...integrationIssues);

    // Report results
    if (issues.length === 0) {
      console.log(`✅ ${path.basename(filePath)} validation passed\n`);
      return true;
    } else {
      console.log(`\n🚨 VALIDATION ISSUES in ${path.basename(filePath)}:`);
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log('\n❌ Please resolve issues before saving\n');
      return false;
    }
  }

  checkProtectedFunctions(content, filename) {
    const issues = [];
    
    this.protectedFunctions.forEach(func => {
      if (content.includes(`export ${func}`) || content.includes(`${func}(`)) {
        // Verify signature hasn't changed
        if (!this.validateFunctionSignature(content, func)) {
          issues.push(`⚠️  BREAKING CHANGE: ${func} signature modified`);
        }
      }
    });

    return issues;
  }

  validateFunctionSignature(content, functionName) {
    // Basic signature validation - check for expected parameters
    const signatures = {
      'session_and_cycle': ['no parameters'],
      'timeframe_classification': ['no parameters'],
      'ema_stack_analysis': ['ema5', 'ema13', 'ema50', 'ema200', 'ema800'],
      'volume_analysis': ['volume', 'lookback']
    };

    const expectedSig = signatures[functionName];
    if (!expectedSig) return true;

    // Extract function definition
    const funcRegex = new RegExp(`${functionName}\\s*\\([^)]*\\)`, 'g');
    const matches = content.match(funcRegex);
    
    if (!matches) return true; // Function not found, might be okay

    // Basic parameter count check
    const match = matches[0];
    const paramCount = (match.match(/,/g) || []).length + (match.includes('(') ? 1 : 0);
    
    if (expectedSig[0] === 'no parameters') {
      return !match.includes(',') && match.includes('()');
    }
    
    return paramCount >= expectedSig.length;
  }

  checkDataWindowOutputs(content, filename) {
    const issues = [];
    
    // Check file-specific critical outputs
    const fileOutputs = {
      'BTMM_EMA_System.pine': ['Bull_Stack', 'Bear_Stack', 'Stack_Strength'],
      'BTMM_HTF_Bias.pine': ['HTF_Bias', 'Bullish_Setup', 'Bearish_Setup'],
      'BTMM_Asian_Range.pine': ['Asian_Range', 'Session_Active'],
      'BTMM_Pattern_Detection.pine': ['Pattern_Detected', 'Pattern_Type'],
      'BTMM_Entry_System.pine': ['Entry_Signal', 'Signal_Strength']
    };

    const requiredOutputs = fileOutputs[filename] || [];
    
    requiredOutputs.forEach(output => {
      if (!content.includes(`"${output}", display=display.data_window`)) {
        issues.push(`🚨 CRITICAL: ${output} data window output missing`);
      }
    });

    return issues;
  }

  checkOverlaySettings(content, filename) {
    const issues = [];
    
    // Price-based indicators should have overlay=true
    const priceBasedFiles = [
      'BTMM_EMA_System.pine',
      'BTMM_Pattern_Detection.pine',
      'BTMM_Entry_System.pine',
      'BTMM_Risk_Management.pine',
      'BTMM_Asian_Range.pine'
    ];

    if (priceBasedFiles.includes(filename)) {
      if (content.includes('indicator(') && !content.includes('overlay=true')) {
        issues.push('🎯 OVERLAY: Missing overlay=true for price-based indicator');
      }
    }

    return issues;
  }

  checkBasicSyntax(content) {
    const issues = [];

    // Check version declaration
    if (!content.includes('//@version=5')) {
      issues.push('📝 SYNTAX: Missing //@version=5 declaration');
    }

    // Check indicator declaration
    if (!content.includes('indicator(')) {
      issues.push('📝 SYNTAX: Missing indicator() declaration');
    }

    // Check balanced parentheses
    if (!this.checkBalancedParentheses(content)) {
      issues.push('🔧 SYNTAX: Unbalanced parentheses detected');
    }

    // Check for common syntax errors
    if (content.includes('ERROR') || content.includes('SYNTAX ERROR')) {
      issues.push('🚨 SYNTAX: Syntax error markers found in code');
    }

    // Check line length (Pine Script recommendation)
    const lines = content.split('\n');
    const longLines = lines.filter((line, index) => {
      if (line.length > 120) {
        issues.push(`📏 LINE LENGTH: Line ${index + 1} exceeds 120 characters`);
        return true;
      }
      return false;
    });

    return issues;
  }

  checkBalancedParentheses(content) {
    let count = 0;
    for (const char of content) {
      if (char === '(') count++;
      if (char === ')') count--;
      if (count < 0) return false;
    }
    return count === 0;
  }

  checkIntegrationHealth(content) {
    const issues = [];

    // Check for input.source() without corresponding plots
    const inputSources = this.extractInputSources(content);
    if (inputSources.length > 0) {
      inputSources.forEach(source => {
        if (!this.hasCorrespondingOutput(source.description)) {
          issues.push(`🔗 INTEGRATION: Input source "${source.description}" may lack corresponding output`);
        }
      });
    }

    // Check for orphaned variables
    const variables = this.extractVariableDeclarations(content);
    const usedVariables = this.extractVariableUsages(content);
    
    variables.forEach(variable => {
      if (!usedVariables.includes(variable) && !variable.startsWith('g_')) {
        issues.push(`🧹 CLEANUP: Unused variable detected: ${variable}`);
      }
    });

    return issues;
  }

  extractInputSources(content) {
    const sources = [];
    const sourceRegex = /(\w+)\s*=\s*input\.source\([^,]+,\s*"([^"]+)"/g;
    let match;
    
    while ((match = sourceRegex.exec(content)) !== null) {
      sources.push({
        variable: match[1],
        description: match[2]
      });
    }
    
    return sources;
  }

  hasCorrespondingOutput(description) {
    // This is a simplified check - in a full implementation,
    // you'd check across all BTMM files
    const commonOutputs = [
      'Bull_Stack', 'Bear_Stack', 'HTF_Bias', 'Bullish_Setup', 
      'Bearish_Setup', 'Stack_Strength', 'Asian_Range'
    ];
    
    return commonOutputs.some(output => 
      description.includes(output.replace('_', ' ')) ||
      output.includes(description.replace(' ', '_'))
    );
  }

  extractVariableDeclarations(content) {
    const variables = [];
    const varRegex = /^([a-zA-Z_]\w*)\s*=/gm;
    let match;
    
    while ((match = varRegex.exec(content)) !== null) {
      variables.push(match[1]);
    }
    
    return variables;
  }

  extractVariableUsages(content) {
    const usages = [];
    // Simple word boundary matching for variable usage
    const words = content.match(/\b[a-zA-Z_]\w*\b/g) || [];
    return [...new Set(words)]; // Remove duplicates
  }

  // Generate validation report
  generateValidationReport(filePath) {
    console.log('📋 BTMM Pre-Save Validation Report');
    console.log('='.repeat(45));
    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    const isValid = this.validateBeforeSave(filePath);
    
    console.log(`🎯 Overall Status: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (!isValid) {
      console.log('\n💡 Suggestions:');
      console.log('   1. Fix syntax errors first');
      console.log('   2. Restore missing data window outputs');
      console.log('   3. Check function signatures for breaking changes');
      console.log('   4. Verify overlay settings for price-based indicators');
      console.log('   5. Run integration health check after fixes\n');
    }

    return isValid;
  }

  // Batch validate multiple files
  batchValidate(filePaths) {
    console.log(`🔍 Batch validation of ${filePaths.length} files\n`);
    
    const results = filePaths.map(filePath => ({
      file: path.basename(filePath),
      valid: this.validateBeforeSave(filePath)
    }));

    const passed = results.filter(r => r.valid).length;
    const failed = results.length - passed;

    console.log(`📊 Batch validation summary:`);
    console.log(`   Total files: ${results.length}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}\n`);

    if (failed > 0) {
      console.log('❌ Failed files:');
      results.filter(r => !r.valid).forEach(result => {
        console.log(`   - ${result.file}`);
      });
      console.log('');
    }

    return results;
  }
}

// Usage
if (require.main === module) {
  const validator = new PreSaveValidator();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node pre-save-validation.js <file-path>');
    process.exit(1);
  }
  
  const filePath = args[0];
  const isValid = validator.generateValidationReport(filePath);
  
  process.exit(isValid ? 0 : 1);
}

module.exports = PreSaveValidator; 