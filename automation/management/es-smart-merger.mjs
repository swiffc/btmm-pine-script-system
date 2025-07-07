// es-smart-merger.mjs - BTMM Smart Merge System (ES Module)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BTMMSmartMerger {
  constructor() {
    this.scriptsDir = path.join(__dirname, '..', '..', 'scripts');
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

      // 3. Read and prepare new content
      const newContent = this.prepareNewContent(sourceFile);

      // 4. Perform merge
      const success = this.performMerge(targetScript, newContent, mergePosition);

      if (success) {
        console.log(`✅ Merge completed successfully\n`);
        return true;
      } else {
        console.log(`❌ Merge failed\n`);
        return false;
      }
    } catch (error) {
      console.error(`🚨 Merge error: ${error.message}`);
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

  prepareNewContent(sourceFile) {
    let content = fs.readFileSync(sourceFile, 'utf8');

    // Remove version declaration if present (target should already have it)
    content = content.replace(/^\/\/@version=5\s*\n/m, '');

    // Remove indicator declaration if present (target should already have it)
    content = content.replace(/^indicator\([^)]*\)\s*\n/m, '');

    // Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Add section header
    const fileName = path.basename(sourceFile, '.pine');
    content = `\n// ============================================================================\n// MERGED FROM: ${fileName}\n// ============================================================================\n\n${content}`;

    return content.trim();
  }

  performMerge(targetScript, newCode, insertionPoint) {
    const targetPath = this.findScriptPath(targetScript);
    const content = fs.readFileSync(targetPath, 'utf8');

    // Simple append strategy for now
    const mergedContent = content + '\n' + newCode;

    // Write back to file
    fs.writeFileSync(targetPath, mergedContent);

    console.log(`✅ Merged content into ${targetScript}`);
    return true;
  }

  createBackup(scriptPath) {
    const targetPath = this.findScriptPath(scriptPath);
    const fileName = path.basename(targetPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `${fileName}.pre-merge-${timestamp}`);

    fs.copyFileSync(targetPath, backupPath);
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  }

  findScriptPath(scriptName) {
    // Search in all script directories
    const searchDirs = [
      path.join(this.scriptsDir, 'core'),
      path.join(this.scriptsDir, 'foundation'),
      path.join(this.scriptsDir, 'dashboard'),
      path.join(this.scriptsDir, 'alerts'),
      this.scriptsDir
    ];

    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file === scriptName || path.basename(file, '.pine') === path.basename(scriptName, '.pine')) {
            return path.join(dir, file);
          }
        }
      }
    }

    return null;
  }

  // Archive unused script
  archiveScript(scriptPath) {
    const archiveDir = path.join(__dirname, '..', '..', 'archives', 'consolidated');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    const fileName = path.basename(scriptPath);
    const archivePath = path.join(archiveDir, fileName);

    fs.renameSync(scriptPath, archivePath);
    console.log(`📦 Archived: ${fileName} → archives/consolidated/`);
  }
}

// CLI interface
if (process.argv[2] === 'merge') {
  const merger = new BTMMSmartMerger();
  const sourceFile = process.argv[3];
  const targetScript = process.argv[4];

  if (!sourceFile || !targetScript) {
    console.log('Usage: node es-smart-merger.mjs merge <source-file> <target-script>');
    process.exit(1);
  }

  merger.mergeIntoExistingScript(sourceFile, targetScript);
}

export default BTMMSmartMerger;
