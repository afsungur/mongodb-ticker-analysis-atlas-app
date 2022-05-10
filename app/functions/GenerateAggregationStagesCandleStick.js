exports = function(unit, binSize){

  let stages = []
  
  let stageGroup = {
        "$group": {
            "_id": {
                "symbol": "$symbol",
                "time": {
                    "$dateTrunc": {
                        "date": "$time",
                        "unit": unit,
                        "binSize": binSize
                    }
                }
            },
            "high": {
                "$max": "$price"
            },
            "low": {
                "$min": "$price"
            },
            "open": {
                "$first": "$price"
            },
            "close": {
                "$last": "$price"
            }
        }
    }
    
    let stageSort = 
    {
        "$sort": {
            "_id.time": 1
        }
    }
    
    stages.push(stageGroup)
    stages.push(stageSort)
    return stages
};