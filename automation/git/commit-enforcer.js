const fs = require('fs');
const { execSync } = require('child_process');

class CommitEnforcer {
    constructor() {
        this.rulesPath = '.cursor/rules/learned-practices.mdc';
        this.packagePath = 'package.json';
        this.enforceMode = true;
    }

    async enforceCommitProcess(context = 'general') {
        console.log('🔒 BTMM Commit Enforcement - ACTIVATING...');
        console.log(`📋 Context: ${context}`);
        
        try {
            const commitStatus = await this.checkCommitStatus();
            
            if (!commitStatus.required) {
                console.log('✅ Working directory clean - no commits needed');
                return { success: true, action: 'none_required' };
            }
            
            // CRITICAL: Execute file organization BEFORE commits
            console.log('🏗️ Executing MANDATORY file organization...');
            await this.executeFileOrganization();
            
            console.log('📦 Executing MANDATORY commit sequence...');
            const result = await this.executeMandatoryCommitSequence(context);
            
            await this.verifyCommitSuccess();
            await this.logSuccessfulEnforcement(context);
            
            console.log('✅ COMMIT ENFORCEMENT SUCCESSFUL - All changes secured!');
            return result;
            
        } catch (error) {
            console.error('❌ COMMIT ENFORCEMENT FAILED:', error.message);
            throw error;
        }
    }

    /**
     * Execute mandatory file organization before commits
     */
    async executeFileOrganization() {
        try {
            console.log('🔍 Professional DevOps file organization starting...');
            
            // Execute the file organizer (updated path after organization)
            execSync('node automation/devops/file-organizer.js organize', { 
                stdio: 'inherit',
                timeout: 60000 // 1 minute timeout
            });
            
            console.log('✅ File organization completed successfully');
            
        } catch (error) {
            console.error('❌ File organization failed:', error.message);
            throw new Error(`File organization prerequisite failed: ${error.message}`);
        }
    }

    async checkCommitStatus() {
        try {
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
            const hasChanges = gitStatus.trim().length > 0;
            
            return {
                required: hasChanges,
                changes: gitStatus.trim().split('\n').filter(line => line.length > 0),
                status: hasChanges ? 'changes_pending' : 'clean'
            };
        } catch (error) {
            throw new Error(`Failed to check git status: ${error.message}`);
        }
    }

    async executeMandatoryCommitSequence(context) {
        const steps = [
            'git add .',
            `git commit -m "Automated commit enforcement: ${context} - ${new Date().toISOString()}"`,
            'git push'
        ];
        
        for (const command of steps) {
            console.log(`🔧 Executing: ${command}`);
            execSync(command, { stdio: 'inherit' });
        }
        
        return {
            success: true,
            action: 'committed_and_pushed',
            context: context,
            timestamp: new Date().toISOString()
        };
    }

    async verifyCommitSuccess() {
        const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
        if (gitStatus.trim().length > 0) {
            throw new Error('Working directory not clean after commit');
        }
        console.log('✅ Commit verification successful');
    }

    async logSuccessfulEnforcement(context) {
        try {
            const timestamp = new Date().toISOString().split('T')[0];
            const logEntry = `
### ${timestamp}: Automated Commit Enforcement Success
**Context:** ${context}
**Pattern:** File organization + commits - Professional DevOps standards
**Application:** Enterprise-grade repository management achieved
`;
            
            if (fs.existsSync(this.rulesPath)) {
                const currentContent = fs.readFileSync(this.rulesPath, 'utf8');
                fs.writeFileSync(this.rulesPath, currentContent + logEntry);
                console.log('📚 Learning database updated');
            }
        } catch (error) {
            console.warn('⚠️ Could not update learning database:', error.message);
        }
    }
}

if (require.main === module) {
    const enforcer = new CommitEnforcer();
    const context = process.argv[2] || 'manual_execution';
    
    enforcer.enforceCommitProcess(context)
        .then(() => console.log('🎉 Commit enforcement completed!'))
        .catch(error => console.error('❌ Failed:', error.message));
}

module.exports = CommitEnforcer;
