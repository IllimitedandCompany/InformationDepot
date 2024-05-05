// When an indicator provides repetitive signals the following can be applied:

// BUY and SELL signals required
buy = ??
sell = ??

O1 = ta.barssince(buy)
O2 = ta.barssince(sell)
K1 = ta.barssince(buy[1])
K2 = ta.barssince(sell[1])

// then adding the following to the final variable
finalBuy = buy and K1 > O2
finalSell = sell and K2 > O1