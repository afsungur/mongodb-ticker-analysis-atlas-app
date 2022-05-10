exports = function(arg){

  const collectionName = context.values.get("activeConfiguration")['exchangeCollectionName'] // later we will get the exchange name from frontend
  console.log("CollectionName:"+collectionName)
  
  const pipeline = [
     {
        '$group' : {
          '_id' : "$symbol"
        }
    },
    {
        '$sort' : {
          "_id" : 1
        }
    }
  ];
  
  const symbols = context.services.get("mongodb-atlas").db("exchange").collection(collectionName).aggregate(pipeline).toArray()
  return symbols
};