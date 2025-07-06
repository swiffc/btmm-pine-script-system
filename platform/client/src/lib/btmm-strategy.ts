export interface BTMMPhase {
  id: number;
  name: string;
  description: string;
  timeframe: string;
  characteristics: string[];
  tradingRules: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface BTMMSession {
  name: string;
  startTime: string;
  endTime: string;
  timezone: string;
  phase: string;
  volatility: 'low' | 'medium' | 'high';
  tradingOpportunities: string[];
}

export interface BTMMLevel {
  name: string;
  value: number;
  type: 'support' | 'resistance' | 'pivot';
  strength: 'weak' | 'medium' | 'strong';
  description: string;
}

export const BTMM_PHASES: BTMMPhase[] = [
  {
    id: 1,
    name: 'Accumulation',
    description: 'Market makers establish daily range during Asian session low volatility',
    timeframe: '21:00 - 06:00 UTC',
    characteristics: [
      'Low volatility consolidation',
      'Range-bound price action',
      'Minimal volume participation',
      'Setting high/low of day levels'
    ],
    tradingRules: [
      'Identify Asian session high and low',
      'Calculate range size for position sizing',
      'Avoid trading during this phase',
      'Prepare for London manipulation'
    ],
    riskLevel: 'low'
  },
  {
    id: 2,
    name: 'Manipulation',
    description: 'False moves designed to trap retail traders during London open',
    timeframe: '03:00 - 08:00 UTC',
    characteristics: [
      'False breakouts of Asian range',
      'Stop hunting activities',
      'Rapid price reversals',
      'High volatility spikes'
    ],
    tradingRules: [
      'Watch for Asian range breaks',
      'Expect false moves and reversals',
      'Do not chase breakouts immediately',
      'Wait for reversal confirmation'
    ],
    riskLevel: 'high'
  },
  {
    id: 3,
    name: 'Distribution',
    description: 'Real directional move begins with sustained trending price action',
    timeframe: '08:00 - 17:00 UTC',
    characteristics: [
      'Sustained directional movement',
      'Consistent trend progression',
      'Higher volume participation',
      '6-8 hour trending moves'
    ],
    tradingRules: [
      'Enter after manipulation ends',
      'Trade in direction of true breakout',
      'Use trailing stops for profit',
      'Target 2:1 or 3:1 risk/reward'
    ],
    riskLevel: 'medium'
  },
  {
    id: 4,
    name: 'Markdown',
    description: 'Return to consolidation as major moves complete and cycle resets',
    timeframe: '17:00 - 21:00 UTC',
    characteristics: [
      'Decreasing volatility',
      'Profit taking by institutions',
      'Range formation',
      'Preparation for next cycle'
    ],
    tradingRules: [
      'Close existing positions',
      'Avoid new entries',
      'Analyze day performance',
      'Prepare for next Asian session'
    ],
    riskLevel: 'low'
  }
];

export const BTMM_SESSIONS: BTMMSession[] = [
  {
    name: 'Asian Session',
    startTime: '21:00',
    endTime: '06:00',
    timezone: 'UTC',
    phase: 'Accumulation',
    volatility: 'low',
    tradingOpportunities: [
      'Range identification',
      'Level setting',
      'Preparation for London'
    ]
  },
  {
    name: 'London Session',
    startTime: '03:00',
    endTime: '12:00',
    timezone: 'UTC',
    phase: 'Manipulation',
    volatility: 'high',
    tradingOpportunities: [
      'False breakout detection',
      'Reversal trading',
      'Trend initiation'
    ]
  },
  {
    name: 'New York Session',
    startTime: '08:00',
    endTime: '17:00',
    timezone: 'UTC',
    phase: 'Distribution',
    volatility: 'medium',
    tradingOpportunities: [
      'Trend continuation',
      'Momentum trading',
      'Major moves'
    ]
  }
];

export interface BTMMIndicators {
  asianHigh: number | null;
  asianLow: number | null;
  asianRange: number | null;
  asianMidpoint: number | null;
  currentPhase: string;
  manipulationDetected: boolean;
  trendDirection: 'bullish' | 'bearish' | 'neutral';
  volatility: 'low' | 'medium' | 'high';
}

export class BTMMAnalyzer {
  private asianHigh: number | null = null;
  private asianLow: number | null = null;
  private currentSession: string = '';
  
  updateAsianRange(high: number, low: number): void {
    if (this.asianHigh === null || high > this.asianHigh) {
      this.asianHigh = high;
    }
    if (this.asianLow === null || low < this.asianLow) {
      this.asianLow = low;
    }
  }
  
  resetAsianRange(): void {
    this.asianHigh = null;
    this.asianLow = null;
  }
  
  getAsianRange(): number {
    if (this.asianHigh !== null && this.asianLow !== null) {
      return this.asianHigh - this.asianLow;
    }
    return 0;
  }
  
  getAsianMidpoint(): number | null {
    if (this.asianHigh !== null && this.asianLow !== null) {
      return (this.asianHigh + this.asianLow) / 2;
    }
    return null;
  }
  
  detectManipulation(currentPrice: number): boolean {
    if (this.asianHigh === null || this.asianLow === null) {
      return false;
    }
    
    // Simple manipulation detection logic
    return currentPrice > this.asianHigh || currentPrice < this.asianLow;
  }
  
  getCurrentPhase(currentTime: Date): string {
    const hour = currentTime.getUTCHours();
    
    if (hour >= 21 || hour < 6) {
      return 'Accumulation';
    } else if (hour >= 3 && hour < 8) {
      return 'Manipulation';
    } else if (hour >= 8 && hour < 17) {
      return 'Distribution';
    } else {
      return 'Markdown';
    }
  }
  
  getTrendDirection(currentPrice: number): 'bullish' | 'bearish' | 'neutral' {
    const midpoint = this.getAsianMidpoint();
    if (midpoint === null) {
      return 'neutral';
    }
    
    const threshold = this.getAsianRange() * 0.1; // 10% of range as threshold
    
    if (currentPrice > midpoint + threshold) {
      return 'bullish';
    } else if (currentPrice < midpoint - threshold) {
      return 'bearish';
    } else {
      return 'neutral';
    }
  }
  
  getIndicators(currentPrice: number, currentTime: Date): BTMMIndicators {
    return {
      asianHigh: this.asianHigh,
      asianLow: this.asianLow,
      asianRange: this.getAsianRange(),
      asianMidpoint: this.getAsianMidpoint(),
      currentPhase: this.getCurrentPhase(currentTime),
      manipulationDetected: this.detectManipulation(currentPrice),
      trendDirection: this.getTrendDirection(currentPrice),
      volatility: this.calculateVolatility(currentTime)
    };
  }
  
  private calculateVolatility(currentTime: Date): 'low' | 'medium' | 'high' {
    const hour = currentTime.getUTCHours();
    
    // High volatility during London open and NY overlap
    if ((hour >= 3 && hour < 5) || (hour >= 8 && hour < 11)) {
      return 'high';
    }
    // Medium volatility during main trading sessions
    else if ((hour >= 5 && hour < 17)) {
      return 'medium';
    }
    // Low volatility during Asian and off-market hours
    else {
      return 'low';
    }
  }
}

export const BTMM_RISK_RULES = {
  maxRiskPerTrade: 2.0, // 2% per trade
  maxDailyRisk: 6.0,    // 6% per day
  maxPositions: 3,       // Maximum simultaneous positions
  minRiskReward: 2.0,    // Minimum 2:1 risk/reward ratio
  maxConsecutiveLosses: 3, // Stop trading after 3 consecutive losses
  
  // Session-based rules
  avoidAsianTrading: true,
  tradeLondonManipulation: false,
  focusOnDistribution: true,
  closeBeforeWeekend: true,
  
  // Market condition filters
  minAsianRangePips: 20,
  maxAsianRangePips: 100,
  requiredVolume: 1.5, // Multiplier of average volume
  avoidNewsEvents: true
};

export const BTMM_CONFLUENCE_FACTORS = [
  'Asian range break with volume',
  'Multi-timeframe trend alignment',
  'Previous day high/low levels',
  'Fibonacci retracement levels',
  'Moving average confluence',
  'RSI divergence signals',
  'Session overlap periods',
  'Economic news release times'
];

export const generateBTMMSignal = (
  price: number,
  volume: number,
  time: Date,
  analyzer: BTMMAnalyzer
): {
  signal: 'buy' | 'sell' | 'wait';
  confidence: number;
  reasons: string[];
} => {
  const indicators = analyzer.getIndicators(price, time);
  const reasons: string[] = [];
  let confidence = 0;
  let signal: 'buy' | 'sell' | 'wait' = 'wait';
  
  // Phase-based logic
  if (indicators.currentPhase === 'Distribution') {
    if (indicators.trendDirection === 'bullish' && !indicators.manipulationDetected) {
      signal = 'buy';
      confidence += 30;
      reasons.push('Distribution phase with bullish trend');
    } else if (indicators.trendDirection === 'bearish' && !indicators.manipulationDetected) {
      signal = 'sell';
      confidence += 30;
      reasons.push('Distribution phase with bearish trend');
    }
  }
  
  // Manipulation reversal logic
  if (indicators.currentPhase === 'Manipulation' && indicators.manipulationDetected) {
    confidence += 20;
    reasons.push('Manipulation detected - potential reversal setup');
  }
  
  // Range analysis
  if (indicators.asianRange && indicators.asianRange > 0) {
    const rangeInPips = indicators.asianRange * 10000; // Assuming EUR/USD-like pair
    if (rangeInPips >= BTMM_RISK_RULES.minAsianRangePips && 
        rangeInPips <= BTMM_RISK_RULES.maxAsianRangePips) {
      confidence += 15;
      reasons.push('Asian range within optimal parameters');
    }
  }
  
  // Volume confirmation
  const avgVolume = 1000; // This would be calculated from historical data
  if (volume > avgVolume * BTMM_RISK_RULES.requiredVolume) {
    confidence += 15;
    reasons.push('Volume confirmation present');
  }
  
  // Time-based filters
  const hour = time.getUTCHours();
  if (hour >= 8 && hour <= 17) { // NY session
    confidence += 10;
    reasons.push('Trading during optimal time window');
  }
  
  return {
    signal: confidence >= 50 ? signal : 'wait',
    confidence: Math.min(confidence, 100),
    reasons
  };
};

export default {
  BTMM_PHASES,
  BTMM_SESSIONS,
  BTMM_RISK_RULES,
  BTMM_CONFLUENCE_FACTORS,
  BTMMAnalyzer,
  generateBTMMSignal
};
