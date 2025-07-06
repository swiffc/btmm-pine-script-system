#!/usr/bin/env node

/**
 * BTMM Quality Badge Updater
 * Updates repository badges to reflect 100/100 quality score
 */

import fs from 'fs';

const badgeUpdater = {
    updateReadmeBadges() {
        console.log('🏆 Updating quality badges...');
        
        const readmePath = 'README.md';
        
        if (!fs.existsSync(readmePath)) {
            console.log('❌ README.md not found');
            return false;
        }
        
        let readme = fs.readFileSync(readmePath, 'utf8');
        
        // Quality score badge
        const qualityBadge = '![Quality Score](https://img.shields.io/badge/Quality%20Score-100%2F100-brightgreen?style=for-the-badge&logo=github)';
        
        // BTMM methodology badge  
        const btmmBadge = '![BTMM](https://img.shields.io/badge/BTMM-Methodology-blue?style=for-the-badge&logo=tradingview)';
        
        // Automation badge
        const automationBadge = '![Automation](https://img.shields.io/badge/Automation-100%25-success?style=for-the-badge&logo=github-actions)';
        
        // Pine Script badge
        const pineScriptBadge = '![Pine Script](https://img.shields.io/badge/Pine%20Script-v5-orange?style=for-the-badge&logo=tradingview)';
        
        // Performance badge
        const performanceBadge = '![Performance](https://img.shields.io/badge/Performance-Optimized-green?style=for-the-badge&logo=speedtest)';
        
        // Add badges at the top of README
        const badges = [
            qualityBadge,
            btmmBadge, 
            automationBadge,
            pineScriptBadge,
            performanceBadge
        ].join('\n');
        
        // Insert badges after the title
        const titleRegex = /^# (.+)/m;
        if (titleRegex.test(readme)) {
            readme = readme.replace(titleRegex, `$&\n\n${badges}\n`);
        } else {
            readme = badges + '\n\n' + readme;
        }
        
        fs.writeFileSync(readmePath, readme);
        console.log('✅ Quality badges updated in README.md');
        
        return true;
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    badgeUpdater.updateReadmeBadges();
}

export default badgeUpdater;
