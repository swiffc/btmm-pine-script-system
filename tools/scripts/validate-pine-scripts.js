#!/usr/bin/env node

/**
 * Pine Script Template Validation Script
 * Validates Pine Script v5 templates for BTMM methodology compliance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Validation results
let totalFiles = 0;
let validFiles = 0;
let errors = [];
let warnings = [];

/**
 * Print colored console output
 */
function colorLog(message, color = 'white') {
  console.log(colors[color] + message + colors.reset);
}

/**
 * Validate Pine Script v5 syntax and structure
 */
function validatePineScriptSyntax(content, filename) {
  const issues = [];
  
  // Check for version 5 header
  if (!content.startsWith('//@version=5')) {
    issues.push({
      type: 'error',
      message: 'Missing or incorrect @version=5 header'
    });
  }
  
  // Check for indicator declaration
  if (!content.includes('indicator(')) {
    issues.push({
      type: 'error',
      message: 'Missing indicator() declaration'
    });
  }
  
  // Check for basic structure issues
  const lines = content.split('\n');
  let hasInputs = false;
  let hasCalculations = false;
  let hasVisuals = false;
  let hasAlerts = false;
  
  for (const line of lines) {
    if (line.includes('input.')) hasInputs = true;
    if (line.includes('ta.') || line.includes('math.')) hasCalculations = true;
    if (line.includes('plot(') || line.includes('plotshape(')) hasVisuals = true;
    if (line.includes('alertcondition(')) hasAlerts = true;
  }
  
  if (!hasInputs) {
    issues.push({
      type: 'warning',
      message: 'No input parameters found - consider adding user controls'
    });
  }
  
  if (!hasVisuals) {
    issues.push({
      type: 'warning',
      message: 'No visual elements found - indicator may not display anything'
    });
  }
  
  if (!hasAlerts) {
    issues.push({
      type: 'warning',
      message: 'No alert conditions found - users cannot set alerts'
    });
  }
  
  return issues;
}

/**
 * Validate BTMM methodology compliance
 */
function validateBTMMCompliance(content, filename) {
  const issues = [];
  
  // Check for EMA system (food names)
  const emaTerms = ['mustard', 'ketchup', 'water', 'mayo', 'blueberry'];
  const hasEmaTerms = emaTerms.some(term => 
    content.toLowerCase().includes(term)
  );
  
  if (!hasEmaTerms) {
    issues.push({
      type: 'warning',
      message: 'No EMA food name references found (Mustard, Ketchup, Water, Mayo, Blueberry)'
    });
  }
  
  // Check for critical EMA 13 (Ketchup)
  if (!content.includes('13') || !content.toLowerCase().includes('ketchup')) {
    issues.push({
      type: 'warning',
      message: 'Missing EMA 13 (Ketchup line) - critical for BTMM methodology'
    });
  }
  
  // Check for second leg pattern focus
  const secondLegTerms = ['second_leg', 'second leg', 'leg.*2', '2.*leg'];
  const hasSecondLeg = secondLegTerms.some(term => {
    const regex = new RegExp(term, 'i');
    return regex.test(content);
  });
  
  if (!hasSecondLeg) {
    issues.push({
      type: 'warning',
      message: 'No second leg pattern references found - BTMM focuses on second leg completion'
    });
  }
  
  // Check for M&W patterns
  const patternTerms = ['m_pattern', 'w_pattern', 'm.*pattern', 'w.*pattern'];
  const hasPatterns = patternTerms.some(term => {
    const regex = new RegExp(term, 'i');
    return regex.test(content);
  });
  
  if (!hasPatterns) {
    issues.push({
      type: 'info',
      message: 'No M&W pattern detection found - consider adding if relevant'
    });
  }
  
  // Check for session analysis
  const sessionTerms = ['london', 'ny', 'session', 'asian'];
  const hasSessions = sessionTerms.some(term => 
    content.toLowerCase().includes(term)
  );
  
  if (!hasSessions) {
    issues.push({
      type: 'info',
      message: 'No session analysis found - BTMM methodology emphasizes session timing'
    });
  }
  
  // Check for TDI integration
  if (content.toLowerCase().includes('tdi') || content.includes('rsi')) {
    // Good - has TDI or RSI which is part of TDI
  } else {
    issues.push({
      type: 'info',
      message: 'No TDI (Traders Dynamic Index) integration found - consider adding for confluence'
    });
  }
  
  return issues;
}

/**
 * Find all Pine Script files
 */
function findPineScriptFiles(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        files.push(...findPineScriptFiles(fullPath));
      } else if (stat.isFile() && item.endsWith('.pine')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    colorLog(`Warning: Could not read directory ${dir}: ${error.message}`, 'yellow');
  }
  
  return files;
}

/**
 * Validate a single Pine Script file
 */
function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    colorLog(`\nValidating: ${filename}`, 'cyan');
    
    // Run all validation checks
    const syntaxIssues = validatePineScriptSyntax(content, filename);
    const btmmIssues = validateBTMMCompliance(content, filename);
    
    const allIssues = [...syntaxIssues, ...btmmIssues];
    
    // Categorize issues
    const fileErrors = allIssues.filter(issue => issue.type === 'error');
    const fileWarnings = allIssues.filter(issue => issue.type === 'warning');
    
    // Display results
    if (fileErrors.length === 0) {
      colorLog(`   ✅ Syntax validation passed`, 'green');
      validFiles++;
    } else {
      colorLog(`   ❌ Syntax validation failed`, 'red');
      fileErrors.forEach(error => {
        colorLog(`      • ${error.message}`, 'red');
        errors.push(`${filename}: ${error.message}`);
      });
    }
    
    if (fileWarnings.length > 0) {
      colorLog(`   ⚠️  Warnings (${fileWarnings.length}):`, 'yellow');
      fileWarnings.forEach(warning => {
        colorLog(`      • ${warning.message}`, 'yellow');
        warnings.push(`${filename}: ${warning.message}`);
      });
    }
    
    if (allIssues.length === 0) {
      colorLog(`   🎉 Perfect! No issues found`, 'green');
    }
    
  } catch (error) {
    colorLog(`   ❌ Error reading file: ${error.message}`, 'red');
    errors.push(`${path.basename(filePath)}: File read error - ${error.message}`);
  }
}

/**
 * Main validation function
 */
function main() {
  colorLog('\nBTMM Pine Script Template Validator', 'bold');
  colorLog('===================================\n', 'cyan');
  
  // Find all Pine Script files
  const searchDirs = ['indicators', 'templates', 'examples'].map(dir => 
    path.join(projectRoot, dir)
  ).filter(dir => fs.existsSync(dir));
  
  if (searchDirs.length === 0) {
    colorLog('❌ No Pine Script directories found (indicators/, templates/, examples/)', 'red');
    process.exit(1);
  }
  
  let allFiles = [];
  for (const dir of searchDirs) {
    const files = findPineScriptFiles(dir);
    allFiles.push(...files);
    colorLog(`Found ${files.length} files in ${path.relative(projectRoot, dir)}/`, 'blue');
  }
  
  totalFiles = allFiles.length;
  
  if (totalFiles === 0) {
    colorLog('❌ No Pine Script files (.pine) found to validate', 'red');
    process.exit(1);
  }
  
  colorLog(`\nValidating ${totalFiles} Pine Script files...\n`, 'white');
  
  // Validate each file
  for (const file of allFiles) {
    validateFile(file);
  }
  
  // Display summary
  colorLog('\nValidation Summary', 'bold');
  colorLog('=================', 'cyan');
  
  colorLog(`Total files: ${totalFiles}`, 'white');
  colorLog(`Valid files: ${validFiles}`, 'green');
  colorLog(`Files with errors: ${totalFiles - validFiles}`, validFiles === totalFiles ? 'green' : 'red');
  colorLog(`Total warnings: ${warnings.length}`, warnings.length === 0 ? 'green' : 'yellow');
  
  if (errors.length > 0) {
    colorLog('\nCritical Errors:', 'red');
    errors.forEach(error => colorLog(`   • ${error}`, 'red'));
  }
  
  // Exit with appropriate code
  if (errors.length > 0) {
    colorLog('\nValidation failed due to critical errors', 'red');
    process.exit(1);
  } else if (validFiles === totalFiles) {
    colorLog('\nAll Pine Script templates validated successfully!', 'green');
    process.exit(0);
  } else {
    colorLog('\nValidation completed with warnings', 'yellow');
    process.exit(0);
  }
}

// Run the validator
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}