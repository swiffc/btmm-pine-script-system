import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  decimal,
  varchar,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pineScriptTemplates = pgTable("pine_script_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'btmm', 'indicators', 'strategies', 'utilities'
  subcategory: text("subcategory"), // 'market-structure', 'session-analysis', 'risk-management'
  code: text("code").notNull(),
  version: text("version").notNull().default("5"),
  tags: text("tags").array().default([]),
  isBuiltIn: boolean("is_built_in").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  files: jsonb("files").notNull(), // Array of file objects with name, content, type
  settings: jsonb("settings"), // Project-specific settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const codeSnippets = pgTable("code_snippets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  language: text("language").notNull().default("pinescript"),
  category: text("category").notNull(),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sessions storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Custom alerts system
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  alertType: text("alert_type").notNull(), // 'pattern', 'ema_cross', 'session', 'level_break', 'stop_hunt'
  conditions: jsonb("conditions").notNull(), // Alert trigger conditions
  actions: jsonb("actions").notNull(), // What to do when triggered
  isActive: boolean("is_active").default(true),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  timeframe: text("timeframe").notNull().default("15m"),
  symbol: text("symbol").notNull().default("EURUSD"),
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// TradingView emojis and visual elements
export const tradingViewEmojis = pgTable("trading_view_emojis", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  emoji: text("emoji").notNull(),
  category: text("category").notNull(), // 'signals', 'patterns', 'levels', 'sessions', 'emotions'
  description: text("description"),
  tradingContext: text("trading_context"), // When to use this emoji
  isCustom: boolean("is_custom").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Custom dashboards
export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  layout: jsonb("layout").notNull(), // Grid layout configuration
  widgets: jsonb("widgets").notNull(), // Widget configurations
  theme: text("theme").notNull().default("dark"),
  isDefault: boolean("is_default").default(false),
  isShared: boolean("is_shared").default(false),
  shareToken: text("share_token").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Alert logs for tracking
export const alertLogs = pgTable("alert_logs", {
  id: serial("id").primaryKey(),
  alertId: integer("alert_id").references(() => alerts.id),
  triggeredAt: timestamp("triggered_at").defaultNow(),
  conditions: jsonb("conditions").notNull(), // Conditions that triggered the alert
  marketData: jsonb("market_data"), // Market data at time of trigger
  result: text("result").notNull(), // 'sent', 'failed', 'ignored'
  errorMessage: text("error_message"),
});

// BTMM strategy configurations
export const btmmConfigs = pgTable("btmm_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  emaSettings: jsonb("ema_settings").notNull(), // EMA lengths and colors
  sessionSettings: jsonb("session_settings").notNull(), // Trading sessions
  patternSettings: jsonb("pattern_settings").notNull(), // M&W pattern rules
  riskSettings: jsonb("risk_settings").notNull(), // Risk management rules
  alertSettings: jsonb("alert_settings").notNull(), // Alert preferences
  visualSettings: jsonb("visual_settings").notNull(), // Colors, sizes, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trading performance tracking
export const tradingPerformance = pgTable("trading_performance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  strategy: text("strategy").notNull(), // 'btmm', 'ote', 'patterns'
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }),
  exitPrice: decimal("exit_price", { precision: 10, scale: 5 }),
  positionSize: decimal("position_size", { precision: 10, scale: 2 }),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  riskRewardRatio: decimal("risk_reward_ratio", { precision: 5, scale: 2 }),
  entryReason: text("entry_reason"), // Why this trade was taken
  exitReason: text("exit_reason"), // Why this trade was closed
  marketConditions: jsonb("market_conditions"), // Market state during trade
  screenshots: text("screenshots").array(), // Screenshot URLs
  notes: text("notes"),
  tradeDate: timestamp("trade_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Market data cache for backtesting
export const marketDataCache = pgTable("market_data_cache", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  open: decimal("open", { precision: 10, scale: 5 }).notNull(),
  high: decimal("high", { precision: 10, scale: 5 }).notNull(),
  low: decimal("low", { precision: 10, scale: 5 }).notNull(),
  close: decimal("close", { precision: 10, scale: 5 }).notNull(),
  volume: decimal("volume", { precision: 15, scale: 2 }),
  btmmData: jsonb("btmm_data"), // Calculated BTMM indicators
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_symbol_timeframe_timestamp").on(table.symbol, table.timeframe, table.timestamp),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(userProjects),
  alerts: many(alerts),
  dashboards: many(dashboards),
  btmmConfigs: many(btmmConfigs),
  tradingPerformance: many(tradingPerformance),
}));

export const alertsRelations = relations(alerts, ({ one, many }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
  logs: many(alertLogs),
}));

export const dashboardsRelations = relations(dashboards, ({ one }) => ({
  user: one(users, {
    fields: [dashboards.userId],
    references: [users.id],
  }),
}));

export const btmmConfigsRelations = relations(btmmConfigs, ({ one }) => ({
  user: one(users, {
    fields: [btmmConfigs.userId],
    references: [users.id],
  }),
}));

export const tradingPerformanceRelations = relations(tradingPerformance, ({ one }) => ({
  user: one(users, {
    fields: [tradingPerformance.userId],
    references: [users.id],
  }),
}));

export const alertLogsRelations = relations(alertLogs, ({ one }) => ({
  alert: one(alerts, {
    fields: [alertLogs.alertId],
    references: [alerts.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTemplateSchema = createInsertSchema(pineScriptTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(userProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSnippetSchema = createInsertSchema(codeSnippets).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastTriggered: true,
  triggerCount: true,
});

export const insertDashboardSchema = createInsertSchema(dashboards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  shareToken: true,
});

export const insertBtmmConfigSchema = createInsertSchema(btmmConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradingPerformanceSchema = createInsertSchema(tradingPerformance).omit({
  id: true,
  createdAt: true,
});

export const insertTradingViewEmojiSchema = createInsertSchema(tradingViewEmojis).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PineScriptTemplate = typeof pineScriptTemplates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type UserProject = typeof userProjects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type InsertSnippet = z.infer<typeof insertSnippetSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Dashboard = typeof dashboards.$inferSelect;
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;

export type BtmmConfig = typeof btmmConfigs.$inferSelect;
export type InsertBtmmConfig = z.infer<typeof insertBtmmConfigSchema>;

export type TradingPerformance = typeof tradingPerformance.$inferSelect;
export type InsertTradingPerformance = z.infer<typeof insertTradingPerformanceSchema>;

export type TradingViewEmoji = typeof tradingViewEmojis.$inferSelect;
export type InsertTradingViewEmoji = z.infer<typeof insertTradingViewEmojiSchema>;

export type AlertLog = typeof alertLogs.$inferSelect;
export type MarketDataCache = typeof marketDataCache.$inferSelect;
