exports = async function(arg){
    
    const maximumRuntimeDurationMS = 50000
    const sleepTimeMilliMS = 1000
    const sleep = async (time) => new Promise((resolve) => setTimeout(resolve, time));
    const startTime = new Date()
  
    // define set of currencies to track
    const currencies = ["BTC-USD", "ETH-USD", "SHIB-USD", "AVAX-USD", "BICO-USD", "ADA-USD", "VGX-USD", "AUCTION-USD", "MASK-USD"]
  
  
    const {exchangeDBName, exchangeDataSourceName} = context.values.get("activeConfiguration")
    const collection = context.services.get(exchangeDataSourceName).db(exchangeDBName).collection("cryptoTickerCoinbase");

    while (true) {
      
      // execute the http calls 
      let httpCalls = currencies.map(function(singleCurrency) {
          return context.http.get({ url: `https://api.exchange.coinbase.com/products/${singleCurrency}/ticker` })
      });
      
      let httpResponses = await Promise.all(httpCalls); // execute all REST calls parallel and wait them all to be finished
    
      const now = new Date();
    
      let tickers = []    
      for (i=0; i<httpResponses.length; i++) {
          let symbolName = currencies[i]
          let jsonResponse = EJSON.parse(httpResponses[i].body.text())
          let objectToInsert = {}
          
          objectToInsert.symbol = symbolName
          objectToInsert.price = parseFloat(jsonResponse.price)
          objectToInsert.time = now
          
          tickers.push(objectToInsert)
      }
        
      console.log(JSON.stringify(tickers, null, "\t"))

      const result = await collection.insertMany(tickers)
      console.log(JSON.stringify(result))

      if ((new Date()-startTime) > maximumRuntimeDurationMS) break;
      await sleep(sleepTimeMilliMS)
    }
};