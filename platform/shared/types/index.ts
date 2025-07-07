// BTMM Trading System - Shared Types

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: number;
  strategy: string;
}

export interface MarketSession {
  name: string;
  start: string;
  end: string;
  timezone: string;
  active: boolean;
}

export interface PineScriptIndicator {
  name: string;
  version: string;
  parameters: Record<string, any>;
  signals: TradingSignal[];
}
