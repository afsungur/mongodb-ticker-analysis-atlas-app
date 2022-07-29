exports = function(){
  
  const collectionName = context.values.get("activeConfiguration")['exchangeCollectionName'] // later we will get the exchange name from frontend
  console.log("CollectionName:"+collectionName)
  
  const pipeline = [
    {
        "$sort": {
            "symbol": 1,
            "time": -1
        }
    }, 
    {
        "$group": {
            "_id": "$symbol",
            "lastPrice": {
                "$first": "$price"
            },
            "lastUpdatedTime": {
                "$first": "$time"
            }
        }
    },
    {
        "$project" : {
            "symbol" : "$_id",
            "lastPrice": 1,
            "lastUpdatedTime": 1
        }  
    },
    {
        "$sort": {"symbol": 1}
    }
  ]
  
  const lastPrices = context.services.get("mongodb-atlas").db("exchange").collection("cryptoTickerBinance").aggregate(pipeline, {allowDiskUse:true}).toArray()
  return lastPrices
  
};