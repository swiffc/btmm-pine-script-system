import { 
  type User, 
  type InsertUser,
  type PineScriptTemplate,
  type InsertTemplate,
  type UserProject,
  type InsertProject,
  type CodeSnippet,
  type InsertSnippet
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Template management
  getAllTemplates(): Promise<PineScriptTemplate[]>;
  getTemplatesByCategory(category: string): Promise<PineScriptTemplate[]>;
  getTemplate(id: number): Promise<PineScriptTemplate | undefined>;
  createTemplate(template: InsertTemplate): Promise<PineScriptTemplate>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<PineScriptTemplate | undefined>;
  deleteTemplate(id: number): Promise<boolean>;

  // Project management
  getUserProjects(userId: number): Promise<UserProject[]>;
  getProject(id: number): Promise<UserProject | undefined>;
  createProject(project: InsertProject): Promise<UserProject>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<UserProject | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Code snippets
  getAllSnippets(): Promise<CodeSnippet[]>;
  getSnippetsByCategory(category: string): Promise<CodeSnippet[]>;
  createSnippet(snippet: InsertSnippet): Promise<CodeSnippet>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, PineScriptTemplate>;
  private projects: Map<number, UserProject>;
  private snippets: Map<number, CodeSnippet>;
  private currentUserId: number;
  private currentTemplateId: number;
  private currentProjectId: number;
  private currentSnippetId: number;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.projects = new Map();
    this.snippets = new Map();
    this.currentUserId = 1;
    this.currentTemplateId = 1;
    this.currentProjectId = 1;
    this.currentSnippetId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Create default BTMM templates
    const btmmTemplates: Omit<PineScriptTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: "BTMM Market Structure",
        description: "Steve Mauro's 4-phase market structure detection indicator",
        category: "btmm",
        subcategory: "market-structure",
        code: `//@version=5
indicator("BTMM Market Structure", shorttitle="BTMM-MS", overlay=true)

// ═══════════════════════════════════════════════════════════════════
// BTMM STRATEGY INPUTS
// Steve Mauro's Beat The Market Maker methodology
// ═══════════════════════════════════════════════════════════════════

group_btmm = "BTMM Configuration"
show_manipulation = input.bool(true, "Show Manipulation Zones", group=group_btmm)
asian_session = input.session("2200-0500", "Asian Session (5PM-Midnight EST)", group=group_btmm)
london_session = input.session("0300-1200", "London Session", group=group_btmm)
ny_session = input.session("0800-1700", "New York Session", group=group_btmm)

// ═══════════════════════════════════════════════════════════════════
// MARKET MAKER DETECTION ALGORITHM
// ═══════════════════════════════════════════════════════════════════

atr_length = input.int(14, "ATR Length", minval=1)
atr_value = ta.atr(atr_length)

// Four-phase market structure detection
is_asian = session.islondon or session.issydney
is_london = session.islondon
is_newyork = session.isnewyork

// Market maker manipulation detection
manipulation_detected = ta.crossover(close, ta.highest(high, 20)) or 
                      ta.crossunder(close, ta.lowest(low, 20))

// ═══════════════════════════════════════════════════════════════════
// CONFLUENCE FACTORS
// ═══════════════════════════════════════════════════════════════════

ema_fast = ta.ema(close, 8)
ema_slow = ta.ema(close, 21)
rsi_value = ta.rsi(close, 14)

// Multi-timeframe analysis
htf_trend = request.security(syminfo.tickerid, "4H", ta.ema(close, 50))
is_bullish_bias = close > htf_trend

// ═══════════════════════════════════════════════════════════════════
// PLOTTING AND VISUALIZATION
// ═══════════════════════════════════════════════════════════════════

plot(ema_fast, color=color.aqua, linewidth=2, title="EMA 8")
plot(ema_slow, color=color.orange, linewidth=2, title="EMA 21")

// Market manipulation alerts
plotshape(manipulation_detected, style=shape.diamond, 
          color=color.red, size=size.small, title="Manipulation")

// Session backgrounds
asian_color = is_asian ? color.new(color.yellow, 95) : na
london_color = is_london ? color.new(color.blue, 95) : na
ny_color = is_newyork ? color.new(color.green, 95) : na

bgcolor(asian_color, title="Asian Session")
bgcolor(london_color, title="London Session")
bgcolor(ny_color, title="NY Session")

// BTMM Alert conditions
alertcondition(manipulation_detected, title="BTMM Manipulation", 
              message="Market Maker manipulation detected on {{ticker}}")`,
        version: "5",
        tags: ["btmm", "market-structure", "sessions", "manipulation"],
        isBuiltIn: true
      },
      {
        name: "BTMM Session Analysis",
        description: "Advanced session-based analysis for Asian, London, and New York sessions",
        category: "btmm",
        subcategory: "session-analysis",
        code: `//@version=5
indicator("BTMM Session Analysis", shorttitle="BTMM-Sessions", overlay=true)

// ═══════════════════════════════════════════════════════════════════
// SESSION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

group_sessions = "Session Settings"
show_session_boxes = input.bool(true, "Show Session Boxes", group=group_sessions)
show_session_highs_lows = input.bool(true, "Show Session High/Low", group=group_sessions)
extend_lines = input.bool(false, "Extend Lines", group=group_sessions)

// Session times (adjustable for different brokers)
asian_start = input.time(timestamp("2000-01-01 22:00"), "Asian Start (5PM EST)", group=group_sessions)
asian_end = input.time(timestamp("2000-01-01 05:00"), "Asian End (Midnight EST)", group=group_sessions)
london_start = input.time(timestamp("2000-01-01 03:00"), "London Start", group=group_sessions)
london_end = input.time(timestamp("2000-01-01 12:00"), "London End", group=group_sessions)
ny_start = input.time(timestamp("2000-01-01 08:00"), "NY Start", group=group_sessions)
ny_end = input.time(timestamp("2000-01-01 17:00"), "NY End", group=group_sessions)

// ═══════════════════════════════════════════════════════════════════
// SESSION DETECTION
// ═══════════════════════════════════════════════════════════════════

// Current session detection
in_asian = time >= asian_start and time <= asian_end
in_london = time >= london_start and time <= london_end
in_ny = time >= ny_start and time <= ny_end

// Session transition detection
asian_open = not in_asian[1] and in_asian
london_open = not in_london[1] and in_london
ny_open = not in_ny[1] and in_ny

asian_close = in_asian[1] and not in_asian
london_close = in_london[1] and not in_london
ny_close = in_ny[1] and not in_ny

// ═══════════════════════════════════════════════════════════════════
// SESSION HIGH/LOW TRACKING
// ═══════════════════════════════════════════════════════════════════

var float asian_high = na
var float asian_low = na
var float london_high = na
var float london_low = na
var float ny_high = na
var float ny_low = na

// Track session highs and lows
if asian_open
    asian_high := high
    asian_low := low
else if in_asian
    asian_high := math.max(asian_high, high)
    asian_low := math.min(asian_low, low)

if london_open
    london_high := high
    london_low := low
else if in_london
    london_high := math.max(london_high, high)
    london_low := math.min(london_low, low)

if ny_open
    ny_high := high
    ny_low := low
else if in_ny
    ny_high := math.max(ny_high, high)
    ny_low := math.min(ny_low, low)

// ═══════════════════════════════════════════════════════════════════
// BTMM ANALYSIS
// ═══════════════════════════════════════════════════════════════════

// Asian session: Accumulation phase
asian_range = asian_high - asian_low
asian_midpoint = (asian_high + asian_low) / 2

// London session: Manipulation phase
london_breaks_asian_high = london_high > asian_high
london_breaks_asian_low = london_low < asian_low

// NY session: Distribution phase
ny_trend_direction = close > asian_midpoint ? 1 : -1

// ═══════════════════════════════════════════════════════════════════
// VISUALIZATION
// ═══════════════════════════════════════════════════════════════════

// Session backgrounds
bgcolor(in_asian ? color.new(color.yellow, 90) : na, title="Asian Session")
bgcolor(in_london ? color.new(color.blue, 90) : na, title="London Session")
bgcolor(in_ny ? color.new(color.green, 90) : na, title="NY Session")

// Session high/low lines
if show_session_highs_lows
    // Asian levels
    line.new(bar_index, asian_high, bar_index + 1, asian_high, 
             color=color.yellow, width=2, extend=extend_lines ? extend.right : extend.none)
    line.new(bar_index, asian_low, bar_index + 1, asian_low, 
             color=color.yellow, width=2, extend=extend_lines ? extend.right : extend.none)
    
    // London levels
    line.new(bar_index, london_high, bar_index + 1, london_high, 
             color=color.blue, width=2, extend=extend_lines ? extend.right : extend.none)
    line.new(bar_index, london_low, bar_index + 1, london_low, 
             color=color.blue, width=2, extend=extend_lines ? extend.right : extend.none)

// Labels for session breaks
if london_breaks_asian_high
    label.new(bar_index, high, "London breaks Asian High", 
              color=color.red, style=label.style_label_down, size=size.small)

if london_breaks_asian_low
    label.new(bar_index, low, "London breaks Asian Low", 
              color=color.red, style=label.style_label_up, size=size.small)

// Alerts
alertcondition(london_breaks_asian_high, "London Breaks Asian High", 
              "London session broke Asian session high - potential manipulation")
alertcondition(london_breaks_asian_low, "London Breaks Asian Low", 
              "London session broke Asian session low - potential manipulation")`,
        version: "5",
        tags: ["btmm", "sessions", "asian", "london", "newyork", "manipulation"],
        isBuiltIn: true
      },
      {
        name: "BTMM Risk Manager",
        description: "Position sizing and risk management based on BTMM principles",
        category: "btmm",
        subcategory: "risk-management",
        code: `//@version=5
strategy("BTMM Risk Manager", shorttitle="BTMM-Risk", overlay=true, 
         default_qty_type=strategy.percent_of_equity, default_qty_value=2)

// ═══════════════════════════════════════════════════════════════════
// RISK MANAGEMENT INPUTS
// ═══════════════════════════════════════════════════════════════════

group_risk = "Risk Management"
risk_per_trade = input.float(2.0, "Risk Per Trade (%)", minval=0.1, maxval=10.0, step=0.1, group=group_risk)
max_daily_risk = input.float(6.0, "Max Daily Risk (%)", minval=1.0, maxval=20.0, step=0.5, group=group_risk)
use_atr_stops = input.bool(true, "Use ATR-based Stops", group=group_risk)
atr_multiplier = input.float(2.0, "ATR Multiplier", minval=0.5, maxval=5.0, step=0.1, group=group_risk)
atr_length = input.int(14, "ATR Length", minval=5, maxval=50, group=group_risk)

group_btmm = "BTMM Settings"
only_trade_london_ny = input.bool(true, "Only Trade London/NY", group=group_btmm)
avoid_friday_after_12 = input.bool(true, "Avoid Friday After 12 UTC", group=group_btmm)
min_asian_range_pips = input.int(20, "Min Asian Range (pips)", minval=10, maxval=100, group=group_btmm)

// ═══════════════════════════════════════════════════════════════════
// SESSION AND TIME FILTERS
// ═══════════════════════════════════════════════════════════════════

// Session detection
in_asian = session.issydney or (time >= timestamp("1970-01-01 21:00") and time <= timestamp("1970-01-01 06:00"))
in_london = session.islondon
in_ny = session.isnewyork
in_london_ny = in_london or in_ny

// Friday filter
is_friday = dayofweek == dayofweek.friday
friday_after_12 = is_friday and hour >= 12
should_avoid_friday = avoid_friday_after_12 and friday_after_12

// Trading time filter
can_trade_time = only_trade_london_ny ? in_london_ny : true
can_trade = can_trade_time and not should_avoid_friday

// ═══════════════════════════════════════════════════════════════════
// ASIAN RANGE ANALYSIS
// ═══════════════════════════════════════════════════════════════════

var float asian_high = na
var float asian_low = na
var bool asian_range_valid = false

// Track Asian session range
asian_open = not in_asian[1] and in_asian
if asian_open
    asian_high := high
    asian_low := low
else if in_asian
    asian_high := math.max(asian_high, high)
    asian_low := math.min(asian_low, low)

// Calculate Asian range in pips
asian_range_pips = (asian_high - asian_low) / syminfo.mintick / 10
asian_range_valid := asian_range_pips >= min_asian_range_pips

// ═══════════════════════════════════════════════════════════════════
// RISK CALCULATION
// ═══════════════════════════════════════════════════════════════════

// Calculate position size based on risk
atr_value = ta.atr(atr_length)
stop_distance = use_atr_stops ? atr_value * atr_multiplier : (asian_high - asian_low) / 2

// Account equity (simulated)
account_equity = strategy.equity
risk_amount = account_equity * (risk_per_trade / 100)

// Position size calculation
position_size = risk_amount / (stop_distance / syminfo.mintick * syminfo.pointvalue)

// Daily risk tracking
var float daily_risk_used = 0.0
if dayofweek != dayofweek[1]  // New day
    daily_risk_used := 0.0

can_take_trade = daily_risk_used < max_daily_risk and asian_range_valid and can_trade

// ═══════════════════════════════════════════════════════════════════
// BTMM ENTRY SIGNALS
// ═══════════════════════════════════════════════════════════════════

// Market structure break signals
london_breaks_asian_high = close > asian_high and in_london
london_breaks_asian_low = close < asian_low and in_london

// Confluence factors
ema_fast = ta.ema(close, 8)
ema_slow = ta.ema(close, 21)
ema_bullish = ema_fast > ema_slow
ema_bearish = ema_fast < ema_slow

rsi = ta.rsi(close, 14)
rsi_oversold = rsi < 30
rsi_overbought = rsi > 70

// Entry conditions
long_signal = london_breaks_asian_high and ema_bullish and can_take_trade
short_signal = london_breaks_asian_low and ema_bearish and can_take_trade

// ═══════════════════════════════════════════════════════════════════
// STRATEGY EXECUTION
// ═══════════════════════════════════════════════════════════════════

if long_signal
    stop_loss = use_atr_stops ? close - (atr_value * atr_multiplier) : asian_low
    take_profit = close + (close - stop_loss) * 2  // 2:1 RR
    
    strategy.entry("Long", strategy.long, qty=position_size)
    strategy.exit("Long Exit", "Long", stop=stop_loss, limit=take_profit)
    
    daily_risk_used += risk_per_trade
    
    // Alert
    alert("BTMM Long Entry: " + str.tostring(close) + " SL: " + str.tostring(stop_loss))

if short_signal
    stop_loss = use_atr_stops ? close + (atr_value * atr_multiplier) : asian_high
    take_profit = close - (stop_loss - close) * 2  // 2:1 RR
    
    strategy.entry("Short", strategy.short, qty=position_size)
    strategy.exit("Short Exit", "Short", stop=stop_loss, limit=take_profit)
    
    daily_risk_used += risk_per_trade
    
    // Alert
    alert("BTMM Short Entry: " + str.tostring(close) + " SL: " + str.tostring(stop_loss))

// ═══════════════════════════════════════════════════════════════════
// VISUALIZATION
// ═══════════════════════════════════════════════════════════════════

// Plot Asian range
plot(asian_high, color=color.yellow, linewidth=2, title="Asian High")
plot(asian_low, color=color.yellow, linewidth=2, title="Asian Low")

// Session backgrounds
bgcolor(in_asian ? color.new(color.yellow, 95) : na)
bgcolor(in_london ? color.new(color.blue, 95) : na)
bgcolor(in_ny ? color.new(color.green, 95) : na)

// Risk information table
if barstate.islast
    var table risk_table = table.new(position.top_right, 2, 5, bgcolor=color.white, border_width=1)
    table.cell(risk_table, 0, 0, "Risk Per Trade", text_color=color.black)
    table.cell(risk_table, 1, 0, str.tostring(risk_per_trade) + "%", text_color=color.black)
    table.cell(risk_table, 0, 1, "Daily Risk Used", text_color=color.black)
    table.cell(risk_table, 1, 1, str.tostring(daily_risk_used) + "%", text_color=color.black)
    table.cell(risk_table, 0, 2, "Asian Range", text_color=color.black)
    table.cell(risk_table, 1, 2, str.tostring(asian_range_pips) + " pips", text_color=color.black)
    table.cell(risk_table, 0, 3, "Can Trade", text_color=color.black)
    table.cell(risk_table, 1, 3, can_take_trade ? "Yes" : "No", 
               text_color=can_take_trade ? color.green : color.red)`,
        version: "5",
        tags: ["btmm", "risk-management", "position-sizing", "strategy"],
        isBuiltIn: true
      }
    ];

    btmmTemplates.forEach((template, index) => {
      this.templates.set(this.currentTemplateId++, {
        ...template,
        id: index + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Template methods
  async getAllTemplates(): Promise<PineScriptTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<PineScriptTemplate[]> {
    return Array.from(this.templates.values()).filter(template => template.category === category);
  }

  async getTemplate(id: number): Promise<PineScriptTemplate | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(template: InsertTemplate): Promise<PineScriptTemplate> {
    const id = this.currentTemplateId++;
    const newTemplate: PineScriptTemplate = {
      ...template,
      id,
      version: template.version ?? "1.0.0",
      subcategory: template.subcategory ?? null,
      tags: template.tags ?? null,
      isBuiltIn: template.isBuiltIn ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<PineScriptTemplate | undefined> {
    const existing = this.templates.get(id);
    if (!existing) return undefined;
    
    const updated: PineScriptTemplate = {
      ...existing,
      ...template,
      subcategory: template.subcategory !== undefined ? template.subcategory : existing.subcategory,
      version: template.version !== undefined ? template.version : existing.version,
      tags: template.tags !== undefined ? template.tags : existing.tags,
      isBuiltIn: template.isBuiltIn !== undefined ? template.isBuiltIn : existing.isBuiltIn,
      updatedAt: new Date()
    };
    this.templates.set(id, updated);
    return updated;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Project methods
  async getUserProjects(userId: number): Promise<UserProject[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async getProject(id: number): Promise<UserProject | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<UserProject> {
    const id = this.currentProjectId++;
    const newProject: UserProject = {
      ...project,
      id,
      description: project.description ?? null,
      userId: project.userId ?? null,
      settings: project.settings ?? {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<UserProject | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: UserProject = {
      ...existing,
      ...project,
      description: project.description !== undefined ? project.description : existing.description,
      userId: project.userId !== undefined ? project.userId : existing.userId,
      updatedAt: new Date()
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Snippet methods
  async getAllSnippets(): Promise<CodeSnippet[]> {
    return Array.from(this.snippets.values());
  }

  async getSnippetsByCategory(category: string): Promise<CodeSnippet[]> {
    return Array.from(this.snippets.values()).filter(snippet => snippet.category === category);
  }

  async createSnippet(snippet: InsertSnippet): Promise<CodeSnippet> {
    const id = this.currentSnippetId++;
    const newSnippet: CodeSnippet = {
      ...snippet,
      id,
      description: snippet.description ?? null,
      tags: snippet.tags ?? null,
      language: snippet.language ?? "pine",
      createdAt: new Date()
    };
    this.snippets.set(id, newSnippet);
    return newSnippet;
  }
}

export const storage = new MemStorage();
