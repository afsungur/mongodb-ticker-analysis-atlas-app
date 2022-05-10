exports = async function(arg){
    
    const maximumRuntimeDurationMS = 50000
    const sleepTimeMilliMS = 1000
    const sleep = async (time) => new Promise((resolve) => setTimeout(resolve, time));
    const startTime = new Date()

    const {exchangeDBName, exchangeDataSourceName} = context.values.get("activeConfiguration")
    const collection = context.services.get(exchangeDataSourceName).db(exchangeDBName).collection("cryptoTickerBinance");

    while (true) {
      // Making HTTP GET call
      const response = await context.http.get({ url: "https://api.binance.com/api/v3/ticker/price" });
      
      // The response body is a BSON.Binary object. Parse it and return.
      var tickers = EJSON.parse(response.body.text());
      
      // Printing out one example ticker data
      console.log("One example of ticker data:" + JSON.stringify(tickers[0]))
      
      // Get the current date
      const now = new Date();
  
      tickers = tickers.map(obj=> ({ ...obj, time: now }))
      tickers = tickers.map(obj=> ({ ...obj, price: parseFloat(obj.price) }))
      
      // Printing out one example enriched ticker data
      console.log("One example of enriched ticker data:" + JSON.stringify(tickers[0]))
      
      const result = await collection.insertMany(tickers)
      console.log(JSON.stringify(result))

      
      if ((new Date()-startTime) > maximumRuntimeDurationMS) break;
      await sleep(sleepTimeMilliMS)
      

    }
};