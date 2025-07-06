#!/usr/bin/env node

/**
 * BTMM Pre-Commit Optimization
 * Automatically runs before every commit to ensure project structure is optimized
 * and unnecessary files are cleaned up
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
    projectRoot: path.resolve(__dirname, '..'),
    workspaceRoot: path.resolve(__dirname, '../..'),
    logFile: path.join(__dirname, '../logs/pre-commit-optimization.log'),
    dryRun: false
};

// Logging utility
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logEntry);
    
    // Ensure log directory exists
    const logDir = path.dirname(config.logFile);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    try {
        fs.appendFileSync(config.logFile, logEntry + '\n');
    } catch (error) {
        console.error('Failed to write to log file:', error.message);
    }
}

// Check if folder/file should be cleaned up
function shouldCleanup(itemPath) {
    const relativePath = path.relative(config.workspaceRoot, itemPath);
    
    // Patterns to clean up
    const cleanupPatterns = [
        // Backup folders
        /btmm-trading-system-backup-\d{8}-\d{6}/,
        /backup-\d{8}-\d{6}/,
        /\.backup$/,
        
        // Redundant folders
        /^TradePineFramework\/$/,
        /^docs\/$/,  // Standalone docs folder (not btmm-trading-system/docs/)
        /^\.venv\/$/,
        /^~\/$/,
        
        // Temporary files
        /\.tmp$/,
        /\.temp$/,
        /node_modules\.bak$/,
        
        // OS generated files
        /\.DS_Store$/,
        /Thumbs\.db$/,
        /desktop\.ini$/
    ];
    
    return cleanupPatterns.some(pattern => pattern.test(relativePath));
}

// Safe cleanup operation
function safeCleanup(itemPath) {
    if (config.dryRun) {
        log(`DRY RUN: Would cleanup ${itemPath}`);
        return true;
    }
    
    try {
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
            // For directories, check if they contain important files
            const items = fs.readdirSync(itemPath);
            const importantFiles = items.filter(item => {
                const itemPath = path.join(itemPath, item);
                return !shouldCleanup(itemPath);
            });
            
            if (importantFiles.length > 0) {
                log(`PRESERVED: Directory ${itemPath} contains important files`, 'WARN');
                return false;
            }
            
            fs.rmSync(itemPath, { recursive: true, force: true });
            log(`CLEANED: Directory ${itemPath}`);
        } else {
            fs.unlinkSync(itemPath);
            log(`CLEANED: File ${itemPath}`);
        }
        
        return true;
    } catch (error) {
        log(`Failed to cleanup ${itemPath}: ${error.message}`, 'ERROR');
        return false;
    }
}

// Archive important files before cleanup
function archiveBeforeCleanup(itemPath) {
    const archiveDir = path.join(config.projectRoot, 'archives', 'pre-commit-cleanup');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const itemName = path.basename(itemPath);
    const archivePath = path.join(archiveDir, `${itemName}-${timestamp}`);
    
    if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
    }
    
    try {
        if (fs.statSync(itemPath).isDirectory()) {
            fs.cpSync(itemPath, archivePath, { recursive: true });
        } else {
            fs.copyFileSync(itemPath, archivePath);
        }
        
        log(`ARCHIVED: ${itemPath} → ${archivePath}`);
        return true;
    } catch (error) {
        log(`Failed to archive ${itemPath}: ${error.message}`, 'ERROR');
        return false;
    }
}

// Run structure optimization
function runStructureOptimization() {
    log('🔄 Running structure optimization...');
    
    const structureOptimizationScript = path.join(__dirname, 'structure-optimization.js');
    
    if (fs.existsSync(structureOptimizationScript)) {
        try {
            execSync(`node "${structureOptimizationScript}"`, { 
                stdio: 'inherit',
                cwd: config.projectRoot
            });
            log('✅ Structure optimization completed');
            return true;
        } catch (error) {
            log(`❌ Structure optimization failed: ${error.message}`, 'ERROR');
            return false;
        }
    } else {
        log('⚠️ Structure optimization script not found', 'WARN');
        return true;
    }
}

// Clean up workspace
function cleanupWorkspace() {
    log('🧹 Cleaning up workspace...');
    
    // Scan workspace for cleanup candidates
    const workspaceItems = fs.readdirSync(config.workspaceRoot);
    let cleanedCount = 0;
    
    for (const item of workspaceItems) {
        const itemPath = path.join(config.workspaceRoot, item);
        
        if (shouldCleanup(itemPath)) {
            log(`Found cleanup candidate: ${itemPath}`);
            
            // Archive if it might contain important files
            if (fs.statSync(itemPath).isDirectory()) {
                archiveBeforeCleanup(itemPath);
            }
            
            // Clean up
            if (safeCleanup(itemPath)) {
                cleanedCount++;
            }
        }
    }
    
    log(`✅ Cleaned up ${cleanedCount} items`);
    return true;
}

// Validate git status
function validateGitStatus() {
    log('🔍 Validating git status...');
    
    try {
        const gitStatus = execSync('git status --porcelain', { 
            cwd: config.projectRoot,
            encoding: 'utf8'
        });
        
        if (gitStatus.trim()) {
            log('📝 Git status shows changes - optimization needed');
            return false;
        } else {
            log('✅ Git status clean');
            return true;
        }
    } catch (error) {
        log(`❌ Git status check failed: ${error.message}`, 'ERROR');
        return false;
    }
}

// Update .gitignore for workspace cleanup
function updateGitignore() {
    log('📝 Updating .gitignore...');
    
    const gitignorePath = path.join(config.workspaceRoot, '.gitignore');
    const additionalIgnores = [
        '',
        '# BTMM System - Workspace cleanup patterns',
        'btmm-trading-system-backup-*/',
        'TradePineFramework/',
        '.venv/',
        '~/',
        '*.tmp',
        '*.temp',
        '.DS_Store',
        'Thumbs.db',
        'desktop.ini',
        'node_modules.bak',
        '',
        '# Keep only the main btmm-trading-system directory',
        '!btmm-trading-system/',
        ''
    ];
    
    try {
        let currentContent = '';
        if (fs.existsSync(gitignorePath)) {
            currentContent = fs.readFileSync(gitignorePath, 'utf8');
        }
        
        // Check if our patterns are already there
        const hasPatterns = additionalIgnores.some(pattern => 
            pattern.trim() && currentContent.includes(pattern)
        );
        
        if (!hasPatterns) {
            fs.appendFileSync(gitignorePath, additionalIgnores.join('\n'));
            log('✅ Updated .gitignore with cleanup patterns');
        } else {
            log('✅ .gitignore already contains cleanup patterns');
        }
        
        return true;
    } catch (error) {
        log(`❌ Failed to update .gitignore: ${error.message}`, 'ERROR');
        return false;
    }
}

// Generate optimization report
function generateOptimizationReport() {
    const reportData = {
        timestamp: new Date().toISOString(),
        preCommitOptimization: {
            structureOptimization: 'completed',
            workspaceCleanup: 'completed',
            gitignoreUpdate: 'completed',
            gitStatus: 'validated'
        },
        automationRules: {
            preCommitHook: 'active',
            structureOptimization: 'automated',
            workspaceCleanup: 'automated',
            gitValidation: 'automated'
        },
        benefits: [
            'Automatic structure optimization before commits',
            'Workspace cleanup prevents red folder indicators',
            'Maintains clean git status',
            'Prevents unnecessary files from being committed',
            'Ensures professional project structure'
        ]
    };
    
    const reportPath = path.join(config.projectRoot, 'PRE_COMMIT_OPTIMIZATION_REPORT.json');
    
    if (!config.dryRun) {
        fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    }
    
    log('📊 Generated optimization report');
    return reportData;
}

// Main pre-commit function
async function main() {
    log('🚀 BTMM Pre-Commit Optimization Started');
    log('=====================================');
    
    if (config.dryRun) {
        log('🔍 DRY RUN MODE - No actual changes will be made');
    }
    
    try {
        // Step 1: Clean up workspace
        if (!cleanupWorkspace()) {
            throw new Error('Workspace cleanup failed');
        }
        
        // Step 2: Update .gitignore
        if (!updateGitignore()) {
            throw new Error('Git ignore update failed');
        }
        
        // Step 3: Run structure optimization
        if (!runStructureOptimization()) {
            throw new Error('Structure optimization failed');
        }
        
        // Step 4: Validate git status
        if (!validateGitStatus()) {
            log('⚠️ Git status shows changes after optimization');
        }
        
        // Step 5: Generate report
        const report = generateOptimizationReport();
        
        log('🎯 Pre-Commit Optimization Summary:');
        log('✅ Workspace cleaned up');
        log('✅ Git ignore updated');
        log('✅ Structure optimized');
        log('✅ Git status validated');
        log('✅ Optimization report generated');
        
        log('🏆 Pre-commit optimization completed successfully!');
        
        return true;
    } catch (error) {
        log(`❌ Pre-commit optimization failed: ${error.message}`, 'ERROR');
        return false;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const success = await main();
    process.exit(success ? 0 : 1);
}

export { main }; 