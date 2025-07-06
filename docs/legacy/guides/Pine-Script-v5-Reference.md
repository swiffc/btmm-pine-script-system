# Pine Script v5 Complete Reference Guide
## Comprehensive Documentation for BTMM Strategy Development

### Table of Contents
1. [Pine Script v5 Overview](#overview)
2. [Basic Syntax and Structure](#syntax)
3. [Data Types and Variables](#data-types)
4. [Built-in Functions](#built-in-functions)
5. [Technical Analysis Functions](#technical-analysis)
6. [User-Defined Functions](#user-functions)
7. [Plotting and Visualization](#plotting)
8. [Strategy Development](#strategy-development)
9. [BTMM-Specific Implementation](#btmm-implementation)
10. [Performance Optimization](#optimization)
11. [Best Practices](#best-practices)
12. [Common Errors and Solutions](#errors)

---

## 1. Pine Script v5 Overview {#overview}

Pine Script v5 is TradingView's domain-specific language for creating custom technical indicators and trading strategies. It offers significant improvements over previous versions, including better performance, new data types, and enhanced functionality.

### Key Improvements in v5
- **User-Defined Types (UDT):** Create custom data structures
- **Methods:** Object-oriented programming capabilities
- **Improved Performance:** Better memory management and execution speed
- **Enhanced Libraries:** Modular code organization
- **Better Debugging:** Improved error messages and debugging tools

### Script Structure
Every Pine Script v5 script follows this basic structure:

```pinescript
//@version=5
indicator("Script Name", shorttitle="Short", overlay=true)

// Inputs
input_parameter = input.int(20, "Parameter Name")

// Calculations
calculated_value = ta.sma(close, input_parameter)

// Plotting
plot(calculated_value, color=color.blue)

// Alerts
alertcondition(condition, title="Alert Title", message="Alert Message")
