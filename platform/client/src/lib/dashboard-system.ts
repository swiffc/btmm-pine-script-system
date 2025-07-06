// Advanced Dashboard System for BTMM Platform
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'alert' | 'news' | 'calendar' | 'performance' | 'emoji-panel' | 'strategy-guide';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  isVisible: boolean;
  refreshInterval?: number; // seconds
}

export interface DashboardLayout {
  id?: number;
  userId?: number;
  name: string;
  description?: string;
  layout: {
    cols: number;
    rowHeight: number;
    margin: [number, number];
    containerPadding: [number, number];
  };
  widgets: DashboardWidget[];
  theme: 'dark' | 'light' | 'auto';
  isDefault: boolean;
  isShared: boolean;
  shareToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Pre-built Dashboard Templates
export const DASHBOARD_TEMPLATES: Omit<DashboardLayout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'BTMM Professional',
    description: 'Complete BTMM trading dashboard with all essential widgets',
    layout: {
      cols: 12,
      rowHeight: 100,
      margin: [10, 10],
      containerPadding: [10, 10]
    },
    theme: 'dark',
    isDefault: true,
    isShared: false,
    widgets: [
      {
        id: 'market-overview',
        type: 'chart',
        title: 'Market Overview',
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {
          chartType: 'candlestick',
          timeframe: '15m',
          symbol: 'EURUSD',
          indicators: ['ema_5', 'ema_13', 'ema_50', 'ema_200', 'ema_800'],
          showPatterns: true,
          showLevels: true
        },
        isVisible: true,
        refreshInterval: 30
      },
      {
        id: 'session-timer',
        type: 'metric',
        title: 'Trading Sessions',
        position: { x: 8, y: 0, w: 4, h: 2 },
        config: {
          showAsian: true,
          showLondon: true,
          showNY: true,
          showCountdown: true,
          highlightActive: true
        },
        isVisible: true,
        refreshInterval: 60
      },
      {
        id: 'btmm-signals',
        type: 'alert',
        title: 'BTMM Signals',
        position: { x: 8, y: 2, w: 4, h: 2 },
        config: {
          showActive: true,
          showRecent: true,
          maxItems: 5,
          priorityFilter: ['high', 'urgent']
        },
        isVisible: true,
        refreshInterval: 15
      },
      {
        id: 'ema-status',
        type: 'table',
        title: 'EMA Status (Food Names)',
        position: { x: 0, y: 4, w: 6, h: 2 },
        config: {
          emas: [
            { length: 5, name: 'Mustard', color: '#FFFF00' },
            { length: 13, name: 'Ketchup', color: '#FF0000' },
            { length: 50, name: 'Water', color: '#00FFFF' },
            { length: 200, name: 'Mayo', color: '#00FF00' },
            { length: 800, name: 'Blueberry', color: '#800080' }
          ],
          showValues: true,
          showDirection: true,
          showCrossings: true
        },
        isVisible: true,
        refreshInterval: 30
      },
      {
        id: 'pattern-detector',
        type: 'metric',
        title: 'Pattern Detection',
        position: { x: 6, y: 4, w: 3, h: 2 },
        config: {
          patterns: ['M', 'W', 'triangle', 'flag'],
          showConfidence: true,
          minConfidence: 0.7,
          timeframes: ['15m', '1h', '4h']
        },
        isVisible: true,
        refreshInterval: 60
      },
      {
        id: 'risk-meter',
        type: 'metric',
        title: 'Risk Meter',
        position: { x: 9, y: 4, w: 3, h: 2 },
        config: {
          factors: ['volatility', 'session', 'news', 'patterns'],
          showBreakdown: true,
          alertThreshold: 'high'
        },
        isVisible: true,
        refreshInterval: 30
      },
      {
        id: 'trading-performance',
        type: 'performance',
        title: 'Performance Metrics',
        position: { x: 0, y: 6, w: 6, h: 3 },
        config: {
          timeRange: '7d',
          metrics: ['winRate', 'avgRR', 'totalTrades', 'pnl'],
          showChart: true,
          compareToStrategy: 'btmm'
        },
        isVisible: true,
        refreshInterval: 300
      },
      {
        id: 'emoji-panel',
        type: 'emoji-panel',
        title: 'TradingView Emojis',
        position: { x: 6, y: 6, w: 3, h: 3 },
        config: {
          categories: ['signals', 'patterns', 'risk'],
          showRecent: true,
          showFavorites: true,
          maxVisible: 12
        },
        isVisible: true
      },
      {
        id: 'strategy-guide',
        type: 'strategy-guide',
        title: 'BTMM Quick Guide',
        position: { x: 9, y: 6, w: 3, h: 3 },
        config: {
          sections: ['bias', 'sessions', 'patterns', 'risk'],
          showTips: true,
          showPhase: true
        },
        isVisible: true
      },
      {
        id: 'economic-calendar',
        type: 'calendar',
        title: 'Economic Calendar',
        position: { x: 0, y: 9, w: 12, h: 2 },
        config: {
          impactLevel: 'medium',
          currencies: ['USD', 'EUR', 'GBP', 'JPY'],
          timeRange: '24h',
          showCountdown: true
        },
        isVisible: true,
        refreshInterval: 600
      }
    ]
  },
  {
    name: 'BTMM Scalper',
    description: 'Optimized for quick scalping trades with minimal widgets',
    layout: {
      cols: 8,
      rowHeight: 120,
      margin: [5, 5],
      containerPadding: [5, 5]
    },
    theme: 'dark',
    isDefault: false,
    isShared: false,
    widgets: [
      {
        id: 'scalp-chart',
        type: 'chart',
        title: 'Scalping Chart',
        position: { x: 0, y: 0, w: 6, h: 4 },
        config: {
          chartType: 'candlestick',
          timeframe: '1m',
          symbol: 'EURUSD',
          indicators: ['ema_5', 'ema_13'],
          showPatterns: false,
          showLevels: true,
          fastUpdate: true
        },
        isVisible: true,
        refreshInterval: 5
      },
      {
        id: 'quick-signals',
        type: 'alert',
        title: 'Quick Signals',
        position: { x: 6, y: 0, w: 2, h: 2 },
        config: {
          showActive: true,
          maxItems: 3,
          priorityFilter: ['urgent'],
          autoHide: true
        },
        isVisible: true,
        refreshInterval: 5
      },
      {
        id: 'session-status',
        type: 'metric',
        title: 'Session',
        position: { x: 6, y: 2, w: 2, h: 1 },
        config: {
          compact: true,
          showActive: true,
          showNext: true
        },
        isVisible: true,
        refreshInterval: 60
      },
      {
        id: 'risk-quick',
        type: 'metric',
        title: 'Risk',
        position: { x: 6, y: 3, w: 2, h: 1 },
        config: {
          compact: true,
          showLevel: true,
          alertOnly: true
        },
        isVisible: true,
        refreshInterval: 30
      }
    ]
  },
  {
    name: 'BTMM Analyst',
    description: 'Comprehensive analysis dashboard for strategy development',
    layout: {
      cols: 16,
      rowHeight: 80,
      margin: [8, 8],
      containerPadding: [8, 8]
    },
    theme: 'light',
    isDefault: false,
    isShared: true,
    widgets: [
      {
        id: 'multi-timeframe',
        type: 'chart',
        title: 'Multi-Timeframe Analysis',
        position: { x: 0, y: 0, w: 12, h: 6 },
        config: {
          layouts: [
            { timeframe: '15m', position: 'top-left' },
            { timeframe: '1h', position: 'top-right' },
            { timeframe: '4h', position: 'bottom-left' },
            { timeframe: '1d', position: 'bottom-right' }
          ],
          syncCrosshair: true,
          showCorrelation: true
        },
        isVisible: true,
        refreshInterval: 60
      },
      {
        id: 'correlation-matrix',
        type: 'table',
        title: 'Currency Correlation',
        position: { x: 12, y: 0, w: 4, h: 3 },
        config: {
          pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'],
          showHeatmap: true,
          timeRange: '24h'
        },
        isVisible: true,
        refreshInterval: 300
      },
      {
        id: 'pattern-analysis',
        type: 'table',
        title: 'Pattern Analysis',
        position: { x: 12, y: 3, w: 4, h: 3 },
        config: {
          patterns: ['M', 'W', 'triangle', 'flag', 'wedge'],
          showSuccessRate: true,
          showBacktest: true,
          timeRange: '30d'
        },
        isVisible: true,
        refreshInterval: 600
      },
      {
        id: 'strategy-backtest',
        type: 'performance',
        title: 'Strategy Backtest',
        position: { x: 0, y: 6, w: 8, h: 4 },
        config: {
          strategy: 'btmm',
          timeRange: '90d',
          metrics: ['winRate', 'avgRR', 'maxDD', 'sharpe'],
          showEquityCurve: true,
          showDrawdown: true
        },
        isVisible: true,
        refreshInterval: 3600
      },
      {
        id: 'optimization-results',
        type: 'table',
        title: 'Parameter Optimization',
        position: { x: 8, y: 6, w: 8, h: 4 },
        config: {
          parameters: ['ema_lengths', 'pattern_tolerance', 'session_timing'],
          showResults: true,
          sortBy: 'sharpe',
          topN: 10
        },
        isVisible: true,
        refreshInterval: 3600
      }
    ]
  }
];

// Dashboard Management Class
export class DashboardManager {
  private dashboards: Map<number, DashboardLayout> = new Map();
  private currentDashboard: DashboardLayout | null = null;
  private subscribers: Map<string, Function[]> = new Map();

  constructor() {
    this.loadDashboards();
  }

  // Event subscription
  subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const callbacks = this.subscribers.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Load dashboards from storage
  private loadDashboards() {
    // Load from localStorage or API
    const saved = localStorage.getItem('btmm_dashboards');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        data.forEach((dashboard: DashboardLayout, index: number) => {
          this.dashboards.set(index, dashboard);
        });
      } catch (error) {
        console.error('Failed to load dashboards:', error);
      }
    }

    // If no dashboards, create default
    if (this.dashboards.size === 0) {
      this.createDefaultDashboard();
    }
  }

  // Save dashboards to storage
  private saveDashboards() {
    try {
      const data = Array.from(this.dashboards.values());
      localStorage.setItem('btmm_dashboards', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save dashboards:', error);
    }
  }

  // Create dashboard from template
  createFromTemplate(templateName: string, customName?: string): number {
    const template = DASHBOARD_TEMPLATES.find(t => t.name === templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    const dashboard: DashboardLayout = {
      ...template,
      id: Date.now(),
      name: customName || template.name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.addDashboard(dashboard);
  }

  // Add new dashboard
  addDashboard(dashboard: DashboardLayout): number {
    const id = dashboard.id || Date.now();
    dashboard.id = id;
    dashboard.createdAt = dashboard.createdAt || new Date();
    dashboard.updatedAt = new Date();

    this.dashboards.set(id, dashboard);
    this.saveDashboards();
    this.emit('dashboardAdded', dashboard);
    return id;
  }

  // Update dashboard
  updateDashboard(id: number, updates: Partial<DashboardLayout>): boolean {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return false;

    Object.assign(dashboard, updates, { updatedAt: new Date() });
    this.dashboards.set(id, dashboard);
    this.saveDashboards();
    this.emit('dashboardUpdated', dashboard);
    return true;
  }

  // Delete dashboard
  deleteDashboard(id: number): boolean {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return false;

    this.dashboards.delete(id);
    this.saveDashboards();
    this.emit('dashboardDeleted', { id, dashboard });
    return true;
  }

  // Get all dashboards
  getDashboards(): DashboardLayout[] {
    return Array.from(this.dashboards.values());
  }

  // Get dashboard by ID
  getDashboard(id: number): DashboardLayout | undefined {
    return this.dashboards.get(id);
  }

  // Set current dashboard
  setCurrentDashboard(id: number): boolean {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return false;

    this.currentDashboard = dashboard;
    this.emit('dashboardChanged', dashboard);
    return true;
  }

  // Get current dashboard
  getCurrentDashboard(): DashboardLayout | null {
    return this.currentDashboard;
  }

  // Create default dashboard
  private createDefaultDashboard() {
    const defaultTemplate = DASHBOARD_TEMPLATES.find(t => t.isDefault);
    if (defaultTemplate) {
      const id = this.createFromTemplate(defaultTemplate.name);
      this.setCurrentDashboard(id);
    }
  }

  // Add widget to dashboard
  addWidget(dashboardId: number, widget: DashboardWidget): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    dashboard.widgets.push(widget);
    dashboard.updatedAt = new Date();
    this.saveDashboards();
    this.emit('widgetAdded', { dashboard, widget });
    return true;
  }

  // Update widget
  updateWidget(dashboardId: number, widgetId: string, updates: Partial<DashboardWidget>): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    const widget = dashboard.widgets.find(w => w.id === widgetId);
    if (!widget) return false;

    Object.assign(widget, updates);
    dashboard.updatedAt = new Date();
    this.saveDashboards();
    this.emit('widgetUpdated', { dashboard, widget });
    return true;
  }

  // Remove widget
  removeWidget(dashboardId: number, widgetId: string): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    const index = dashboard.widgets.findIndex(w => w.id === widgetId);
    if (index === -1) return false;

    const widget = dashboard.widgets.splice(index, 1)[0];
    dashboard.updatedAt = new Date();
    this.saveDashboards();
    this.emit('widgetRemoved', { dashboard, widget });
    return true;
  }

  // Export dashboard
  exportDashboard(id: number): string | null {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return null;

    return JSON.stringify(dashboard, null, 2);
  }

  // Import dashboard
  importDashboard(data: string): number | null {
    try {
      const dashboard = JSON.parse(data) as DashboardLayout;
      const importedDashboard = {
        ...dashboard,
        name: `${dashboard.name} (Imported)`,
      };
      delete (importedDashboard as any).id; // Remove ID to get new one
      return this.addDashboard(importedDashboard);
    } catch (error) {
      console.error('Failed to import dashboard:', error);
      return null;
    }
  }

  // Clone dashboard
  cloneDashboard(id: number, newName?: string): number | null {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return null;

    const clone = {
      ...dashboard,
      name: newName || `${dashboard.name} (Copy)`,
      isShared: false as const,
    };
    delete (clone as any).id;
    delete (clone as any).shareToken;

    return this.addDashboard(clone as any);
  }

  // Get dashboard templates
  getTemplates(): typeof DASHBOARD_TEMPLATES {
    return DASHBOARD_TEMPLATES;
  }

  // Search dashboards
  searchDashboards(query: string): DashboardLayout[] {
    const searchTerm = query.toLowerCase();
    return this.getDashboards().filter(dashboard =>
      dashboard.name.toLowerCase().includes(searchTerm) ||
      dashboard.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Get dashboards by theme
  getDashboardsByTheme(theme: string): DashboardLayout[] {
    return this.getDashboards().filter(dashboard => dashboard.theme === theme);
  }

  // Validate dashboard layout
  validateDashboard(dashboard: DashboardLayout): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dashboard.name || dashboard.name.trim().length === 0) {
      errors.push('Dashboard name is required');
    }

    if (!dashboard.layout) {
      errors.push('Dashboard layout configuration is required');
    }

    if (!dashboard.widgets || dashboard.widgets.length === 0) {
      errors.push('Dashboard must have at least one widget');
    }

    // Validate widget positions don't overlap
    const positions = dashboard.widgets.map(w => w.position);
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];
        if (this.doPositionsOverlap(pos1, pos2)) {
          errors.push(`Widgets ${i + 1} and ${j + 1} have overlapping positions`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private doPositionsOverlap(pos1: DashboardWidget['position'], pos2: DashboardWidget['position']): boolean {
    return !(pos1.x + pos1.w <= pos2.x ||
             pos2.x + pos2.w <= pos1.x ||
             pos1.y + pos1.h <= pos2.y ||
             pos2.y + pos2.h <= pos1.y);
  }
}

// Global dashboard manager instance
export const dashboardManager = new DashboardManager();