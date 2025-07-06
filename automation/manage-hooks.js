#!/usr/bin/env node

/**
 * BTMM Git Hooks Manager
 * Manage git hooks installation and configuration
 */

import { execSync } from 'child_process';

const commands = {
    install: () => {
        console.log('🔧 Installing git hooks...');
        execSync('node automation/install-git-hooks.js', { stdio: 'inherit' });
        console.log('✅ Git hooks installed successfully!');
    },
    
    uninstall: () => {
        console.log('🗑️ Uninstalling git hooks...');
        // Remove hook files
        const hooksToRemove = ['.git/hooks/pre-commit', '.git/hooks/pre-push', '.git/hooks/pre-commit.bat', '.git/hooks/pre-push.bat'];
        
        for (const hook of hooksToRemove) {
            try {
                const fs = require('fs');
                if (fs.existsSync(hook)) {
                    fs.unlinkSync(hook);
                    console.log(`Removed: ${hook}`);
                }
            } catch (error) {
                console.warn(`Failed to remove ${hook}: ${error.message}`);
            }
        }
        
        console.log('✅ Git hooks uninstalled successfully!');
    },
    
    status: () => {
        console.log('📊 Git Hooks Status:');
        const fs = require('fs');
        const hooks = ['pre-commit', 'pre-push'];
        
        for (const hook of hooks) {
            const hookPath = `.git/hooks/${hook}`;
            const hookBatPath = `.git/hooks/${hook}.bat`;
            
            if (fs.existsSync(hookPath) || fs.existsSync(hookBatPath)) {
                console.log(`✅ ${hook}: Installed`);
            } else {
                console.log(`❌ ${hook}: Not installed`);
            }
        }
    }
};

const command = process.argv[2];

if (commands[command]) {
    commands[command]();
} else {
    console.log('Usage: node automation/manage-hooks.js [install|uninstall|status]');
}
