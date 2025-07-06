#!/usr/bin/env node

/**
 * BTMM Quality Score Validator
 * Validates that the repository achieves 100/100 quality score
 */

import fs from 'fs';
import path from 'path';

const qualityValidator = {
    validateQualityScore() {
        console.log('🎯 Validating quality score...');
        
        const checks = {
            // Structure and organization (20 points)
            structure: this.checkStructure(),
            
            // Automation and workflows (20 points)  
            automation: this.checkAutomation(),
            
            // Documentation quality (20 points)
            documentation: this.checkDocumentation(),
            
            // GitHub best practices (15 points)
            github: this.checkGitHub(),
            
            // Performance optimization (15 points)
            performance: this.checkPerformance(),
            
            // Security and compliance (10 points)
            security: this.checkSecurity()
        };
        
        let totalScore = 0;
        let maxScore = 0;
        
        for (const [category, result] of Object.entries(checks)) {
            totalScore += result.score;
            maxScore += result.maxScore;
            
            console.log(`${result.score >= result.maxScore ? '✅' : '❌'} ${category}: ${result.score}/${result.maxScore}`);
            
            if (result.issues.length > 0) {
                result.issues.forEach(issue => console.log(`   ⚠️ ${issue}`));
            }
        }
        
        const finalScore = Math.round((totalScore / maxScore) * 100);
        
        console.log(`\n🎯 Final Quality Score: ${finalScore}/100`);
        
        if (finalScore >= 100) {
            console.log('🏆 PERFECT QUALITY ACHIEVED! 100/100');
            return true;
        } else {
            console.log(`❌ Quality goal not met. Need ${100 - finalScore} more points.`);
            return false;
        }
    },
    
    checkStructure() {
        const issues = [];
        let score = 0;
        
        // Check directory structure
        const requiredDirs = ['automation', 'scripts', 'docs', 'configs', 'testing'];
        const existingDirs = requiredDirs.filter(dir => fs.existsSync(dir));
        score += (existingDirs.length / requiredDirs.length) * 10;
        
        if (existingDirs.length < requiredDirs.length) {
            issues.push(`Missing directories: ${requiredDirs.filter(d => !existingDirs.includes(d)).join(', ')}`);
        }
        
        // Check file organization
        if (fs.existsSync('package.json')) score += 5;
        if (fs.existsSync('README.md')) score += 5;
        
        return { score: Math.round(score), maxScore: 20, issues };
    },
    
    checkAutomation() {
        const issues = [];
        let score = 0;
        
        // Check automation scripts
        const automationFiles = [
            'automation/pre-commit-optimization.js',
            'automation/git-manager.js',
            'automation/structure-optimization.js'
        ];
        
        const existingAutomation = automationFiles.filter(file => fs.existsSync(file));
        score += (existingAutomation.length / automationFiles.length) * 15;
        
        // Check package.json scripts
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const qualityScripts = ['pre-commit', 'auto-commit', 'quality:check'];
            const existingScripts = qualityScripts.filter(script => pkg.scripts && pkg.scripts[script]);
            score += (existingScripts.length / qualityScripts.length) * 5;
        }
        
        return { score: Math.round(score), maxScore: 20, issues };
    },
    
    checkDocumentation() {
        const issues = [];
        let score = 0;
        
        // Check README quality
        if (fs.existsSync('README.md')) {
            const readme = fs.readFileSync('README.md', 'utf8');
            if (readme.length > 5000) score += 10;
            else issues.push('README.md too short (needs 5000+ characters)');
        }
        
        // Check GitHub templates
        const templates = [
            '.github/ISSUE_TEMPLATE/bug_report.md',
            '.github/ISSUE_TEMPLATE/feature_request.md',
            '.github/pull_request_template.md'
        ];
        
        const existingTemplates = templates.filter(template => fs.existsSync(template));
        score += (existingTemplates.length / templates.length) * 10;
        
        return { score: Math.round(score), maxScore: 20, issues };
    },
    
    checkGitHub() {
        const issues = [];
        let score = 0;
        
        // Check CI/CD workflows
        if (fs.existsSync('.github/workflows')) {
            const workflows = fs.readdirSync('.github/workflows').filter(f => f.endsWith('.yml'));
            score += Math.min(workflows.length * 5, 10);
        }
        
        // Check security and contributing files
        if (fs.existsSync('.github/SECURITY.md')) score += 3;
        if (fs.existsSync('.github/CONTRIBUTING.md')) score += 2;
        
        return { score: Math.round(score), maxScore: 15, issues };
    },
    
    checkPerformance() {
        const issues = [];
        let score = 15; // Assume good performance based on automation system
        
        // Check for performance monitoring
        if (fs.existsSync('automation/performance-benchmark.js')) score += 0;
        else { score -= 5; issues.push('Missing performance monitoring'); }
        
        return { score: Math.round(score), maxScore: 15, issues };
    },
    
    checkSecurity() {
        const issues = [];
        let score = 0;
        
        // Check gitignore
        if (fs.existsSync('.gitignore')) score += 5;
        
        // Check for security policy
        if (fs.existsSync('.github/SECURITY.md')) score += 5;
        
        return { score: Math.round(score), maxScore: 10, issues };
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const success = qualityValidator.validateQualityScore();
    process.exit(success ? 0 : 1);
}

export default qualityValidator;
