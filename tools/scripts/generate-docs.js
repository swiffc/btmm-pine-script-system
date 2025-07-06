#!/usr/bin/env node

/**
 * Documentation Generator for BTMM Pine Script Templates
 * Automatically generates documentation from Pine Script files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Extract metadata from Pine Script file
 */
function extractMetadata(content, filename) {
  const metadata = {
    title: '',
    description: '',
    version: '',
    category: '',
    features: [],
    inputs: [],
    alerts: [],
    btmmCompliance: {}
  };

  const lines = content.split('\n');
  
  // Extract title from indicator declaration
  const indicatorMatch = content.match(/indicator\(\s*["']([^"']+)["']/);
  if (indicatorMatch) {
    metadata.title = indicatorMatch[1];
  } else {
    metadata.title = filename.replace('.pine', '');
  }

  // Extract version
  const versionMatch = content.match(/\/\/@version=(\d+)/);
  if (versionMatch) {
    metadata.version = `v${versionMatch[1]}`;
  }

  // Extract description from comments
  const descriptionLines = [];
  let inDescription = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') && !trimmed.startsWith('//@')) {
      const comment = trimmed.replace(/^\/\/\s*/, '');
      if (comment.toLowerCase().includes('description') || inDescription) {
        inDescription = true;
        if (comment && !comment.toLowerCase().includes('description')) {
          descriptionLines.push(comment);
        }
      } else if (comment.length > 10 && !inDescription) {
        descriptionLines.push(comment);
      }
    } else if (inDescription && !trimmed.startsWith('//')) {
      break;
    }
  }
  
  metadata.description = descriptionLines.slice(0, 3).join(' ').trim();

  // Extract inputs
  const inputMatches = content.matchAll(/input\.(\w+)\s*\(\s*([^,)]+)(?:,\s*title\s*=\s*["']([^"']+)["'])?/g);
  for (const match of inputMatches) {
    metadata.inputs.push({
      type: match[1],
      defaultValue: match[2],
      title: match[3] || 'Input parameter'
    });
  }

  // Extract alert conditions
  const alertMatches = content.matchAll(/alertcondition\s*\([^,]*,\s*title\s*=\s*["']([^"']+)["']/g);
  for (const match of alertMatches) {
    metadata.alerts.push(match[1]);
  }

  // Check BTMM compliance
  metadata.btmmCompliance = {
    hasEmaSystem: /mustard|ketchup|water|mayo|blueberry/i.test(content),
    hasSecondLeg: /second[_\s]leg|leg[_\s]*2/i.test(content),
    hasMWPatterns: /[mw][_\s]*pattern/i.test(content),
    hasSessionAnalysis: /london|ny|session|asian/i.test(content),
    hasTdiIntegration: /tdi|rsi/i.test(content),
    hasAlerts: metadata.alerts.length > 0
  };

  // Determine category
  if (content.toLowerCase().includes('divergence')) {
    metadata.category = 'Divergence Analysis';
  } else if (content.toLowerCase().includes('pattern')) {
    metadata.category = 'Pattern Detection';
  } else if (content.toLowerCase().includes('session')) {
    metadata.category = 'Session Analysis';
  } else if (content.toLowerCase().includes('bias')) {
    metadata.category = 'Market Bias';
  } else {
    metadata.category = 'General BTMM';
  }

  return metadata;
}

/**
 * Generate markdown documentation for a template
 */
function generateTemplateDoc(filePath, metadata) {
  const relativePath = path.relative(projectRoot, filePath);
  
  let doc = `## ${metadata.title}\n\n`;
  
  // Basic info
  doc += `**File:** \`${relativePath}\`  \n`;
  doc += `**Version:** ${metadata.version}  \n`;
  doc += `**Category:** ${metadata.category}  \n\n`;
  
  // Description
  if (metadata.description) {
    doc += `**Description:** ${metadata.description}\n\n`;
  }

  // BTMM Compliance
  doc += `### BTMM Methodology Compliance\n\n`;
  doc += `| Feature | Status |\n`;
  doc += `|---------|--------|\n`;
  doc += `| EMA Food System | ${metadata.btmmCompliance.hasEmaSystem ? '✅' : '❌'} |\n`;
  doc += `| Second Leg Focus | ${metadata.btmmCompliance.hasSecondLeg ? '✅' : '❌'} |\n`;
  doc += `| M&W Patterns | ${metadata.btmmCompliance.hasMWPatterns ? '✅' : '❌'} |\n`;
  doc += `| Session Analysis | ${metadata.btmmCompliance.hasSessionAnalysis ? '✅' : '❌'} |\n`;
  doc += `| TDI Integration | ${metadata.btmmCompliance.hasTdiIntegration ? '✅' : '❌'} |\n`;
  doc += `| Alert System | ${metadata.btmmCompliance.hasAlerts ? '✅' : '❌'} |\n\n`;

  // Inputs
  if (metadata.inputs.length > 0) {
    doc += `### Input Parameters\n\n`;
    for (const input of metadata.inputs) {
      doc += `- **${input.title}** (${input.type}): Default = \`${input.defaultValue}\`\n`;
    }
    doc += '\n';
  }

  // Alerts
  if (metadata.alerts.length > 0) {
    doc += `### Available Alerts\n\n`;
    for (const alert of metadata.alerts) {
      doc += `- ${alert}\n`;
    }
    doc += '\n';
  }

  doc += `---\n\n`;
  
  return doc;
}

/**
 * Find all Pine Script files
 */
function findPineScriptFiles(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        files.push(...findPineScriptFiles(fullPath));
      } else if (stat.isFile() && item.endsWith('.pine')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Generate complete documentation
 */
function generateDocumentation() {
  console.log('🔍 BTMM Template Documentation Generator');
  console.log('========================================\n');

  // Ensure docs directory exists
  const docsDir = path.join(projectRoot, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Find all Pine Script files
  const searchDirs = ['indicators', 'templates', 'examples'].map(dir => 
    path.join(projectRoot, dir)
  ).filter(dir => fs.existsSync(dir));

  if (searchDirs.length === 0) {
    console.log('❌ No Pine Script directories found');
    return;
  }

  let allFiles = [];
  for (const dir of searchDirs) {
    const files = findPineScriptFiles(dir);
    allFiles.push(...files);
    console.log(`📁 Found ${files.length} files in ${path.relative(projectRoot, dir)}/`);
  }

  if (allFiles.length === 0) {
    console.log('❌ No Pine Script files found');
    return;
  }

  console.log(`\n📝 Processing ${allFiles.length} Pine Script files...\n`);

  // Process files and group by category
  const templates = [];
  const categories = new Map();

  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const metadata = extractMetadata(content, path.basename(file));
      
      templates.push({ file, metadata });
      
      if (!categories.has(metadata.category)) {
        categories.set(metadata.category, []);
      }
      categories.get(metadata.category).push({ file, metadata });
      
      console.log(`✅ Processed: ${path.basename(file)}`);
    } catch (error) {
      console.log(`❌ Error processing ${path.basename(file)}: ${error.message}`);
    }
  }

  // Generate main template index
  let indexContent = `# BTMM Pine Script Template Library\n\n`;
  indexContent += `*Auto-generated on ${new Date().toISOString().split('T')[0]}*\n\n`;
  indexContent += `This documentation provides a comprehensive overview of all available BTMM Pine Script templates.\n\n`;
  
  // Summary table
  indexContent += `## Quick Stats\n\n`;
  indexContent += `| Metric | Count |\n`;
  indexContent += `|--------|-------|\n`;
  indexContent += `| Total Templates | ${templates.length} |\n`;
  indexContent += `| Categories | ${categories.size} |\n`;
  
  const compliantTemplates = templates.filter(t => 
    Object.values(t.metadata.btmmCompliance).filter(Boolean).length >= 3
  );
  indexContent += `| BTMM Compliant | ${compliantTemplates.length} |\n`;
  indexContent += `| With Alerts | ${templates.filter(t => t.metadata.alerts.length > 0).length} |\n\n`;

  // Category overview
  indexContent += `## Categories\n\n`;
  for (const [category, categoryTemplates] of categories) {
    indexContent += `### ${category} (${categoryTemplates.length})\n\n`;
    
    for (const { file, metadata } of categoryTemplates) {
      const complianceScore = Object.values(metadata.btmmCompliance).filter(Boolean).length;
      const complianceEmoji = complianceScore >= 4 ? '🟢' : complianceScore >= 2 ? '🟡' : '🔴';
      
      indexContent += `- **[${metadata.title}](#${metadata.title.toLowerCase().replace(/\s+/g, '-')})** `;
      indexContent += `${complianceEmoji} - ${metadata.description || 'No description available'}\n`;
    }
    indexContent += '\n';
  }

  // Detailed documentation
  indexContent += `## Template Details\n\n`;
  
  // Sort by category and then by name
  const sortedTemplates = [...templates].sort((a, b) => {
    if (a.metadata.category !== b.metadata.category) {
      return a.metadata.category.localeCompare(b.metadata.category);
    }
    return a.metadata.title.localeCompare(b.metadata.title);
  });

  for (const { file, metadata } of sortedTemplates) {
    indexContent += generateTemplateDoc(file, metadata);
  }

  // Add usage guide
  indexContent += `## Usage Guide\n\n`;
  indexContent += `### Getting Started\n\n`;
  indexContent += `1. **Choose a Template**: Browse the categories above to find a template that matches your needs\n`;
  indexContent += `2. **Copy the Code**: Navigate to the template file and copy the Pine Script code\n`;
  indexContent += `3. **Customize with AI**: Use the provided prompts in \`.cursorrules\` and \`windsurf.config.json\`\n`;
  indexContent += `4. **Test and Deploy**: Validate your indicator and deploy to TradingView\n\n`;
  
  indexContent += `### BTMM Compliance Legend\n\n`;
  indexContent += `- 🟢 **Highly Compliant**: 4+ BTMM features implemented\n`;
  indexContent += `- 🟡 **Partially Compliant**: 2-3 BTMM features implemented\n`;
  indexContent += `- 🔴 **Basic Template**: <2 BTMM features implemented\n\n`;
  
  indexContent += `### AI Development Tips\n\n`;
  indexContent += `- Use Cursor AI with the provided \`.cursorrules\` for optimal Pine Script generation\n`;
  indexContent += `- Leverage Windsurf for performance optimization and visual enhancements\n`;
  indexContent += `- Always validate templates with the included validation script\n`;
  indexContent += `- Focus on second leg patterns for true BTMM compliance\n\n`;

  // Write the documentation
  const indexPath = path.join(docsDir, 'template-index.md');
  fs.writeFileSync(indexPath, indexContent);

  // Generate API documentation
  const apiDoc = generateApiDocumentation(templates);
  const apiPath = path.join(docsDir, 'api-reference.md');
  fs.writeFileSync(apiPath, apiDoc);

  console.log(`\n📚 Documentation generated:`);
  console.log(`   📄 Template Index: docs/template-index.md`);
  console.log(`   📄 API Reference: docs/api-reference.md`);
  console.log(`\n✅ Documentation generation completed!`);
}

/**
 * Generate API documentation
 */
function generateApiDocumentation(templates) {
  let apiDoc = `# BTMM Pine Script API Reference\n\n`;
  apiDoc += `*Auto-generated on ${new Date().toISOString().split('T')[0]}*\n\n`;
  
  apiDoc += `## Common Functions\n\n`;
  apiDoc += `### Pattern Detection Functions\n\n`;
  apiDoc += `#### \`detect_m_second_leg()\`\n`;
  apiDoc += `Detects the completion of the second leg in M patterns.\n\n`;
  apiDoc += `**Returns:** \`boolean\`  \n`;
  apiDoc += `**Usage:** Essential for BTMM M pattern trading setups\n\n`;
  
  apiDoc += `#### \`detect_w_second_leg()\`\n`;
  apiDoc += `Detects the completion of the second leg in W patterns.\n\n`;
  apiDoc += `**Returns:** \`boolean\`  \n`;
  apiDoc += `**Usage:** Essential for BTMM W pattern trading setups\n\n`;
  
  apiDoc += `### EMA System Functions\n\n`;
  apiDoc += `#### \`ema_food_system()\`\n`;
  apiDoc += `Implements the BTMM EMA food naming system.\n\n`;
  apiDoc += `**EMAs:**\n`;
  apiDoc += `- Mustard: EMA 5\n`;
  apiDoc += `- Ketchup: EMA 13 (Most Important)\n`;
  apiDoc += `- Water: EMA 50\n`;
  apiDoc += `- Mayo: EMA 200\n`;
  apiDoc += `- Blueberry: EMA 800\n\n`;
  
  apiDoc += `### Session Analysis Functions\n\n`;
  apiDoc += `#### \`london_session()\`\n`;
  apiDoc += `Identifies London trading session (3:30-5:30 AM EST).\n\n`;
  apiDoc += `**Returns:** \`boolean\`  \n`;
  apiDoc += `**Usage:** Filter trades during high-impact London session\n\n`;
  
  apiDoc += `#### \`ny_session()\`\n`;
  apiDoc += `Identifies New York trading session (9:30-11:00 AM EST).\n\n`;
  apiDoc += `**Returns:** \`boolean\`  \n`;
  apiDoc += `**Usage:** Filter trades during high-impact NY session\n\n`;
  
  apiDoc += `### TDI Integration\n\n`;
  apiDoc += `#### \`tdi_divergence()\`\n`;
  apiDoc += `Detects regular and hidden divergences using TDI.\n\n`;
  apiDoc += `**Returns:** \`series bool\`  \n`;
  apiDoc += `**Usage:** Confluence factor for entry signals\n\n`;
  
  apiDoc += `## Input Standards\n\n`;
  apiDoc += `### Recommended Input Groups\n\n`;
  apiDoc += `\`\`\`pinescript\n`;
  apiDoc += `// === EMA SYSTEM ===\n`;
  apiDoc += `mustard_length = input.int(5, "Mustard EMA", group="EMA Food System")\n`;
  apiDoc += `ketchup_length = input.int(13, "Ketchup EMA", group="EMA Food System")\n`;
  apiDoc += `water_length = input.int(50, "Water EMA", group="EMA Food System")\n`;
  apiDoc += `mayo_length = input.int(200, "Mayo EMA", group="EMA Food System")\n`;
  apiDoc += `blueberry_length = input.int(800, "Blueberry EMA", group="EMA Food System")\n\n`;
  apiDoc += `// === PATTERN DETECTION ===\n`;
  apiDoc += `pattern_sensitivity = input.float(0.5, "Sensitivity", 0.1, 2.0, group="Pattern Detection")\n`;
  apiDoc += `require_second_leg = input.bool(true, "Focus on Second Leg", group="Pattern Detection")\n\n`;
  apiDoc += `// === SESSION FILTERS ===\n`;
  apiDoc += `london_filter = input.bool(true, "London Session Filter", group="Session Analysis")\n`;
  apiDoc += `ny_filter = input.bool(true, "NY Session Filter", group="Session Analysis")\n`;
  apiDoc += `\`\`\`\n\n`;
  
  return apiDoc;
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocumentation();
}