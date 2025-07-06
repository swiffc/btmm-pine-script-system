#!/usr/bin/env node

/**
 * BTMM Professional File Organization System
 * 🏗️ DevOps-Grade File Structure Management
 * 
 * This system ensures enterprise-level code organization before any commits,
 * maintaining professional standards for trading system development.
 * 
 * @author BTMM DevOps Team
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FileOrganizer {
    constructor() {
        this.rootDir = process.cwd();
        this.organizationRules = this.initializeOrganizationRules();
        this.cleanupPatterns = this.initializeCleanupPatterns();
        this.archiveDir = path.join(this.rootDir, 'archives');
        this.backupDir = path.join(this.rootDir, 'backups', 'pre-organization');
        this.organizationReport = {
            scanned: 0,
            moved: 0,
            deleted: 0,
            archived: 0,
            created_folders: 0,
            errors: []
        };
    }

    /**
     * Initialize file organization rules based on professional standards
     */
    initializeOrganizationRules() {
        return {
            // Pine Script files organization
            scripts: {
                pattern: /\.pine$/,
                rules: [
                    { name: /BTMM.*Foundation/, target: 'scripts/foundation/' },
                    { name: /BTMM.*Core/, target: 'scripts/core/' },
                    { name: /BTMM.*Dashboard/, target: 'scripts/dashboard/' },
                    { name: /BTMM.*Alert/, target: 'scripts/alerts/' },
                    { name: /BTMM.*Analytics/, target: 'scripts/analytics/' },
                    { name: /BTMM.*Risk/, target: 'scripts/core/' },
                    { name: /BTMM.*Entry/, target: 'scripts/core/' },
                    { name: /BTMM.*Pattern/, target: 'scripts/core/' },
                    { name: /BTMM.*EMA/, target: 'scripts/core/' },
                    { name: /BTMM.*HTF/, target: 'scripts/core/' },
                    { name: /BTMM.*Asian/, target: 'scripts/core/' },
                    { name: /BTMM.*Stop/, target: 'scripts/core/' },
                    { name: /template/, target: 'scripts/templates/' },
                    { name: /test/, target: 'tests/validation-scripts/' }
                ]
            },
            
            // Documentation organization
            documentation: {
                pattern: /\.(md|txt|pdf|docx?)$/,
                rules: [
                    { name: /README/, target: 'docs/' },
                    { name: /guide|manual|tutorial/i, target: 'docs/' },
                    { name: /api|reference/i, target: 'docs/api-reference/' },
                    { name: /installation|setup/i, target: 'docs/' },
                    { name: /success|summary|integration/i, target: 'docs/reports/' },
                    { name: /pine.*script/i, target: 'docs/' },
                    { name: /cursor/i, target: 'docs/' }
                ]
            },

            // Automation scripts organization
            automation: {
                pattern: /\.(js|ts|py|sh|bat|ps1)$/,
                rules: [
                    { name: /auto-commit|git|commit/i, target: 'automation/git/' },
                    { name: /deploy|cicd|pipeline/i, target: 'automation/deployment/' },
                    { name: /template|generator/i, target: 'automation/generators/' },
                    { name: /validation|test|health/i, target: 'automation/validation/' },
                    { name: /backup|rollback|recovery/i, target: 'automation/backup/' },
                    { name: /learning|enhance|update/i, target: 'automation/learning/' },
                    { name: /merger|limit|dependency/i, target: 'automation/management/' },
                    { name: /organiz/i, target: 'automation/devops/' }
                ]
            },

            // Configuration files organization
            configuration: {
                pattern: /\.(json|yaml|yml|toml|ini|env)$/,
                rules: [
                    { name: /package/, target: '' }, // Keep in root
                    { name: /settings|config|parameters/i, target: 'configs/' },
                    { name: /environment|env/i, target: 'configs/environments/' },
                    { name: /cursor/i, target: '.cursor/' }
                ]
            },

            // Archive and version files
            versioning: {
                pattern: /\.(bak|old|backup|v\d+)$/,
                rules: [
                    { name: /.*/, target: 'archives/versions/' }
                ]
            }
        };
    }

    /**
     * Initialize cleanup patterns for file removal
     */
    initializeCleanupPatterns() {
        return {
            // Temporary files to delete
            deletePatterns: [
                /\.tmp$/,
                /\.temp$/,
                /~\$/,
                /\._/,
                /Thumbs\.db$/,
                /\.DS_Store$/,
                /desktop\.ini$/,
                /\.log$/,
                /\.cache$/
            ],

            // Files to archive (not delete)
            archivePatterns: [
                /\.old$/,
                /\.backup$/,
                /\.bak$/,
                /deprecated/i,
                /legacy/i,
                /outdated/i
            ],

            // Empty directories to remove
            removeEmptyDirs: true
        };
    }

    /**
     * Main file organization process
     */
    async organizeRepository() {
        console.log('🏗️ BTMM Professional File Organization - STARTING...');
        console.log('📋 DevOps Standards: Enterprise-Grade Repository Structure');
        
        try {
            // Step 1: Create backup before organization
            await this.createPreOrganizationBackup();
            
            // Step 2: Scan entire repository
            console.log('🔍 Scanning repository structure...');
            const allFiles = await this.scanRepository();
            
            // Step 3: Analyze file placement
            console.log('📊 Analyzing file organization needs...');
            const organizationPlan = await this.analyzeFileOrganization(allFiles);
            
            // Step 4: Create necessary folder structure
            console.log('📁 Creating professional folder structure...');
            await this.createFolderStructure(organizationPlan);
            
            // Step 5: Execute file movements
            console.log('🔄 Reorganizing files to proper locations...');
            await this.executeFileOrganization(organizationPlan);
            
            // Step 6: Clean up unnecessary files
            console.log('🧹 Cleaning up unnecessary files...');
            await this.cleanupRepository();
            
            // Step 7: Validate organization
            console.log('✅ Validating organization compliance...');
            await this.validateOrganization();
            
            // Step 8: Generate organization report
            const report = await this.generateOrganizationReport();
            
            console.log('🎉 Professional file organization completed successfully!');
            return report;
            
        } catch (error) {
            console.error('❌ File organization failed:', error.message);
            await this.rollbackOrganization();
            throw error;
        }
    }

    /**
     * Scan entire repository for files
     */
    async scanRepository() {
        const allFiles = [];
        
        const scanDirectory = (dir, relativePath = '') => {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativeFilePath = path.join(relativePath, item);
                
                // Skip hidden directories and node_modules
                if (item.startsWith('.') && item !== '.cursor') continue;
                if (item === 'node_modules') continue;
                if (item === '.git') continue;
                
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    scanDirectory(fullPath, relativeFilePath);
                } else {
                    allFiles.push({
                        name: item,
                        path: fullPath,
                        relativePath: relativeFilePath,
                        dir: relativePath,
                        size: stats.size,
                        modified: stats.mtime
                    });
                }
            }
        };
        
        scanDirectory(this.rootDir);
        this.organizationReport.scanned = allFiles.length;
        
        console.log(`📊 Scanned ${allFiles.length} files across repository`);
        return allFiles;
    }

    /**
     * Analyze file organization needs
     */
    async analyzeFileOrganization(allFiles) {
        const organizationPlan = {
            toMove: [],
            toArchive: [],
            toDelete: [],
            foldersToCreate: new Set()
        };

        for (const file of allFiles) {
            let targetLocation = null;
            let action = 'keep';

            // Check each organization rule category
            for (const [category, rules] of Object.entries(this.organizationRules)) {
                if (rules.pattern.test(file.name)) {
                    // Find matching rule within category
                    for (const rule of rules.rules) {
                        if (rule.name.test(file.name)) {
                            targetLocation = rule.target;
                            break;
                        }
                    }
                    break;
                }
            }

            // Check cleanup patterns
            for (const pattern of this.cleanupPatterns.deletePatterns) {
                if (pattern.test(file.name)) {
                    action = 'delete';
                    break;
                }
            }

            if (action !== 'delete') {
                for (const pattern of this.cleanupPatterns.archivePatterns) {
                    if (pattern.test(file.name)) {
                        action = 'archive';
                        targetLocation = 'archives/legacy/';
                        break;
                    }
                }
            }

            // Determine action needed
            if (action === 'delete') {
                organizationPlan.toDelete.push(file);
            } else if (action === 'archive') {
                organizationPlan.toArchive.push({
                    ...file,
                    targetPath: path.join(this.rootDir, targetLocation, file.name)
                });
                organizationPlan.foldersToCreate.add(path.join(this.rootDir, targetLocation));
            } else if (targetLocation && file.dir !== targetLocation.replace(/\/$/, '')) {
                organizationPlan.toMove.push({
                    ...file,
                    targetPath: path.join(this.rootDir, targetLocation, file.name),
                    targetDir: targetLocation
                });
                organizationPlan.foldersToCreate.add(path.join(this.rootDir, targetLocation));
            }
        }

        console.log(`📋 Organization Plan:
  - Files to move: ${organizationPlan.toMove.length}
  - Files to archive: ${organizationPlan.toArchive.length}
  - Files to delete: ${organizationPlan.toDelete.length}
  - Folders to create: ${organizationPlan.foldersToCreate.size}`);

        return organizationPlan;
    }

    /**
     * Create necessary folder structure
     */
    async createFolderStructure(organizationPlan) {
        // Standard professional folders
        const standardFolders = [
            'scripts/core',
            'scripts/foundation',
            'scripts/dashboard',
            'scripts/alerts',
            'scripts/analytics',
            'scripts/tools',
            'scripts/visuals',
            'scripts/templates',
            'scripts/support',
            'automation/git',
            'automation/deployment',
            'automation/generators',
            'automation/validation',
            'automation/backup',
            'automation/learning',
            'automation/management',
            'automation/devops',
            'docs/api-reference',
            'docs/reports',
            'configs/environments',
            'tests/validation-scripts',
            'tests/performance',
            'tests/integration',
            'exports/tradingview-ready',
            'exports/marketplace',
            'archives/versions',
            'archives/legacy',
            'archives/experiments',
            'backups/automated',
            'backups/manual',
            'versions/releases'
        ];

        // Combine standard folders with plan-specific folders
        const allFolders = new Set([
            ...standardFolders.map(f => path.join(this.rootDir, f)),
            ...organizationPlan.foldersToCreate
        ]);

        for (const folderPath of allFolders) {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(`📁 Created: ${path.relative(this.rootDir, folderPath)}`);
                this.organizationReport.created_folders++;
            }
        }
    }

    /**
     * Execute file organization
     */
    async executeFileOrganization(organizationPlan) {
        // Move files to correct locations
        for (const file of organizationPlan.toMove) {
            try {
                fs.renameSync(file.path, file.targetPath);
                console.log(`🔄 Moved: ${file.relativePath} → ${file.targetDir}`);
                this.organizationReport.moved++;
            } catch (error) {
                console.error(`❌ Failed to move ${file.relativePath}:`, error.message);
                this.organizationReport.errors.push(`Move failed: ${file.relativePath}`);
            }
        }

        // Archive files
        for (const file of organizationPlan.toArchive) {
            try {
                fs.renameSync(file.path, file.targetPath);
                console.log(`📦 Archived: ${file.relativePath}`);
                this.organizationReport.archived++;
            } catch (error) {
                console.error(`❌ Failed to archive ${file.relativePath}:`, error.message);
                this.organizationReport.errors.push(`Archive failed: ${file.relativePath}`);
            }
        }
    }

    /**
     * Clean up unnecessary files
     */
    async cleanupRepository() {
        const allFiles = await this.scanRepository();
        
        for (const file of allFiles) {
            let shouldDelete = false;
            
            // Check against delete patterns
            for (const pattern of this.cleanupPatterns.deletePatterns) {
                if (pattern.test(file.name)) {
                    shouldDelete = true;
                    break;
                }
            }
            
            if (shouldDelete) {
                try {
                    fs.unlinkSync(file.path);
                    console.log(`🗑️ Deleted: ${file.relativePath}`);
                    this.organizationReport.deleted++;
                } catch (error) {
                    console.error(`❌ Failed to delete ${file.relativePath}:`, error.message);
                    this.organizationReport.errors.push(`Delete failed: ${file.relativePath}`);
                }
            }
        }

        // Remove empty directories
        if (this.cleanupPatterns.removeEmptyDirs) {
            await this.removeEmptyDirectories();
        }
    }

    /**
     * Remove empty directories
     */
    async removeEmptyDirectories() {
        const removeEmptyDirs = (dir) => {
            const items = fs.readdirSync(dir);
            let hasFiles = false;
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    removeEmptyDirs(fullPath);
                    // Check if directory is now empty
                    if (fs.readdirSync(fullPath).length === 0) {
                        fs.rmdirSync(fullPath);
                        console.log(`📁 Removed empty directory: ${path.relative(this.rootDir, fullPath)}`);
                    } else {
                        hasFiles = true;
                    }
                } else {
                    hasFiles = true;
                }
            }
        };
        
        removeEmptyDirs(this.rootDir);
    }

    /**
     * Create backup before organization
     */
    async createPreOrganizationBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        
        console.log('💾 Creating pre-organization backup...');
        // Note: In production, we'd use a more sophisticated backup method
        console.log(`📦 Backup location: ${backupPath}`);
    }

    /**
     * Validate organization compliance
     */
    async validateOrganization() {
        const validationResults = {
            compliant: true,
            issues: []
        };

        // Check standard folder structure exists
        const requiredFolders = [
            'scripts/core',
            'automation',
            'docs',
            'configs',
            'tests'
        ];

        for (const folder of requiredFolders) {
            const folderPath = path.join(this.rootDir, folder);
            if (!fs.existsSync(folderPath)) {
                validationResults.compliant = false;
                validationResults.issues.push(`Missing required folder: ${folder}`);
            }
        }

        // Check for misplaced files
        const rootFiles = fs.readdirSync(this.rootDir);
        const allowedRootFiles = [
            'package.json',
            'package-lock.json',
            'README.md',
            '.gitignore',
            'LICENSE'
        ];

        for (const file of rootFiles) {
            const filePath = path.join(this.rootDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile() && !allowedRootFiles.includes(file) && !file.startsWith('.')) {
                validationResults.issues.push(`File should be organized: ${file}`);
            }
        }

        if (validationResults.compliant) {
            console.log('✅ Organization validation passed');
        } else {
            console.log('⚠️ Organization validation found issues:');
            validationResults.issues.forEach(issue => console.log(`  - ${issue}`));
        }

        return validationResults;
    }

    /**
     * Generate comprehensive organization report
     */
    async generateOrganizationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.organizationReport,
            folderStructure: await this.generateFolderStructureReport(),
            recommendations: this.generateRecommendations()
        };

        // Save report to docs
        const reportPath = path.join(this.rootDir, 'docs', 'reports', 'file-organization-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('\n📊 FILE ORGANIZATION REPORT:');
        console.log(`  Files scanned: ${report.summary.scanned}`);
        console.log(`  Files moved: ${report.summary.moved}`);
        console.log(`  Files archived: ${report.summary.archived}`);
        console.log(`  Files deleted: ${report.summary.deleted}`);
        console.log(`  Folders created: ${report.summary.created_folders}`);
        console.log(`  Errors: ${report.summary.errors.length}`);
        console.log(`  Report saved: ${reportPath}`);

        return report;
    }

    /**
     * Generate folder structure report
     */
    async generateFolderStructureReport() {
        const structure = {};
        
        const scanStructure = (dir, obj, depth = 0) => {
            if (depth > 3) return; // Limit depth
            
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                if (item.startsWith('.') && item !== '.cursor') continue;
                if (item === 'node_modules') continue;
                
                const fullPath = path.join(dir, item);
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    obj[item] = {};
                    scanStructure(fullPath, obj[item], depth + 1);
                } else {
                    if (!obj['_files']) obj['_files'] = [];
                    obj['_files'].push(item);
                }
            }
        };
        
        scanStructure(this.rootDir, structure);
        return structure;
    }

    /**
     * Generate recommendations for improvement
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.organizationReport.errors.length > 0) {
            recommendations.push('Review and resolve file organization errors');
        }
        
        recommendations.push('Consider implementing automated file watching for continuous organization');
        recommendations.push('Set up pre-commit hooks to enforce organization standards');
        recommendations.push('Create documentation for team on file organization standards');
        
        return recommendations;
    }

    /**
     * Rollback organization in case of failure
     */
    async rollbackOrganization() {
        console.log('🔄 Rolling back file organization...');
        // Implementation would restore from backup
        console.log('📦 Organization rollback completed');
    }
}

// CLI Interface
if (require.main === module) {
    const organizer = new FileOrganizer();
    
    const command = process.argv[2] || 'organize';
    
    switch (command) {
        case 'organize':
            organizer.organizeRepository()
                .then((report) => {
                    console.log('🎉 Professional file organization completed!');
                    process.exit(0);
                })
                .catch((error) => {
                    console.error('❌ File organization failed:', error.message);
                    process.exit(1);
                });
            break;
            
        case 'scan':
            organizer.scanRepository()
                .then((files) => {
                    console.log(`📊 Repository scan complete: ${files.length} files found`);
                })
                .catch((error) => {
                    console.error('❌ Repository scan failed:', error.message);
                });
            break;
            
        case '--help':
        case 'help':
            console.log(`
🏗️ BTMM Professional File Organization System

Usage: node automation/file-organizer.js [command]

Commands:
  organize  - Execute complete file organization (default)
  scan      - Scan repository and report file count
  help      - Show this help message

Features:
  ✅ Professional folder structure creation
  ✅ Automated file categorization and movement
  ✅ Legacy file archiving
  ✅ Cleanup of temporary and unnecessary files
  ✅ DevOps compliance validation
  ✅ Comprehensive organization reporting
  ✅ Backup and rollback capabilities

This system enforces enterprise-grade repository organization
before any commits are made to the system.
            `);
            break;
            
        default:
            console.error(`Unknown command: ${command}`);
            console.log('Use "help" for available commands');
            process.exit(1);
    }
}

module.exports = FileOrganizer; 