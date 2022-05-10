exports = function(ma_1, ma_2, ema_1, ema_2){

  let stagePartitioning = {
    "$setWindowFields": {
        "partitionBy": "$_id.symbol",
        "sortBy": {
            "_id.time": 1
        },
        "output" : {}
    }
  }
  
  if (ma_1 != null) {
    let outputMovingAverage01 = {
                      "$avg": "$close",
                      "window": {
                          "documents": [
                              (ma_1-1)*-1,
                              0
                          ]
                      }
    }
    stagePartitioning['$setWindowFields']['output']['movingAverage01'] = outputMovingAverage01
  }
  
  if (ma_2 != null) {
    let outputMovingAverage02 = {
                      "$avg": "$close",
                      "window": {
                          "documents": [
                              (ma_2-1)*-1,
                              0
                          ]
                      }
    }
    stagePartitioning['$setWindowFields']['output']['movingAverage02'] = outputMovingAverage02
  }
  
  if (ema_1 != null) {
    let outputExponentialMovingAverage01 = {
                "$expMovingAvg": {
                    "input": "$close",
                    "N": (ema_1)
                }
                
    }
    stagePartitioning['$setWindowFields']['output']['expMovingAverage01'] = outputExponentialMovingAverage01
  }
  
  if (ema_2 != null) {
    let outputExponentialMovingAverage02 = {
                "$expMovingAvg": {
                    "input": "$close",
                    "N": (ema_2)
                }
                
    }
    stagePartitioning['$setWindowFields']['output']['expMovingAverage02'] = outputExponentialMovingAverage02
  }
        
  return stagePartitioning;
};