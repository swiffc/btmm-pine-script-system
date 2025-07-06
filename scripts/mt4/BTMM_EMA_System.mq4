//+------------------------------------------------------------------+
//|                                            BTMM_EMA_System.mq4 |
//|                                EMA Stack Analysis for BTMM System |
//|                      Synchronized with BTMM_EMA_System.pine v1.0 |
//+------------------------------------------------------------------+
#property copyright "BTMM Trading System"
#property link      "https://github.com/btmm-trading-system"
#property version   "1.00"
#property strict
#property indicator_chart_window
#property indicator_buffers 8
#property indicator_color1 clrLime
#property indicator_color2 clrYellow
#property indicator_color3 clrOrange
#property indicator_color4 clrRed
#property indicator_color5 clrPurple
#property indicator_color6 clrDodgerBlue
#property indicator_color7 clrGreen
#property indicator_color8 clrCrimson

#include <BTMM_Foundation.mqh>

//+------------------------------------------------------------------+
//| Input Parameters                                                 |
//+------------------------------------------------------------------+
input string EMASettings = "=== EMA Stack Configuration ===";
input int EMA_Fast_Period = 5;                     // Fast EMA period
input int EMA_Medium_Period = 13;                  // Medium EMA period
input int EMA_Slow_Period = 50;                    // Slow EMA period
input int EMA_Long_Period = 200;                   // Long EMA period
input int EMA_HTF_Period = 800;                    // HTF EMA period

input string DisplaySettings = "=== Display Settings ===";
input bool ShowEMALines = true;                    // Show EMA lines
input bool ShowStackStrength = true;               // Show stack strength
input bool ShowStackLabels = true;                 // Show stack labels
input bool ShowTrendDirection = true;              // Show trend direction
input bool ShowStackAlerts = true;                 // Enable stack alerts

input string ColorSettings = "=== Color Settings ===";
input color EMA_Fast_Color = clrLime;              // Fast EMA color
input color EMA_Medium_Color = clrYellow;          // Medium EMA color
input color EMA_Slow_Color = clrOrange;            // Slow EMA color
input color EMA_Long_Color = clrRed;               // Long EMA color
input color EMA_HTF_Color = clrPurple;             // HTF EMA color
input color BullStack_Color = clrGreen;            // Bull stack color
input color BearStack_Color = clrCrimson;          // Bear stack color

input string AlertSettings = "=== Alert Settings ===";
input bool AlertOnStackChange = true;              // Alert on stack change
input bool AlertOnTrendChange = true;              // Alert on trend change
input bool AlertOnStrengthThreshold = true;        // Alert on strength threshold
input double StrengthThreshold = 70.0;             // Strength alert threshold
input string AlertSoundFile = "alert2.wav";        // Alert sound file

//+------------------------------------------------------------------+
//| Indicator Buffers                                                |
//+------------------------------------------------------------------+
double EMA_Fast_Buffer[];
double EMA_Medium_Buffer[];
double EMA_Slow_Buffer[];
double EMA_Long_Buffer[];
double EMA_HTF_Buffer[];
double StackStrength_Buffer[];
double BullStack_Buffer[];
double BearStack_Buffer[];

//+------------------------------------------------------------------+
//| Global Variables                                                 |
//+------------------------------------------------------------------+
BTMMEMAStack g_emaStack;
TREND_DIRECTION g_lastTrendDirection = TREND_NEUTRAL;
bool g_lastBullStack = false;
bool g_lastBearStack = false;
double g_lastStackStrength = 0.0;
datetime g_lastAlertTime = 0;
int g_stackChangeCount = 0;

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
    // Initialize BTMM Foundation
    if(!InitializeBTMMFoundation())
    {
        Print("ERROR: BTMM_EMA_System requires BTMM Foundation to be loaded first");
        return INIT_FAILED;
    }
    
    // Set up indicator buffers
    SetIndexBuffer(0, EMA_Fast_Buffer);
    SetIndexBuffer(1, EMA_Medium_Buffer);
    SetIndexBuffer(2, EMA_Slow_Buffer);
    SetIndexBuffer(3, EMA_Long_Buffer);
    SetIndexBuffer(4, EMA_HTF_Buffer);
    SetIndexBuffer(5, StackStrength_Buffer);
    SetIndexBuffer(6, BullStack_Buffer);
    SetIndexBuffer(7, BearStack_Buffer);
    
    // Set buffer labels
    SetIndexLabel(0, "EMA " + IntegerToString(EMA_Fast_Period));
    SetIndexLabel(1, "EMA " + IntegerToString(EMA_Medium_Period));
    SetIndexLabel(2, "EMA " + IntegerToString(EMA_Slow_Period));
    SetIndexLabel(3, "EMA " + IntegerToString(EMA_Long_Period));
    SetIndexLabel(4, "EMA " + IntegerToString(EMA_HTF_Period));
    SetIndexLabel(5, "Stack Strength");
    SetIndexLabel(6, "Bull Stack");
    SetIndexLabel(7, "Bear Stack");
    
    // Set buffer styles
    SetIndexStyle(0, DRAW_LINE, STYLE_SOLID, 1, EMA_Fast_Color);
    SetIndexStyle(1, DRAW_LINE, STYLE_SOLID, 1, EMA_Medium_Color);
    SetIndexStyle(2, DRAW_LINE, STYLE_SOLID, 2, EMA_Slow_Color);
    SetIndexStyle(3, DRAW_LINE, STYLE_SOLID, 2, EMA_Long_Color);
    SetIndexStyle(4, DRAW_LINE, STYLE_SOLID, 3, EMA_HTF_Color);
    SetIndexStyle(5, DRAW_NONE);
    SetIndexStyle(6, DRAW_NONE);
    SetIndexStyle(7, DRAW_NONE);
    
    // Set indicator properties
    IndicatorShortName("BTMM EMA System v1.00");
    IndicatorDigits(5);
    
    // Initialize global variables
    g_lastTrendDirection = TREND_NEUTRAL;
    g_lastBullStack = false;
    g_lastBearStack = false;
    g_lastStackStrength = 0.0;
    g_lastAlertTime = 0;
    g_stackChangeCount = 0;
    
    LogBTMMInfo("BTMM_EMA_System", "EMA System initialized successfully");
    
    return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
    // Check for sufficient data
    if(rates_total < EMA_HTF_Period + 10)
        return 0;
    
    // Calculate from the last unprocessed bar
    int start_pos = prev_calculated;
    if(start_pos < EMA_HTF_Period)
        start_pos = EMA_HTF_Period;
    
    // Main calculation loop
    for(int i = start_pos; i < rates_total; i++)
    {
        int bar_index = rates_total - 1 - i;
        
        // Calculate EMA values
        CalculateEMAValues(bar_index);
        
        // Calculate EMA stack analysis
        CalculateEMAStackAnalysis(bar_index);
        
        // Update global variables for other indicators
        UpdateGlobalVariables(bar_index);
    }
    
    // Check for alerts on new bar
    if(IsNewBar())
    {
        CheckForAlerts();
        
        // Display stack information
        if(ShowStackLabels)
        {
            DisplayStackInfo();
        }
    }
    
    return rates_total;
}

//+------------------------------------------------------------------+
//| Calculate EMA Values                                             |
//+------------------------------------------------------------------+
void CalculateEMAValues(int bar_index)
{
    if(ShowEMALines)
    {
        EMA_Fast_Buffer[bar_index] = iMA(NULL, 0, EMA_Fast_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
        EMA_Medium_Buffer[bar_index] = iMA(NULL, 0, EMA_Medium_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
        EMA_Slow_Buffer[bar_index] = iMA(NULL, 0, EMA_Slow_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
        EMA_Long_Buffer[bar_index] = iMA(NULL, 0, EMA_Long_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
        EMA_HTF_Buffer[bar_index] = iMA(NULL, 0, EMA_HTF_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    }
    else
    {
        // Still calculate but don't display
        EMA_Fast_Buffer[bar_index] = EMPTY_VALUE;
        EMA_Medium_Buffer[bar_index] = EMPTY_VALUE;
        EMA_Slow_Buffer[bar_index] = EMPTY_VALUE;
        EMA_Long_Buffer[bar_index] = EMPTY_VALUE;
        EMA_HTF_Buffer[bar_index] = EMPTY_VALUE;
    }
}

//+------------------------------------------------------------------+
//| Calculate EMA Stack Analysis                                     |
//+------------------------------------------------------------------+
void CalculateEMAStackAnalysis(int bar_index)
{
    // Use foundation function to calculate EMA stack
    CalculateEMAStack(g_emaStack, bar_index);
    
    // Store stack strength
    StackStrength_Buffer[bar_index] = g_emaStack.stack_strength;
    
    // Store stack signals
    BullStack_Buffer[bar_index] = g_emaStack.bull_stack ? 1 : 0;
    BearStack_Buffer[bar_index] = g_emaStack.bear_stack ? 1 : 0;
    
    // Calculate additional metrics
    double price_to_fast_distance = MathAbs(Close[bar_index] - g_emaStack.ema5);
    double stack_separation = CalculateStackSeparation(bar_index);
    double stack_momentum = CalculateStackMomentum(bar_index);
    
    // Store additional data in global variables
    GlobalVariableSet("BTMM_EMA_Price_Distance", price_to_fast_distance);
    GlobalVariableSet("BTMM_EMA_Stack_Separation", stack_separation);
    GlobalVariableSet("BTMM_EMA_Stack_Momentum", stack_momentum);
}

//+------------------------------------------------------------------+
//| Calculate Stack Separation                                       |
//+------------------------------------------------------------------+
double CalculateStackSeparation(int bar_index)
{
    double fast_ema = iMA(NULL, 0, EMA_Fast_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    double htf_ema = iMA(NULL, 0, EMA_HTF_Period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    
    return MathAbs(fast_ema - htf_ema);
}

//+------------------------------------------------------------------+
//| Calculate Stack Momentum                                         |
//+------------------------------------------------------------------+
double CalculateStackMomentum(int bar_index)
{
    if(bar_index + 1 >= Bars)
        return 0;
    
    double current_strength = g_emaStack.stack_strength;
    double previous_strength = GetEMAStackStrength(bar_index + 1);
    
    return current_strength - previous_strength;
}

//+------------------------------------------------------------------+
//| Update Global Variables                                          |
//+------------------------------------------------------------------+
void UpdateGlobalVariables(int bar_index)
{
    // Update core EMA values
    GlobalVariableSet("BTMM_EMA_Fast", g_emaStack.ema5);
    GlobalVariableSet("BTMM_EMA_Medium", g_emaStack.ema13);
    GlobalVariableSet("BTMM_EMA_Slow", g_emaStack.ema50);
    GlobalVariableSet("BTMM_EMA_Long", g_emaStack.ema200);
    GlobalVariableSet("BTMM_EMA_HTF", g_emaStack.ema800);
    
    // Update stack analysis
    GlobalVariableSet("BTMM_EMA_Stack_Strength", g_emaStack.stack_strength);
    GlobalVariableSet("BTMM_EMA_Bull_Stack", g_emaStack.bull_stack ? 1 : 0);
    GlobalVariableSet("BTMM_EMA_Bear_Stack", g_emaStack.bear_stack ? 1 : 0);
    GlobalVariableSet("BTMM_EMA_Trend_Direction", g_emaStack.trend_direction);
    
    // Update timestamp
    GlobalVariableSet("BTMM_EMA_Last_Update", TimeCurrent());
}

//+------------------------------------------------------------------+
//| Check for Alerts                                                 |
//+------------------------------------------------------------------+
void CheckForAlerts()
{
    // Prevent spam alerts
    if(TimeCurrent() - g_lastAlertTime < 60) // 1 minute minimum between alerts
        return;
    
    // Check for stack change
    if(AlertOnStackChange && ShowStackAlerts)
    {
        if(g_emaStack.bull_stack != g_lastBullStack)
        {
            if(g_emaStack.bull_stack)
            {
                SendBTMMAlert("EMA Bull Stack formed!", AlertSoundFile);
                g_lastAlertTime = TimeCurrent();
            }
            g_lastBullStack = g_emaStack.bull_stack;
        }
        
        if(g_emaStack.bear_stack != g_lastBearStack)
        {
            if(g_emaStack.bear_stack)
            {
                SendBTMMAlert("EMA Bear Stack formed!", AlertSoundFile);
                g_lastAlertTime = TimeCurrent();
            }
            g_lastBearStack = g_emaStack.bear_stack;
        }
    }
    
    // Check for trend change
    if(AlertOnTrendChange && ShowStackAlerts)
    {
        if(g_emaStack.trend_direction != g_lastTrendDirection)
        {
            string trend_message = "EMA Trend changed to: ";
            switch(g_emaStack.trend_direction)
            {
                case TREND_BULLISH:
                    trend_message += "BULLISH";
                    break;
                case TREND_BEARISH:
                    trend_message += "BEARISH";
                    break;
                case TREND_NEUTRAL:
                    trend_message += "NEUTRAL";
                    break;
            }
            
            SendBTMMAlert(trend_message, AlertSoundFile);
            g_lastTrendDirection = g_emaStack.trend_direction;
            g_lastAlertTime = TimeCurrent();
        }
    }
    
    // Check for strength threshold
    if(AlertOnStrengthThreshold && ShowStackAlerts)
    {
        if(g_emaStack.stack_strength >= StrengthThreshold && g_lastStackStrength < StrengthThreshold)
        {
            SendBTMMAlert("EMA Stack strength exceeded " + DoubleToString(StrengthThreshold, 1) + "%", AlertSoundFile);
            g_lastAlertTime = TimeCurrent();
        }
        g_lastStackStrength = g_emaStack.stack_strength;
    }
}

//+------------------------------------------------------------------+
//| Display Stack Information                                        |
//+------------------------------------------------------------------+
void DisplayStackInfo()
{
    string stack_info = "EMA Stack Analysis:\n";
    stack_info += "Strength: " + DoubleToString(g_emaStack.stack_strength, 1) + "%\n";
    stack_info += "Bull Stack: " + (g_emaStack.bull_stack ? "YES" : "NO") + "\n";
    stack_info += "Bear Stack: " + (g_emaStack.bear_stack ? "YES" : "NO") + "\n";
    stack_info += "Trend: ";
    
    switch(g_emaStack.trend_direction)
    {
        case TREND_BULLISH:
            stack_info += "BULLISH";
            break;
        case TREND_BEARISH:
            stack_info += "BEARISH";
            break;
        case TREND_NEUTRAL:
            stack_info += "NEUTRAL";
            break;
    }
    
    Comment(stack_info);
}

//+------------------------------------------------------------------+
//| Custom indicator deinitialization function                      |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // Clean up global variables
    GlobalVariableDel("BTMM_EMA_Fast");
    GlobalVariableDel("BTMM_EMA_Medium");
    GlobalVariableDel("BTMM_EMA_Slow");
    GlobalVariableDel("BTMM_EMA_Long");
    GlobalVariableDel("BTMM_EMA_HTF");
    GlobalVariableDel("BTMM_EMA_Stack_Strength");
    GlobalVariableDel("BTMM_EMA_Bull_Stack");
    GlobalVariableDel("BTMM_EMA_Bear_Stack");
    GlobalVariableDel("BTMM_EMA_Trend_Direction");
    GlobalVariableDel("BTMM_EMA_Price_Distance");
    GlobalVariableDel("BTMM_EMA_Stack_Separation");
    GlobalVariableDel("BTMM_EMA_Stack_Momentum");
    GlobalVariableDel("BTMM_EMA_Last_Update");
    
    Comment("");
    
    LogBTMMInfo("BTMM_EMA_System", "EMA System deinitialized (Reason: " + IntegerToString(reason) + ")");
}

//+------------------------------------------------------------------+
//| Get EMA Stack Values (for other indicators)                     |
//+------------------------------------------------------------------+
double GetEMAStackStrength(int bar_index = 0)
{
    if(bar_index < 0 || bar_index >= Bars)
        return 0;
    
    return StackStrength_Buffer[bar_index];
}

bool GetEMABullStack(int bar_index = 0)
{
    if(bar_index < 0 || bar_index >= Bars)
        return false;
    
    return BullStack_Buffer[bar_index] == 1;
}

bool GetEMABearStack(int bar_index = 0)
{
    if(bar_index < 0 || bar_index >= Bars)
        return false;
    
    return BearStack_Buffer[bar_index] == 1;
}

TREND_DIRECTION GetEMATrendDirection(int bar_index = 0)
{
    return (TREND_DIRECTION)GlobalVariableGet("BTMM_EMA_Trend_Direction");
}

double GetEMAValue(int period, int bar_index = 0)
{
    if(bar_index < 0 || bar_index >= Bars)
        return 0;
    
    return iMA(NULL, 0, period, 0, MODE_EMA, PRICE_CLOSE, bar_index);
}

//+------------------------------------------------------------------+
//| End of BTMM EMA System                                          |
//+------------------------------------------------------------------+ 