exports = async function(){
  
  const {exchangeCollectionName, exchangeDBName, exchangeDataSourceName} = context.values.get("activeConfiguration")
  const exampleData = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection('minuteBasedReport').findOne({})
  
  let thresholdMinute = 5;
  /*if (exampleData === null) {
    // there's no record, initial load should happen for last 1 hours of data (60 min)
    thresholdMinute = 30
  } else {
    // delta load should happen with 10 minutes buffer
    // assume that we get data 10 minutes later from the exchange
    thresholdMinute = 10
  }*/
  
  console.log("Threshold Minute:" + thresholdMinute)
  let pipeline =  
  [
    {
      "$addFields" : {
        'minuteDiff': {
          '$dateDiff': {
            'startDate': '$time',
            'endDate': '$$NOW',
            'unit': 'minute'
            }
        }
      }
    },
    { "$match" : {'minuteDiff': {'$lte': thresholdMinute}}},
    {
        "$group" : {
            "_id" : { "symbol" : "$symbol" , "time": { "$dateTrunc" : {"date": "$time", "unit": "minute", "binSize" : 1}}},
            "open" : {"$first" : "$price"},
            "close" : {"$last" : "$price"}
        }
    },
    {
        "$project" : {
          "symbol" : "$_id.symbol",
          "time": "$_id.time",
          "open": "$open",
          "close": "$close"
        }
    },
    {
        "$merge" : {
          "into" : "minuteBasedReport",
          "on" : ["time","symbol"],
          "whenMatched": "replace",
          "whenNotMatched": "insert"
        }
    }]
  
  
    const insertResult = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection(exchangeCollectionName).aggregate(pipeline,{allowDiskUse:true}).toArray();

  
  
  
  
  
};