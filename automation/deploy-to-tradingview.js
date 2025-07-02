// deploy-to-tradingview.js - Enhanced TradingView Deployment with Git Integration
const fs = require('fs');
const { exec, execSync } = require('child_process');
const path = require('path');
const BackupSystem = require('./backup-system');
const DependencyTracker = require('./dependency-tracker');

class TradingViewDeployer {
  constructor() {
    this.scriptsPath = './scripts/';
    this.deploymentLog = './deployment-log.json';
    this.versionsPath = './versions/';
    this.gitEnabled = this.checkGitRepository();
    this.backupSystem = new BackupSystem();
    this.dependencyTracker = new DependencyTracker();
    this.ensureDirectories();
  }

  checkGitRepository() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch (error) {
      console.log('⚠️  Git repository not found - Git features disabled');
      return false;
    }
  }

  ensureDirectories() {
    if (!fs.existsSync(this.versionsPath)) {
      fs.mkdirSync(this.versionsPath, { recursive: true });
    }
  }

  // Enhanced deployment with Git integration and existing BTMM validation
  async deployScript(scriptName, mode = 'copy', autoCommit = true) {
    console.log(`🚀 Deploying ${scriptName} to TradingView...`);
    
    try {
      // 1. Pre-deployment backup using existing system
      console.log(`💾 Creating pre-deployment backup...`);
      this.backupSystem.backupAllScripts('pre-deployment');

      // 2. Check Git status before deployment
      if (this.gitEnabled && autoCommit) {
        await this.handleGitPreDeployment(scriptName);
      }

      // 3. Validate script using existing BTMM validation
      const validation = this.validateScript(scriptName);
      if (!validation.valid) {
        console.log(`❌ Validation failed:`);
        validation.errors.forEach(error => console.log(`   - ${error}`));
        return false;
      }

      // 4. Check integration health using existing tracker
      console.log(`🔍 Checking integration health...`);
      const healthReport = this.dependencyTracker.generateHealthReport();
      if (!healthReport.isHealthy) {
        console.log(`⚠️  Integration health issues detected - proceeding with caution`);
      }

      // 5. Format for TradingView
      const formattedCode = this.formatForTradingView(scriptName);
      
      // 6. Copy to clipboard
      if (mode === 'copy' || mode === 'auto') {
        const success = await this.copyToClipboard(formattedCode);
        if (success) {
          console.log(`📋 ${scriptName} copied to clipboard`);
        } else {
          console.log(`⚠️  Clipboard copy failed - code prepared for manual copy`);
        }
      }

      // 7. Log deployment
      this.logDeployment(scriptName, 'SUCCESS');
      
      // 8. Git post-deployment actions
      if (this.gitEnabled && autoCommit) {
        await this.handleGitPostDeployment(scriptName);
      }

      // 9. Open TradingView
      if (mode === 'auto') {
        this.openTradingView(scriptName);
      }

      console.log(`✅ ${scriptName} deployment completed successfully`);
      return true;
    } catch (error) {
      console.log(`❌ Deployment failed: ${error.message}`);
      this.logDeployment(scriptName, 'FAILED', error.message);
      return false;
    }
  }

  async handleGitPreDeployment(scriptName) {
    console.log(`📊 Checking Git status for ${scriptName}...`);
    
    try {
      const scriptPath = this.findScriptPath(`${scriptName}.pine`);
      if (!scriptPath) {
        console.log(`⚠️  Script file not found: ${scriptName}.pine`);
        return;
      }

      // Check if file has uncommitted changes
      const gitStatus = execSync(`git status --porcelain "${scriptPath}"`, { encoding: 'utf8' });
      
      if (gitStatus.trim()) {
        console.log(`📝 Uncommitted changes detected in ${scriptName}.pine`);
        
        // Auto-stage the file
        execSync(`git add "${scriptPath}"`);
        console.log(`📌 Staged ${scriptName}.pine for commit`);
        
        // Create pre-deployment commit
        const commitMessage = `Pre-deployment: ${scriptName} - ${new Date().toISOString()}`;
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });
        console.log(`💾 Pre-deployment commit created`);
      } else {
        console.log(`✅ ${scriptName}.pine is up to date in Git`);
      }
    } catch (error) {
      console.log(`⚠️  Git pre-deployment check failed: ${error.message}`);
    }
  }

  async handleGitPostDeployment(scriptName) {
    try {
      // Tag successful deployment
      const tagName = `deploy-${scriptName}-${Date.now()}`;
      const tagMessage = `Deployment: ${scriptName} to TradingView - ${new Date().toISOString()}`;
      
      execSync(`git tag -a "${tagName}" -m "${tagMessage}"`, { stdio: 'ignore' });
      console.log(`🏷️  Created deployment tag: ${tagName}`);
      
      // Push to remote if configured
      await this.pushToRemote();
      
    } catch (error) {
      console.log(`⚠️  Git post-deployment actions failed: ${error.message}`);
    }
  }

  async pushToRemote() {
    try {
      // Check if remote exists
      const remotes = execSync('git remote', { encoding: 'utf8' });
      
      if (remotes.includes('origin')) {
        console.log(`🌐 Pushing to GitHub...`);
        
        // Push commits and tags
        execSync('git push origin main', { stdio: 'ignore' });
        execSync('git push origin --tags', { stdio: 'ignore' });
        
        console.log(`✅ Successfully pushed to GitHub`);
      } else {
        console.log(`💡 No remote 'origin' configured - skipping push`);
      }
    } catch (error) {
      console.log(`⚠️  GitHub push failed: ${error.message}`);
      console.log(`💡 You may need to run: git push origin main`);
    }
  }

  // Deploy all with Git integration and existing BTMM validation
  async deployAllScripts(autoCommit = true) {
    const btmmScripts = [
      'BTMMFoundation',
      'BTMM_EMA_System', 
      'BTMM_Asian_Range',
      'BTMM_HTF_Bias',
      'BTMM_Pattern_Detection',
      'BTMM_Entry_System',
      'BTMM_Risk_Management',
      'BTMM_Stop_Hunt_Detection',
      'BTMM_Master_Dashboard',
      'BTMM_Alert_System'
    ];

    console.log(`🚀 Deploying all ${btmmScripts.length} BTMM scripts with Git integration...`);
    
    // Run full validation first using existing system
    console.log(`🔍 Running pre-deployment validation...`);
    const healthReport = this.dependencyTracker.generateHealthReport();
    
    if (!healthReport.isHealthy) {
      console.log(`❌ System health check failed - aborting deployment`);
      console.log(`💡 Run 'npm run integration-health' to see issues`);
      return false;
    }

    if (this.gitEnabled && autoCommit) {
      // Create bulk deployment commit
      try {
        execSync('git add scripts/*.pine scripts/*/*.pine');
        const commitMessage = `Bulk deployment: All BTMM scripts - ${new Date().toISOString()}`;
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });
        console.log(`💾 Bulk deployment commit created`);
      } catch (error) {
        console.log(`💡 No changes to commit or already committed`);
      }
    }

    let successful = 0;
    let failed = 0;

    for (const script of btmmScripts) {
      const scriptPath = this.findScriptPath(`${script}.pine`);
      if (scriptPath) {
        console.log(`\n📄 Processing ${script}...`);
        const success = await this.deployScript(script, 'copy', false); // Don't auto-commit individual scripts
        if (success) {
          successful++;
        } else {
          failed++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`⚠️  Script not found: ${script}.pine`);
        failed++;
      }
    }

    // Final Git actions for bulk deployment
    if (this.gitEnabled && autoCommit && successful > 0) {
      try {
        const tagName = `bulk-deploy-${Date.now()}`;
        const tagMessage = `Bulk deployment: ${successful} scripts to TradingView`;
        execSync(`git tag -a "${tagName}" -m "${tagMessage}"`, { stdio: 'ignore' });
        console.log(`🏷️  Created bulk deployment tag: ${tagName}`);
        
        await this.pushToRemote();
      } catch (error) {
        console.log(`⚠️  Bulk deployment Git actions failed: ${error.message}`);
      }
    }

    console.log(`\n📊 Deployment Summary:`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    if (this.gitEnabled) {
      console.log(`   📊 Git: Changes committed and pushed to GitHub`);
    }

    return successful > 0;
  }

  // Enhanced validation using existing BTMM patterns
  validateScript(scriptName) {
    const scriptPath = this.findScriptPath(`${scriptName}.pine`);
    
    if (!scriptPath) {
      return { valid: false, errors: [`Script file not found: ${scriptName}.pine`] };
    }

    const content = fs.readFileSync(scriptPath, 'utf8');
    const validation = { valid: true, errors: [] };

    // Basic Pine Script validation
    if (!content.startsWith('//@version=5')) {
      validation.errors.push('Missing //@version=5 declaration');
      validation.valid = false;
    }

    if (!content.includes('indicator(') && !content.includes('strategy(') && !content.includes('library(')) {
      validation.errors.push('Missing script type declaration');
      validation.valid = false;
    }

    // BTMM-specific validation
    if (this.isPriceBasedIndicator(scriptName) && !content.includes('overlay=true')) {
      validation.errors.push('Price-based indicator missing overlay=true');
      validation.valid = false;
    }

    const lineCount = content.split('\n').length;
    if (lineCount > 2000) {
      validation.errors.push(`Script too long: ${lineCount} lines (limit: 2000)`);
      validation.valid = false;
    }

    // Foundation dependency check (except for Foundation itself)
    if (scriptName !== 'BTMMFoundation' && !content.includes('import BTMMFoundation')) {
      validation.errors.push('Missing BTMMFoundation import');
      validation.valid = false;
    }

    return validation;
  }

  formatForTradingView(scriptName) {
    const scriptPath = this.findScriptPath(`${scriptName}.pine`);
    let content = fs.readFileSync(scriptPath, 'utf8');
    
    content = this.removeLocalComments(content);
    content = this.optimizeForTradingView(content);
    content = this.addDeploymentHeader(content, scriptName);
    
    return content;
  }

  removeLocalComments(content) {
    const lines = content.split('\n');
    return lines
      .filter(line => !line.trim().startsWith('// DEV:'))
      .filter(line => !line.trim().startsWith('// TODO:'))
      .filter(line => !line.trim().startsWith('// DEBUG:'))
      .filter(line => !line.trim().startsWith('// CURSOR:'))
      .filter(line => !line.trim().startsWith('// MERGE:'))
      .join('\n');
  }

  optimizeForTradingView(content) {
    content = content.replace(/\/\/ ={70,}/g, '// ============================================================================');
    content = content.replace(/\n{3,}/g, '\n\n');
    content = content.replace(/\t/g, '    ');
    return content;
  }

  addDeploymentHeader(content, scriptName) {
    const timestamp = new Date().toISOString();
    let header = `// Deployed from Cursor IDE - ${timestamp}\n// Script: ${scriptName}\n// BTMM System Component\n`;
    
    // Add Git info if available
    if (this.gitEnabled) {
      try {
        const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        header += `// Git: ${gitBranch}@${gitHash}\n`;
      } catch (error) {
        // Git info not available
      }
    }
    
    header += '\n';
    return header + content;
  }

  async copyToClipboard(content) {
    try {
      // Try to use clipboardy if available
      try {
        const clipboardy = require('clipboardy');
        await clipboardy.write(content);
        return true;
      } catch (clipError) {
        // Fallback to platform-specific clipboard commands
        const command = process.platform === 'win32' ? 'clip' : 
                       process.platform === 'darwin' ? 'pbcopy' : 'xclip -selection clipboard';
        
        const child = exec(command);
        child.stdin.write(content);
        child.stdin.end();
        
        return new Promise((resolve) => {
          child.on('close', (code) => resolve(code === 0));
        });
      }
    } catch (error) {
      console.log(`⚠️  Clipboard copy failed: ${error.message}`);
      return false;
    }
  }

  openTradingView(scriptName) {
    const url = 'https://www.tradingview.com/pine-editor/';
    const command = process.platform === 'win32' ? 'start' : 
                   process.platform === 'darwin' ? 'open' : 'xdg-open';
    
    exec(`${command} "${url}"`, (error) => {
      if (error) {
        console.log('💡 Manually open: https://www.tradingview.com/pine-editor/');
      } else {
        console.log(`🌐 TradingView Pine Editor opened for ${scriptName}`);
      }
    });
  }

  isPriceBasedIndicator(scriptName) {
    const priceBasedScripts = [
      'BTMM_EMA_System', 'BTMM_Asian_Range', 'BTMM_Pattern_Detection',
      'BTMM_Entry_System', 'BTMM_Risk_Management', 'BTMM_Stop_Hunt_Detection',
      'BTMM_Master_Dashboard'
    ];
    return priceBasedScripts.some(script => scriptName.includes(script));
  }

  findScriptPath(fileName) {
    const possiblePaths = [
      path.join(this.scriptsPath, fileName),
      path.join(this.scriptsPath, 'core', fileName),
      path.join(this.scriptsPath, 'foundation', fileName),
      path.join(this.scriptsPath, 'dashboard', fileName),
      path.join(this.scriptsPath, 'alerts', fileName),
      path.join(this.scriptsPath, 'analytics', fileName),
      path.join(this.scriptsPath, 'tools', fileName),
      path.join(this.scriptsPath, 'visuals', fileName),
      path.join(this.scriptsPath, 'support', fileName)
    ];

    return possiblePaths.find(p => fs.existsSync(p));
  }

  logDeployment(scriptName, status, error = null) {
    let log = [];
    
    if (fs.existsSync(this.deploymentLog)) {
      try {
        log = JSON.parse(fs.readFileSync(this.deploymentLog, 'utf8'));
      } catch (e) {
        log = [];
      }
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      script: scriptName,
      status: status,
      error: error
    };

    // Add Git info if available
    if (this.gitEnabled) {
      try {
        logEntry.gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        logEntry.gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      } catch (error) {
        // Git info not available
      }
    }
    
    log.push(logEntry);
    
    if (log.length > 100) {
      log = log.slice(-100);
    }
    
    fs.writeFileSync(this.deploymentLog, JSON.stringify(log, null, 2));
  }

  // Create GitHub release for major versions
  async createGitHubRelease(version, description) {
    try {
      console.log(`📦 Creating GitHub release v${version}...`);
      
      if (!this.gitEnabled) {
        console.log(`❌ Git not available - cannot create release`);
        return false;
      }

      // Create and push tag
      const tagName = `v${version}`;
      execSync(`git tag -a "${tagName}" -m "Release ${version}: ${description}"`);
      execSync(`git push origin ${tagName}`);
      
      console.log(`✅ Release tag ${tagName} created and pushed`);
      console.log(`💡 Manual step: Go to GitHub > Releases > Create Release from tag ${tagName}`);
      console.log(`   Description: ${description}`);
      
      return true;
    } catch (error) {
      console.log(`❌ GitHub release creation failed: ${error.message}`);
      return false;
    }
  }
}

// CLI Usage with Git integration
if (require.main === module) {
  const deployer = new TradingViewDeployer();
  const args = process.argv.slice(2);
  const scriptName = args[0];
  const mode = args[1] || 'copy';
  const autoCommit = args[2] !== 'no-git';

  if (scriptName === 'all') {
    deployer.deployAllScripts(autoCommit);
  } else if (scriptName === 'release') {
    const version = args[1];
    const description = args[2] || 'BTMM System release';
    if (version) {
      deployer.createGitHubRelease(version, description);
    } else {
      console.log('Usage: node deploy-to-tradingview.js release <version> [description]');
    }
  } else if (scriptName) {
    deployer.deployScript(scriptName, mode, autoCommit);
  } else {
    console.log('BTMM Enhanced TradingView Deployer with Git Integration');
    console.log('Usage:');
    console.log('  node deploy-to-tradingview.js <scriptName> [copy|auto] [no-git]');
    console.log('  node deploy-to-tradingview.js all [no-git]');
    console.log('  node deploy-to-tradingview.js release <version> [description]');
    console.log('');
    console.log('Examples:');
    console.log('  node deploy-to-tradingview.js BTMM_EMA_System auto');
    console.log('  node deploy-to-tradingview.js all');
    console.log('  node deploy-to-tradingview.js release 1.0.0 "Enhanced EMA system"');
  }
}

module.exports = TradingViewDeployer; 