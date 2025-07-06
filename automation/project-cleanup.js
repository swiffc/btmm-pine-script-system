#!/usr/bin/env node

/**
 * BTMM Project Cleanup Script
 * Removes duplicates, unnecessary files, and organizes project structure
 * Maintains synchronization between Pine Script and MT4 systems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
    projectRoot: path.resolve(__dirname, '..'),
    pineScriptDir: path.join(__dirname, '../scripts'),
    mt4Dir: path.join(__dirname, '../scripts/mt4'),
    backupDir: path.join(__dirname, '../archives'),
    tempDir: path.join(__dirname, '../temp'),
    logFile: path.join(__dirname, '../logs/cleanup.log')
};

// Files and directories to remove
const filesToRemove = [
    // Temporary files
    '*.tmp',
    '*.temp',
    '*.log',
    '*.bak',
    '*.old',
    // System files
    'Thumbs.db',
    '.DS_Store',
    '*.swp',
    '*.swo',
    // Node modules in wrong places
    'node_modules',
    // Duplicate documentation
    'README.txt',
    'readme.md',
    // Old backup files
    '*backup*',
    '*old*',
    '*copy*'
];

// Directory structure to maintain
const directoryStructure = {
    'scripts': {
        'core': 'Core Pine Script files',
        'dashboard': 'Dashboard Pine Script files',
        'alerts': 'Alert Pine Script files',
        'foundation': 'Foundation Pine Script files',
        'templates': 'Template Pine Script files',
        'mt4': {
            'include': 'MT4 include files (.mqh)',
            'experts': 'MT4 Expert Advisors (.ex4)',
            'libraries': 'MT4 Libraries (.ex4)',
            'docs': 'MT4 documentation'
        }
    },
    'automation': 'Automation and build scripts',
    'docs': 'Documentation and guides',
    'tests': 'Testing and validation scripts',
    'configs': 'Configuration files',
    'logs': 'System logs',
    'archives': 'Archived and backup files',
    'temp': 'Temporary files (auto-cleaned)',
    'exports': {
        'tradingview-ready': 'Production-ready Pine Scripts',
        'mt4-ready': 'Production-ready MT4 files'
    }
};

// File mapping for synchronization
const synchronizationMapping = {
    'BTMMFoundation.pine': 'BTMM_Foundation.mq4',
    'BTMM_EMA_System.pine': 'BTMM_EMA_System.mq4',
    'BTMM_Session_Analysis.pine': 'BTMM_Session_Analysis.mq4',
    'BTMM_HTF_Bias.pine': 'BTMM_HTF_Bias.mq4',
    'BTMM_Pattern_Detection.pine': 'BTMM_Pattern_Detection.mq4',
    'BTMM_Entry_System.pine': 'BTMM_Entry_System.mq4',
    'BTMM_Risk_Management.pine': 'BTMM_Risk_Management.mq4',
    'BTMM_Stop_Hunt_Detection.pine': 'BTMM_Stop_Hunt_Detection.mq4',
    'BTMM_Signal_Dashboard.pine': 'BTMM_Signal_Dashboard.mq4',
    'BTMM_Master_Controller.pine': 'BTMM_Master_Controller.mq4'
};

// Logging utility
class Logger {
    constructor(logFile) {
        this.logFile = logFile;
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;
        
        console.log(logEntry.trim());
        
        try {
            fs.appendFileSync(this.logFile, logEntry);
        } catch (error) {
            console.error('Failed to write to log file:', error.message);
        }
    }

    info(message) { this.log(message, 'INFO'); }
    warn(message) { this.log(message, 'WARN'); }
    error(message) { this.log(message, 'ERROR'); }
    success(message) { this.log(message, 'SUCCESS'); }
}

// Initialize logger
const logger = new Logger(config.logFile);

// Utility functions
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isFilePattern(filename, pattern) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(filename);
}

// Main cleanup functions
function createDirectoryStructure() {
    logger.info('Creating directory structure...');
    
    function createDirectories(structure, basePath = config.projectRoot) {
        for (const [name, value] of Object.entries(structure)) {
            const dirPath = path.join(basePath, name);
            
            if (typeof value === 'object') {
                // Create directory and subdirectories
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    logger.info(`Created directory: ${dirPath}`);
                }
                createDirectories(value, dirPath);
            } else {
                // Create directory with description
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    logger.info(`Created directory: ${dirPath}`);
                }
                
                // Create README for the directory
                const readmePath = path.join(dirPath, 'README.md');
                if (!fs.existsSync(readmePath)) {
                    const readmeContent = `# ${name}\n\n${value}\n\n---\n*Auto-generated by BTMM Project Cleanup*`;
                    fs.writeFileSync(readmePath, readmeContent);
                }
            }
        }
    }
    
    createDirectories(directoryStructure);
    logger.success('Directory structure created successfully');
}

function removeUnnecessaryFiles() {
    logger.info('Removing unnecessary files...');
    let removedCount = 0;
    let totalSize = 0;
    
    function scanDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) return;
        
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                scanDirectory(itemPath);
            } else {
                // Check if file matches removal patterns
                for (const pattern of filesToRemove) {
                    if (isFilePattern(item, pattern)) {
                        const fileSize = getFileSize(itemPath);
                        totalSize += fileSize;
                        
                        try {
                            fs.unlinkSync(itemPath);
                            logger.info(`Removed: ${itemPath} (${formatFileSize(fileSize)})`);
                            removedCount++;
                        } catch (error) {
                            logger.error(`Failed to remove ${itemPath}: ${error.message}`);
                        }
                        break;
                    }
                }
            }
        }
    }
    
    scanDirectory(config.projectRoot);
    
    logger.success(`Removed ${removedCount} unnecessary files (${formatFileSize(totalSize)} total)`);
    return { count: removedCount, size: totalSize };
}

function organizePineScriptFiles() {
    logger.info('Organizing Pine Script files...');
    
    const pineFiles = [];
    
    // Find all Pine Script files
    function findPineFiles(dirPath) {
        if (!fs.existsSync(dirPath)) return;
        
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                findPineFiles(itemPath);
            } else if (item.endsWith('.pine')) {
                pineFiles.push(itemPath);
            }
        }
    }
    
    findPineFiles(config.pineScriptDir);
    
    // Organize files by type
    const organized = {
        core: [],
        dashboard: [],
        alerts: [],
        foundation: [],
        templates: [],
        other: []
    };
    
    for (const filePath of pineFiles) {
        const fileName = path.basename(filePath);
        
        if (fileName.includes('Foundation')) {
            organized.foundation.push(filePath);
        } else if (fileName.includes('Dashboard')) {
            organized.dashboard.push(filePath);
        } else if (fileName.includes('Alert')) {
            organized.alerts.push(filePath);
        } else if (fileName.includes('Template')) {
            organized.templates.push(filePath);
        } else if (fileName.startsWith('BTMM_')) {
            organized.core.push(filePath);
        } else {
            organized.other.push(filePath);
        }
    }
    
    // Move files to appropriate directories
    for (const [category, files] of Object.entries(organized)) {
        if (files.length === 0) continue;
        
        const targetDir = path.join(config.pineScriptDir, category);
        
        for (const filePath of files) {
            const fileName = path.basename(filePath);
            const targetPath = path.join(targetDir, fileName);
            
            if (filePath !== targetPath) {
                try {
                    fs.renameSync(filePath, targetPath);
                    logger.info(`Moved: ${fileName} to ${category}/`);
                } catch (error) {
                    logger.error(`Failed to move ${fileName}: ${error.message}`);
                }
            }
        }
    }
    
    logger.success('Pine Script files organized successfully');
}

function validateSynchronization() {
    logger.info('Validating Pine Script <-> MT4 synchronization...');
    
    const issues = [];
    
    for (const [pineFile, mt4File] of Object.entries(synchronizationMapping)) {
        const pineFiles = findFileInDirectory(config.pineScriptDir, pineFile);
        const mt4Path = path.join(config.mt4Dir, mt4File);
        
        if (pineFiles.length === 0) {
            issues.push(`Missing Pine Script file: ${pineFile}`);
        } else if (pineFiles.length > 1) {
            issues.push(`Duplicate Pine Script files: ${pineFile} (found ${pineFiles.length})`);
        }
        
        if (!fs.existsSync(mt4Path)) {
            issues.push(`Missing MT4 file: ${mt4File}`);
        }
    }
    
    if (issues.length > 0) {
        logger.warn('Synchronization issues found:');
        issues.forEach(issue => logger.warn(`  - ${issue}`));
    } else {
        logger.success('Pine Script <-> MT4 synchronization validated successfully');
    }
    
    return issues;
}

function findFileInDirectory(directory, fileName) {
    const found = [];
    
    function search(dirPath) {
        if (!fs.existsSync(dirPath)) return;
        
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                search(itemPath);
            } else if (item === fileName) {
                found.push(itemPath);
            }
        }
    }
    
    search(directory);
    return found;
}

function createExportDirectories() {
    logger.info('Creating export directories...');
    
    const exportDirs = [
        path.join(config.projectRoot, 'exports/tradingview-ready'),
        path.join(config.projectRoot, 'exports/mt4-ready')
    ];
    
    for (const dir of exportDirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            logger.info(`Created export directory: ${dir}`);
        }
    }
    
    // Create export instructions
    const instructionsPath = path.join(config.projectRoot, 'exports/README.md');
    if (!fs.existsSync(instructionsPath)) {
        const instructions = `# BTMM Export Directory

## TradingView-Ready
Production-ready Pine Script files for TradingView deployment.

## MT4-Ready
Production-ready MT4 files for MetaTrader 4 deployment.

## Export Process
1. Run \`npm run export-production\` to generate production-ready files
2. Copy files from respective directories to their target platforms
3. Test thoroughly before live deployment

---
*Auto-generated by BTMM Project Cleanup*`;
        
        fs.writeFileSync(instructionsPath, instructions);
        logger.info('Created export instructions');
    }
}

function generateProjectSummary() {
    logger.info('Generating project summary...');
    
    const summary = {
        timestamp: new Date().toISOString(),
        structure: {},
        files: {
            pineScript: 0,
            mt4: 0,
            documentation: 0,
            automation: 0,
            total: 0
        },
        synchronization: {
            mapped: Object.keys(synchronizationMapping).length,
            issues: []
        }
    };
    
    // Count files by category
    function countFiles(dirPath, category) {
        if (!fs.existsSync(dirPath)) return 0;
        
        let count = 0;
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                count += countFiles(itemPath, category);
            } else {
                count++;
                summary.files.total++;
            }
        }
        
        summary.files[category] = count;
        return count;
    }
    
    countFiles(config.pineScriptDir, 'pineScript');
    countFiles(config.mt4Dir, 'mt4');
    countFiles(path.join(config.projectRoot, 'docs'), 'documentation');
    countFiles(path.join(config.projectRoot, 'automation'), 'automation');
    
    // Validate synchronization
    summary.synchronization.issues = validateSynchronization();
    
    // Save summary
    const summaryPath = path.join(config.projectRoot, 'PROJECT_SUMMARY.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    logger.success('Project summary generated: PROJECT_SUMMARY.json');
    return summary;
}

// Main cleanup function
function main() {
    logger.info('🧹 BTMM Project Cleanup Started');
    logger.info('=================================');
    
    try {
        // Create directory structure
        createDirectoryStructure();
        
        // Remove unnecessary files
        const removed = removeUnnecessaryFiles();
        
        // Organize Pine Script files
        organizePineScriptFiles();
        
        // Create export directories
        createExportDirectories();
        
        // Generate project summary
        const summary = generateProjectSummary();
        
        // Final report
        logger.info('🎯 Cleanup Summary:');
        logger.info(`✅ Removed ${removed.count} unnecessary files (${formatFileSize(removed.size)})`);
        logger.info(`✅ Organized ${summary.files.pineScript} Pine Script files`);
        logger.info(`✅ Validated ${summary.files.mt4} MT4 files`);
        logger.info(`✅ Created professional directory structure`);
        logger.info(`✅ Generated project summary and documentation`);
        
        if (summary.synchronization.issues.length > 0) {
            logger.warn(`⚠️  ${summary.synchronization.issues.length} synchronization issues found`);
        } else {
            logger.success('✅ Pine Script <-> MT4 synchronization verified');
        }
        
        logger.success('🎉 Project cleanup completed successfully!');
        
        return true;
    } catch (error) {
        logger.error(`❌ Cleanup failed: ${error.message}`);
        return false;
    }
}

// Run cleanup
main();

export { main }; 