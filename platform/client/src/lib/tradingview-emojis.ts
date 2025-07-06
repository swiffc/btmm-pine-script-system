// TradingView Emojis and Visual Elements System
export interface TradingViewEmoji {
  id?: number;
  name: string;
  emoji: string;
  category: 'signals' | 'patterns' | 'levels' | 'sessions' | 'emotions' | 'risk' | 'currency';
  description?: string;
  tradingContext?: string;
  isCustom?: boolean;
  createdAt?: Date;
}

// Comprehensive TradingView Emoji Library
export const TRADINGVIEW_EMOJIS: TradingViewEmoji[] = [
  // === SIGNAL EMOJIS ===
  { name: 'Bullish Signal', emoji: '🚀', category: 'signals', description: 'Strong bullish momentum', tradingContext: 'Use when price breaks above key resistance' },
  { name: 'Bearish Signal', emoji: '📉', category: 'signals', description: 'Strong bearish momentum', tradingContext: 'Use when price breaks below key support' },
  { name: 'Entry Signal', emoji: '🎯', category: 'signals', description: 'Perfect entry opportunity', tradingContext: 'Mark high-probability entry points' },
  { name: 'Exit Signal', emoji: '🚪', category: 'signals', description: 'Time to exit position', tradingContext: 'Mark take profit or stop loss levels' },
  { name: 'Buy Signal', emoji: '✅', category: 'signals', description: 'Long position signal', tradingContext: 'Confirm bullish setup' },
  { name: 'Sell Signal', emoji: '❌', category: 'signals', description: 'Short position signal', tradingContext: 'Confirm bearish setup' },
  { name: 'Wait Signal', emoji: '⏳', category: 'signals', description: 'Wait for better setup', tradingContext: 'Mark areas to avoid trading' },
  { name: 'Strong Signal', emoji: '💪', category: 'signals', description: 'High confidence signal', tradingContext: 'Mark ultimate confluence zones' },

  // === PATTERN EMOJIS ===
  { name: 'M Pattern', emoji: '🔻', category: 'patterns', description: 'Bearish M pattern', tradingContext: 'Mark completed M patterns' },
  { name: 'W Pattern', emoji: '🔺', category: 'patterns', description: 'Bullish W pattern', tradingContext: 'Mark completed W patterns' },
  { name: 'Triangle', emoji: '🔺', category: 'patterns', description: 'Triangle pattern formation', tradingContext: 'Mark consolidation triangles' },
  { name: 'Flag Pattern', emoji: '🏁', category: 'patterns', description: 'Bull or bear flag', tradingContext: 'Mark continuation patterns' },
  { name: 'Head Shoulders', emoji: '👤', category: 'patterns', description: 'Head and shoulders pattern', tradingContext: 'Mark reversal patterns' },
  { name: 'Double Top', emoji: '⛰️', category: 'patterns', description: 'Double top formation', tradingContext: 'Mark resistance areas' },
  { name: 'Double Bottom', emoji: '⛰️', category: 'patterns', description: 'Double bottom formation', tradingContext: 'Mark support areas' },
  { name: 'Wedge', emoji: '📐', category: 'patterns', description: 'Rising or falling wedge', tradingContext: 'Mark wedge formations' },

  // === LEVEL EMOJIS ===
  { name: 'Support', emoji: '🛡️', category: 'levels', description: 'Strong support level', tradingContext: 'Mark key support zones' },
  { name: 'Resistance', emoji: '🚧', category: 'levels', description: 'Strong resistance level', tradingContext: 'Mark key resistance zones' },
  { name: 'Key Level', emoji: '🗝️', category: 'levels', description: 'Critical price level', tradingContext: 'Mark most important levels' },
  { name: 'Breakout', emoji: '💥', category: 'levels', description: 'Level breakout', tradingContext: 'Mark confirmed breakouts' },
  { name: 'Fake Out', emoji: '🎭', category: 'levels', description: 'False breakout', tradingContext: 'Mark failed breakouts' },
  { name: 'Retest', emoji: '🔄', category: 'levels', description: 'Level retest', tradingContext: 'Mark level retests' },
  { name: 'Pivot Point', emoji: '⚖️', category: 'levels', description: 'Pivot point level', tradingContext: 'Mark daily/weekly pivots' },
  { name: 'Fibonacci', emoji: '🌀', category: 'levels', description: 'Fibonacci level', tradingContext: 'Mark Fib retracement levels' },

  // === SESSION EMOJIS ===
  { name: 'Asian Session', emoji: '🌏', category: 'sessions', description: 'Asian trading session', tradingContext: 'Mark Asian session times' },
  { name: 'London Session', emoji: '🇬🇧', category: 'sessions', description: 'London trading session', tradingContext: 'Mark London session times' },
  { name: 'New York Session', emoji: '🇺🇸', category: 'sessions', description: 'New York session', tradingContext: 'Mark NY session times' },
  { name: 'Session Open', emoji: '🔔', category: 'sessions', description: 'Session opening', tradingContext: 'Mark session start times' },
  { name: 'Session Close', emoji: '🔕', category: 'sessions', description: 'Session closing', tradingContext: 'Mark session end times' },
  { name: 'Overlap', emoji: '🤝', category: 'sessions', description: 'Session overlap period', tradingContext: 'Mark high volatility periods' },
  { name: 'Quiet Period', emoji: '😴', category: 'sessions', description: 'Low volatility time', tradingContext: 'Mark consolidation periods' },
  { name: 'News Time', emoji: '📰', category: 'sessions', description: 'News release time', tradingContext: 'Mark high-impact news' },

  // === EMOTION EMOJIS ===
  { name: 'Euphoria', emoji: '🤩', category: 'emotions', description: 'Market euphoria', tradingContext: 'Mark overextended bullish moves' },
  { name: 'Fear', emoji: '😱', category: 'emotions', description: 'Market fear', tradingContext: 'Mark panic selling areas' },
  { name: 'Greed', emoji: '🤑', category: 'emotions', description: 'Market greed', tradingContext: 'Mark FOMO buying areas' },
  { name: 'Uncertainty', emoji: '🤔', category: 'emotions', description: 'Market uncertainty', tradingContext: 'Mark indecision zones' },
  { name: 'Confidence', emoji: '😎', category: 'emotions', description: 'Market confidence', tradingContext: 'Mark strong trending moves' },
  { name: 'Panic', emoji: '😰', category: 'emotions', description: 'Market panic', tradingContext: 'Mark flash crash areas' },
  { name: 'Relief', emoji: '😌', category: 'emotions', description: 'Market relief', tradingContext: 'Mark bounce from oversold' },
  { name: 'Frustration', emoji: '😤', category: 'emotions', description: 'Market frustration', tradingContext: 'Mark sideways choppy action' },

  // === RISK EMOJIS ===
  { name: 'High Risk', emoji: '🚨', category: 'risk', description: 'High risk area', tradingContext: 'Mark dangerous trading zones' },
  { name: 'Low Risk', emoji: '✅', category: 'risk', description: 'Low risk opportunity', tradingContext: 'Mark safe entry zones' },
  { name: 'Stop Hunt', emoji: '🎣', category: 'risk', description: 'Stop hunt warning', tradingContext: 'Mark potential stop hunt areas' },
  { name: 'Trap', emoji: '🪤', category: 'risk', description: 'Bull or bear trap', tradingContext: 'Mark fake breakout areas' },
  { name: 'Safe Zone', emoji: '🛡️', category: 'risk', description: 'Safe trading area', tradingContext: 'Mark low-risk zones' },
  { name: 'Danger Zone', emoji: '⚠️', category: 'risk', description: 'Dangerous area', tradingContext: 'Mark high-risk zones' },
  { name: 'Manipulation', emoji: '🎪', category: 'risk', description: 'Market manipulation', tradingContext: 'Mark MM manipulation areas' },
  { name: 'Squeeze', emoji: '🤏', category: 'risk', description: 'Short/long squeeze', tradingContext: 'Mark squeeze setups' },

  // === CURRENCY SPECIFIC ===
  { name: 'Dollar Strong', emoji: '💵', category: 'currency', description: 'USD strength', tradingContext: 'Mark USD bullish periods' },
  { name: 'Euro Strong', emoji: '💶', category: 'currency', description: 'EUR strength', tradingContext: 'Mark EUR bullish periods' },
  { name: 'Pound Strong', emoji: '💷', category: 'currency', description: 'GBP strength', tradingContext: 'Mark GBP bullish periods' },
  { name: 'Yen Strong', emoji: '💴', category: 'currency', description: 'JPY strength', tradingContext: 'Mark JPY bullish periods' },
  { name: 'Gold', emoji: '🏆', category: 'currency', description: 'Gold analysis', tradingContext: 'Mark gold trading setups' },
  { name: 'Oil', emoji: '🛢️', category: 'currency', description: 'Oil correlation', tradingContext: 'Mark oil-related moves' },
  { name: 'Commodity', emoji: '📦', category: 'currency', description: 'Commodity impact', tradingContext: 'Mark commodity correlations' },
  { name: 'Risk On', emoji: '📈', category: 'currency', description: 'Risk-on sentiment', tradingContext: 'Mark risk-on periods' },
  { name: 'Risk Off', emoji: '📉', category: 'currency', description: 'Risk-off sentiment', tradingContext: 'Mark risk-off periods' },

  // === BTMM SPECIFIC ===
  { name: 'Perfect Stack', emoji: '🔥', category: 'signals', description: 'Perfect EMA stack', tradingContext: 'Mark perfect BTMM stack formation' },
  { name: 'Mustard Line', emoji: '🟡', category: 'levels', description: 'EMA 5 (Mustard)', tradingContext: 'Mark EMA 5 interactions' },
  { name: 'Ketchup Line', emoji: '🔴', category: 'levels', description: 'EMA 13 (Ketchup)', tradingContext: 'Mark critical EMA 13 breaks' },
  { name: 'Water Line', emoji: '💧', category: 'levels', description: 'EMA 50 (Water)', tradingContext: 'Mark EMA 50 interactions' },
  { name: 'Mayo Line', emoji: '🟢', category: 'levels', description: 'EMA 200 (Mayo)', tradingContext: 'Mark EMA 200 interactions' },
  { name: 'Blueberry Line', emoji: '🫐', category: 'levels', description: 'EMA 800 (Blueberry)', tradingContext: 'Mark EMA 800 interactions' },
  { name: 'Asian Box', emoji: '📦', category: 'levels', description: 'Asian session range', tradingContext: 'Mark Asian session box' },
  { name: 'Institution', emoji: '🏦', category: 'signals', description: 'Institutional activity', tradingContext: 'Mark big player moves' },
  { name: 'Retail Trap', emoji: '🪤', category: 'risk', description: 'Retail trader trap', tradingContext: 'Mark retail sentiment traps' },
  { name: 'Smart Money', emoji: '🧠', category: 'signals', description: 'Smart money move', tradingContext: 'Mark institutional flow' },
];

// Emoji Management Functions
export class EmojiManager {
  private customEmojis: Map<number, TradingViewEmoji> = new Map();

  // Get all emojis (built-in + custom)
  getAllEmojis(): TradingViewEmoji[] {
    return [
      ...TRADINGVIEW_EMOJIS,
      ...Array.from(this.customEmojis.values())
    ];
  }

  // Get emojis by category
  getEmojisByCategory(category: string): TradingViewEmoji[] {
    return this.getAllEmojis().filter(emoji => emoji.category === category);
  }

  // Search emojis
  searchEmojis(query: string): TradingViewEmoji[] {
    const searchTerm = query.toLowerCase();
    return this.getAllEmojis().filter(emoji => 
      emoji.name.toLowerCase().includes(searchTerm) ||
      emoji.description?.toLowerCase().includes(searchTerm) ||
      emoji.tradingContext?.toLowerCase().includes(searchTerm)
    );
  }

  // Add custom emoji
  addCustomEmoji(emoji: Omit<TradingViewEmoji, 'id' | 'createdAt'>): number {
    const id = Date.now();
    const customEmoji: TradingViewEmoji = {
      ...emoji,
      id,
      isCustom: true,
      createdAt: new Date()
    };
    this.customEmojis.set(id, customEmoji);
    return id;
  }

  // Update custom emoji
  updateCustomEmoji(id: number, updates: Partial<TradingViewEmoji>): boolean {
    const emoji = this.customEmojis.get(id);
    if (!emoji) return false;

    Object.assign(emoji, updates);
    this.customEmojis.set(id, emoji);
    return true;
  }

  // Delete custom emoji
  deleteCustomEmoji(id: number): boolean {
    return this.customEmojis.delete(id);
  }

  // Get emoji by name
  getEmojiByName(name: string): TradingViewEmoji | undefined {
    return this.getAllEmojis().find(emoji => emoji.name === name);
  }

  // Get random emoji from category
  getRandomEmoji(category?: string): TradingViewEmoji {
    const emojis = category ? this.getEmojisByCategory(category) : this.getAllEmojis();
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  // Get emoji suggestions based on context
  getContextualEmojis(context: string): TradingViewEmoji[] {
    const contextLower = context.toLowerCase();
    const suggestions: TradingViewEmoji[] = [];

    // Pattern-based suggestions
    if (contextLower.includes('bullish') || contextLower.includes('buy') || contextLower.includes('long')) {
      suggestions.push(...this.getEmojisByCategory('signals').filter(e => 
        e.name.includes('Bullish') || e.name.includes('Buy') || e.emoji === '🚀'
      ));
    }

    if (contextLower.includes('bearish') || contextLower.includes('sell') || contextLower.includes('short')) {
      suggestions.push(...this.getEmojisByCategory('signals').filter(e => 
        e.name.includes('Bearish') || e.name.includes('Sell') || e.emoji === '📉'
      ));
    }

    // Session-based suggestions
    if (contextLower.includes('asian')) {
      suggestions.push(...this.getEmojisByCategory('sessions').filter(e => e.name.includes('Asian')));
    }

    if (contextLower.includes('london')) {
      suggestions.push(...this.getEmojisByCategory('sessions').filter(e => e.name.includes('London')));
    }

    // Pattern suggestions
    if (contextLower.includes('m pattern') || contextLower.includes('m-pattern')) {
      suggestions.push(...this.getAllEmojis().filter(e => e.name.includes('M Pattern')));
    }

    if (contextLower.includes('w pattern') || contextLower.includes('w-pattern')) {
      suggestions.push(...this.getAllEmojis().filter(e => e.name.includes('W Pattern')));
    }

    // Risk suggestions
    if (contextLower.includes('stop hunt') || contextLower.includes('manipulation')) {
      suggestions.push(...this.getEmojisByCategory('risk'));
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  // Format emoji for display
  formatEmoji(emoji: TradingViewEmoji, includeDescription = false): string {
    let result = `${emoji.emoji} ${emoji.name}`;
    if (includeDescription && emoji.description) {
      result += ` - ${emoji.description}`;
    }
    return result;
  }

  // Export emojis configuration
  exportConfiguration(): any {
    return {
      builtInEmojis: TRADINGVIEW_EMOJIS.length,
      customEmojis: Array.from(this.customEmojis.values()),
      categories: [...new Set(this.getAllEmojis().map(e => e.category))],
      totalEmojis: this.getAllEmojis().length
    };
  }

  // Import custom emojis
  importCustomEmojis(emojis: TradingViewEmoji[]): number {
    let imported = 0;
    emojis.forEach(emoji => {
      if (emoji.isCustom) {
        const id = this.addCustomEmoji(emoji);
        if (id) imported++;
      }
    });
    return imported;
  }
}

// Global emoji manager instance
export const emojiManager = new EmojiManager();

// Utility functions
export const getEmojiCategories = (): string[] => {
  return [...new Set(TRADINGVIEW_EMOJIS.map(emoji => emoji.category))];
};

export const findEmojiBySymbol = (symbol: string): TradingViewEmoji[] => {
  return TRADINGVIEW_EMOJIS.filter(emoji => emoji.emoji === symbol);
};

export const getPopularEmojis = (): TradingViewEmoji[] => {
  // Return most commonly used emojis for quick access
  return TRADINGVIEW_EMOJIS.filter(emoji => 
    ['🚀', '📉', '🎯', '✅', '❌', '⚠️', '🔥', '💪', '🛡️', '🚧'].includes(emoji.emoji)
  );
};