-- BTMM Workbook Seed Data - 44 Chapters
-- Insert comprehensive BTMM methodology chapters

INSERT INTO workbook_chapters (id, title, description, content, difficulty, estimated_time, order_index, category, learning_objectives) VALUES

-- Foundation Chapters (1-8)
(1, 'Introduction to BTMM', 'Understanding the Beat The Market Makers methodology and core principles', '# Introduction to BTMM\n\nWelcome to the Beat The Market Makers (BTMM) methodology by Steve Mauro...', 'beginner', 15, 1, 'foundation', ARRAY['Understand BTMM principles', 'Learn market maker behavior']),

(2, 'Market Structure Fundamentals', 'Learn how institutional market makers control price action', '# Market Structure Fundamentals\n\nInstitutional market makers control 90% of all trading volume...', 'beginner', 20, 2, 'foundation', ARRAY['Identify market structure', 'Understand institutional behavior']),

(3, 'The EMA Food System', 'Master the 5-13-50-200-800 EMA stack methodology', '# The EMA Food System\n\nThe EMA Food System is the cornerstone of BTMM trading...', 'beginner', 25, 3, 'ema-system', ARRAY['Configure EMA stack', 'Identify perfect stack conditions']),

(4, 'Understanding Market Sessions', 'Asian, London, and New York session characteristics', '# Understanding Market Sessions\n\nEach trading session has unique characteristics...', 'beginner', 30, 4, 'session-analysis', ARRAY['Identify session ranges', 'Understand session transitions']),

(5, 'The 8-Point Bias Algorithm', 'Steve Mauros bias calculation system for trend strength', '# The 8-Point Bias Algorithm\n\nThe bias algorithm quantifies trend strength...', 'intermediate', 35, 5, 'ema-system', ARRAY['Calculate bias points', 'Determine trend strength']),

(6, 'Perfect Stack vs Imperfect Stack', 'Distinguishing between strong and weak EMA alignments', '# Perfect Stack vs Imperfect Stack\n\nNot all EMA alignments are created equal...', 'intermediate', 25, 6, 'ema-system', ARRAY['Identify perfect stacks', 'Avoid imperfect setups']),

(7, 'Market Maker Phases', 'Accumulation, Manipulation, and Distribution cycles', '# Market Maker Phases\n\nMarket makers operate in predictable cycles...', 'intermediate', 40, 7, 'market-maker', ARRAY['Identify MM phases', 'Time entries with cycles']),

(8, 'Stop Hunt Identification', 'Recognizing and trading liquidity sweeps', '# Stop Hunt Identification\n\nMarket makers hunt retail stops for liquidity...', 'advanced', 35, 8, 'pattern-detection', ARRAY['Spot stop hunts', 'Trade liquidity sweeps']),

-- EMA System Deep Dive (9-16)
(9, 'EMA 5 (Mustard) - Fast Momentum', 'Understanding the fastest EMA for momentum signals', '# EMA 5 (Mustard) - Fast Momentum\n\nThe 5 EMA is your momentum indicator...', 'intermediate', 20, 9, 'ema-system', ARRAY['Use 5 EMA for momentum', 'Identify momentum shifts']),

(10, 'EMA 13 (Ketchup) - Confirmation Line', 'The critical confirmation EMA in the BTMM system', '# EMA 13 (Ketchup) - Confirmation Line\n\nThe 13 EMA is the most important confirmation...', 'intermediate', 25, 10, 'ema-system', ARRAY['Use 13 EMA for confirmation', 'Identify key breaks']),

(11, 'EMA 50 (Water) - Intraday Reference', 'Intraday trend reference and support/resistance', '# EMA 50 (Water) - Intraday Reference\n\nThe 50 EMA defines intraday trend...', 'intermediate', 25, 11, 'ema-system', ARRAY['Use 50 EMA as reference', 'Find support/resistance']),

(12, 'EMA 200 (Mayo) - Daily Trend', 'The institutional trend reference line', '# EMA 200 (Mayo) - Daily Trend\n\nInstitutions watch the 200 EMA closely...', 'intermediate', 30, 12, 'ema-system', ARRAY['Identify daily trend', 'Use as major S/R']),

(13, 'EMA 800 (Blueberry) - Higher Timeframe Bias', 'Higher timeframe trend direction and bias', '# EMA 800 (Blueberry) - Higher Timeframe Bias\n\nThe 800 EMA provides HTF context...', 'advanced', 30, 13, 'ema-system', ARRAY['Determine HTF bias', 'Align with major trend']),

(14, 'EMA Confluence Zones', 'Identifying high-probability areas where EMAs cluster', '# EMA Confluence Zones\n\nWhen multiple EMAs cluster together...', 'advanced', 35, 14, 'ema-system', ARRAY['Find confluence zones', 'Trade EMA clusters']),

(15, 'EMA Expansion and Compression', 'Understanding EMA spacing for volatility analysis', '# EMA Expansion and Compression\n\nEMA spacing reveals market volatility...', 'advanced', 30, 15, 'ema-system', ARRAY['Measure EMA spacing', 'Predict volatility changes']),

(16, 'Advanced EMA Strategies', 'Complex EMA-based trading strategies and combinations', '# Advanced EMA Strategies\n\nCombining EMAs for sophisticated strategies...', 'advanced', 45, 16, 'ema-system', ARRAY['Develop EMA strategies', 'Combine multiple signals']),

-- Session Analysis (17-24)
(17, 'Asian Session Analysis', 'Trading the accumulation phase with 24-hour pivot levels', '# Asian Session Analysis\n\nThe Asian session sets the tone for the day...', 'intermediate', 35, 17, 'session-analysis', ARRAY['Trade Asian ranges', 'Use pivot levels']),

(18, 'London Session Manipulation', 'Understanding London session stop hunts and reversals', '# London Session Manipulation\n\nLondon is the manipulation session...', 'intermediate', 40, 18, 'session-analysis', ARRAY['Identify London manipulation', 'Trade session reversals']),

(19, 'New York Session Distribution', 'NY session trends and institutional distribution', '# New York Session Distribution\n\nNew York is where institutions distribute...', 'intermediate', 35, 19, 'session-analysis', ARRAY['Trade NY trends', 'Identify distribution']),

(20, 'Session Transition Strategies', 'Trading the gaps and overlaps between sessions', '# Session Transition Strategies\n\nSession transitions create opportunities...', 'advanced', 40, 20, 'session-analysis', ARRAY['Trade session gaps', 'Exploit transitions']),

(21, 'Brinks Time Windows', 'Precision timing with 9:45 PM, 3:45 AM, and 9:45 AM EST', '# Brinks Time Windows\n\nSteve Mauros precision timing methodology...', 'advanced', 30, 21, 'session-analysis', ARRAY['Use Brinks timing', 'Time entries precisely']),

(22, 'Session Range Trading', 'Trading within session boundaries and breakouts', '# Session Range Trading\n\nMost sessions trade within defined ranges...', 'intermediate', 35, 22, 'session-analysis', ARRAY['Define session ranges', 'Trade range breakouts']),

(23, 'Weekend Gap Analysis', 'Analyzing and trading weekend gaps in forex', '# Weekend Gap Analysis\n\nWeekend gaps provide trading opportunities...', 'intermediate', 25, 23, 'session-analysis', ARRAY['Analyze weekend gaps', 'Trade gap fills']),

(24, 'Holiday and News Session Behavior', 'How sessions behave during holidays and major news', '# Holiday and News Session Behavior\n\nSessions change during holidays and news...', 'advanced', 30, 24, 'session-analysis', ARRAY['Adapt to holidays', 'Trade news sessions']),

-- Pattern Recognition (25-32)
(25, 'OTE Zone Identification', 'Optimal Trade Entry zones using Fibonacci levels', '# OTE Zone Identification\n\nOTE zones are 62%-79% retracement areas...', 'advanced', 40, 25, 'pattern-detection', ARRAY['Identify OTE zones', 'Time entries in OTE']),

(26, 'M and W Pattern Recognition', 'The core reversal patterns in BTMM methodology', '# M and W Pattern Recognition\n\nM and W patterns are reversal signals...', 'intermediate', 35, 26, 'pattern-detection', ARRAY['Spot M/W patterns', 'Trade pattern confirmations']),

(27, 'Change of Character (CHoCH)', 'Identifying trend changes and structure breaks', '# Change of Character (CHoCH)\n\nCHoCH signals potential trend changes...', 'advanced', 35, 27, 'pattern-detection', ARRAY['Identify CHoCH', 'Trade structure breaks']),

(28, 'Break of Structure (BOS)', 'Confirming trend continuation through structure breaks', '# Break of Structure (BOS)\n\nBOS confirms trend continuation...', 'advanced', 30, 28, 'pattern-detection', ARRAY['Confirm BOS', 'Trade continuations']),

(29, 'Institutional Order Blocks', 'Identifying where institutions placed large orders', '# Institutional Order Blocks\n\nOrder blocks show institutional footprints...', 'advanced', 40, 29, 'pattern-detection', ARRAY['Find order blocks', 'Trade institutional levels']),

(30, 'Fair Value Gaps (FVG)', 'Trading imbalances in price action', '# Fair Value Gaps (FVG)\n\nFVGs represent price imbalances...', 'advanced', 35, 30, 'pattern-detection', ARRAY['Identify FVGs', 'Trade gap fills']),

(31, 'Liquidity Sweeps and Raids', 'Understanding how market makers collect liquidity', '# Liquidity Sweeps and Raids\n\nMarket makers need liquidity to fill orders...', 'advanced', 40, 31, 'pattern-detection', ARRAY['Spot liquidity raids', 'Trade sweep reversals']),

(32, 'Advanced Pattern Combinations', 'Combining multiple patterns for high-probability setups', '# Advanced Pattern Combinations\n\nCombining patterns increases probability...', 'advanced', 45, 32, 'pattern-detection', ARRAY['Combine patterns', 'Create high-probability setups']),

-- Risk Management (33-40)
(33, 'BTMM Risk Management Principles', 'Core risk management rules for BTMM trading', '# BTMM Risk Management Principles\n\nRisk management is paramount in BTMM...', 'intermediate', 30, 33, 'risk-management', ARRAY['Apply risk rules', 'Protect capital']),

(34, 'Position Sizing Strategies', 'Calculating optimal position sizes for different setups', '# Position Sizing Strategies\n\nPosition size determines your risk...', 'intermediate', 35, 34, 'risk-management', ARRAY['Calculate position size', 'Optimize risk-reward']),

(35, 'Stop Loss Placement', 'Strategic stop loss placement using BTMM principles', '# Stop Loss Placement\n\nStops should be placed logically...', 'intermediate', 30, 35, 'risk-management', ARRAY['Place logical stops', 'Avoid stop hunts']),

(36, 'Take Profit Strategies', 'Maximizing profits while maintaining disciplined exits', '# Take Profit Strategies\n\nTaking profits requires discipline...', 'intermediate', 35, 36, 'risk-management', ARRAY['Set profit targets', 'Scale out positions']),

(37, 'Drawdown Management', 'Handling losing streaks and emotional challenges', '# Drawdown Management\n\nDrawdowns are inevitable in trading...', 'intermediate', 30, 37, 'risk-management', ARRAY['Manage drawdowns', 'Maintain emotional control']),

(38, 'Portfolio Heat and Correlation', 'Managing multiple positions and currency correlations', '# Portfolio Heat and Correlation\n\nMultiple positions increase risk...', 'advanced', 40, 38, 'risk-management', ARRAY['Manage portfolio heat', 'Understand correlations']),

(39, 'Advanced Risk Models', 'Sophisticated risk management for professional traders', '# Advanced Risk Models\n\nProfessional risk management techniques...', 'advanced', 45, 39, 'risk-management', ARRAY['Apply advanced models', 'Professional risk management']),

(40, 'Psychology and Discipline', 'Mental aspects of risk management and trading discipline', '# Psychology and Discipline\n\nMental capital is as important as financial capital...', 'intermediate', 35, 40, 'risk-management', ARRAY['Develop discipline', 'Manage emotions']),

-- Advanced Topics (41-44)
(41, 'Multi-Timeframe Analysis', 'Synchronizing multiple timeframes for optimal entries', '# Multi-Timeframe Analysis\n\nUsing multiple timeframes improves timing...', 'advanced', 45, 41, 'advanced', ARRAY['Sync timeframes', 'Improve entry timing']),

(42, 'Algorithm Development', 'Creating automated BTMM trading algorithms', '# Algorithm Development\n\nAutomating BTMM strategies with code...', 'advanced', 50, 42, 'advanced', ARRAY['Develop algorithms', 'Automate strategies']),

(43, 'Backtesting and Optimization', 'Testing BTMM strategies on historical data', '# Backtesting and Optimization\n\nValidating strategies with historical data...', 'advanced', 45, 43, 'advanced', ARRAY['Backtest strategies', 'Optimize parameters']),

(44, 'Professional Trading Setup', 'Building a professional BTMM trading operation', '# Professional Trading Setup\n\nScaling up to professional trading...', 'advanced', 60, 44, 'advanced', ARRAY['Build professional setup', 'Scale trading operation']);

-- Update chapter prerequisites
UPDATE workbook_chapters SET prerequisites = ARRAY[1] WHERE id IN (2, 3, 4);
UPDATE workbook_chapters SET prerequisites = ARRAY[3] WHERE id IN (5, 6, 9, 10, 11, 12, 13);
UPDATE workbook_chapters SET prerequisites = ARRAY[4] WHERE id IN (17, 18, 19, 20, 21, 22, 23, 24);
UPDATE workbook_chapters SET prerequisites = ARRAY[7] WHERE id IN (25, 26, 27, 28, 29, 30, 31, 32);
UPDATE workbook_chapters SET prerequisites = ARRAY[8] WHERE id = 33;
UPDATE workbook_chapters SET prerequisites = ARRAY[33] WHERE id IN (34, 35, 36, 37, 38, 39, 40);
UPDATE workbook_chapters SET prerequisites = ARRAY[16, 24, 32, 40] WHERE id IN (41, 42, 43, 44);