// rollback-system.js - BTMM Emergency Recovery System
const fs = require('fs');
const path = require('path');

class BTMMRollback {
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

  // Create backup with timestamp
  createBackup(filePath, reason = 'manual') {
    try {
      const fileName = path.basename(filePath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `${fileName}.${reason}-${timestamp}`;
      const backupPath = path.join(this.backupDir, backupFileName);
      
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`✅ Backup created: ${backupFileName}`);
        return backupPath;
      } else {
        console.log(`❌ Source file not found: ${filePath}`);
        return null;
      }
    } catch (error) {
      console.error(`🚨 Backup creation failed: ${error.message}`);
      return null;
    }
  }

  // Restore from most recent backup
  restoreFromBackup(scriptName, backupType = null) {
    try {
      const targetPath = this.findScriptPath(scriptName);
      if (!targetPath) {
        console.log(`❌ Target script not found: ${scriptName}`);
        return false;
      }

      const backups = this.getBackupsForScript(scriptName, backupType);
      if (backups.length === 0) {
        console.log(`❌ No backups found for ${scriptName}`);
        return false;
      }

      // Use most recent backup
      const latestBackup = backups[0];
      const backupPath = path.join(this.backupDir, latestBackup.fileName);

      // Create a backup of current state before restoring
      this.createBackup(targetPath, 'pre-restore');

      // Restore from backup
      fs.copyFileSync(backupPath, targetPath);
      
      console.log(`🔄 Restored ${scriptName} from: ${latestBackup.fileName}`);
      console.log(`📅 Backup date: ${latestBackup.date.toISOString()}`);
      console.log(`🏷️  Backup reason: ${latestBackup.reason}\n`);
      
      return true;
    } catch (error) {
      console.error(`🚨 Restore failed: ${error.message}`);
      return false;
    }
  }

  // Get all backups for a specific script
  getBackupsForScript(scriptName, backupType = null) {
    const backups = [];
    
    if (!fs.existsSync(this.backupDir)) {
      return backups;
    }

    const files = fs.readdirSync(this.backupDir);
    
    files.forEach(file => {
      if (file.startsWith(scriptName)) {
        // Parse backup filename: scriptname.reason-timestamp
        const parts = file.split('.');
        if (parts.length >= 3) {
          const reasonAndTime = parts.slice(1).join('.').split('-');
          const reason = reasonAndTime[0];
          
          // Skip if specific backup type requested and doesn't match
          if (backupType && reason !== backupType) {
            return;
          }

          const stats = fs.statSync(path.join(this.backupDir, file));
          
          backups.push({
            fileName: file,
            reason: reason,
            date: stats.mtime,
            size: stats.size
          });
        }
      }
    });

    // Sort by date, most recent first
    return backups.sort((a, b) => b.date - a.date);
  }

  // List all available backups
  listAllBackups() {
    console.log('📋 BTMM Backup Inventory');
    console.log('='.repeat(50));
    console.log(`Backup directory: ${this.backupDir}\n`);

    if (!fs.existsSync(this.backupDir)) {
      console.log('❌ No backup directory found\n');
      return [];
    }

    const files = fs.readdirSync(this.backupDir);
    const backupsByScript = {};

    // Group backups by script
    files.forEach(file => {
      const scriptName = file.split('.')[0];
      if (!backupsByScript[scriptName]) {
        backupsByScript[scriptName] = [];
      }
      
      const stats = fs.statSync(path.join(this.backupDir, file));
      const parts = file.split('.');
      const reason = parts.length >= 3 ? parts[1] : 'unknown';
      
      backupsByScript[scriptName].push({
        fileName: file,
        reason: reason,
        date: stats.mtime,
        size: stats.size
      });
    });

    // Display organized backup list
    Object.entries(backupsByScript).forEach(([scriptName, backups]) => {
      console.log(`📄 ${scriptName}:`);
      
      // Sort by date, most recent first
      backups.sort((a, b) => b.date - a.date);
      
      backups.slice(0, 5).forEach((backup, index) => { // Show only last 5
        const ageHours = Math.round((Date.now() - backup.date.getTime()) / (1000 * 60 * 60));
        const sizeKB = Math.round(backup.size / 1024);
        
        console.log(`   ${index === 0 ? '🔸' : '▫️'} ${backup.reason} (${ageHours}h ago, ${sizeKB}KB)`);
        console.log(`     📁 ${backup.fileName}`);
      });
      
      if (backups.length > 5) {
        console.log(`   ... and ${backups.length - 5} more backups`);
      }
      console.log('');
    });

    return backupsByScript;
  }

  // Validate after restore
  validateAfterRestore(scriptPath) {
    console.log('🧪 Validating restored script...');
    
    if (!fs.existsSync(scriptPath)) {
      console.log('❌ Restored file not found');
      return false;
    }

    const content = fs.readFileSync(scriptPath, 'utf8');
    
    const validations = {
      hasVersionDeclaration: content.includes('//@version=5'),
      hasIndicatorDeclaration: content.includes('indicator('),
      noErrorMarkers: !content.includes('ERROR') && !content.includes('SYNTAX'),
      balancedParentheses: this.checkBalancedParentheses(content),
      reasonableSize: content.length > 100 && content.length < 100000
    };

    const isValid = Object.values(validations).every(v => v);
    
    if (isValid) {
      console.log('✅ Restored script validation passed');
    } else {
      console.log('❌ Restored script validation failed:');
      Object.entries(validations).forEach(([check, passed]) => {
        if (!passed) {
          console.log(`   - ${check}: FAILED`);
        }
      });
    }

    return isValid;
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

  // Emergency rollback all scripts
  emergencyRollbackAll(backupType = 'pre-merge') {
    console.log('🚨 EMERGENCY ROLLBACK INITIATED');
    console.log(`Rolling back all scripts to last ${backupType} state\n`);

    const protectedScripts = [
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

    const results = [];

    protectedScripts.forEach(script => {
      console.log(`🔄 Rolling back ${script}...`);
      const success = this.restoreFromBackup(script, backupType);
      
      if (success) {
        const scriptPath = this.findScriptPath(script);
        const isValid = this.validateAfterRestore(scriptPath);
        results.push({ script, success: true, valid: isValid });
      } else {
        results.push({ script, success: false, valid: false });
      }
    });

    // Summary
    const successful = results.filter(r => r.success && r.valid).length;
    const failed = results.length - successful;

    console.log('\n📊 Emergency Rollback Summary:');
    console.log(`   Total scripts: ${results.length}`);
    console.log(`   Successfully restored: ${successful}`);
    console.log(`   Failed: ${failed}\n`);

    if (failed > 0) {
      console.log('❌ Failed rollbacks:');
      results.filter(r => !r.success || !r.valid).forEach(result => {
        console.log(`   - ${result.script} ${!result.success ? '(restore failed)' : '(validation failed)'}`);
      });
      console.log('');
    }

    return results;
  }

  // Backup all current scripts
  backupAllScripts(reason = 'manual') {
    console.log(`💾 Creating backup of all BTMM scripts (${reason})\n`);

    const scripts = this.getAllBTMMScripts();
    const results = [];

    scripts.forEach(scriptPath => {
      const fileName = path.basename(scriptPath);
      console.log(`📄 Backing up ${fileName}...`);
      
      const backupPath = this.createBackup(scriptPath, reason);
      results.push({
        script: fileName,
        success: backupPath !== null,
        backupPath: backupPath
      });
    });

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    console.log(`\n📊 Backup Summary:`);
    console.log(`   Total scripts: ${results.length}`);
    console.log(`   Successfully backed up: ${successful}`);
    console.log(`   Failed: ${failed}\n`);

    return results;
  }

  getAllBTMMScripts() {
    const files = [];
    
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

  // Cleanup old backups (keep last N)
  cleanupOldBackups(keepCount = 10) {
    console.log(`🧹 Cleaning up old backups (keeping last ${keepCount} per script)\n`);

    if (!fs.existsSync(this.backupDir)) {
      console.log('❌ No backup directory found');
      return;
    }

    const backupsByScript = {};
    const files = fs.readdirSync(this.backupDir);

    // Group by script name
    files.forEach(file => {
      const scriptName = file.split('.')[0];
      if (!backupsByScript[scriptName]) {
        backupsByScript[scriptName] = [];
      }
      
      const stats = fs.statSync(path.join(this.backupDir, file));
      backupsByScript[scriptName].push({
        fileName: file,
        date: stats.mtime
      });
    });

    let totalCleaned = 0;

    // Clean each script's backups
    Object.entries(backupsByScript).forEach(([scriptName, backups]) => {
      // Sort by date, newest first
      backups.sort((a, b) => b.date - a.date);
      
      // Remove old backups beyond keepCount
      const toRemove = backups.slice(keepCount);
      
      toRemove.forEach(backup => {
        const backupPath = path.join(this.backupDir, backup.fileName);
        fs.unlinkSync(backupPath);
        console.log(`🗑️  Removed: ${backup.fileName}`);
        totalCleaned++;
      });
    });

    console.log(`\n✅ Cleanup complete. Removed ${totalCleaned} old backup files.\n`);
  }
}

// Usage
if (require.main === module) {
  const rollback = new BTMMRollback();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('BTMM Rollback System Usage:');
    console.log('  node rollback-system.js list                    - List all backups');
    console.log('  node rollback-system.js backup [reason]         - Backup all scripts');
    console.log('  node rollback-system.js restore <script>        - Restore single script');
    console.log('  node rollback-system.js emergency [type]        - Emergency rollback all');
    console.log('  node rollback-system.js cleanup [count]         - Cleanup old backups');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'list':
      rollback.listAllBackups();
      break;
      
    case 'backup':
      const reason = args[1] || 'manual';
      rollback.backupAllScripts(reason);
      break;
      
    case 'restore':
      if (args.length < 2) {
        console.log('❌ Please specify script name to restore');
        process.exit(1);
      }
      const success = rollback.restoreFromBackup(args[1]);
      process.exit(success ? 0 : 1);
      break;
      
    case 'emergency':
      const backupType = args[1] || 'pre-merge';
      const results = rollback.emergencyRollbackAll(backupType);
      const allSuccess = results.every(r => r.success && r.valid);
      process.exit(allSuccess ? 0 : 1);
      break;
      
    case 'cleanup':
      const keepCount = parseInt(args[1]) || 10;
      rollback.cleanupOldBackups(keepCount);
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

module.exports = BTMMRollback; 