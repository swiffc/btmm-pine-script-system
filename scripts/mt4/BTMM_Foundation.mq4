//+------------------------------------------------------------------+
//|                                               BTMM_Foundation.mq4 |
//|                                    Core Foundation for BTMM System |
//|                        Synchronized with BTMMFoundation.pine v1.0 |
//+------------------------------------------------------------------+
#property copyright "BTMM Trading System"
#property link      "https://github.com/btmm-trading-system"
#property version   "1.00"
#property strict
#property indicator_chart_window
#property indicator_buffers 8
#property indicator_color1 clrDodgerBlue
#property indicator_color2 clrRed
#property indicator_color3 clrOrange
#property indicator_color4 clrGreen
#property indicator_color5 clrPurple
#property indicator_color6 clrYellow
#property indicator_color7 clrCyan
#property indicator_color8 clrMagenta

#include <BTMM_Foundation.mqh>

//+------------------------------------------------------------------+
//| Input Parameters                                                 |
//+------------------------------------------------------------------+
input string FoundationSettings = "=== BTMM Foundation Settings ===";
input bool ShowEMAStack = true;                    // Show EMA Stack on chart
input bool ShowSessionBoxes = true;                // Show session range boxes
input bool ShowMarketStructure = true;             // Show market structure
input bool EnableSystemMonitoring = true;          // Enable system health monitoring
input bool EnableLogging = true;                   // Enable system logging
input bool EnableAlerts = false;                   // Enable system alerts

input string EMASettings = "=== EMA Stack Settings ===";
input int EMA_Fast = 5;                            // Fast EMA period
input int EMA_Medium = 13;                         // Medium EMA period
input int EMA_Slow = 50;                           // Slow EMA period
input int EMA_Long = 200;                          // Long EMA period
input int EMA_HTF = 800;                           // HTF EMA period

input string SessionSettings = "=== Session Settings ===";
input color AsianSessionColor = clrDarkBlue;       // Asian session color
input color LondonSessionColor = clrDarkGreen;     // London session color
input color NYSessionColor = clrDarkRed;           // NY session color
input color OverlapSessionColor = clrDarkGoldenrod; // Overlap session color

input string AlertSettings = "=== Alert Settings ===";
input bool AlertOnStructureBreak = true;           // Alert on structure break
input bool AlertOnSessionChange = false;           // Alert on session change
input string AlertSoundFile = "alert.wav";         // Alert sound file

//+------------------------------------------------------------------+
//| Indicator Buffers                                                |
//+------------------------------------------------------------------+
double EMA_Fast_Buffer[];
double EMA_Medium_Buffer[];
double EMA_Slow_Buffer[];
double EMA_Long_Buffer[];
double EMA_HTF_Buffer[];
double StackStrength_Buffer[];
double StructureHigh_Buffer[];
double StructureLow_Buffer[];

//+------------------------------------------------------------------+
//| Global Variables                                                 |
//+------------------------------------------------------------------+
BTMMEMAStack g_emaStack;
BTMMMarketStructure g_marketStructure;
BTMMSession g_currentSession;
datetime g_lastBarTime = 0;
bool g_systemHealthy = true;
int g_initializationAttempts = 0;

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
    // Initialize BTMM Foundation
    if(!InitializeBTMMFoundation())
    {
        Print("ERROR: Failed to initialize BTMM Foundation");
        return INIT_FAILED;
    }
    
    // Set up indicator buffers
    SetIndexBuffer(0, EMA_Fast_Buffer);
    SetIndexBuffer(1, EMA_Medium_Buffer);
    SetIndexBuffer(2, EMA_Slow_Buffer);
    SetIndexBuffer(3, EMA_Long_Buffer);
    SetIndexBuffer(4, EMA_HTF_Buffer);
    SetIndexBuffer(5, StackStrength_Buffer);
    SetIndexBuffer(6, StructureHigh_Buffer);
    SetIndexBuffer(7, StructureLow_Buffer);
    
    // Set buffer labels
    SetIndexLabel(0, "EMA " + IntegerToString(EMA_Fast));
    SetIndexLabel(1, "EMA " + IntegerToString(EMA_Medium));
    SetIndexLabel(2, "EMA " + IntegerToString(EMA_Slow));
    SetIndexLabel(3, "EMA " + IntegerToString(EMA_Long));
    SetIndexLabel(4, "EMA " + IntegerToString(EMA_HTF));
    SetIndexLabel(5, "Stack Strength");
    SetIndexLabel(6, "Structure High");
    SetIndexLabel(7, "Structure Low");
    
    // Set buffer styles
    SetIndexStyle(0, DRAW_LINE, STYLE_SOLID, 1);
    SetIndexStyle(1, DRAW_LINE, STYLE_SOLID, 1);
    SetIndexStyle(2, DRAW_LINE, STYLE_SOLID, 2);
    SetIndexStyle(3, DRAW_LINE, STYLE_SOLID, 2);
    SetIndexStyle(4, DRAW_LINE, STYLE_SOLID, 3);
    SetIndexStyle(5, DRAW_NONE);
    SetIndexStyle(6, DRAW_NONE);
    SetIndexStyle(7, DRAW_NONE);
    
    // Set indicator properties
    IndicatorShortName("BTMM Foundation v" + GetBTMMVersion());
    IndicatorDigits(5);
    
    // Initialize global variables
    g_lastBarTime = Time[0];
    g_systemHealthy = true;
    g_initializationAttempts++;
    
    // Log initialization
    if(EnableLogging)
    {
        LogBTMMInfo("OnInit", "BTMM Foundation initialized successfully (Attempt: " + 
                   IntegerToString(g_initializationAttempts) + ")");
    }
    
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
    if(rates_total < EMA_HTF + 10)
        return 0;
    
    // Calculate from the last unprocessed bar
    int start_pos = prev_calculated;
    if(start_pos < EMA_HTF)
        start_pos = EMA_HTF;
    
    // Main calculation loop
    for(int i = start_pos; i < rates_total; i++)
    {
        int bar_index = rates_total - 1 - i;
        
        // Calculate EMA Stack
        if(ShowEMAStack)
        {
            CalculateEMAValues(bar_index);
        }
        
        // Calculate Stack Strength
        CalculateStackStrength(bar_index);
        
        // Update Market Structure
        if(ShowMarketStructure)
        {
            UpdateMarketStructureData(bar_index);
        }
    }
    
    // Update session information on new bar
    if(IsNewBar())
    {
        UpdateSessionInfo();
        
        // System health check
        if(EnableSystemMonitoring)
        {
            PerformSystemHealthCheck();
        }
    }
    
    // Draw session boxes
    if(ShowSessionBoxes)
    {
        DrawSessionBoxes();
    }
    
    return rates_total;
}

//+------------------------------------------------------------------+
//| Calculate EMA Values                                             |
//+------------------------------------------------------------------+
void CalculateEMAValues(int bar_index)
{
    EMA_Fast_Buffer[bar_index] = iMA(NULL, 0, EMA_Fast, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    EMA_Medium_Buffer[bar_index] = iMA(NULL, 0, EMA_Medium, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    EMA_Slow_Buffer[bar_index] = iMA(NULL, 0, EMA_Slow, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    EMA_Long_Buffer[bar_index] = iMA(NULL, 0, EMA_Long, 0, MODE_EMA, PRICE_CLOSE, bar_index);
    EMA_HTF_Buffer[bar_index] = iMA(NULL, 0, EMA_HTF, 0, MODE_EMA, PRICE_CLOSE, bar_index);
}

//+------------------------------------------------------------------+
//| Calculate Stack Strength                                         |
//+------------------------------------------------------------------+
void CalculateStackStrength(int bar_index)
{
    // Calculate EMA stack using foundation functions
    CalculateEMAStack(g_emaStack, bar_index);
    
    // Store stack strength in buffer
    StackStrength_Buffer[bar_index] = g_emaStack.stack_strength;
    
    // Global variable for other indicators
    GlobalVariableSet("BTMM_Stack_Strength", g_emaStack.stack_strength);
    GlobalVariableSet("BTMM_Bull_Stack", g_emaStack.bull_stack ? 1 : 0);
    GlobalVariableSet("BTMM_Bear_Stack", g_emaStack.bear_stack ? 1 : 0);
    GlobalVariableSet("BTMM_Trend_Direction", g_emaStack.trend_direction);
}

//+------------------------------------------------------------------+
//| Update Market Structure Data                                     |
//+------------------------------------------------------------------+
void UpdateMarketStructureData(int bar_index)
{
    // Update market structure
    UpdateMarketStructure(g_marketStructure, 20);
    
    // Store in buffers
    StructureHigh_Buffer[bar_index] = g_marketStructure.current_high;
    StructureLow_Buffer[bar_index] = g_marketStructure.current_low;
    
    // Global variables for other indicators
    GlobalVariableSet("BTMM_Structure_High", g_marketStructure.current_high);
    GlobalVariableSet("BTMM_Structure_Low", g_marketStructure.current_low);
    GlobalVariableSet("BTMM_CHoCH_Detected", g_marketStructure.choch_detected ? 1 : 0);
    GlobalVariableSet("BTMM_BOS_Detected", g_marketStructure.bos_detected ? 1 : 0);
    GlobalVariableSet("BTMM_Structure_Bias", g_marketStructure.structure_bias);
    
    // Alert on structure break
    if(EnableAlerts && AlertOnStructureBreak)
    {
        if(g_marketStructure.choch_detected)
        {
            SendBTMMAlert("Change of Character (CHoCH) detected!", AlertSoundFile);
        }
        
        if(g_marketStructure.bos_detected)
        {
            SendBTMMAlert("Break of Structure (BOS) detected!", AlertSoundFile);
        }
    }
}

//+------------------------------------------------------------------+
//| Update Session Information                                       |
//+------------------------------------------------------------------+
void UpdateSessionInfo()
{
    SESSION_TYPE current_session = GetCurrentSession();
    
    // Update session information
    g_currentSession.name = GetSessionName(current_session);
    g_currentSession.is_active = IsSessionActive(current_session);
    
    // Set global variables for other indicators
    GlobalVariableSet("BTMM_Current_Session", current_session);
    GlobalVariableSet("BTMM_Session_Active", g_currentSession.is_active ? 1 : 0);
    
    // Alert on session change
    if(EnableAlerts && AlertOnSessionChange)
    {
        static SESSION_TYPE last_session = SESSION_CLOSED;
        if(last_session != current_session)
        {
            SendBTMMAlert("Session changed to: " + GetSessionName(current_session), AlertSoundFile);
            last_session = current_session;
        }
    }
    
    // Log session info
    if(EnableLogging)
    {
        LogBTMMInfo("UpdateSessionInfo", "Current session: " + g_currentSession.name);
    }
}

//+------------------------------------------------------------------+
//| Draw Session Boxes                                               |
//+------------------------------------------------------------------+
void DrawSessionBoxes()
{
    // This would draw session range boxes
    // Implementation depends on specific requirements
    // For now, we'll use global variables that other indicators can read
    
    SESSION_TYPE current_session = GetCurrentSession();
    color session_color = clrNONE;
    
    switch(current_session)
    {
        case SESSION_ASIAN:
            session_color = AsianSessionColor;
            break;
        case SESSION_LONDON:
            session_color = LondonSessionColor;
            break;
        case SESSION_NY:
            session_color = NYSessionColor;
            break;
        case SESSION_OVERLAP:
            session_color = OverlapSessionColor;
            break;
    }
    
    // Set global variable for session color
    GlobalVariableSet("BTMM_Session_Color", session_color);
}

//+------------------------------------------------------------------+
//| Perform System Health Check                                      |
//+------------------------------------------------------------------+
void PerformSystemHealthCheck()
{
    bool health_status = CheckBTMMHealth();
    
    if(health_status != g_systemHealthy)
    {
        g_systemHealthy = health_status;
        
        if(EnableLogging)
        {
            LogBTMMInfo("PerformSystemHealthCheck", 
                       "System health status changed: " + (health_status ? "HEALTHY" : "UNHEALTHY"));
        }
        
        if(EnableAlerts && !health_status)
        {
            SendBTMMAlert("BTMM System health check failed!", AlertSoundFile);
        }
    }
    
    // Set global variable for system health
    GlobalVariableSet("BTMM_System_Healthy", g_systemHealthy ? 1 : 0);
}

//+------------------------------------------------------------------+
//| Custom indicator deinitialization function                      |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // Clean up global variables
    GlobalVariableDel("BTMM_Stack_Strength");
    GlobalVariableDel("BTMM_Bull_Stack");
    GlobalVariableDel("BTMM_Bear_Stack");
    GlobalVariableDel("BTMM_Trend_Direction");
    GlobalVariableDel("BTMM_Structure_High");
    GlobalVariableDel("BTMM_Structure_Low");
    GlobalVariableDel("BTMM_CHoCH_Detected");
    GlobalVariableDel("BTMM_BOS_Detected");
    GlobalVariableDel("BTMM_Structure_Bias");
    GlobalVariableDel("BTMM_Current_Session");
    GlobalVariableDel("BTMM_Session_Active");
    GlobalVariableDel("BTMM_Session_Color");
    GlobalVariableDel("BTMM_System_Healthy");
    
    // Log deinitialization
    if(EnableLogging)
    {
        LogBTMMInfo("OnDeinit", "BTMM Foundation deinitialized (Reason: " + IntegerToString(reason) + ")");
    }
    
    // Clean up foundation
    CleanupBTMMFoundation();
}

//+------------------------------------------------------------------+
//| Get indicator value functions (for other indicators)            |
//+------------------------------------------------------------------+
double GetBTMMStackStrength(int bar_index = 0)
{
    if(bar_index < 0 || bar_index >= Bars)
        return 0;
    
    return StackStrength_Buffer[bar_index];
}

double GetBTMMEMA(int period, int bar_index = 0)
{
    if(bar_index < 0 || bar_index >= Bars)
        return 0;
    
    switch(period)
    {
        case 5:   return EMA_Fast_Buffer[bar_index];
        case 13:  return EMA_Medium_Buffer[bar_index];
        case 50:  return EMA_Slow_Buffer[bar_index];
        case 200: return EMA_Long_Buffer[bar_index];
        case 800: return EMA_HTF_Buffer[bar_index];
        default:  return 0;
    }
}

bool GetBTMMBullStack(int bar_index = 0)
{
    return GlobalVariableGet("BTMM_Bull_Stack") == 1;
}

bool GetBTMMBearStack(int bar_index = 0)
{
    return GlobalVariableGet("BTMM_Bear_Stack") == 1;
}

SESSION_TYPE GetBTMMCurrentSession()
{
    return (SESSION_TYPE)GlobalVariableGet("BTMM_Current_Session");
}

bool GetBTMMSystemHealth()
{
    return GlobalVariableGet("BTMM_System_Healthy") == 1;
}

//+------------------------------------------------------------------+
//| End of BTMM Foundation                                           |
//+------------------------------------------------------------------+ 