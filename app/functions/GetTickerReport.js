exports = async function(parameterObject){
  
  const {symbol, hourFilter, candleStickUnit, candleStickInterval, ma1, ma2, ema1, ema2, macd1, macd2, macdSignal, rsi, stocOsc} = parameterObject;

  console.log("parameters: "+ JSON.stringify(parameterObject))
  let stages = []

  let initialFilteringStages = context.functions.execute('GenerateAggregationStagesInitialFiltering', parameterObject.symbol, parameterObject.hourFilter)
  initialFilteringStages.map(stage => stages.push(stage))
  
  let candleStickStages = context.functions.execute('GenerateAggregationStagesCandleStick', parameterObject.candleStickUnit, parameterObject.candleStickInterval)
  candleStickStages.map(stage => stages.push(stage))
  
  if (ma1 !== null || ma2 !== null || ema1 !== null || ema2 !== null ) {
    var stageMovingAverage = context.functions.execute('GenerateAggregationStagesMovingAverage', parameterObject.ma1, parameterObject.ma2, parameterObject.ema1, parameterObject.ema2)
    stages.push(stageMovingAverage)
  }
  
  if (macd1!== null && macd2!== null && macdSignal !== null) { 
    var macdStages = context.functions.execute('GenerateAggregationStagesMACD', parameterObject.macd1, parameterObject.macd2, parameterObject.macdSignal)
    macdStages.map(stage => stages.push(stage))
  }
  
  if (rsi !== null) {
    var rsiStages = context.functions.execute('GenerateAggregationStagesRSI', parameterObject.rsi)
    rsiStages.map(stage => stages.push(stage))
  }
  
  if (stocOsc !== null) { 
    var stocOscStages = context.functions.execute('GenerateAggregationStagesStochasticOscillator', parameterObject.stocOsc)
    stocOscStages.map(stage => stages.push(stage))
  }

  console.log("query: "+ JSON.stringify(stages))

  const {exchangeCollectionName, exchangeDBName, exchangeDataSourceName} = context.values.get("activeConfiguration")
  const result = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection(exchangeCollectionName).aggregate(stages).toArray();

  return {"result": result, "query": stages}

  
};