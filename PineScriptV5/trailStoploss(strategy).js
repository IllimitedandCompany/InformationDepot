// Not fully reliable to expect MT5 trailer will work exactly as the strategy tester from TradingView, 
// prices on TV update every 5 seconds, fluctuations only account for high/low/close possibly not fully matching.

if buyCondition
    strategy.entry("BUY", strategy.long, qty=0.1, oca_name="BUY")

if sellCondition
    strategy.entry("SELL", strategy.short, qty=0.1, oca_name="SELL")


stoploss = input(title="SL Activation", defval=20000)
trailActivation = input(title="TP Activation", defval=5000)
trailOffset = input(title="TP Trigger", defval=4000)


strategy.exit("B.Exit", "BUY", qty_percent = 100, loss=stoploss, trail_offset=trailOffset, trail_points=trailActivation) // set take profit with "profit=totalticks"
strategy.exit("S.Exit", "SELL", qty_percent = 100, loss=stoploss, trail_offset=trailOffset, trail_points=trailActivation) // set take profit with "profit=totalticks"