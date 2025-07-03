// git-manager.js - BTMM Git Management System
const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitManager {
  constructor() {
    this.isGitRepo = this.checkGitRepository();
    this.remoteConfigured = this.checkRemoteOrigin();
    this.scriptsDir = path.join(__dirname, '..', 'scripts');
  }

  checkGitRepository() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  checkRemoteOrigin() {
    try {
      const remotes = execSync('git remote', { encoding: 'utf8' });
      return remotes.includes('origin');
    } catch (error) {
      return false;
    }
  }

  // Initialize Git repository for BTMM project
  initializeRepository() {
    console.log('🔧 Initializing Git repository for BTMM system...');

    try {
      if (!this.isGitRepo) {
        execSync('git init');
        console.log('✅ Git repository initialized');
        this.isGitRepo = true;
      }

      // Create .gitignore for Pine Script project
      this.createGitIgnore();

      // Set default branch to main
      try {
        execSync('git branch -M main', { stdio: 'ignore' });
      } catch (error) {
        // Ignore if no commits yet
      }

      // Create initial commit
      this.createInitialCommit();

      console.log('✅ Git repository setup complete');
      return true;
    } catch (error) {
      console.log(`❌ Git initialization failed: ${error.message}`);
      return false;
    }
  }

  createGitIgnore() {
    const gitignoreContent = `# BTMM Pine Script System .gitignore

# Node modules
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local development files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
*.swp
*.swo
*~

# Temporary files
*.tmp
*.temp
.cache/

# Logs
logs
*.log

# Version backups (keep in versions/ and backups/ folders)
versions/*.pine
backups/*.pine*
*.pine.backup*
*.pine.bak

# Deployment logs (keep structured logs only)
deployment-log.json

# Local configuration
config.local.json
settings.local.json

# Build outputs
dist/
build/
out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Pine Script specific
# Keep main .pine files but ignore temporary versions
*.pine.tmp
*.blocked

# Keep important documentation and configuration
!README.md
!CHANGELOG.md
!LICENSE
!docs/
!.vscode/
!.cursor/
!automation/
!configs/
!package.json
!package-lock.json
`;

    fs.writeFileSync('.gitignore', gitignoreContent);
    console.log('✅ .gitignore created');
  }

  createInitialCommit() {
    try {
      // Add Pine Script files and essential configuration
      const filesToAdd = [
        'scripts/**/*.pine',
        'automation/*.js',
        'package.json',
        'package-lock.json',
        '.vscode/',
        '.cursor/',
        'configs/',
        '.gitignore'
      ];

      // Add files that exist
      filesToAdd.forEach(pattern => {
        try {
          execSync(`git add ${pattern}`, { stdio: 'ignore' });
        } catch (error) {
          // File pattern doesn't exist, continue
        }
      });

      // Add README if exists
      if (fs.existsSync('README.md')) {
        execSync('git add README.md');
      }
      
      const commitMessage = 'Initial commit: BTMM Pine Script System with Cursor integration';
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });
      console.log('✅ Initial commit created');
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('💡 Repository already has initial commit');
      } else {
        console.log('💡 No changes to commit or already committed');
      }
    }
  }

  // Connect to GitHub repository
  connectToGitHub(githubUrl) {
    console.log(`🌐 Connecting to GitHub repository: ${githubUrl}`);

    try {
      if (!this.remoteConfigured) {
        execSync(`git remote add origin ${githubUrl}`);
        console.log('✅ GitHub remote added');
      } else {
        execSync(`git remote set-url origin ${githubUrl}`);
        console.log('✅ GitHub remote updated');
      }

      this.remoteConfigured = true;

      // Set default branch to main
      execSync('git branch -M main', { stdio: 'ignore' });

      // Push to GitHub
      this.pushToGitHub(true);

      return true;
    } catch (error) {
      console.log(`❌ GitHub connection failed: ${error.message}`);
      console.log('💡 Make sure the repository exists and you have access');
      return false;
    }
  }

  // Push changes to GitHub
  pushToGitHub(initialPush = false) {
    try {
      if (!this.remoteConfigured) {
        console.log('❌ No GitHub remote configured');
        return false;
      }

      if (initialPush) {
        execSync('git push -u origin main');
        console.log('✅ Initial push to GitHub completed');
      } else {
        execSync('git push origin main');
        execSync('git push origin --tags', { stdio: 'ignore' });
        console.log('✅ Changes pushed to GitHub');
      }
      return true;
    } catch (error) {
      console.log(`❌ GitHub push failed: ${error.message}`);
      return false;
    }
  }

  // Create feature branch for development
  createFeatureBranch(branchName) {
    try {
      execSync(`git checkout -b ${branchName}`);
      console.log(`✅ Created and switched to branch: ${branchName}`);
      return true;
    } catch (error) {
      console.log(`❌ Branch creation failed: ${error.message}`);
      return false;
    }
  }

  // Merge feature branch back to main
  mergeFeatureBranch(branchName) {
    try {
      execSync('git checkout main');
      execSync(`git merge ${branchName}`);
      execSync(`git branch -d ${branchName}`);
      console.log(`✅ Merged and deleted branch: ${branchName}`);
      return true;
    } catch (error) {
      console.log(`❌ Branch merge failed: ${error.message}`);
      return false;
    }
  }

  // Commit all changes with message
  commitChanges(message, addAll = true) {
    try {
      if (addAll) {
        // Add only specific files we want to track
        execSync('git add scripts/ automation/ configs/ .vscode/ package.json package-lock.json');
        
        // Add documentation if exists
        if (fs.existsSync('README.md')) {
          execSync('git add README.md');
        }
        if (fs.existsSync('docs/')) {
          execSync('git add docs/');
        }
      }
      
      execSync(`git commit -m "${message}"`);
      console.log(`✅ Changes committed: ${message}`);
      return true;
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('💡 No changes to commit');
        return true;
      }
      console.log(`❌ Commit failed: ${error.message}`);
      return false;
    }
  }

  // Get Git status
  getStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      
      return {
        branch: branch,
        hash: hash,
        hasChanges: status.trim().length > 0,
        changes: status.trim().split('\n').filter(line => line.length > 0)
      };
    } catch (error) {
      return null;
    }
  }

  // Create release tag
  createRelease(version, message) {
    try {
      const tagName = `v${version}`;
      execSync(`git tag -a "${tagName}" -m "${message}"`);
      
      if (this.remoteConfigured) {
        execSync(`git push origin ${tagName}`);
        console.log(`✅ Release ${tagName} created and pushed to GitHub`);
      } else {
        console.log(`✅ Release ${tagName} created locally`);
      }
      return true;
    } catch (error) {
      console.log(`❌ Release creation failed: ${error.message}`);
      return false;
    }
  }

  // Show Git log
  showLog(limit = 10) {
    try {
      const log = execSync(`git log --oneline -${limit}`, { encoding: 'utf8' });
      console.log('📚 Recent commits:');
      console.log(log);
    } catch (error) {
      console.log(`❌ Failed to show log: ${error.message}`);
    }
  }

  // Auto-commit Pine Script changes
  autoCommitPineScripts(message = null) {
    try {
      // Check for changes in Pine files
      const pineChanges = execSync('git status --porcelain scripts/', { encoding: 'utf8' });
      
      if (pineChanges.trim()) {
        execSync('git add scripts/');
        
        const commitMessage = message || `Auto-commit: Pine Script updates - ${new Date().toISOString()}`;
        execSync(`git commit -m "${commitMessage}"`);
        
        console.log('✅ Pine Script changes auto-committed');
        return true;
      } else {
        console.log('💡 No Pine Script changes to commit');
        return false;
      }
    } catch (error) {
      console.log(`⚠️  Auto-commit failed: ${error.message}`);
      return false;
    }
  }

  // Sync with remote (pull + push)
  syncWithRemote() {
    try {
      if (!this.remoteConfigured) {
        console.log('❌ No remote configured for sync');
        return false;
      }

      console.log('🔄 Syncing with GitHub...');
      
      // Pull latest changes
      execSync('git pull origin main', { stdio: 'ignore' });
      console.log('✅ Pulled latest changes');
      
      // Push local changes
      execSync('git push origin main');
      execSync('git push origin --tags', { stdio: 'ignore' });
      console.log('✅ Pushed local changes');
      
      return true;
    } catch (error) {
      console.log(`❌ Sync failed: ${error.message}`);
      return false;
    }
  }

  // Get current Git information
  getGitInfo() {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      const lastCommit = execSync('git log -1 --pretty=format:"%s"', { encoding: 'utf8' }).trim();
      
      return {
        branch,
        hash,
        lastCommit,
        isGitRepo: this.isGitRepo,
        hasRemote: this.remoteConfigured
      };
    } catch (error) {
      return null;
    }
  }

  // BTMM GitHub enforcement methods
  getRemotes() {
    try {
      const remotes = execSync('git remote -v', { encoding: 'utf8' }).trim();
      return remotes.split('\n').filter(line => line.length > 0);
    } catch (error) {
      return [];
    }
  }

  fetchFromRemote() {
    try {
      if (!this.remoteConfigured) {
        return false;
      }
      execSync('git fetch origin', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  isInSyncWithRemote() {
    try {
      if (!this.remoteConfigured) {
        return false;
      }
      
      const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const remoteCommit = execSync('git rev-parse origin/main', { encoding: 'utf8' }).trim();
      
      return localCommit === remoteCommit;
    } catch (error) {
      // If we can't compare, assume we're not in sync
      return false;
    }
  }
}

// CLI Usage
if (require.main === module) {
  const gitManager = new GitManager();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      gitManager.initializeRepository();
      break;
      
    case 'connect':
      const githubUrl = args[1];
      if (githubUrl) {
        gitManager.connectToGitHub(githubUrl);
      } else {
        console.log('Usage: node git-manager.js connect <github-url>');
        console.log('Example: node git-manager.js connect https://github.com/username/btmm-pine-script-system.git');
      }
      break;
      
    case 'push':
      gitManager.pushToGitHub();
      break;
      
    case 'commit':
      const message = args[1] || 'Update BTMM system';
      gitManager.commitChanges(message);
      break;
      
    case 'sync':
      gitManager.syncWithRemote();
      break;
      
    case 'status':
      const status = gitManager.getStatus();
      if (status) {
        console.log(`📊 Git Status:`);
        console.log(`   Branch: ${status.branch}`);
        console.log(`   Hash: ${status.hash}`);
        console.log(`   Changes: ${status.hasChanges ? 'Yes' : 'No'}`);
        if (status.hasChanges) {
          console.log(`   Files:`);
          status.changes.forEach(change => console.log(`     ${change}`));
        }
      } else {
        console.log('❌ Not a Git repository');
      }
      break;
      
    case 'info':
      const info = gitManager.getGitInfo();
      if (info) {
        console.log(`📊 Git Information:`);
        console.log(`   Branch: ${info.branch}`);
        console.log(`   Hash: ${info.hash}`);
        console.log(`   Last commit: ${info.lastCommit}`);
        console.log(`   Has remote: ${info.hasRemote ? 'Yes' : 'No'}`);
      } else {
        console.log('❌ Not a Git repository');
      }
      break;
      
    case 'release':
      const version = args[1];
      const releaseMessage = args[2] || `BTMM System Release ${version}`;
      if (version) {
        gitManager.createRelease(version, releaseMessage);
      } else {
        console.log('Usage: node git-manager.js release <version> [message]');
        console.log('Example: node git-manager.js release 1.0.0 "Initial release"');
      }
      break;
      
    case 'log':
      const limit = parseInt(args[1]) || 10;
      gitManager.showLog(limit);
      break;
      
    case 'auto-commit':
      const autoMessage = args[1];
      gitManager.autoCommitPineScripts(autoMessage);
      break;
      
    case 'branch':
      const subCommand = args[1];
      const branchName = args[2];
      
      if (subCommand === 'create' && branchName) {
        gitManager.createFeatureBranch(branchName);
      } else if (subCommand === 'merge' && branchName) {
        gitManager.mergeFeatureBranch(branchName);
      } else {
        console.log('Usage: node git-manager.js branch create|merge <branch-name>');
      }
      break;
      
    default:
      console.log('BTMM Git Manager - Enhanced Git integration for BTMM Pine Script System');
      console.log('');
      console.log('Usage:');
      console.log('  node git-manager.js init                         - Initialize Git repository');
      console.log('  node git-manager.js connect <github-url>         - Connect to GitHub');
      console.log('  node git-manager.js commit [message]             - Commit changes');
      console.log('  node git-manager.js push                         - Push to GitHub');
      console.log('  node git-manager.js sync                         - Pull and push changes');
      console.log('  node git-manager.js status                       - Show Git status');
      console.log('  node git-manager.js info                         - Show Git info');
      console.log('  node git-manager.js release <version> [message]  - Create release');
      console.log('  node git-manager.js log [limit]                  - Show Git log');
      console.log('  node git-manager.js auto-commit [message]        - Auto-commit scripts');
      console.log('  node git-manager.js branch create|merge <name>   - Branch operations');
      console.log('');
      console.log('Examples:');
      console.log('  node git-manager.js init');
      console.log('  node git-manager.js connect https://github.com/user/repo.git');
      console.log('  node git-manager.js commit "Enhanced EMA system"');
      console.log('  node git-manager.js release 1.0.0 "Initial release"');
  }
}

module.exports = GitManager; 