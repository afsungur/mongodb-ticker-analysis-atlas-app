exports = function(macd1, macd2, macdSignal){
  
  let stages = []
  
  let stagePartitioning = {
    "$setWindowFields": {
        "partitionBy": "$_id.symbol",
        "sortBy": {
            "_id.time": 1
        },
        "output" : {}
    }
  }
  
  stagePartitioning['$setWindowFields']['output']['macd01'] = {"$expMovingAvg": {"input": "$close","N": (macd1)}}
  stagePartitioning['$setWindowFields']['output']['macd02'] = {"$expMovingAvg": {"input": "$close","N": (macd2)}}
  stages.push(stagePartitioning)
  
  // 
  let stageMacdDifference = { "$addFields" : {"macdLine" : {"$subtract" : ["$macd01", "$macd02"]}}}
  stages.push(stageMacdDifference)
  
  // 
  let stageMacdSignalPartitioning = {
        "$setWindowFields" : {
            "partitionBy" : "$_id.symbol",
            "sortBy": { "_id.time" : 1 },
            "output" : {}
        }}
  
  
  stageMacdSignalPartitioning['$setWindowFields']['output']['macdSignal'] = {"$expMovingAvg" : {"input" : "$macdLine", "N" : macdSignal}}
  stages.push(stageMacdSignalPartitioning)
  
  //
  let stageMacdHistogram =  { "$addFields" : {"macdHistogram" : {"$subtract" : ["$macdLine", "$macdSignal"]}}}
  stages.push(stageMacdHistogram)
  

  
  return stages


  
};