exports = async function(){
  
  const {exchangeCollectionName, exchangeDBName, exchangeDataSourceName} = context.values.get("activeConfiguration")
  const rules = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection('rules').find({}).toArray();
  
  for (const rule of rules) {

    let param = {
    symbol: rule.symbol,
    hourFilter: 24,
    candleStickUnit: "minute",
    candleStickInterval: rule.interval,
    ma1: null,
    ma2: null,
    ema1: null,
    ema2: null,
    macd1: null,
    macd2: null,
    macdSignal: null,
    rsi: null,
    stocOsc: null
    }
    
    if (rule.method === "MA") {
      param.ma1 = rule.numOfDataPointsToAnalyze
    } else if (rule.method === "EMA") {
      param.ema1 = rule.numOfDataPointsToAnalyze
    } else if (rule.method === "RSI") {
      param.rsi = rule.numOfDataPointsToAnalyze
    }
    
    var tickerReport = await context.functions.execute('GetTickerReport', param)
    var returnDataSet = tickerReport.result
    console.log("Return data set:" + JSON.stringify(returnDataSet))
    
    let lastRecord = returnDataSet[returnDataSet.length-1]
    console.log("This is the last record: " + JSON.stringify(lastRecord))

    let lastRecordFieldValueToEvaluate;
    if (rule.method === "MA") lastRecordFieldValueToEvaluate = lastRecord.movingAverage01;
    if (rule.method === "EMA") lastRecordFieldValueToEvaluate = lastRecord.expMovingAverage01;
    if (rule.method === "RSI") lastRecordFieldValueToEvaluate = lastRecord.rsi;

    let conditionsMet = false;

    if ( (rule.comparison === "$gt" && lastRecordFieldValueToEvaluate > rule.threshold) 
    || (rule.comparison === "$lt" && lastRecordFieldValueToEvaluate < rule.threshold)) {
        // then rule evaluted as success
        conditionsMet = true;
    }
    
    let ruleStatistics = {
          ruleId: rule._id,
          time: new Date(),
          symbol: rule.symbol,
          lastPrice: lastRecord.close,
          methodValue: lastRecordFieldValueToEvaluate,
          threshold: rule.threshold,
          comparison: rule.comparison,
          method: rule.method,
          conditionsMet: conditionsMet
    }
    
    //console.log("statistics: "+ JSON.stringify(ruleStatistics))
    
    const insertResult = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection('ruleStatistics').insertOne(ruleStatistics);

    
  }
};