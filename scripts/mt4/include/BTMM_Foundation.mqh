//+------------------------------------------------------------------+
//|                                               BTMM_Foundation.mqh |
//|                                    Core Foundation for BTMM System |
//|                        Synchronized with BTMMFoundation.pine v1.0 |
//+------------------------------------------------------------------+
#property copyright "BTMM Trading System"
#property link      "https://github.com/btmm-trading-system"
#property version   "1.00"
#property strict

//+------------------------------------------------------------------+
//| BTMM Foundation Constants                                        |
//+------------------------------------------------------------------+
#define BTMM_VERSION "1.0.0"
#define BTMM_BUILD_DATE "2025-01-06"

// Session Constants (synchronized with Pine Script)
#define ASIAN_SESSION_START 22    // 10:00 PM GMT (5:00 PM EST)
#define ASIAN_SESSION_END 5       // 5:00 AM GMT (Midnight EST)
#define LONDON_SESSION_START 8    // 8:00 AM GMT
#define LONDON_SESSION_END 16     // 4:00 PM GMT
#define NY_SESSION_START 13       // 1:00 PM GMT
#define NY_SESSION_END 22         // 10:00 PM GMT

// EMA Constants (synchronized with Pine Script)
#define EMA_FAST_PERIOD 5
#define EMA_MEDIUM_PERIOD 13
#define EMA_SLOW_PERIOD 50
#define EMA_LONG_PERIOD 200
#define EMA_HTF_PERIOD 800

// Market Phase Constants
enum MARKET_PHASE
{
    PHASE_ACCUMULATION = 0,
    PHASE_MARKUP = 1,
    PHASE_DISTRIBUTION = 2,
    PHASE_MARKDOWN = 3,
    PHASE_RANGING = 4,
    PHASE_BREAKOUT = 5
};

// Session Types
enum SESSION_TYPE
{
    SESSION_ASIAN = 0,
    SESSION_LONDON = 1,
    SESSION_NY = 2,
    SESSION_OVERLAP = 3,
    SESSION_CLOSED = 4
};

// Signal Strength
enum SIGNAL_STRENGTH
{
    SIGNAL_WEAK = 1,
    SIGNAL_MODERATE = 2,
    SIGNAL_STRONG = 3,
    SIGNAL_VERY_STRONG = 4
};

// Trend Direction
enum TREND_DIRECTION
{
    TREND_BEARISH = -1,
    TREND_NEUTRAL = 0,
    TREND_BULLISH = 1
};

//+------------------------------------------------------------------+
//| BTMM Foundation Data Structures                                  |
//+------------------------------------------------------------------+
struct BTMMSession
{
    string name;
    int start_hour;
    int end_hour;
    bool is_active;
    double range_high;
    double range_low;
    double range_size;
    int bar_count;
    double avg_volume;
};

struct BTMMEMAStack
{
    double ema5;
    double ema13;
    double ema50;
    double ema200;
    double ema800;
    bool bull_stack;
    bool bear_stack;
    double stack_strength;
    TREND_DIRECTION trend_direction;
};

struct BTMMSignal
{
    string signal_type;
    SIGNAL_STRENGTH strength;
    double entry_price;
    double stop_loss;
    double take_profit;
    datetime signal_time;
    bool is_active;
    string description;
};

struct BTMMMarketStructure
{
    double previous_high;
    double previous_low;
    double current_high;
    double current_low;
    bool choch_detected;
    bool bos_detected;
    TREND_DIRECTION structure_bias;
    datetime last_update;
};

//+------------------------------------------------------------------+
//| Session Analysis Functions                                       |
//+------------------------------------------------------------------+
SESSION_TYPE GetCurrentSession()
{
    int current_hour = TimeHour(TimeCurrent());
    
    // Check for overlaps first
    if((current_hour >= LONDON_SESSION_START && current_hour < NY_SESSION_START) ||
       (current_hour >= NY_SESSION_START && current_hour < LONDON_SESSION_END))
    {
        return SESSION_OVERLAP;
    }
    
    // Individual sessions
    if(current_hour >= ASIAN_SESSION_START || current_hour < ASIAN_SESSION_END)
        return SESSION_ASIAN;
    else if(current_hour >= LONDON_SESSION_START && current_hour < LONDON_SESSION_END)
        return SESSION_LONDON;
    else if(current_hour >= NY_SESSION_START && current_hour < NY_SESSION_END)
        return SESSION_NY;
    else
        return SESSION_CLOSED;
}

bool IsSessionActive(SESSION_TYPE session)
{
    SESSION_TYPE current = GetCurrentSession();
    return (current == session || current == SESSION_OVERLAP);
}

string GetSessionName(SESSION_TYPE session)
{
    switch(session)
    {
        case SESSION_ASIAN: return "Asian";
        case SESSION_LONDON: return "London";
        case SESSION_NY: return "New York";
        case SESSION_OVERLAP: return "Overlap";
        default: return "Closed";
    }
}

//+------------------------------------------------------------------+
//| EMA Stack Analysis Functions                                     |
//+------------------------------------------------------------------+
void CalculateEMAStack(BTMMEMAStack &stack, int bar_index = 0)
{
    stack.ema5 = iMA(NULL, 0, EMA_FAST_PERIOD, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    stack.ema13 = iMA(NULL, 0, EMA_MEDIUM_PERIOD, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    stack.ema50 = iMA(NULL, 0, EMA_SLOW_PERIOD, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    stack.ema200 = iMA(NULL, 0, EMA_LONG_PERIOD, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    stack.ema800 = iMA(NULL, 0, EMA_HTF_PERIOD, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    
    // Determine stack alignment
    stack.bull_stack = (stack.ema5 > stack.ema13 && stack.ema13 > stack.ema50 && 
                        stack.ema50 > stack.ema200 && stack.ema200 > stack.ema800);
    
    stack.bear_stack = (stack.ema5 < stack.ema13 && stack.ema13 < stack.ema50 && 
                        stack.ema50 < stack.ema200 && stack.ema200 < stack.ema800);
    
    // Calculate stack strength (0-100)
    double total_spread = MathAbs(stack.ema5 - stack.ema800);
    double current_spread = MathAbs(Close[bar_index] - stack.ema800);
    
    if(total_spread > 0)
        stack.stack_strength = (current_spread / total_spread) * 100;
    else
        stack.stack_strength = 0;
    
    // Determine trend direction
    if(stack.bull_stack)
        stack.trend_direction = TREND_BULLISH;
    else if(stack.bear_stack)
        stack.trend_direction = TREND_BEARISH;
    else
        stack.trend_direction = TREND_NEUTRAL;
}

double GetEMAStackStrength(int bar_index = 0)
{
    BTMMEMAStack stack;
    CalculateEMAStack(stack, bar_index);
    return stack.stack_strength;
}

TREND_DIRECTION GetEMAStackTrend(int bar_index = 0)
{
    BTMMEMAStack stack;
    CalculateEMAStack(stack, bar_index);
    return stack.trend_direction;
}

//+------------------------------------------------------------------+
//| Market Structure Analysis Functions                              |
//+------------------------------------------------------------------+
void UpdateMarketStructure(BTMMMarketStructure &structure, int lookback_periods = 20)
{
    // Find previous significant high and low
    structure.previous_high = High[iHighest(NULL, 0, MODE_HIGH, lookback_periods, 1)];
    structure.previous_low = Low[iLowest(NULL, 0, MODE_LOW, lookback_periods, 1)];
    
    // Current high and low
    structure.current_high = High[iHighest(NULL, 0, MODE_HIGH, 5, 0)];
    structure.current_low = Low[iLowest(NULL, 0, MODE_LOW, 5, 0)];
    
    // Detect Change of Character (CHoCH)
    if(structure.structure_bias == TREND_BULLISH && structure.current_low < structure.previous_low)
    {
        structure.choch_detected = true;
        structure.structure_bias = TREND_BEARISH;
    }
    else if(structure.structure_bias == TREND_BEARISH && structure.current_high > structure.previous_high)
    {
        structure.choch_detected = true;
        structure.structure_bias = TREND_BULLISH;
    }
    else
    {
        structure.choch_detected = false;
    }
    
    // Detect Break of Structure (BOS)
    if(structure.structure_bias == TREND_BULLISH && structure.current_high > structure.previous_high)
    {
        structure.bos_detected = true;
    }
    else if(structure.structure_bias == TREND_BEARISH && structure.current_low < structure.previous_low)
    {
        structure.bos_detected = true;
    }
    else
    {
        structure.bos_detected = false;
    }
    
    structure.last_update = TimeCurrent();
}

//+------------------------------------------------------------------+
//| Utility Functions                                                |
//+------------------------------------------------------------------+
double NormalizeDouble(double value, int digits)
{
    return NormalizeDouble(value, digits);
}

double CalculateATR(int period = 14, int bar_index = 0)
{
    return iATR(NULL, 0, period, bar_index);
}

double CalculateRSI(int period = 14, int bar_index = 0)
{
    return iRSI(NULL, 0, period, PRICE_CLOSE, bar_index);
}

double CalculateVolatility(int period = 20, int bar_index = 0)
{
    double sum = 0;
    double mean = 0;
    
    // Calculate mean
    for(int i = bar_index; i < bar_index + period; i++)
    {
        mean += Close[i];
    }
    mean /= period;
    
    // Calculate variance
    for(int i = bar_index; i < bar_index + period; i++)
    {
        sum += MathPow(Close[i] - mean, 2);
    }
    
    return MathSqrt(sum / period);
}

//+------------------------------------------------------------------+
//| Risk Management Functions                                        |
//+------------------------------------------------------------------+
double CalculatePositionSize(double account_balance, double risk_percent, double stop_loss_pips)
{
    double risk_amount = account_balance * (risk_percent / 100.0);
    double pip_value = MarketInfo(Symbol(), MODE_TICKVALUE);
    
    if(stop_loss_pips > 0 && pip_value > 0)
        return risk_amount / (stop_loss_pips * pip_value);
    else
        return 0;
}

double CalculateRiskReward(double entry_price, double stop_loss, double take_profit)
{
    double risk = MathAbs(entry_price - stop_loss);
    double reward = MathAbs(take_profit - entry_price);
    
    if(risk > 0)
        return reward / risk;
    else
        return 0;
}

//+------------------------------------------------------------------+
//| Time and Date Functions                                          |
//+------------------------------------------------------------------+
bool IsNewBar()
{
    static datetime last_bar_time = 0;
    datetime current_bar_time = Time[0];
    
    if(last_bar_time != current_bar_time)
    {
        last_bar_time = current_bar_time;
        return true;
    }
    return false;
}

bool IsNewDay()
{
    static int last_day = 0;
    int current_day = TimeDay(TimeCurrent());
    
    if(last_day != current_day)
    {
        last_day = current_day;
        return true;
    }
    return false;
}

bool IsNewWeek()
{
    static int last_week = 0;
    int current_week = TimeDayOfWeek(TimeCurrent());
    
    if(last_week != current_week && current_week == 1) // Monday
    {
        last_week = current_week;
        return true;
    }
    return false;
}

//+------------------------------------------------------------------+
//| Alert and Notification Functions                                |
//+------------------------------------------------------------------+
void SendBTMMAlert(string message, string sound_file = "alert.wav")
{
    if(IsOptimization() || IsTesting()) return;
    
    Alert("BTMM Alert: " + message);
    
    if(sound_file != "")
        PlaySound(sound_file);
}

void SendBTMMNotification(string message, bool send_email = false, bool send_push = false)
{
    if(IsOptimization() || IsTesting()) return;
    
    if(send_email)
        SendMail("BTMM System Alert", message);
    
    if(send_push)
        SendNotification(message);
}

//+------------------------------------------------------------------+
//| Logging Functions                                                |
//+------------------------------------------------------------------+
void LogBTMMEvent(string event_type, string message)
{
    if(IsOptimization() || IsTesting()) return;
    
    string log_message = StringFormat("[%s] %s: %s", 
                                      TimeToString(TimeCurrent(), TIME_DATE|TIME_MINUTES),
                                      event_type, 
                                      message);
    Print(log_message);
}

void LogBTMMError(string function_name, string error_message)
{
    LogBTMMEvent("ERROR", function_name + " - " + error_message);
}

void LogBTMMInfo(string function_name, string info_message)
{
    LogBTMMEvent("INFO", function_name + " - " + info_message);
}

//+------------------------------------------------------------------+
//| Version and Health Check Functions                               |
//+------------------------------------------------------------------+
string GetBTMMVersion()
{
    return BTMM_VERSION;
}

string GetBTMMBuildDate()
{
    return BTMM_BUILD_DATE;
}

bool CheckBTMMHealth()
{
    // Basic health checks
    if(Bars < 1000) return false;
    if(AccountBalance() <= 0) return false;
    if(MarketInfo(Symbol(), MODE_SPREAD) > 50) return false;
    
    return true;
}

//+------------------------------------------------------------------+
//| Initialize Foundation                                             |
//+------------------------------------------------------------------+
bool InitializeBTMMFoundation()
{
    LogBTMMInfo("InitializeBTMMFoundation", "Starting BTMM Foundation initialization...");
    
    // Verify minimum requirements
    if(Bars < 1000)
    {
        LogBTMMError("InitializeBTMMFoundation", "Insufficient historical data (bars < 1000)");
        return false;
    }
    
    // Initialize global variables
    static bool initialized = false;
    if(!initialized)
    {
        LogBTMMInfo("InitializeBTMMFoundation", "BTMM Foundation initialized successfully");
        initialized = true;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Foundation Cleanup                                               |
//+------------------------------------------------------------------+
void CleanupBTMMFoundation()
{
    LogBTMMInfo("CleanupBTMMFoundation", "Cleaning up BTMM Foundation resources...");
    // Any cleanup code here
}

//+------------------------------------------------------------------+
//| End of BTMM Foundation                                           |
//+------------------------------------------------------------------+ 