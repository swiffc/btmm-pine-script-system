// auto-commit-system.js - Automated Quality Validation & GitHub Integration
const fs = require('fs');
const { execSync, exec } = require('child_process');
const path = require('path');
const PineScriptValidator = require('./pine-script-validator');
const GitManager = require('./git-manager');
const BackupSystem = require('./backup-system');

class AutoCommitSystem {
  constructor() {
    this.validator = new PineScriptValidator();
    this.gitManager = new GitManager();
    this.backupSystem = new BackupSystem();
    this.validationResults = {};
  }

  // Main auto-commit workflow
  async autoCommitWithValidation(commitMessage = null, skipValidation = false) {
    console.log('🤖 Starting automated commit workflow with quality validation...\n');

    try {
      // Step 1: Create backup before validation
      console.log('💾 Step 1: Creating backup...');
      this.backupSystem.backupAllScripts('pre-commit');

      // Step 2: Run comprehensive validation (unless skipped)
      if (!skipValidation) {
        console.log('🔍 Step 2: Running Pine Script validation...');
        const validationResult = this.validator.validateAllScripts();
        this.validationResults = validationResult;

        if (!validationResult.allValid) {
          console.log('\n❌ Validation failed! Cannot commit with errors.');
          console.log('💡 Fix validation errors and try again, or use --skip-validation flag.');
          return false;
        }

        console.log('✅ All scripts passed validation!\n');
      } else {
        console.log('⚠️  Step 2: Validation skipped (--skip-validation flag)\n');
      }

      // Step 3: Check Git status
      console.log('📊 Step 3: Checking Git status...');
      const gitStatus = this.gitManager.getStatus();
      
      if (!gitStatus || !gitStatus.hasChanges) {
        console.log('💡 No changes to commit.');
        return true;
      }

      console.log(`   Branch: ${gitStatus.branch}`);
      console.log(`   Changes: ${gitStatus.changes.length} files`);

      // Step 4: Generate commit message
      const autoCommitMessage = commitMessage || this.generateCommitMessage(gitStatus.changes);
      console.log(`📝 Step 4: Commit message: "${autoCommitMessage}"`);

      // Step 5: Commit changes
      console.log('💾 Step 5: Committing changes...');
      const commitSuccess = this.gitManager.commitChanges(autoCommitMessage);
      
      if (!commitSuccess) {
        console.log('❌ Commit failed!');
        return false;
      }

      // Step 6: Push to GitHub
      console.log('🌐 Step 6: Pushing to GitHub...');
      const pushSuccess = this.gitManager.pushToGitHub();
      
      if (!pushSuccess) {
        console.log('⚠️  Push to GitHub failed, but local commit succeeded.');
        console.log('💡 You may need to push manually later.');
      }

      // Step 7: Create deployment tag if needed
      if (this.shouldCreateDeploymentTag(gitStatus.changes)) {
        console.log('🏷️  Step 7: Creating deployment tag...');
        const tagName = `auto-deploy-${Date.now()}`;
        this.createDeploymentTag(tagName, autoCommitMessage);
      }

      console.log('\n✅ Automated commit workflow completed successfully!');
      this.printSummary(autoCommitMessage, gitStatus.changes.length);
      
      return true;

    } catch (error) {
      console.log(`❌ Auto-commit workflow failed: ${error.message}`);
      return false;
    }
  }

  // Generate intelligent commit message based on changes
  generateCommitMessage(changes) {
    const changeTypes = this.analyzeChanges(changes);
    
    // Determine primary change type
    if (changeTypes.fixes > 0) {
      return `Fix: Resolve ${changeTypes.fixes} syntax/quality issues`;
    }
    
    if (changeTypes.optimizations > 0) {
      return `Optimize: Performance improvements across ${changeTypes.optimizations} scripts`;
    }
    
    if (changeTypes.features > 0) {
      return `Add: New functionality in ${changeTypes.features} scripts`;
    }
    
    if (changeTypes.merges > 0) {
      return `Merge: Consolidate functionality (${changeTypes.merges} merges)`;
    }
    
    if (changeTypes.config > 0) {
      return `Config: Update automation and configuration files`;
    }
    
    // Default commit message
    return `Update: Automated commit with quality validation - ${new Date().toISOString()}`;
  }

  // Analyze types of changes
  analyzeChanges(changes) {
    const types = {
      fixes: 0,
      optimizations: 0,
      features: 0,
      merges: 0,
      config: 0
    };

    changes.forEach(change => {
      const filename = change.replace(/^[M\s]+/, '');
      
      if (filename.endsWith('.pine')) {
        // Check if likely to be a fix (based on validation results)
        if (this.validationResults && this.validationResults.results) {
          const scriptName = path.basename(filename);
          const result = this.validationResults.results[scriptName];
          
          if (result && (result.errors.length > 0 || result.warnings.length > 5)) {
            types.fixes++;
          } else if (result && result.score >= 90) {
            types.optimizations++;
          } else {
            types.features++;
          }
        } else {
          types.features++;
        }
      } else if (filename.includes('automation/') || filename.includes('.vscode/')) {
        types.config++;
      } else {
        types.features++;
      }
    });

    return types;
  }

  // Check if deployment tag should be created
  shouldCreateDeploymentTag(changes) {
    // Create tag if Pine Script files were modified
    return changes.some(change => 
      change.includes('.pine') && 
      !change.includes('backup') && 
      !change.includes('.tmp')
    );
  }

  // Create deployment tag
  createDeploymentTag(tagName, message) {
    try {
      execSync(`git tag -a "${tagName}" -m "Auto-deployment: ${message}"`);
      
      if (this.gitManager.remoteConfigured) {
        execSync(`git push origin ${tagName}`);
        console.log(`✅ Deployment tag created: ${tagName}`);
      } else {
        console.log(`✅ Local deployment tag created: ${tagName}`);
      }
    } catch (error) {
      console.log(`⚠️  Failed to create deployment tag: ${error.message}`);
    }
  }

  // Print workflow summary
  printSummary(commitMessage, changeCount) {
    console.log('\n📊 Auto-Commit Summary:');
    console.log('='.repeat(50));
    console.log(`📝 Commit: "${commitMessage}"`);
    console.log(`📁 Files: ${changeCount} changed`);
    
    if (this.validationResults && this.validationResults.overallScore) {
      console.log(`🔍 Quality: ${this.validationResults.overallScore}/100 score`);
      console.log(`✅ Valid: ${this.validationResults.validCount}/${this.validationResults.totalCount} scripts`);
    }
    
    console.log(`🌐 GitHub: ${this.gitManager.remoteConfigured ? 'Synced' : 'Local only'}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  }

  // Watch for file changes and auto-commit
  watchForChanges(interval = 30000) { // 30 seconds default
    console.log(`👀 Starting file system watcher (interval: ${interval/1000}s)...`);
    
    setInterval(async () => {
      const gitStatus = this.gitManager.getStatus();
      
      if (gitStatus && gitStatus.hasChanges) {
        console.log('\n🔄 Changes detected, starting auto-commit...');
        await this.autoCommitWithValidation();
      }
    }, interval);
  }

  // Validate and fix common Pine Script issues automatically
  async autoFixScript(scriptPath) {
    console.log(`🔧 Auto-fixing common issues in ${path.basename(scriptPath)}...`);
    
    if (!fs.existsSync(scriptPath)) {
      console.log('❌ Script file not found');
      return false;
    }

    let content = fs.readFileSync(scriptPath, 'utf8');
    let modified = false;

    // Fix 1: Ensure version declaration
    if (!content.startsWith('//@version=5')) {
      content = '//@version=5\n' + content;
      modified = true;
      console.log('✅ Added //@version=5 declaration');
    }

    // Fix 2: Remove trailing whitespace
    const lines = content.split('\n');
    const cleanedLines = lines.map(line => line.trimEnd());
    
    if (cleanedLines.some((line, i) => line !== lines[i])) {
      content = cleanedLines.join('\n');
      modified = true;
      console.log('✅ Removed trailing whitespace');
    }

    // Fix 3: Add shorttitle if missing and indicator exists
    const indicatorMatch = content.match(/indicator\s*\(\s*["']([^"']+)["'][^)]*\)/);
    if (indicatorMatch && !content.includes('shorttitle=')) {
      const title = indicatorMatch[1];
      const shortTitle = title.length > 15 ? title.substring(0, 12) + '...' : title;
      const newDeclaration = indicatorMatch[0].replace(')', `, shorttitle="${shortTitle}")`);
      content = content.replace(indicatorMatch[0], newDeclaration);
      modified = true;
      console.log('✅ Added shorttitle parameter');
    }

    // Fix 4: Add overlay parameter if missing
    const scriptDeclarationMatch = content.match(/(indicator|strategy|library)\s*\([^)]*\)/);
    if (scriptDeclarationMatch && !content.includes('overlay=')) {
      // Default to overlay=false for most indicators unless it's clearly a price overlay
      const isOverlay = content.includes('plot(close') || content.includes('plot(high') || 
                       content.includes('plot(low') || content.includes('plot(open');
      const overlayValue = isOverlay ? 'true' : 'false';
      const newDeclaration = scriptDeclarationMatch[0].replace(')', `, overlay=${overlayValue})`);
      content = content.replace(scriptDeclarationMatch[0], newDeclaration);
      modified = true;
      console.log(`✅ Added overlay=${overlayValue} parameter`);
    }

    // Fix 5: Improve color consistency
    const colorReplacements = [
      { pattern: /color\.red/g, replacement: 'color.new(color.red, 0)', description: 'Standardized red color' },
      { pattern: /color\.green/g, replacement: 'color.new(color.green, 0)', description: 'Standardized green color' },
      { pattern: /color\.blue/g, replacement: 'color.new(color.blue, 0)', description: 'Standardized blue color' }
    ];

    colorReplacements.forEach(fix => {
      if (fix.pattern.test(content) && !content.includes('color.new(')) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
        console.log(`✅ ${fix.description}`);
      }
    });

    // Fix 6: Add input validation patterns
    const inputMatches = content.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*input\.[a-zA-Z]+\([^)]*\)/g) || [];
    inputMatches.forEach(inputMatch => {
      const varName = inputMatch.split('=')[0].trim();
      const hasValidation = content.includes(`if ${varName}`) || 
                           content.includes(`${varName} <`) ||
                           content.includes(`${varName} >`);
      
      if (!hasValidation && !content.includes('runtime.error')) {
        // Add basic validation template as comment
        const validationComment = `\n// TODO: Add input validation for ${varName} (e.g., if ${varName} < 1 runtime.error("${varName} must be positive"))`;
        content = content.replace(inputMatch, inputMatch + validationComment);
        modified = true;
        console.log(`✅ Added validation TODO for ${varName}`);
      }
    });

    // Fix 7: Optimize array loop patterns
    const arrayLoopOptimizations = [
      {
        pattern: /for\s+i\s*=\s*0\s+to\s+array\.size\([^)]+\)\s*-\s*1/g,
        replacement: 'for i = 0 to array.size(data) - 1  // Optimized array iteration',
        description: 'Optimized array loop pattern'
      }
    ];

    arrayLoopOptimizations.forEach(opt => {
      if (opt.pattern.test(content)) {
        content = content.replace(opt.pattern, opt.replacement);
        modified = true;
        console.log(`✅ ${opt.description}`);
      }
    });

    // Fix 8: Add documentation header if missing
    if (!content.includes('=============================================================================') && 
        !content.includes('Purpose:')) {
      const scriptName = path.basename(scriptPath, '.pine');
      const headerTemplate = `\n// =============================================================================\n// ${scriptName.toUpperCase().replace(/_/g, ' ')}\n// =============================================================================\n// Purpose: [DESCRIBE THE PURPOSE OF THIS INDICATOR/STRATEGY]\n// Method: [DESCRIBE THE TECHNICAL ANALYSIS METHOD USED]\n// Author: BTMM Development Team\n// Version: 1.0\n// Date: ${new Date().toISOString().split('T')[0]}\n// =============================================================================\n\n`;
      
      // Insert after version declaration
      const versionIndex = content.indexOf('//@version=5');
      if (versionIndex !== -1) {
        const insertIndex = content.indexOf('\n', versionIndex) + 1;
        content = content.slice(0, insertIndex) + headerTemplate + content.slice(insertIndex);
        modified = true;
        console.log('✅ Added documentation header template');
      }
    }

    // Fix 9: Improve alert messages
    const alertMatches = content.match(/alert\([^)]*\)/g) || [];
    alertMatches.forEach(alertMatch => {
      if (!alertMatch.includes('syminfo.ticker') && !alertMatch.includes('close')) {
        const improvedAlert = alertMatch.replace(
          /alert\(([^,)]+)/,
          'alert($1 + "\\nSymbol: " + syminfo.ticker + "\\nPrice: " + str.tostring(close, "#.##")'
        );
        content = content.replace(alertMatch, improvedAlert);
        modified = true;
        console.log('✅ Enhanced alert message with symbol and price');
      }
    });

    // Fix 10: Add error handling patterns
    if (content.includes(' / ') && !content.includes('!= 0')) {
      // Add division protection comment
      const divisionComment = '\n// TODO: Add division by zero protection (e.g., divisor != 0 ? numerator / divisor : na)';
      content += divisionComment;
      modified = true;
      console.log('✅ Added division by zero protection reminder');
    }

    // Save if modified
    if (modified) {
      // Create backup first
      const backupPath = `${scriptPath}.backup-${Date.now()}`;
      fs.copyFileSync(scriptPath, backupPath);
      
      // Save fixed content
      fs.writeFileSync(scriptPath, content);
      console.log(`✅ Auto-fixes applied to ${path.basename(scriptPath)}`);
      
      return true;
    }

    console.log('💡 No auto-fixes needed');
    return false;
  }

  // Auto-fix all scripts
  async autoFixAllScripts() {
    console.log('🔧 Running auto-fix on all BTMM scripts...\n');
    
    const scripts = [
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

    let fixedCount = 0;
    
    for (const script of scripts) {
      if (fs.existsSync(script)) {
        const fixed = await this.autoFixScript(script);
        if (fixed) fixedCount++;
      }
    }

    console.log(`\n📊 Auto-fix completed: ${fixedCount} scripts modified`);
    
    if (fixedCount > 0) {
      console.log('🔄 Running validation and auto-commit...');
      await this.autoCommitWithValidation('Auto-fix: Resolve common Pine Script issues');
    }
    
    return fixedCount;
  }
}

// CLI Usage
if (require.main === module) {
  const autoCommit = new AutoCommitSystem();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'commit':
      const message = args[1];
      const skipValidation = args.includes('--skip-validation');
      autoCommit.autoCommitWithValidation(message, skipValidation);
      break;
      
    case 'watch':
      const interval = parseInt(args[1]) || 30000;
      autoCommit.watchForChanges(interval);
      break;
      
    case 'autofix':
      if (args[1]) {
        autoCommit.autoFixScript(args[1]);
      } else {
        autoCommit.autoFixAllScripts();
      }
      break;
      
    case 'validate':
      const validator = new PineScriptValidator();
      validator.validateAllScripts();
      break;
      
    default:
      console.log('BTMM Auto-Commit System with Quality Validation');
      console.log('');
      console.log('Usage:');
      console.log('  node auto-commit-system.js commit [message] [--skip-validation]');
      console.log('  node auto-commit-system.js watch [interval-ms]');
      console.log('  node auto-commit-system.js autofix [script-path]');
      console.log('  node auto-commit-system.js validate');
      console.log('');
      console.log('Examples:');
      console.log('  node auto-commit-system.js commit "Enhanced EMA calculations"');
      console.log('  node auto-commit-system.js watch 60000');
      console.log('  node auto-commit-system.js autofix scripts/BTMM_EMA_System.pine');
      console.log('  node auto-commit-system.js validate');
  }
}

module.exports = AutoCommitSystem; 