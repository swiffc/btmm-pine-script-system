// BTMM Alert System - Comprehensive Alert Management
export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  timeframe: string;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface AlertCondition {
  type: 'ema_cross' | 'pattern_detected' | 'level_break' | 'session_change' | 'stop_hunt' | 'volume_spike';
  parameters: Record<string, any>;
  timeframe: string;
  symbol: string;
}

export interface AlertAction {
  type: 'notification' | 'email' | 'sms' | 'webhook' | 'telegram' | 'discord';
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface BTMMAlert {
  id?: number;
  name: string;
  description?: string;
  type: string;
  alertType: string;
  conditions: AlertCondition[];
  actions: AlertAction[];
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeframe: string;
  symbol: string;
  lastTriggered?: Date;
  triggerCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  category: 'btmm' | 'patterns' | 'levels' | 'sessions' | 'risk';
  template: Partial<BTMMAlert>;
}

// Pre-built BTMM Alert Templates
export const BTMM_ALERT_TEMPLATES: AlertTemplate[] = [
  {
    id: 'btmm-perfect-stack',
    name: 'BTMM Perfect Stack Formation',
    description: 'Alert when all EMAs align in perfect bullish or bearish stack',
    category: 'btmm',
    template: {
      name: 'Perfect Stack Alert',
      alertType: 'ema_cross',
      conditions: [{
        type: 'ema_cross',
        parameters: {
          stackType: 'perfect',
          emas: [5, 13, 50, 200, 800],
          direction: 'any'
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '🔥 Perfect BTMM Stack Detected!',
          message: 'All EMAs are in perfect alignment - High probability setup!',
          emoji: '🚀'
        },
        priority: 'high'
      }],
      priority: 'high'
    }
  },
  {
    id: 'asian-box-breakout',
    name: 'Asian Box Breakout',
    description: 'Alert when price breaks above or below Asian session range',
    category: 'sessions',
    template: {
      name: 'Asian Breakout Alert',
      alertType: 'level_break',
      conditions: [{
        type: 'level_break',
        parameters: {
          levelType: 'asian_range',
          direction: 'any',
          confirmationBars: 2
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '📊 Asian Box Breakout!',
          message: 'Price has broken out of Asian session range',
          emoji: '📈'
        },
        priority: 'medium'
      }],
      priority: 'medium'
    }
  },
  {
    id: 'm-pattern-completion',
    name: 'M Pattern Completion',
    description: 'Alert when a bearish M pattern is completed',
    category: 'patterns',
    template: {
      name: 'M Pattern Alert',
      alertType: 'pattern_detected',
      conditions: [{
        type: 'pattern_detected',
        parameters: {
          patternType: 'M',
          minimumBars: 8,
          tolerance: 0.002,
          context: 'any'
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '🔻 Bearish M Pattern Detected!',
          message: 'M pattern completion - Consider short entry',
          emoji: '🐻'
        },
        priority: 'high'
      }],
      priority: 'high'
    }
  },
  {
    id: 'w-pattern-completion',
    name: 'W Pattern Completion',
    description: 'Alert when a bullish W pattern is completed',
    category: 'patterns',
    template: {
      name: 'W Pattern Alert',
      alertType: 'pattern_detected',
      conditions: [{
        type: 'pattern_detected',
        parameters: {
          patternType: 'W',
          minimumBars: 8,
          tolerance: 0.002,
          context: 'any'
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '🔺 Bullish W Pattern Detected!',
          message: 'W pattern completion - Consider long entry',
          emoji: '🐂'
        },
        priority: 'high'
      }],
      priority: 'high'
    }
  },
  {
    id: 'stop-hunt-warning',
    name: 'Stop Hunt Detection',
    description: 'Alert during potential stop hunt periods',
    category: 'risk',
    template: {
      name: 'Stop Hunt Warning',
      alertType: 'stop_hunt',
      conditions: [{
        type: 'stop_hunt',
        parameters: {
          sessionType: 'pre_london',
          volatilityThreshold: 1.5,
          timeWindow: 30
        },
        timeframe: '5m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '⚠️ Potential Stop Hunt Detected!',
          message: 'Avoid trading during this period - High manipulation risk',
          emoji: '🚨'
        },
        priority: 'urgent'
      }],
      priority: 'urgent'
    }
  },
  {
    id: 'london-session-start',
    name: 'London Session Start',
    description: 'Alert when London trading session begins',
    category: 'sessions',
    template: {
      name: 'London Session Alert',
      alertType: 'session_change',
      conditions: [{
        type: 'session_change',
        parameters: {
          sessionType: 'london',
          event: 'start'
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '🇬🇧 London Session Starting!',
          message: 'High volatility period beginning - Prime trading time',
          emoji: '🏛️'
        },
        priority: 'medium'
      }],
      priority: 'medium'
    }
  },
  {
    id: 'ema-13-break',
    name: 'EMA 13 (Ketchup) Break',
    description: 'Alert when price breaks above/below the critical EMA 13',
    category: 'btmm',
    template: {
      name: 'EMA 13 Break Alert',
      alertType: 'ema_cross',
      conditions: [{
        type: 'ema_cross',
        parameters: {
          emaLength: 13,
          crossType: 'price_cross',
          direction: 'any',
          confirmationBars: 1
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '🔴 Ketchup Line Break!',
          message: 'Price has crossed the critical EMA 13 line',
          emoji: '🍅'
        },
        priority: 'medium'
      }],
      priority: 'medium'
    }
  },
  {
    id: 'institutional-volume',
    name: 'Institutional Volume Spike',
    description: 'Alert when volume indicates institutional activity',
    category: 'risk',
    template: {
      name: 'Institutional Volume Alert',
      alertType: 'volume_spike',
      conditions: [{
        type: 'volume_spike',
        parameters: {
          multiplier: 2.0,
          lookbackPeriod: 20,
          sustainedBars: 3
        },
        timeframe: '15m',
        symbol: 'EURUSD'
      }],
      actions: [{
        type: 'notification',
        parameters: {
          title: '🏦 Institutional Activity Detected!',
          message: 'High volume spike indicates institutional trading',
          emoji: '🏛️'
        },
        priority: 'high'
      }],
      priority: 'high'
    }
  }
];

// Alert Management Functions
export class AlertManager {
  private alerts: Map<number, BTMMAlert> = new Map();
  private subscribers: Map<string, Function[]> = new Map();

  // Subscribe to alert events
  subscribe(eventType: string, callback: Function) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(callback);
  }

  // Trigger alert
  private emit(eventType: string, data: any) {
    const callbacks = this.subscribers.get(eventType) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Add new alert
  addAlert(alert: BTMMAlert): number {
    const id = Date.now();
    alert.id = id;
    alert.createdAt = new Date();
    alert.triggerCount = 0;
    this.alerts.set(id, alert);
    this.emit('alertAdded', alert);
    return id;
  }

  // Update alert
  updateAlert(id: number, updates: Partial<BTMMAlert>): boolean {
    const alert = this.alerts.get(id);
    if (!alert) return false;

    Object.assign(alert, updates, { updatedAt: new Date() });
    this.alerts.set(id, alert);
    this.emit('alertUpdated', alert);
    return true;
  }

  // Delete alert
  deleteAlert(id: number): boolean {
    const alert = this.alerts.get(id);
    if (!alert) return false;

    this.alerts.delete(id);
    this.emit('alertDeleted', { id, alert });
    return true;
  }

  // Get all alerts
  getAlerts(): BTMMAlert[] {
    return Array.from(this.alerts.values());
  }

  // Get alerts by type
  getAlertsByType(type: string): BTMMAlert[] {
    return this.getAlerts().filter(alert => alert.alertType === type);
  }

  // Get active alerts
  getActiveAlerts(): BTMMAlert[] {
    return this.getAlerts().filter(alert => alert.isActive);
  }

  // Trigger alert
  triggerAlert(id: number, marketData: any) {
    const alert = this.alerts.get(id);
    if (!alert || !alert.isActive) return;

    alert.lastTriggered = new Date();
    alert.triggerCount = (alert.triggerCount || 0) + 1;

    // Execute alert actions
    alert.actions.forEach(action => {
      this.executeAction(action, alert, marketData);
    });

    this.emit('alertTriggered', { alert, marketData });
  }

  // Execute alert action
  private executeAction(action: AlertAction, alert: BTMMAlert, marketData: any) {
    switch (action.type) {
      case 'notification':
        this.showNotification(action, alert, marketData);
        break;
      case 'email':
        this.sendEmail(action, alert, marketData);
        break;
      case 'webhook':
        this.callWebhook(action, alert, marketData);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  // Show browser notification
  private showNotification(action: AlertAction, alert: BTMMAlert, marketData: MarketData) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = action.parameters.title
        .replace('{symbol}', marketData.symbol)
        .replace('{type}', alert.type);
      const message = action.parameters.message
        .replace('{price}', marketData.price.toString())
        .replace('{alert}', alert.name);
      
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
    }
  }

  // Send email alert
  private async sendEmail(action: AlertAction, alert: BTMMAlert, marketData: any) {
    try {
      await fetch('/api/alerts/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: action.parameters.email,
          subject: action.parameters.title,
          body: action.parameters.message,
          alert,
          marketData
        })
      });
    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  }

  // Call webhook
  private async callWebhook(action: AlertAction, alert: BTMMAlert, marketData: any) {
    try {
      await fetch(action.parameters.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert,
          marketData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to call webhook:', error);
    }
  }

  // Check conditions and trigger alerts
  checkAlerts(marketData: any) {
    const activeAlerts = this.getActiveAlerts();
    
    activeAlerts.forEach(alert => {
      const conditionsMet = alert.conditions.every(condition => 
        this.evaluateCondition(condition, marketData)
      );

      if (conditionsMet) {
        this.triggerAlert(alert.id!, marketData);
      }
    });
  }

  // Evaluate alert condition
  private evaluateCondition(condition: AlertCondition, marketData: any): boolean {
    switch (condition.type) {
      case 'ema_cross':
        return this.checkEmaCross(condition, marketData);
      case 'pattern_detected':
        return this.checkPatternDetected(condition, marketData);
      case 'level_break':
        return this.checkLevelBreak(condition, marketData);
      case 'session_change':
        return this.checkSessionChange(condition, marketData);
      case 'stop_hunt':
        return this.checkStopHunt(condition, marketData);
      case 'volume_spike':
        return this.checkVolumeSpike(condition, marketData);
      default:
        return false;
    }
  }

  private checkEmaCross(condition: AlertCondition, marketData: any): boolean {
    // Implementation for EMA cross detection
    // Using condition and marketData for EMA analysis
    const { parameters } = condition;
    const { price } = marketData;
    return price && parameters ? false : false; // Placeholder implementation
  }

  private checkPatternDetected(condition: AlertCondition, marketData: any): boolean {
    // Implementation for pattern detection
    const { parameters } = condition;
    const { close, timestamp } = marketData;
    return close && timestamp && parameters ? false : false; // Placeholder implementation
  }

  private checkLevelBreak(condition: AlertCondition, marketData: any): boolean {
    // Implementation for level break detection
    const { parameters } = condition;
    const { high, low } = marketData;
    return high && low && parameters ? false : false; // Placeholder implementation
  }

  private checkSessionChange(condition: AlertCondition, marketData: any): boolean {
    // Implementation for session change detection
    const { timeframe } = condition;
    const { timestamp } = marketData;
    return timeframe && timestamp ? false : false; // Placeholder implementation
  }

  private checkStopHunt(condition: AlertCondition, marketData: any): boolean {
    // Implementation for stop hunt detection
    const { parameters } = condition;
    const { volume, price } = marketData;
    return volume && price && parameters ? false : false; // Placeholder implementation
  }

  private checkVolumeSpike(condition: AlertCondition, marketData: any): boolean {
    // Implementation for volume spike detection
    const { parameters } = condition;
    const { volume } = marketData;
    return volume && parameters ? false : false; // Placeholder implementation
  }
}

// Global alert manager instance
export const alertManager = new AlertManager();