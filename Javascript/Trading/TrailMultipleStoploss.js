// If personalized logs is not being used, modify 'logMessage...' for console.log(...)
// Will log errors on init until traderLogin has finished start up.

let trailActivationPrice;

let trailArray = []
let waitArray = []
let recArray = []

const trailOffsetPips = 40;
const trailPoints = 50; 

function returnWaitArrLen(){
  let len = waitArray.length;
  return len
}

function returnTrailPrice(y, side){
  let trailPrice;

  if(side === "POSITION_TYPE_BUY"){
    trailPrice = y - trailOffsetPips
  }else if("POSITION_TYPE_SELL"){
    trailPrice = y + trailOffsetPips
  }
  
  return trailPrice
}

async function cleanArrays(){
  let y = [];
  try{
      y = await terminalState.positions;
  }catch(error){
      await reconnect();
      y = await terminalState.positions;
  }

  if(waitArray.length > 0){
    for(let a = waitArray.length-1; a >= 0; a--){
        let orderPresent = false;
        for(let i = 0; i < y.length; i++){
            if(Number(waitArray[a]) === Number(y[i].id)){
                orderPresent = true;
                break;
            }
        }
        if(!orderPresent){
            waitArray.splice(a, 1);
        }
    }
  }

  if(trailArray.length > 0){
      for(let a = trailArray.length-1; a >= 0; a--){
          let orderTrailPresent = false;
          for(let i = 0; i < y.length; i++){
              if(Number(trailArray[a].split(':')[0]) === Number(y[i].id)){
                  orderTrailPresent = true;
                  break;
              }
          }
          if(!orderTrailPresent){
              trailArray.splice(a, 1);
          }
      }
  }
}


async function p1(){
    try{
      y = await terminalState.positions
    }catch(error){
      await reconnect()
      y = await terminalState.positions
    }
        
    for(let i = 0; i < y.length; i++){
        let id = y[i].id;
        let present = false;
        let oldPresent = recArray.includes(id);

        if(returnWaitArrLen() !== 0){
            for (let z = 0; z < waitArray.length; z++) {
                if (waitArray[z] === id) {
                    present = true;
                    break;
                }
            }
        }

        if(!present && !oldPresent){
            logMessage.info("New order found.");
            waitArray.push(id);
            recArray.push(id);
        }
    }
    await p2();
}


async function p2(){
  let y = []
  try{
    y = await terminalState.positions
  }catch(error){
    await reconnect()
    y = await terminalState.positions
  }

  let orderUpdate;
  let beingTrailed;

  if(y.length > 0){
    for(let i = 0; i<y.length; i++){
      let id = Number(y[i].id)
      let type = y[i].type;
      beingTrailed = false;
      for(let z = 0; z < waitArray.length;z++){
        let orderId = Number(waitArray[z])
        if(orderId === id){
          if(type === "POSITION_TYPE_BUY"){
            trailActivationPrice = y[i].openPrice + trailPoints
    
            for(let x = 0; x < trailArray.length;x++){
              let orderTrailId = Number(trailArray[x].split(':')[0])
              if(orderTrailId === orderId){
                beingTrailed = true
                break
              }
            }

            if(y[i].currentPrice >= trailActivationPrice && !beingTrailed){
              logMessage.info("New order being trailed.")
              orderUpdate = id + ":" + returnTrailPrice(y[i].currentPrice, type)
              trailArray.push(orderUpdate)
              waitArray.splice(z, 1)
            }
          }else if(type === "POSITION_TYPE_SELL"){
            trailActivationPrice = y[i].openPrice - trailPoints
    
            for(let x = 0; x < trailArray.length;x++){
              let orderTrailId = Number(trailArray[x].split(':')[0])
              if(orderTrailId === orderId){
                beingTrailed = true
                break
              }
            }

            if(y[i].currentPrice <= trailActivationPrice && !beingTrailed){
              logMessage.info("New order being trailed.")
              orderUpdate = id + ":" + returnTrailPrice(y[i].currentPrice, type)
              trailArray.push(orderUpdate)
              waitArray.splice(z, 1)
            }
          }
        }
      }
    }
  }
  await p3()
}

let cy = 0;

async function p3(){
  let y = []
  try{
    y = await terminalState.positions
  }catch(error){
    await reconnect()
    y = await terminalState.positions
  }

  let trail;

  if(y.length > 0){
    for(let i = 0; i<y.length; i++){
      let id = y[i].id
      let type = y[i].type;
      trail = returnTrailPrice(y[i].currentPrice, type)
      
      for(let z = 0; z < trailArray.length;z++){
        let idMatch = trailArray[z].split(':')[0]
        let lastPrice = Number(trailArray[z].split(':')[1])
        if(idMatch === id){
          if(type === "POSITION_TYPE_BUY"){

            if(trail > lastPrice){
              trailArray.splice(z, 1)
              logMessage.success("Trailing updated.")
              let orderUpdate = id + ":" + trail
              
              trailArray.push(orderUpdate)

            }else if(y[i].currentPrice < lastPrice){
              try{
                connection.closePosition(id)
              }catch(err){
                console.log("ERROR CLOSING TRADE, ", err, "ERROR CLOSING TRADE!")
                connection.closePosition(id)
              }
  
              trailArray.splice(z, 1)
              removeClosed(id)
              logMessage.info('Order closed by trailing.')
            }
          }else if(type === "POSITION_TYPE_SELL"){

            if(trail < lastPrice){
              logMessage.success("Trailing updated.")
              let orderUpdate = id + ":" + trail
              trailArray.splice(z, 1)
              trailArray.push(orderUpdate)

            }else if(y[i].currentPrice > lastPrice){
              try{
                connection.closePosition(id)
              }catch(err){
                console.log("ERROR CLOSING TRADE, ", err, "ERROR CLOSING TRADE!")
                connection.closePosition(id)
              }
              
              trailArray.splice(z, 1)
              removeClosed(id)
              logMessage.info('Order closed by trailing.')
            }
          }
        }
      }
    }
  }
  cy += 1
  logMessage.debug(`Cycle ${cy}`)
}

function checkCloses(){
  if(waitArray.length === 0){
    logMessage.info('No orders waiting.')
  }else{
    for(let z = 0; z < waitArray.length;z++){
      console.log("Wait Array: ", waitArray[z])
    }
  }
  console.log("\n")
  if(trailArray.length === 0){
    logMessage.info('No orders being trailed.')
  }else{
    for(let a = 0; a < trailArray.length;a++){
      console.log("Trail Array: ", trailArray[a])
    }
  }
}

setInterval(p1, 500) // P1 requires P2 and P3.
setInterval(cleanArrays, 500) // Cleans old orders from arrays. (Record array currently not included)
setInterval(checkCloses, 5000) // Logs the arrays for inspection.