// backup-system.js - BTMM Backup Management System
const fs = require('fs');
const path = require('path');

class BackupSystem {
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

  // Backup all BTMM scripts
  backupAllScripts(reason = 'manual') {
    console.log(`💾 Creating backup of all BTMM scripts (${reason})\n`);

    const scripts = this.getAllBTMMScripts();
    const results = [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    scripts.forEach(scriptPath => {
      const fileName = path.basename(scriptPath);
      console.log(`📄 Backing up ${fileName}...`);
      
      try {
        const backupFileName = `${fileName}.${reason}-${timestamp}`;
        const backupPath = path.join(this.backupDir, backupFileName);
        
        fs.copyFileSync(scriptPath, backupPath);
        console.log(`✅ Backed up to: ${backupFileName}`);
        
        results.push({
          script: fileName,
          success: true,
          backupPath: backupPath,
          backupName: backupFileName
        });
      } catch (error) {
        console.log(`❌ Failed to backup ${fileName}: ${error.message}`);
        results.push({
          script: fileName,
          success: false,
          error: error.message
        });
      }
    });

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    console.log(`\n📊 Backup Summary:`);
    console.log(`   Total scripts: ${results.length}`);
    console.log(`   Successfully backed up: ${successful}`);
    console.log(`   Failed: ${failed}`);
    
    if (failed > 0) {
      console.log(`\n❌ Failed backups:`);
      results.filter(r => !r.success).forEach(result => {
        console.log(`   - ${result.script}: ${result.error}`);
      });
    }

    console.log(`\n💾 Backup location: ${this.backupDir}\n`);
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
      path.join(this.scriptsDir, 'visuals'),
      path.join(this.scriptsDir, 'support'),
      path.join(this.scriptsDir, 'templates')
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

  // List all backup files
  listBackups() {
    console.log('📋 BTMM Backup Inventory');
    console.log('='.repeat(50));
    console.log(`Backup directory: ${this.backupDir}\n`);

    if (!fs.existsSync(this.backupDir)) {
      console.log('❌ No backup directory found\n');
      return [];
    }

    const files = fs.readdirSync(this.backupDir);
    if (files.length === 0) {
      console.log('📭 No backup files found\n');
      return [];
    }

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
      
      backups.slice(0, 3).forEach((backup, index) => { // Show only last 3
        const ageHours = Math.round((Date.now() - backup.date.getTime()) / (1000 * 60 * 60));
        const sizeKB = Math.round(backup.size / 1024);
        
        console.log(`   ${index === 0 ? '🔸' : '▫️'} ${backup.reason} (${ageHours}h ago, ${sizeKB}KB)`);
      });
      
      if (backups.length > 3) {
        console.log(`   ... and ${backups.length - 3} more backups`);
      }
      console.log('');
    });

    console.log(`📊 Total backup files: ${files.length}\n`);
    return backupsByScript;
  }

  // Cleanup old backups
  cleanupOldBackups(keepCount = 5) {
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
  const backup = new BackupSystem();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Default: backup all scripts
    const results = backup.backupAllScripts('pre-consolidation');
    const allSuccess = results.every(r => r.success);
    process.exit(allSuccess ? 0 : 1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'list':
      backup.listBackups();
      break;
      
    case 'cleanup':
      const keepCount = parseInt(args[1]) || 5;
      backup.cleanupOldBackups(keepCount);
      break;
      
    default:
      const reason = command || 'manual';
      const results = backup.backupAllScripts(reason);
      const allSuccess = results.every(r => r.success);
      process.exit(allSuccess ? 0 : 1);
  }
}

module.exports = BackupSystem; 