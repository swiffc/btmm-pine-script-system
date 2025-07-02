// dependency-tracker.js - BTMM Dependency Tracking System
const fs = require('fs');
const path = require('path');

class BTMMDependencyTracker {
  constructor() {
    this.dependencies = new Map();
    this.dataWindowOutputs = new Map();
    this.inputSources = new Map();
    this.scriptsDir = path.join(__dirname, '..', 'scripts');
  }

  // Scan all BTMM files for data window outputs
  scanDataWindowOutputs() {
    console.log('🔍 Scanning for data window outputs...\n');
    const files = this.getBTMMFiles();
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const outputs = this.extractDataWindowOutputs(content);
      this.dataWindowOutputs.set(file, outputs);
      
      if (outputs.length > 0) {
        console.log(`📊 ${path.basename(file)}:`);
        outputs.forEach(output => console.log(`   - ${output}`));
        console.log('');
      }
    });
  }

  // Extract plot(..., display=display.data_window) declarations
  extractDataWindowOutputs(content) {
    const outputs = [];
    const plotRegex = /plot\([^,]+,\s*"([^"]+)"[^)]*display\s*=\s*display\.data_window\)/g;
    let match;
    
    while ((match = plotRegex.exec(content)) !== null) {
      outputs.push(match[1]); // Capture the output name
    }
    
    return outputs;
  }

  // Scan all files for input.source() dependencies
  scanInputSources() {
    console.log('🔗 Scanning for input source dependencies...\n');
    const files = this.getBTMMFiles();
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const sources = this.extractInputSources(content);
      this.inputSources.set(file, sources);
      
      if (sources.length > 0) {
        console.log(`⚡ ${path.basename(file)}:`);
        sources.forEach(source => console.log(`   - ${source.variable} ← "${source.description}"`));
        console.log('');
      }
    });
  }

  // Extract input.source() declarations
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

  // Validate that all input sources have corresponding outputs
  validateIntegrations() {
    console.log('🧪 Validating integrations...\n');
    const issues = [];
    
    this.inputSources.forEach((sources, file) => {
      sources.forEach(source => {
        const matchingOutput = this.findMatchingOutput(source.description);
        if (!matchingOutput) {
          issues.push({
            file: path.basename(file),
            issue: `Missing data source: ${source.description}`,
            variable: source.variable
          });
        } else {
          console.log(`✅ ${path.basename(file)} → ${source.description} (from ${path.basename(matchingOutput)})`);
        }
      });
    });
    
    return issues;
  }

  findMatchingOutput(description) {
    // Clean the description to match output names
    const cleanDesc = description.replace(' Source', '').replace(/\s+/g, '_');
    
    for (const [file, outputs] of this.dataWindowOutputs) {
      const match = outputs.find(output => 
        output.includes(cleanDesc) || 
        cleanDesc.includes(output.replace(/_/g, ' ')) ||
        this.fuzzyMatch(output, cleanDesc)
      );
      if (match) {
        return file;
      }
    }
    return null;
  }

  fuzzyMatch(output, description) {
    const outputWords = output.toLowerCase().split('_');
    const descWords = description.toLowerCase().split(/[\s_]/);
    
    return outputWords.some(word => descWords.includes(word)) ||
           descWords.some(word => outputWords.includes(word));
  }

  // Auto-fix missing dependencies
  autoFixDependencies() {
    const issues = this.validateIntegrations();
    
    if (issues.length === 0) {
      console.log('\n✅ All BTMM integrations are valid\n');
      return true;
    }

    console.log('\n🚨 Integration issues found:\n');
    issues.forEach(issue => {
      console.log(`❌ ${issue.file}:`);
      console.log(`   Missing: ${issue.issue}`);
      console.log(`   Variable: ${issue.variable}`);
      console.log(`   Suggested fix: Add corresponding plot() in source script\n`);
    });
    
    return false;
  }

  // Generate integration health report
  generateHealthReport() {
    console.log('📋 BTMM Integration Health Report');
    console.log('='.repeat(50));
    console.log(`Generated: ${new Date().toISOString()}\n`);

    const totalScripts = this.getBTMMFiles().length;
    const totalOutputs = Array.from(this.dataWindowOutputs.values()).flat().length;
    const totalInputs = Array.from(this.inputSources.values()).flat().length;
    
    console.log(`📊 Statistics:`);
    console.log(`   Scripts: ${totalScripts}/10`);
    console.log(`   Data Window Outputs: ${totalOutputs}`);
    console.log(`   Input Sources: ${totalInputs}\n`);

    this.scanDataWindowOutputs();
    this.scanInputSources();
    const isHealthy = this.autoFixDependencies();

    console.log('🎯 Script Purpose Validation:');
    this.validateScriptPurposes();

    return {
      isHealthy,
      totalScripts,
      totalOutputs,
      totalInputs,
      issues: isHealthy ? [] : this.validateIntegrations()
    };
  }

  validateScriptPurposes() {
    const expectedPurposes = {
      'BTMMFoundation.pine': 'Core library functions',
      'BTMM_EMA_System.pine': 'EMA calculations and stack analysis',
      'BTMM_Asian_Range.pine': 'Asian session range detection',
      'BTMM_HTF_Bias.pine': 'Higher timeframe bias analysis',
      'BTMM_Pattern_Detection.pine': 'Market maker patterns',
      'BTMM_Entry_System.pine': 'Entry signal generation',
      'BTMM_Risk_Management.pine': 'Position and risk management',
      'BTMM_Stop_Hunt_Detection.pine': 'Stop hunt and liquidity analysis',
      'BTMM_Master_Dashboard.pine': 'Comprehensive dashboard',
      'BTMM_Alert_System.pine': 'Alert management'
    };

    Object.entries(expectedPurposes).forEach(([filename, purpose]) => {
      const fullPath = this.findScriptPath(filename);
      if (fullPath && fs.existsSync(fullPath)) {
        console.log(`✅ ${filename} - ${purpose}`);
      } else {
        console.log(`❌ ${filename} - MISSING (${purpose})`);
      }
    });
    console.log('');
  }

  findScriptPath(filename) {
    const possiblePaths = [
      path.join(this.scriptsDir, filename),
      path.join(this.scriptsDir, 'core', filename),
      path.join(this.scriptsDir, 'foundation', filename),
      path.join(this.scriptsDir, 'dashboard', filename),
      path.join(this.scriptsDir, 'alerts', filename)
    ];

    return possiblePaths.find(p => fs.existsSync(p));
  }

  getBTMMFiles() {
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
}

// Usage
if (require.main === module) {
  const tracker = new BTMMDependencyTracker();
  const report = tracker.generateHealthReport();
  
  process.exit(report.isHealthy ? 0 : 1);
}

module.exports = BTMMDependencyTracker; 