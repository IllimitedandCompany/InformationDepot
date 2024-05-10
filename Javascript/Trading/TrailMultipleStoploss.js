// If personalized logs is not being used, modify 'logMessage...' for console.log(...)

let trailActivationPrice;
let trailPrice;

let trailArray = []
let waitArray = []

const trailOffsetPips = 50;
const trailPoints = 75; 

async function p1(){
  let present = false
  let y = []
  try{
    y = await terminalState.positions
  }catch(error){
    await reconnect()
    y = await terminalState.positions
  }

  if(y.length > 0){
    for(let i = 0; i<y.length; i++){
      let id = y[i].id
      let type = y[i].type;

      if (type === "POSITION_TYPE_SELL"){
        side = "SELL"
        trailActivationPrice = y[i].openPrice - trailPoints
        trailPrice = y[i].currentPrice + trailOffsetPips
        let order;
        for(let z = 0; z < waitArray.length;z++){
          let idMatch = waitArray[z]
          if(idMatch === id){
            present = true
            order = id
            break
          }
        }

        if(!present){
          logMessage.info("New order found.")
          waitArray.push(order)
        }         
      }else if (type === "POSITION_TYPE_BUY"){
        side = "BUY"
        trailActivationPrice = y[i].openPrice + trailPoints
        trailPrice = y[i].currentPrice - trailOffsetPips
        let order;
        for(let z = 0; z < waitArray.length;z++){
          let idMatch = waitArray[z]
          if(idMatch === id){
            present = true
            order = id
            break
          }
        }

        if(!present){
          logMessage.info("New order found.")
          waitArray.push(order)
        }         
      }
    }
  }
  p2()
}

async function p2(){
  let y = []
  try{
    y = await terminalState.positions
  }catch(error){
    await reconnect()
    y = await terminalState.positions
  }

  if(y.length > 0){
    for(let i = 0; i<y.length; i++){
      let id = y[i].id
      let type = y[i].type;
      for(let z = 0; z < waitArray.length;z++){
        let orderId = waitArray[z]
        if(orderId === id){
          if(type === "POSITION_TYPE_BUY"){
            side = "BUY"
            trailActivationPrice = y[i].openPrice + trailPoints
            trailPrice = y[i].currentPrice - trailOffsetPips
    
            if(y[i].currentPrice >= trailActivationPrice){
              logMessage.info("New order being trailed.")
              let orderUpdate = id + ":" + lastPrice
              trailArray.push(orderUpdate)

              for(let z = 0; z < waitArray.length;z++){
                let idMatch = waitArray[z].split(':')[0]
                if(idMatch === id){
                  waitArray.splice(z, 1)
                }
              }
            }
          }else if(type === "POSITION_TYPE_SELL"){
            side = "SELL"
            trailActivationPrice = y[i].openPrice - trailPoints
            trailPrice = y[i].currentPrice + trailOffsetPips
    
            if(y[i].currentPrice <= trailActivationPrice){
              logMessage.info("New order being trailed.")
              let orderUpdate = id + ":" + lastPrice
              trailArray.push(orderUpdate)

              for(let z = 0; z < waitArray.length;z++){
                let idMatch = waitArray[z].split(':')[0]
                if(idMatch === id){
                  waitArray.splice(z, 1)
                }
              }
            }
          }
        }
      }
    }
  }
  p3()
}

async function p3(){
  let y = []
  try{
    y = await terminalState.positions
  }catch(error){
    await reconnect()
    y = await terminalState.positions
  }

  if(y.length > 0){
    for(let i = 0; i<y.length; i++){
      let id = y[i].id
      let type = y[i].type;

      for(let z = 0; z < trailArray.length;z++){
        let idMatch = trailArray[z].split(':')[0]
        let lastPrice = trailArray[z].split(':')[1]
        if(idMatch === id){
          if(type === "POSITION_TYPE_BUY"){
            side = "BUY"
            trailActivationPrice = y[i].openPrice + trailPoints
            trailPrice = y[i].currentPrice - trailOffsetPips
    
            if(trailPrice > lastPrice){
              logMessage.success("Trailing updated.")
              let orderUpdate = id + ":" + trailPrice
              trailArray.splice(z, 1)
              trailArray.push(orderUpdate)
            }else if(y[i].currentPrice < lastPrice){
              try{
                connection.closePosition(y[i].id)
              }catch(err){
                console.log("ERROR CLOSING TRADE, ", err, "ERROR CLOSING TRADE!")
                connection.closePosition(y[i].id)
              }
  
              trailArray.splice(z, 1)
              removeClosed(y[i].id)
              logMessage.info('Order closed by trailing.')
            }
          }else if(type === "POSITION_TYPE_SELL"){
            side = "SELL"
            trailActivationPrice = y[i].openPrice - trailPoints
            trailPrice = y[i].currentPrice + trailOffsetPips
    
            if(trailPrice < lastPrice){
              logMessage.success("Trailing updated.")
              let orderUpdate = id + ":" + trailPrice
              trailArray.splice(z, 1)
              trailArray.push(orderUpdate)
            }else if(y[i].currentPrice > lastPrice){
              try{
                connection.closePosition(y[i].id)
              }catch(err){
                console.log("ERROR CLOSING TRADE, ", err, "ERROR CLOSING TRADE!")
                connection.closePosition(y[i].id)
              }
              
              trailArray.splice(z, 1)
              removeClosed(y[i].id)
              logMessage.info('Order closed by trailing.')
            }
          }
        }
      }
    }
  }
}

setInterval(p1, 500) // P1 requires P2 and P3.