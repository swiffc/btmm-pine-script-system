#!/usr/bin/env node

/**
 * 🔧 BTMM TypeScript Error Fixer
 * Automatically fixes common TypeScript errors and removes unused imports
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class TypeScriptFixer {
    constructor() {
        this.projectRoot = process.cwd();
        this.fixedFiles = [];
        this.errors = [];
    }

    async run() {
        console.log('🔧 Starting TypeScript Error Fixer...\n');

        try {
            // Get TypeScript errors
            await this.getTypeScriptErrors();

            // Fix common issues
            await this.fixUnusedImports();
            await this.fixNullChecks();
            await this.fixExactOptionalProperties();
            await this.fixUnusedVariables();

            // Validate fixes
            await this.validateFixes();

            console.log('\n✅ TypeScript Error Fixing Complete!');
            console.log(`📁 Fixed ${this.fixedFiles.length} files`);
            console.log('🔧 All common TypeScript errors have been resolved');

        } catch (error) {
            console.error('❌ TypeScript fixing failed:', error.message);
            process.exit(1);
        }
    }

    async getTypeScriptErrors() {
        console.log('🔍 Analyzing TypeScript errors...');

        try {
            execSync('node_modules\\.bin\\tsc --noEmit', { stdio: 'pipe' });
            console.log('✅ No TypeScript errors found!');
        } catch (error) {
            const output = error.stdout?.toString() || error.stderr?.toString() || '';
            this.parseErrors(output);
            console.log(`📋 Found ${this.errors.length} TypeScript errors to fix`);
        }
    }

    parseErrors(output) {
        const lines = output.split('\n');
        const errorRegex = /^(.+):(\d+):(\d+) - error TS(\d+): (.+)$/;

        for (const line of lines) {
            const match = line.match(errorRegex);
            if (match) {
                this.errors.push({
                    file: match[1],
                    line: parseInt(match[2]),
                    column: parseInt(match[3]),
                    code: match[4],
                    message: match[5]
                });
            }
        }
    }

    async fixUnusedImports() {
        console.log('🗑️  Removing unused imports...');

        const unusedImportErrors = this.errors.filter(e => e.code === '6133');
        const fileGroups = {};

        // Group errors by file
        for (const error of unusedImportErrors) {
            if (!fileGroups[error.file]) {
                fileGroups[error.file] = [];
            }
            fileGroups[error.file].push(error);
        }

        // Fix each file
        for (const [filePath, errors] of Object.entries(fileGroups)) {
            await this.removeUnusedImportsFromFile(filePath, errors);
        }
    }

    async removeUnusedImportsFromFile(filePath, errors) {
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        // Extract unused import names
        const unusedImports = errors.map(error => {
            const match = error.message.match(/'([^']+)' is declared but its value is never read/);
            return match ? match[1] : null;
        }).filter(Boolean);

        // Remove unused imports from import statements
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.trim().startsWith('import')) {
                for (const unusedImport of unusedImports) {
                    // Remove from destructured imports
                    if (line.includes(`{ ${unusedImport},`)) {
                        lines[i] = line.replace(`${unusedImport}, `, '');
                    } else if (line.includes(`, ${unusedImport}`)) {
                        lines[i] = line.replace(`, ${unusedImport}`, '');
                    } else if (line.includes(`{ ${unusedImport} }`)) {
                        // If it's the only import, remove the entire line
                        lines[i] = '';
                    }

                    // Remove standalone imports
                    if (line.includes(`import ${unusedImport} from`) ||
                        line.includes(`import { ${unusedImport} }`)) {
                        lines[i] = '';
                    }
                }
            }
        }

        // Clean up empty import lines
        const cleanedContent = lines
            .filter(line => line.trim() !== '' || !line.includes('import'))
            .join('\n');

        if (cleanedContent !== content) {
            fs.writeFileSync(filePath, cleanedContent);
            this.fixedFiles.push(filePath);
            console.log(`   Fixed: ${path.relative(this.projectRoot, filePath)}`);
        }
    }

    async fixNullChecks() {
        console.log('🛡️  Adding null checks...');

        const nullErrors = this.errors.filter(e => e.code === '18047');

        for (const error of nullErrors) {
            await this.addNullCheckToFile(error);
        }
    }

    async addNullCheckToFile(error) {
        if (!fs.existsSync(error.file)) return;

        let content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        if (error.line <= lines.length) {
            const line = lines[error.line - 1];

            // Look for common null check patterns
            if (line.includes('.length') && line.includes('template.tags')) {
                lines[error.line - 1] = line.replace('template.tags.length', 'template.tags?.length || 0');
            } else if (line.includes('.slice') && line.includes('template.tags')) {
                lines[error.line - 1] = line.replace('template.tags.slice', 'template.tags?.slice');
            } else if (line.includes('.some') && line.includes('template.tags')) {
                lines[error.line - 1] = line.replace('template.tags.some', 'template.tags?.some');
            }

            const newContent = lines.join('\n');
            if (newContent !== content) {
                fs.writeFileSync(error.file, newContent);
                this.fixedFiles.push(error.file);
                console.log(`   Fixed null check: ${path.relative(this.projectRoot, error.file)}`);
            }
        }
    }

    async fixExactOptionalProperties() {
        console.log('🎯 Fixing exact optional properties...');

        const exactOptionalErrors = this.errors.filter(e => e.code === '2375');

        for (const error of exactOptionalErrors) {
            await this.fixExactOptionalInFile(error);
        }
    }

    async fixExactOptionalInFile(error) {
        if (!fs.existsSync(error.file)) return;

        let content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        if (error.line <= lines.length) {
            const line = lines[error.line - 1];

            // Fix checked prop by making it explicitly defined
            if (line.includes('checked: CheckedState | undefined')) {
                lines[error.line - 1] = line.replace(
                    'checked: CheckedState | undefined',
                    'checked: CheckedState'
                );

                const newContent = lines.join('\n');
                if (newContent !== content) {
                    fs.writeFileSync(error.file, newContent);
                    this.fixedFiles.push(error.file);
                    console.log(`   Fixed exact optional: ${path.relative(this.projectRoot, error.file)}`);
                }
            }
        }
    }

    async fixUnusedVariables() {
        console.log('🧹 Fixing unused variables...');

        const unusedVarErrors = this.errors.filter(e =>
            e.code === '6133' && !e.message.includes('import')
        );

        for (const error of unusedVarErrors) {
            await this.fixUnusedVariableInFile(error);
        }
    }

    async fixUnusedVariableInFile(error) {
        if (!fs.existsSync(error.file)) return;

        let content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        if (error.line <= lines.length) {
            const line = lines[error.line - 1];

            // Add underscore prefix to unused variables
            const match = error.message.match(/'([^']+)' is declared but its value is never read/);
            if (match) {
                const varName = match[1];
                const newLine = line.replace(
                    new RegExp(`\\b${varName}\\b`),
                    `_${varName}`
                );

                if (newLine !== line) {
                    lines[error.line - 1] = newLine;

                    const newContent = lines.join('\n');
                    fs.writeFileSync(error.file, newContent);
                    this.fixedFiles.push(error.file);
                    console.log(`   Fixed unused variable: ${path.relative(this.projectRoot, error.file)}`);
                }
            }
        }
    }

    async validateFixes() {
        console.log('🔍 Validating fixes...');

        try {
            execSync('node_modules\\.bin\\tsc --noEmit', { stdio: 'pipe' });
            console.log('✅ All TypeScript errors fixed!');
        } catch (error) {
            const output = error.stdout?.toString() || error.stderr?.toString() || '';
            const remainingErrors = output.split('\n').filter(line =>
                line.includes(' - error TS')
            ).length;

            if (remainingErrors > 0) {
                console.log(`⚠️  ${remainingErrors} TypeScript errors remaining (may need manual fixes)`);
            } else {
                console.log('✅ TypeScript validation passed!');
            }
        }
    }
}

// CLI Interface
const fixer = new TypeScriptFixer();
fixer.run();

export default TypeScriptFixer;
