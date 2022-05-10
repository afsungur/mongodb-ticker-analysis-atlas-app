exports = async function() {

    const {exchangeCollectionName, exchangeDBName, exchangeDataSourceName} = context.values.get("activeConfiguration")


    //let bucketedCollectionName = `system.buckets.${exchangeCollectionName}`
    let bucketedCollectionName = 'system.buckets.cryptoTickerBinance'
    console.log(`Bucketed collection name ${bucketedCollectionName}`)
    
    const minimumTimeResultSet = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection(bucketedCollectionName).find({},{"control.min.time":1}).sort({"$natural":1}).limit(1).toArray()
    console.log("mm:" + JSON.stringify(minimumTimeResultSet))
    minimumTime = minimumTimeResultSet[0]['control']['min']['time']

    const maximumTimeResultSet = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection(bucketedCollectionName).find({},{"control.max.time":1}).sort({"$natural":-1}).limit(1).toArray()
    maximumTime = maximumTimeResultSet[0]['control']['max']['time']
    console.log("mm:" + JSON.stringify(maximumTimeResultSet))

    var startTime = new Date()
    const cntBuckets = await context.services.get(exchangeDataSourceName).db(exchangeDBName).collection(bucketedCollectionName).count()
    var endTime = new Date()
    console.log("Duration to fetch from system bucket:"+(endTime-startTime))
  
    let returnObject = {
      "latestCurrencyDate" : maximumTime,
      "firstCurrencyDate" : minimumTime,
      "totalNumberOfRecords": cntBuckets*1000,
      "totalNumberOfBuckets" : cntBuckets
    }
    return returnObject

};