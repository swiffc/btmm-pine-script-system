// BTMM Trading System - Client Types

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  phases: TradingPhase[];
}

export interface TradingPhase {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  actions: string[];
}

export interface MarketData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultTimeframe: string;
  notifications: boolean;
}
