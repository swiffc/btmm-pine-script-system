// script-limit-enforcer.js - BTMM Script Limit Enforcement
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class ScriptLimitEnforcer {
  constructor() {
    this.MAX_SCRIPTS = 10;
    this.scriptsDir = path.join(__dirname, '..', 'scripts');
    this.PROTECTED_SCRIPTS = [
      'BTMMFoundation.pine',
      'BTMM_EMA_System.pine',
      'BTMM_Asian_Range.pine', 
      'BTMM_HTF_Bias.pine',
      'BTMM_Pattern_Detection.pine',
      'BTMM_Entry_System.pine',
      'BTMM_Risk_Management.pine',
      'BTMM_Stop_Hunt_Detection.pine',
      'BTMM_Master_Dashboard.pine',
      'BTMM_Alert_System.pine'
    ];
  }

  // Check current script count
  getCurrentScriptCount() {
    const files = this.getAllBTMMScripts();
    return files.length;
  }

  getAllBTMMScripts() {
    const files = [];
    
    // Search in all subdirectories
    const searchDirs = [
      this.scriptsDir,
      path.join(this.scriptsDir, 'core'),
      path.join(this.scriptsDir, 'foundation'),
      path.join(this.scriptsDir, 'dashboard'),
      path.join(this.scriptsDir, 'alerts'),
      path.join(this.scriptsDir, 'analytics'),
      path.join(this.scriptsDir, 'tools'),
      path.join(this.scriptsDir, 'visuals')
    ];

    searchDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const dirFiles = fs.readdirSync(dir)
          .filter(file => file.endsWith('.pine') && file.startsWith('BTMM'))
          .map(file => path.join(dir, file));
        files.push(...dirFiles);
      }
    });

    return files;
  }

  // Monitor file system for new .pine file creation
  monitorFileSystem() {
    console.log('🔒 BTMM Script Limit Enforcer Active');
    console.log(`📊 Current Status: ${this.getCurrentScriptCount()}/${this.MAX_SCRIPTS} scripts\n`);

    // Watch for new .pine files
    const watcher = chokidar.watch('**/*.pine', {
      cwd: this.scriptsDir,
      ignored: /^\./, 
      persistent: true,
      ignoreInitial: true
    });
    
    watcher.on('add', (filePath) => {
      const fullPath = path.join(this.scriptsDir, filePath);
      if (this.isNewBTMMScript(fullPath)) {
        this.handleNewScriptCreation(fullPath);
      }
    });

    console.log('👀 Monitoring for new script creation...\n');
    return watcher;
  }

  isNewBTMMScript(filePath) {
    const fileName = path.basename(filePath);
    return fileName.endsWith('.pine') && 
           fileName.startsWith('BTMM') && 
           !this.PROTECTED_SCRIPTS.includes(fileName);
  }

  handleNewScriptCreation(newScriptPath) {
    const currentCount = this.getCurrentScriptCount();
    
    console.log(`🚨 NEW SCRIPT DETECTED: ${path.basename(newScriptPath)}`);
    console.log(`📊 Current count: ${currentCount}/${this.MAX_SCRIPTS}`);
    
    if (currentCount > this.MAX_SCRIPTS) {
      console.log('❌ SCRIPT LIMIT EXCEEDED!\n');
      
      // Block the creation
      this.blockScriptCreation(newScriptPath);
      
      // Suggest merge target
      this.suggestMergeTarget(newScriptPath);
    } else {
      console.log('✅ Within limit, but consider merging for organization\n');
      this.suggestMergeTarget(newScriptPath);
    }
  }

  blockScriptCreation(scriptPath) {
    try {
      if (fs.existsSync(scriptPath)) {
        const content = fs.readFileSync(scriptPath, 'utf8');
        
        // Save content for potential merge
        const blockedPath = `${scriptPath}.blocked`;
        fs.writeFileSync(blockedPath, content);
        
        // Remove the original file
        fs.unlinkSync(scriptPath);
        
        console.log(`❌ Script creation blocked: ${path.basename(scriptPath)}`);
        console.log(`💾 Content saved to: ${path.basename(blockedPath)}`);
        console.log(`🔀 Use merge command to integrate into existing script\n`);
      }
    } catch (error) {
      console.error(`Error blocking script creation: ${error.message}`);
    }
  }

  suggestMergeTarget(blockedScript) {
    const functionality = this.extractFunctionality(blockedScript);
    const target = this.getMergeTarget(functionality);
    
    console.log(`💡 MERGE SUGGESTION:`);
    console.log(`   Blocked script: ${path.basename(blockedScript)}`);
    console.log(`   Detected functionality: ${functionality}`);
    console.log(`   Suggested target: ${target}`);
    console.log(`   Command: npm run merge -- "${blockedScript}.blocked" "${target}"\n`);
  }

  extractFunctionality(scriptPath) {
    const fileName = path.basename(scriptPath, '.pine');
    
    // Extract functionality from filename
    if (fileName.includes('EMA') || fileName.includes('Moving') || fileName.includes('Trend')) {
      return 'EMA/Technical Analysis';
    }
    if (fileName.includes('Asian') || fileName.includes('Session') || fileName.includes('Range')) {
      return 'Session/Time Analysis';
    }
    if (fileName.includes('Bias') || fileName.includes('HTF') || fileName.includes('Setup')) {
      return 'Bias/Setup Analysis';
    }
    if (fileName.includes('Pattern') || fileName.includes('Candle') || fileName.includes('Formation')) {
      return 'Pattern Recognition';
    }
    if (fileName.includes('Entry') || fileName.includes('Signal') || fileName.includes('Trigger')) {
      return 'Entry System';
    }
    if (fileName.includes('Risk') || fileName.includes('Position') || fileName.includes('Money')) {
      return 'Risk Management';
    }
    if (fileName.includes('Hunt') || fileName.includes('Liquidity') || fileName.includes('Structure')) {
      return 'Market Structure';
    }
    if (fileName.includes('Dashboard') || fileName.includes('Display') || fileName.includes('Visual')) {
      return 'Dashboard/Visualization';
    }
    if (fileName.includes('Alert') || fileName.includes('Notification')) {
      return 'Alert System';
    }
    
    return 'General Functionality';
  }

  getMergeTarget(functionality) {
    const targets = {
      'EMA/Technical Analysis': 'BTMM_EMA_System.pine',
      'Session/Time Analysis': 'BTMM_Asian_Range.pine',
      'Bias/Setup Analysis': 'BTMM_HTF_Bias.pine',
      'Pattern Recognition': 'BTMM_Pattern_Detection.pine',
      'Entry System': 'BTMM_Entry_System.pine',
      'Risk Management': 'BTMM_Risk_Management.pine',
      'Market Structure': 'BTMM_Stop_Hunt_Detection.pine',
      'Dashboard/Visualization': 'BTMM_Master_Dashboard.pine',
      'Alert System': 'BTMM_Alert_System.pine',
      'General Functionality': 'BTMM_Master_Dashboard.pine'
    };

    return targets[functionality] || 'BTMM_Master_Dashboard.pine';
  }

  // Generate status report
  generateStatusReport() {
    console.log('📋 BTMM Script Limit Status Report');
    console.log('='.repeat(40));
    console.log(`Generated: ${new Date().toISOString()}\n`);

    const currentCount = this.getCurrentScriptCount();
    const allScripts = this.getAllBTMMScripts();

    console.log(`📊 Script Count: ${currentCount}/${this.MAX_SCRIPTS}`);
    console.log(`🎯 Limit Status: ${currentCount >= this.MAX_SCRIPTS ? '❌ LIMIT REACHED' : '✅ Within Limit'}\n`);

    console.log('📝 Current Scripts:');
    allScripts.forEach((script, index) => {
      const fileName = path.basename(script);
      const isProtected = this.PROTECTED_SCRIPTS.includes(fileName);
      console.log(`   ${index + 1}. ${fileName} ${isProtected ? '🔒' : ''}`);
    });

    if (currentCount < this.MAX_SCRIPTS) {
      console.log(`\n💡 Available slots: ${this.MAX_SCRIPTS - currentCount}`);
      console.log('⚠️  Recommendation: Merge new functionality into existing scripts');
    } else {
      console.log('\n🚨 NO NEW SCRIPTS ALLOWED');
      console.log('🔀 ALL new functionality must be merged into existing scripts');
    }

    console.log('\n🔒 Protected Scripts (cannot be deleted):');
    this.PROTECTED_SCRIPTS.forEach((script, index) => {
      console.log(`   ${index + 1}. ${script}`);
    });

    return {
      currentCount,
      maxScripts: this.MAX_SCRIPTS,
      isAtLimit: currentCount >= this.MAX_SCRIPTS,
      availableSlots: Math.max(0, this.MAX_SCRIPTS - currentCount),
      scripts: allScripts.map(s => path.basename(s))
    };
  }

  // Cleanup blocked files older than 7 days
  cleanupBlockedFiles() {
    console.log('🧹 Cleaning up old blocked files...\n');
    
    const searchDirs = [
      this.scriptsDir,
      path.join(this.scriptsDir, 'core'),
      path.join(this.scriptsDir, 'foundation'),
      path.join(this.scriptsDir, 'dashboard'),
      path.join(this.scriptsDir, 'alerts')
    ];

    let cleanedCount = 0;

    searchDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const blockedFiles = fs.readdirSync(dir)
          .filter(file => file.endsWith('.blocked'))
          .map(file => path.join(dir, file));

        blockedFiles.forEach(file => {
          const stats = fs.statSync(file);
          const age = Date.now() - stats.mtime.getTime();
          const days = age / (1000 * 60 * 60 * 24);

          if (days > 7) {
            fs.unlinkSync(file);
            console.log(`🗑️  Removed old blocked file: ${path.basename(file)}`);
            cleanedCount++;
          }
        });
      }
    });

    console.log(`\n✅ Cleanup complete. Removed ${cleanedCount} old blocked files.\n`);
  }
}

// Usage
if (require.main === module) {
  const enforcer = new ScriptLimitEnforcer();
  
  // Check if monitoring mode requested
  if (process.argv.includes('--monitor')) {
    enforcer.monitorFileSystem();
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n👋 Script limit enforcer stopped');
      process.exit(0);
    });
  } else if (process.argv.includes('--cleanup')) {
    enforcer.cleanupBlockedFiles();
  } else {
    // Generate status report
    const report = enforcer.generateStatusReport();
    process.exit(report.isAtLimit ? 1 : 0);
  }
}

module.exports = ScriptLimitEnforcer; 