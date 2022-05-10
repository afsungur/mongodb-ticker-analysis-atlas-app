exports = async function(symbol, collectionType){


  // setting collection
  const collectionName = context.values.get("activeConfiguration")['exchangeCollectionName']
  console.log("CollectionName:"+collectionName)

  const pipelineForTimeSeriesCollection = [
      {
          '$match': {
            'symbol' : symbol
          }
      },
      {
          '$sort' : {
            "time" : -1
          }
      },
      {
          '$limit' : 100
      }
    ];
    
  const pipelineForBucketedCollection1 = [
    {
        '$match': {
          'meta' : symbol
        }
    },
    {
        '$sort' : {
          "time" : -1
        }
    },
    {
        '$limit' : 1
    }
  ];
  
  const pipelineForBucketedCollection =  [ 
      {'$match': {'meta':symbol} },
      {'$project' : {
          '_id' : 1,
          'control' : 1,
          'meta' : 1,
          'data._id.0' : 1,
          'data._id.1' : 1,
          'data._id.2' : 1,
          'data._id.3' : 1,
          'data.price.0' : 1,
          'data.price.1' : 1,
          'data.price.2' : 1,
          'data.price.3' : 1,
          'data.volume.0' : 1,
          'data.volume.1' : 1,
          'data.volume.2' : 1,
          'data.volume.3' : 1,
          'data.time.0' : 1,
          'data.time.1' : 1,
          'data.time.2' : 1,
          'data.time.3' : 1

      }},
      {'$sort' : {'control.max.time': -1}},
      {'$limit': 5}
  ]

  let result;
  console.log("Query is going to be executed now for the currency: " + symbol)
  if (collectionType === "timeseries") {
    console.log("Timeseries collection will be queried...")
    result = await context.services.get("mongodb-atlas").db("exchange").collection(collectionName).aggregate(pipelineForTimeSeriesCollection).toArray()
  } 
  else if (collectionType === "bucketed") {
    console.log("Bucket collection will be queried...")
    result = await context.services.get("mongodb-atlas").db("exchange").collection("system.buckets."+collectionName).aggregate(pipelineForBucketedCollection).toArray()
  }
    
  //resultStr = JSON.stringify(result,null,4)
  
  return result;
};
