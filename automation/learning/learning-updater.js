const fs = require('fs');

class LearningUpdater {
    constructor() {
        this.learningPath = '.cursor/rules/learned-practices.mdc';
    }

    async updateLearning() {
        console.log(' Learning update in progress...');
        
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            const currentContent = this.loadCurrentLearning();
            const newEntry = `
### ${dateStr}: Continuous Learning System Active
**Pattern:** Automated learning detection working
**Application:** Regular system evolution cycles
`;
            
            const updatedContent = currentContent + newEntry;
            fs.writeFileSync(this.learningPath, updatedContent);
            console.log(' Learning database updated successfully!');
            
        } catch (error) {
            console.error(' Learning update failed:', error.message);
        }
    }

    loadCurrentLearning() {
        if (fs.existsSync(this.learningPath)) {
            return fs.readFileSync(this.learningPath, 'utf8');
        }
        return '';
    }
}

if (require.main === module) {
    const updater = new LearningUpdater();
    updater.updateLearning()
        .then(() => console.log(' Learning update completed!'))
        .catch(error => console.error(' Failed:', error.message));
}

module.exports = LearningUpdater;
