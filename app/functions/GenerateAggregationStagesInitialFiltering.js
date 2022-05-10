exports = function(symbol, hourFilter){

  let stages = []
  
  let stageSymbolFilter = {
        "$match": {
            "symbol": symbol
        }
  }
  stages.push(stageSymbolFilter)
  
  let stagesHourFilter = [
      {
        "$addFields": {
            "hourDiff": {
                "$dateDiff": {
                    "startDate": "$time",
                    "endDate": "$$NOW",
                    "unit": "hour"
                }
            }
        }
    },
    {
        "$match": {
            "hourDiff": {
                "$lte": hourFilter
            }
        }
    }
  ]
  stagesHourFilter.map(stage =>   stages.push(stage))
  
  return stages
  
};