// Method 1

FromMonth = input.int(defval = 1, title = "From Month", minval = 1, maxval = 12)
FromDay   = input.int(defval = 1, title = "From Day", minval = 1, maxval = 31)
FromYear  = input.int(defval = 2024, title = "From Year", minval = 2015)
ToMonth   = input.int(defval = 1, title = "To Month", minval = 1, maxval = 12)
ToDay     = input.int(defval = 1, title = "To Day", minval = 1, maxval = 31)
ToYear    = input.int(defval = 9999, title = "To Year", minval = 2015)

start     = timestamp(FromYear, FromMonth, FromDay, 00, 00)
finish    = timestamp(ToYear, ToMonth, ToDay, 23, 59)
window()  => time >= start and time <= finish ? true : false

if buySignal and window()
    strategy.entry("BUY", strategy.long)

if sellSignal and window()
    strategy.entry("SELL", strategy.short)

// Method 2

startYear = input.int(2023, "Start Year")
endYear = input.int(2099, "End Year")

inDateRange = year(time) >= startYear and year(time) <= endYear

if inDateRange
    if buySignal
        strategy.order("long", strategy.long)

    if sellSignal
        strategy.order("short", strategy.short)

    if buyExitSignal
        strategy.close("long")
    
    if sellExitSignal
        strategy.close("short")