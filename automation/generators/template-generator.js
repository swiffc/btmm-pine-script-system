// template-generator.js - BTMM Pine Script Template Generator
const fs = require('fs');
const path = require('path');

class BTMMTemplateGenerator {
    constructor() {
        this.templates = new Map();
        this.aiEnabled = false;
        this.btmmFoundation = null;
        
        // Steve Mauro concept definitions
        this.steveMaruoConcepts = {
            ASIAN_RANGE: {
                name: 'Asian Range Trading',
                description: 'Session-based range analysis with breakout detection',
                complexity: 'intermediate',
                foundationRequired: true,
                parameters: ['sessionTimes', 'breakoutConfirmation', 'volumeFilter']
            },
            EMA_STACK: {
                name: 'EMA Stack Analysis',
                description: 'Multi-timeframe exponential moving average analysis',
                complexity: 'beginner',
                foundationRequired: true,
                parameters: ['lengths', 'stackStrength', 'alignmentThreshold']
            },
            STOP_HUNT: {
                name: 'Stop Hunt Detection',
                description: 'Liquidity sweep and false breakout identification',
                complexity: 'advanced',
                foundationRequired: true,
                parameters: ['liquidityLevels', 'sweepTolerance', 'confirmationBars']
            },
            HTF_BIAS: {
                name: 'Higher Timeframe Bias',
                description: 'Institutional flow and bias analysis',
                complexity: 'advanced',
                foundationRequired: true,
                parameters: ['timeframes', 'biasStrength', 'alignmentScore']
            },
            MARKET_STRUCTURE: {
                name: 'Market Structure Analysis',
                description: 'CHoCH, BOS, and market structure detection',
                complexity: 'intermediate',
                foundationRequired: true,
                parameters: ['structureType', 'confirmationMethod', 'sensitivityLevel']
            }
        };
        
        this.loadTemplates();
    }
    
    loadTemplates() {
        console.log('📂 Loading BTMM template library...');
        
        try {
            // Load existing BTMM scripts as template foundations
            this.loadBTMMFoundations();
            
            // Generate template variants
            this.generateTemplateVariants();
            
            console.log(`✅ Loaded ${this.templates.size} BTMM templates`);
        } catch (error) {
            console.error('❌ Failed to load templates:', error.message);
        }
    }
    
    loadBTMMFoundations() {
        const scriptsDir = 'scripts';
        const foundationFiles = [
            'foundation/BTMMFoundation.pine',
            'BTMM_EMA_System.pine',
            'BTMM_Asian_Range.pine',
            'BTMM_HTF_Bias.pine',
            'BTMM_Pattern_Detection.pine',
            'BTMM_Entry_System.pine',
            'BTMM_Risk_Management.pine',
            'BTMM_Stop_Hunt_Detection.pine'
        ];
        
        foundationFiles.forEach(file => {
            const filePath = path.join(scriptsDir, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const templateName = path.basename(file, '.pine');
                
                this.templates.set(templateName, {
                    name: templateName,
                    content: content,
                    type: 'foundation',
                    concept: this.mapFileToSteveMaruoConcept(templateName),
                    parameters: this.extractParameters(content),
                    outputs: this.extractDataWindowOutputs(content)
                });
            }
        });
    }
    
    mapFileToSteveMaruoConcept(fileName) {
        if (fileName.includes('Asian_Range')) return 'ASIAN_RANGE';
        if (fileName.includes('EMA_System')) return 'EMA_STACK';
        if (fileName.includes('Stop_Hunt')) return 'STOP_HUNT';
        if (fileName.includes('HTF_Bias')) return 'HTF_BIAS';
        if (fileName.includes('Pattern')) return 'MARKET_STRUCTURE';
        return 'ASIAN_RANGE'; // Default concept
    }
    
    extractParameters(content) {
        const parameters = [];
        const inputMatches = content.match(/input\.\w+\([^)]+\)/g) || [];
        
        inputMatches.forEach(match => {
            const paramMatch = match.match(/input\.\w+\([^,]+,\s*"([^"]+)"/);
            if (paramMatch) {
                parameters.push({
                    name: paramMatch[1],
                    type: this.getInputType(match),
                    description: paramMatch[1]
                });
            }
        });
        
        return parameters;
    }
    
    extractDataWindowOutputs(content) {
        const outputs = [];
        const plotMatches = content.match(/plot\([^)]+\)/g) || [];
        
        plotMatches.forEach(match => {
            const titleMatch = match.match(/"([^"]+)"/);
            if (titleMatch && match.includes('display=display.data_window')) {
                outputs.push(titleMatch[1]);
            }
        });
        
        return outputs;
    }
    
    getInputType(inputString) {
        if (inputString.includes('input.int')) return 'integer';
        if (inputString.includes('input.float')) return 'float';
        if (inputString.includes('input.bool')) return 'boolean';
        if (inputString.includes('input.string')) return 'string';
        if (inputString.includes('input.source')) return 'source';
        return 'unknown';
    }
    
    generateTemplateVariants() {
        console.log('🔄 Generating template variants...');
        
        // Generate variants for each Steve Mauro concept
        Object.entries(this.steveMaruoConcepts).forEach(([conceptKey, concept]) => {
            this.generateConceptVariants(conceptKey, concept);
        });
    }
    
    generateConceptVariants(conceptKey, concept) {
        const variants = ['basic', 'intermediate', 'advanced'];
        
        variants.forEach(variant => {
            const templateId = `${conceptKey}_${variant}`;
            const template = this.createConceptTemplate(conceptKey, concept, variant);
            
            this.templates.set(templateId, template);
        });
    }
    
    createConceptTemplate(conceptKey, concept, variant) {
        return {
            id: `${conceptKey}_${variant}`,
            name: `${concept.name} (${variant.toUpperCase()})`,
            description: concept.description,
            steveMaruoConcept: concept.name,
            difficulty: variant,
            category: 'BTMM_Methodology',
            foundationRequired: concept.foundationRequired,
            parameters: concept.parameters,
            code: this.generateCodeTemplate(conceptKey, variant),
            educationalContent: {
                videoUrl: `steve-mauro-${conceptKey.toLowerCase()}-${variant}`,
                documentation: `${conceptKey.toLowerCase()}-guide-${variant}.md`,
                practiceExercises: ['basic_understanding', 'parameter_modification', 'signal_analysis']
            },
            btmmIntegration: {
                foundationRequired: true,
                crossScriptDependencies: ['BTMMFoundation'],
                dataWindowOutputs: ['Signal', 'Strength']
            }
        };
    }
    
    generateParametersForVariant(baseParameters, variant) {
        const parameterSets = {
            basic: baseParameters.slice(0, 2),
            intermediate: baseParameters,
            advanced: [...baseParameters, 'advancedFilters', 'customLogic']
        };
        
        return parameterSets[variant] || baseParameters;
    }
    
    generateCodeTemplate(conceptKey, variant) {
        const templates = {
            ASIAN_RANGE: {
                basic: `// Basic Asian Range Detection
session_time = input.session("2000-0800", "Asian Session")
session_high = ta.highest(high, 50)
session_low = ta.lowest(low, 50)
plot(session_high, "Asian High", color=color.blue)
plot(session_low, "Asian Low", color=color.red)`,
                intermediate: `// Enhanced Asian Range with Breakout Detection
session_time = input.session("2000-0800", "Asian Session")
breakout_threshold = input.float(0.5, "Breakout Threshold %")
var float asian_high = na
var float asian_low = na
if time(timeframe.period, session_time)
    asian_high := math.max(high, nz(asian_high))
    asian_low := math.min(low, nz(asian_low))
range_size = asian_high - asian_low
breakout_up = close > asian_high + (range_size * breakout_threshold / 100)
breakout_down = close < asian_low - (range_size * breakout_threshold / 100)
plot(asian_high, "Asian High", color=color.blue)
plot(asian_low, "Asian Low", color=color.red)
plotshape(breakout_up, "Breakout Up", shape.triangleup, location.belowbar, color.green)`,
                advanced: `// Advanced Asian Range with Multi-Timeframe Analysis
session_time = input.session("2000-0800", "Asian Session") 
htf_timeframe = input.timeframe("4H", "HTF for Bias")
htf_bias = request.security(syminfo.tickerid, htf_timeframe, ta.ema(close, 20) > ta.ema(close, 50))
// Advanced range analysis with statistical validation
bgcolor(time(timeframe.period, session_time) ? color.new(color.yellow, 95) : na)`
            },
            EMA_STACK: {
                basic: `// Basic EMA Stack Analysis
ema5 = ta.ema(close, 5)
ema13 = ta.ema(close, 13)
ema50 = ta.ema(close, 50)
bull_stack = ema5 > ema13 and ema13 > ema50
bear_stack = ema5 < ema13 and ema13 < ema50
plot(ema5, "EMA 5", color=color.blue)
plot(ema13, "EMA 13", color=color.orange)
plot(ema50, "EMA 50", color=color.red)`,
                intermediate: `// Enhanced EMA Stack with Strength Analysis
ema1 = ta.ema(close, 5)
ema2 = ta.ema(close, 13)
ema3 = ta.ema(close, 50)
ema4 = ta.ema(close, 200)
perfect_bull_stack = ema1 > ema2 and ema2 > ema3 and ema3 > ema4
bull_distance = (ema1 - ema4) / ema4 * 100
stack_strength = ta.sma(math.abs(bull_distance), 20)
plot(ema1, "Fast EMA", color=perfect_bull_stack ? color.green : color.gray)`,
                advanced: `// Advanced Multi-Timeframe EMA Stack System
// Full BTMMFoundation integration with 800 EMA analysis
htf_ema800 = request.security(syminfo.tickerid, "D", ta.ema(close, 800))
stack_touch_detected = math.abs(close - ema1) < (atr * 0.1)
plot(htf_ema800, "HTF EMA 800", color=color.black, linewidth=3)`
            },
            STOP_HUNT: {
                basic: `// Basic Stop Hunt Detection
previous_high = ta.highest(high[1], 20)[1]
previous_low = ta.lowest(low[1], 20)[1]
liquidity_sweep_up = high > previous_high and close < previous_high
liquidity_sweep_down = low < previous_low and close > previous_low
plotshape(liquidity_sweep_up, "Stop Hunt Up", shape.xcross, location.abovebar, color.red)
plotshape(liquidity_sweep_down, "Stop Hunt Down", shape.xcross, location.belowbar, color.green)`,
                intermediate: `// Enhanced Stop Hunt with Volume Confirmation
avg_volume = ta.sma(volume, 20)
volume_spike = volume > (avg_volume * 1.5)
hunt_up = liquidity_sweep_up and volume_spike
hunt_down = liquidity_sweep_down and volume_spike
alertcondition(hunt_up, "Stop Hunt Up Confirmed", "Stop hunt detected above highs")`,
                advanced: `// Advanced Stop Hunt with Institutional Flow Analysis
// Integration with BTMM_Stop_Hunt_Detection.pine foundation
institutional_volume = volume > ta.percentile_linear_interpolation(volume, 50, 95)
false_breakout_confirmed = hunt_up and ta.rsi(close, 14) > 70`
            }
        };
        
        return templates[conceptKey]?.[variant] || `// ${conceptKey} ${variant} template`;
    }
    
    generateIndicator(conceptKey, variant = 'basic', customParameters = {}) {
        console.log(`🎨 Generating ${conceptKey} indicator (${variant})...`);
        
        const templateId = `${conceptKey}_${variant}`;
        const template = this.templates.get(templateId);
        
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }
        
        const generatedCode = this.assembleIndicator(template, customParameters);
        const validation = this.validateGeneratedCode(generatedCode);
        
        return {
            code: generatedCode,
            template: template,
            validation: validation,
            metadata: {
                concept: template.steveMaruoConcept,
                difficulty: template.difficulty,
                parameters: template.parameters,
                outputs: template.btmmIntegration.dataWindowOutputs
            }
        };
    }
    
    assembleIndicator(template, customParameters) {
        const header = this.generateHeader(template);
        const imports = template.foundationRequired ? this.generateImports() : '';
        let code = template.code;
        
        // Add data window outputs
        code = this.addDataWindowOutputs(code, template.btmmIntegration.dataWindowOutputs);
        
        return `${header}\n${imports}\n${code}`;
    }
    
    generateHeader(template) {
        return `//@version=5
// =============================================================================
// ${template.name} - BTMM Trading System Component
// =============================================================================
// Purpose: ${template.description}
// Method: Steve Mauro's ${template.steveMaruoConcept} methodology
// Author: BTMM Development Team
// Version: 2.0
// Date: ${new Date().toISOString().split('T')[0]}
// Dependencies: ${template.btmmIntegration.crossScriptDependencies.join(', ')}
// Data Outputs: ${template.btmmIntegration.dataWindowOutputs.join(', ')}
// Difficulty: ${template.difficulty.toUpperCase()}
// =============================================================================

indicator("${template.name}", shorttitle="${template.id.toUpperCase()}", overlay=true)`;
    }
    
    generateImports() {
        return `
// BTMM Foundation Integration
// Note: In production, this would import from BTMMFoundation.pine
// import BTMMFoundation as foundation`;
    }
    
    addDataWindowOutputs(code, expectedOutputs) {
        const outputPlots = expectedOutputs.map(output => 
            `plot(${output.toLowerCase().replace(/_/g, '')}, "${output}", display=display.data_window)`
        ).join('\n');
        
        return `${code}\n\n// Data Window Outputs for Cross-Script Integration\n${outputPlots}`;
    }
    
    validateGeneratedCode(code) {
        const issues = [];
        const warnings = [];
        
        if (!code.startsWith('//@version=5')) {
            issues.push('Missing //@version=5 declaration');
        }
        
        if (!code.includes('display=display.data_window')) {
            warnings.push('No data window outputs detected - may affect cross-script integration');
        }
        
        const complexity = this.estimateComplexity(code);
        
        return {
            isValid: issues.length === 0,
            issues: issues,
            warnings: warnings,
            complexity: complexity,
            score: Math.max(0, 100 - (issues.length * 20) - (warnings.length * 5))
        };
    }
    
    estimateComplexity(code) {
        const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length;
        const calculations = (code.match(/[\+\-\*\/]/g) || []).length;
        const functions = (code.match(/ta\.\w+|math\.\w+/g) || []).length;
        
        const complexityScore = (lines * 0.5) + (calculations * 1) + (functions * 2);
        
        if (complexityScore < 50) return 'low';
        if (complexityScore < 150) return 'medium';
        return 'high';
    }
    
    listAvailableTemplates() {
        const templateList = [];
        
        this.templates.forEach((template, id) => {
            templateList.push({
                id: id,
                name: template.name,
                concept: template.steveMaruoConcept || 'N/A',
                difficulty: template.difficulty || 'N/A',
                description: template.description || 'N/A'
            });
        });
        
        return templateList.sort((a, b) => a.concept.localeCompare(b.concept));
    }
    
    exportTemplate(templateId, outputPath) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }
        
        const exportData = {
            ...template,
            generatedAt: new Date().toISOString(),
            version: '2.0.0'
        };
        
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
        console.log(`✅ Template exported: ${outputPath}`);
    }
    
    // CLI interface
    static runCLI() {
        const generator = new BTMMTemplateGenerator();
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            console.log('\n📋 Available BTMM Templates:');
            const templates = generator.listAvailableTemplates();
            templates.forEach(template => {
                console.log(`  🎯 ${template.id} - ${template.name} (${template.difficulty})`);
            });
            return;
        }
        
        const [conceptKey, variant = 'basic'] = args;
        
        try {
            const result = generator.generateIndicator(conceptKey.toUpperCase(), variant);
            
            console.log('\n🎨 Generated Pine Script Indicator:');
            console.log('📊 Validation:', result.validation.isValid ? '✅ PASSED' : '❌ FAILED');
            console.log('📈 Quality Score:', `${result.validation.score}/100`);
            console.log('⚡ Complexity:', result.validation.complexity.toUpperCase());
            
            if (result.validation.warnings.length > 0) {
                console.log('⚠️  Warnings:');
                result.validation.warnings.forEach(warning => console.log(`   - ${warning}`));
            }
            
            console.log('\n📄 Generated Code:');
            console.log('=' .repeat(80));
            console.log(result.code);
            console.log('=' .repeat(80));
            
        } catch (error) {
            console.error('❌ Generation failed:', error.message);
            process.exit(1);
        }
    }
}

// CLI usage
if (require.main === module) {
    BTMMTemplateGenerator.runCLI();
}

module.exports = BTMMTemplateGenerator;
