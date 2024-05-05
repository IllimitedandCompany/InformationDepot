// Requires TraderLogin Module
// Still being worked on, please be patient.

let trailActivationPrice;
let trailPrice;
let lastPrice = undefined;
let trailing = false;

async function priceTrailer(){
  console.log("PRICE TRAILER ACTIVE!")

  let y = []
  try{
    y = await terminalState.positions
  }catch(error){
    await reconnect()
    y = await terminalState.positions
  }

  const trailOffsetPips = 50;
  const trailPoints = 90; 

  for(let i = 0; i<y.length; i++){
    let type = y[i].type;

    console.log("TYPE: ", type)
    if (type === "POSITION_TYPE_SELL"){
      side = "SELL"
      trailActivationPrice = y[i].openPrice - trailPoints
      trailPrice = y[i].currentPrice + trailOffsetPips

      if(y[i].currentPrice <= trailActivationPrice && lastPrice === undefined){
        lastPrice = trailPrice
        trailing = true
      }else if(y[i].currentPrice <= trailActivationPrice && lastPrice > trailPrice){
        lastPrice = trailPrice
        trailing = true
      }

      if(y[i].currentPrice <= trailActivationPrice && y[i].currentPrice > lastPrice && trailing){
        try{
          connection.closePosition(y[i].id)
        }catch(err){
          console.log("ERROR CLOSING TRADE, ", err, "ERROR CLOSING TRADE!")
          connection.closePosition(y[i].id)
        }

        removeClosed(y[i].id)
        trailing = false;
        lastPrice = undefined
        console.log("CLOSING TRADE")
      }

    }else if(type === "POSITION_TYPE_BUY"){
      side = "BUY"
      trailActivationPrice = y[i].openPrice + trailPoints
      trailPrice = y[i].currentPrice - trailOffsetPips

      if(y[i].currentPrice >= trailActivationPrice && lastPrice === undefined){
        lastPrice = trailPrice
        trailing = true
      }else if(y[i].currentPrice >= trailActivationPrice && lastPrice < trailPrice){
        lastPrice = trailPrice
        trailing = true
      }

      if(y[i].currentPrice >= trailActivationPrice && y[i].currentPrice < lastPrice && trailing){
        try{
          connection.closePosition(y[i].id)
        }catch(err){
          console.log("ERROR CLOSING TRADE, ", err, "ERROR CLOSING TRADE!")
          connection.closePosition(y[i].id)
        }
        
        removeClosed(y[i].id)
        trailing = false;
        lastPrice = undefined
        console.log("CLOSING TRADE")
      }

    }
  }
  console.log("Trailing from: ", trailActivationPrice)
  console.log("Closing on cross of: ", lastPrice)
}
setInterval(priceTrailer, 500)
