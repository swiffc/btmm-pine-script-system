// integration-health-check.js - BTMM Integration Health Monitor
const fs = require('fs');
const path = require('path');
const BTMMDependencyTracker = require('./dependency-tracker');

class IntegrationHealthChecker extends BTMMDependencyTracker {
  constructor() {
    super();
    this.healthScore = 0;
    this.maxScore = 100;
    this.issues = [];
    this.warnings = [];
  }

  // Comprehensive health check
  performHealthCheck() {
    console.log('🏥 BTMM Integration Health Check');
    console.log('='.repeat(50));
    console.log(`Started: ${new Date().toISOString()}\n`);

    this.healthScore = 0;
    this.issues = [];
    this.warnings = [];

    // 1. Check script count and availability (20 points)
    this.checkScriptAvailability();

    // 2. Check data window output integrity (25 points)
    this.checkDataWindowIntegrity();

    // 3. Check input source dependencies (25 points)
    this.checkInputSourceIntegrity();

    // 4. Check function signature integrity (15 points)
    this.checkFunctionSignatures();

    // 5. Check cross-script communication (15 points)
    this.checkCrossScriptCommunication();

    // Generate final report
    this.generateHealthReport();

    return {
      score: this.healthScore,
      maxScore: this.maxScore,
      percentage: Math.round((this.healthScore / this.maxScore) * 100),
      issues: this.issues,
      warnings: this.warnings,
      status: this.getHealthStatus()
    };
  }

  checkScriptAvailability() {
    console.log('📊 Checking script availability...\n');
    
    const expectedScripts = [
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

    let availableCount = 0;
    let correctLocation = 0;

    expectedScripts.forEach(script => {
      const scriptPath = this.findScriptPath(script);
      if (scriptPath) {
        availableCount++;
        console.log(`✅ ${script} - Found`);
        
        // Check if it's in the correct location based on its purpose
        if (this.isInCorrectLocation(script, scriptPath)) {
          correctLocation++;
        } else {
          this.warnings.push(`⚠️  ${script} may be in wrong directory`);
        }
      } else {
        console.log(`❌ ${script} - MISSING`);
        this.issues.push(`Missing required script: ${script}`);
      }
    });

    const availabilityScore = (availableCount / expectedScripts.length) * 15;
    const locationScore = (correctLocation / expectedScripts.length) * 5;
    const totalScore = availabilityScore + locationScore;

    console.log(`\n📈 Script Availability: ${availableCount}/${expectedScripts.length} (${Math.round(availabilityScore)}pts)`);
    console.log(`📁 Correct Locations: ${correctLocation}/${expectedScripts.length} (${Math.round(locationScore)}pts)`);
    
    this.healthScore += totalScore;
  }

  isInCorrectLocation(script, scriptPath) {
    const expectedLocations = {
      'BTMMFoundation.pine': 'foundation',
      'BTMM_Master_Dashboard.pine': 'dashboard',
      'BTMM_Alert_System.pine': 'alerts'
    };

    const expectedDir = expectedLocations[script];
    if (expectedDir) {
      return scriptPath.includes(expectedDir);
    }
    
    return true; // If no specific location required, it's okay
  }

  checkDataWindowIntegrity() {
    console.log('\n📊 Checking data window output integrity...\n');
    
    this.scanDataWindowOutputs();
    
    const expectedOutputs = {
      'BTMM_EMA_System.pine': ['Bull_Stack', 'Bear_Stack', 'Stack_Strength'],
      'BTMM_HTF_Bias.pine': ['HTF_Bias', 'Bullish_Setup', 'Bearish_Setup'],
      'BTMM_Asian_Range.pine': ['Asian_Range', 'Session_Active'],
      'BTMM_Pattern_Detection.pine': ['Pattern_Detected', 'Pattern_Type'],
      'BTMM_Entry_System.pine': ['Entry_Signal', 'Signal_Strength']
    };

    let totalExpected = 0;
    let totalFound = 0;

    Object.entries(expectedOutputs).forEach(([filename, outputs]) => {
      const scriptPath = this.findScriptPath(filename);
      if (scriptPath) {
        const actualOutputs = this.dataWindowOutputs.get(scriptPath) || [];
        
        outputs.forEach(expectedOutput => {
          totalExpected++;
          const found = actualOutputs.some(actual => 
            actual.includes(expectedOutput) || expectedOutput.includes(actual)
          );
          
          if (found) {
            totalFound++;
            console.log(`✅ ${filename}: ${expectedOutput}`);
          } else {
            console.log(`❌ ${filename}: ${expectedOutput} - MISSING`);
            this.issues.push(`Missing data output: ${expectedOutput} in ${filename}`);
          }
        });
      } else {
        totalExpected += outputs.length;
        this.issues.push(`Script not found for output validation: ${filename}`);
      }
    });

    const outputScore = (totalFound / totalExpected) * 25;
    console.log(`\n📈 Data Window Integrity: ${totalFound}/${totalExpected} (${Math.round(outputScore)}pts)`);
    
    this.healthScore += outputScore;
  }

  checkInputSourceIntegrity() {
    console.log('\n🔗 Checking input source integrity...\n');
    
    this.scanInputSources();
    
    let totalInputs = 0;
    let validInputs = 0;

    this.inputSources.forEach((sources, file) => {
      sources.forEach(source => {
        totalInputs++;
        const hasOutput = this.findMatchingOutput(source.description);
        
        if (hasOutput) {
          validInputs++;
          console.log(`✅ ${path.basename(file)}: ${source.description}`);
        } else {
          console.log(`❌ ${path.basename(file)}: ${source.description} - NO MATCHING OUTPUT`);
          this.issues.push(`Orphaned input source: ${source.description} in ${path.basename(file)}`);
        }
      });
    });

    const inputScore = totalInputs > 0 ? (validInputs / totalInputs) * 25 : 25;
    console.log(`\n📈 Input Source Integrity: ${validInputs}/${totalInputs} (${Math.round(inputScore)}pts)`);
    
    this.healthScore += inputScore;
  }

  checkFunctionSignatures() {
    console.log('\n🔧 Checking protected function signatures...\n');
    
    const protectedFunctions = {
      'BTMMFoundation.pine': [
        { name: 'session_and_cycle', params: 0 },
        { name: 'timeframe_classification', params: 0 },
        { name: 'ema_stack_analysis', params: 5 }
      ]
    };

    let totalFunctions = 0;
    let validSignatures = 0;

    Object.entries(protectedFunctions).forEach(([filename, functions]) => {
      const scriptPath = this.findScriptPath(filename);
      if (scriptPath) {
        const content = fs.readFileSync(scriptPath, 'utf8');
        
        functions.forEach(func => {
          totalFunctions++;
          
          if (this.validateFunctionSignature(content, func.name, func.params)) {
            validSignatures++;
            console.log(`✅ ${filename}: ${func.name}()`);
          } else {
            console.log(`❌ ${filename}: ${func.name}() - SIGNATURE CHANGED`);
            this.issues.push(`Function signature changed: ${func.name} in ${filename}`);
          }
        });
      } else {
        totalFunctions += functions.length;
        this.issues.push(`Cannot check signatures in missing file: ${filename}`);
      }
    });

    const signatureScore = totalFunctions > 0 ? (validSignatures / totalFunctions) * 15 : 15;
    console.log(`\n📈 Function Signature Integrity: ${validSignatures}/${totalFunctions} (${Math.round(signatureScore)}pts)`);
    
    this.healthScore += signatureScore;
  }

  validateFunctionSignature(content, functionName, expectedParamCount) {
    const funcRegex = new RegExp(`${functionName}\\s*\\(([^)]*)\\)`, 'g');
    const matches = content.match(funcRegex);
    
    if (!matches) return false;
    
    const match = matches[0];
    const params = match.match(/\([^)]*\)/)[0];
    const paramCount = params === '()' ? 0 : (params.match(/,/g) || []).length + 1;
    
    return paramCount === expectedParamCount;
  }

  checkCrossScriptCommunication() {
    console.log('\n📡 Checking cross-script communication...\n');
    
    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies();
    
    // Check for broken communication paths
    const brokenPaths = this.detectBrokenCommunicationPaths();
    
    let communicationScore = 15;
    
    if (circularDeps.length > 0) {
      communicationScore -= 5;
      console.log(`⚠️  Circular dependencies detected: ${circularDeps.length}`);
      this.warnings.push(`Circular dependencies: ${circularDeps.join(', ')}`);
    }
    
    if (brokenPaths.length > 0) {
      communicationScore -= 10;
      console.log(`❌ Broken communication paths: ${brokenPaths.length}`);
      brokenPaths.forEach(path => {
        this.issues.push(`Broken communication: ${path}`);
      });
    }
    
    if (circularDeps.length === 0 && brokenPaths.length === 0) {
      console.log(`✅ All communication paths are healthy`);
    }

    console.log(`\n📈 Cross-Script Communication: (${Math.round(communicationScore)}pts)`);
    
    this.healthScore += communicationScore;
  }

  detectCircularDependencies() {
    // Simplified circular dependency detection
    const dependencies = new Map();
    
    this.inputSources.forEach((sources, file) => {
      const fileName = path.basename(file);
      dependencies.set(fileName, []);
      
      sources.forEach(source => {
        const outputFile = this.findMatchingOutput(source.description);
        if (outputFile) {
          dependencies.get(fileName).push(path.basename(outputFile));
        }
      });
    });

    const circular = [];
    // Basic circular detection (A → B → A)
    dependencies.forEach((deps, file) => {
      deps.forEach(dep => {
        const depDeps = dependencies.get(dep) || [];
        if (depDeps.includes(file)) {
          circular.push(`${file} ↔ ${dep}`);
        }
      });
    });

    return [...new Set(circular)]; // Remove duplicates
  }

  detectBrokenCommunicationPaths() {
    const broken = [];
    
    this.inputSources.forEach((sources, file) => {
      sources.forEach(source => {
        if (!this.findMatchingOutput(source.description)) {
          broken.push(`${path.basename(file)} → ${source.description}`);
        }
      });
    });

    return broken;
  }

  generateHealthReport() {
    console.log('\n' + '='.repeat(50));
    console.log('🏥 BTMM INTEGRATION HEALTH REPORT');
    console.log('='.repeat(50));
    
    const percentage = Math.round((this.healthScore / this.maxScore) * 100);
    const status = this.getHealthStatus();
    
    console.log(`\n📊 Overall Health Score: ${this.healthScore}/${this.maxScore} (${percentage}%)`);
    console.log(`🎯 Health Status: ${status.emoji} ${status.text}\n`);

    // Score breakdown
    console.log('📈 Score Breakdown:');
    console.log(`   Script Availability: 20 points max`);
    console.log(`   Data Window Integrity: 25 points max`);
    console.log(`   Input Source Integrity: 25 points max`);
    console.log(`   Function Signatures: 15 points max`);
    console.log(`   Cross-Script Communication: 15 points max\n`);

    // Issues summary
    if (this.issues.length > 0) {
      console.log('🚨 Critical Issues:');
      this.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      console.log('');
    }

    // Warnings summary
    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
      console.log('');
    }

    // Recommendations
    console.log('💡 Recommendations:');
    if (percentage >= 90) {
      console.log('   ✅ System is in excellent health');
      console.log('   🔄 Continue regular monitoring');
    } else if (percentage >= 75) {
      console.log('   🔧 Address minor issues for optimal performance');
      console.log('   📊 Monitor closely for degradation');
    } else if (percentage >= 50) {
      console.log('   ⚠️  Significant issues detected');
      console.log('   🚨 Immediate attention required');
      console.log('   🔄 Consider rollback if issues persist');
    } else {
      console.log('   🚨 CRITICAL: System integrity compromised');
      console.log('   🔄 Emergency rollback recommended');
      console.log('   🛠️  Full system validation required');
    }

    console.log(`\nCompleted: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
  }

  getHealthStatus() {
    const percentage = Math.round((this.healthScore / this.maxScore) * 100);
    
    if (percentage >= 90) {
      return { emoji: '💚', text: 'EXCELLENT' };
    } else if (percentage >= 75) {
      return { emoji: '💛', text: 'GOOD' };
    } else if (percentage >= 50) {
      return { emoji: '🧡', text: 'NEEDS ATTENTION' };
    } else {
      return { emoji: '❤️', text: 'CRITICAL' };
    }
  }

  // Generate daily health monitoring
  scheduleDailyCheck() {
    console.log('⏰ Setting up daily health monitoring...\n');
    
    const checkInterval = 24 * 60 * 60 * 1000; // 24 hours
    
    setInterval(() => {
      console.log('🕐 Automated daily health check starting...\n');
      const results = this.performHealthCheck();
      
      if (results.percentage < 75) {
        console.log('🚨 ALERT: Health degradation detected!');
        console.log('📧 Notification should be sent to development team');
      }
    }, checkInterval);
    
    console.log('✅ Daily health monitoring active');
  }
}

// Usage
if (require.main === module) {
  const healthChecker = new IntegrationHealthChecker();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--monitor')) {
    healthChecker.scheduleDailyCheck();
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n👋 Health monitoring stopped');
      process.exit(0);
    });
  } else {
    const results = healthChecker.performHealthCheck();
    
    // Exit with error code if health is poor
    process.exit(results.percentage >= 75 ? 0 : 1);
  }
}

module.exports = IntegrationHealthChecker; 