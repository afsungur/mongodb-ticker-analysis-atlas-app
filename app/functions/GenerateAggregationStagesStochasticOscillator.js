exports = function(stocOsc){
  
  let stages = []
  
  let stageHighestLowest = {
        "$setWindowFields": {
            "partitionBy": "$_id.symbol",
            "sortBy": {
                "_id.time": 1
            },
            "output": {
                "stocOsscHighest": {
                    "$max": "$high",
                    "window": {
                        "documents": [
                            -1*(stocOsc-1),
                            0
                        ]
                    }
                },
                "stocOsscLowest": {
                    "$min": "$low",
                    "window": {
                        "documents": [
                            -1*(stocOsc-1),
                            0
                        ]
                    }
                },
                "documentNumber": {
                    "$documentNumber": {}
                }
            }
        }
  }
  stages.push(stageHighestLowest)
  
  let stageKValue =     {
        "$addFields": {
            "stocOsscKValue": {
                "$cond": {
                    "if": {
                        "$gt": [
                            "$documentNumber",
                            stocOsc
                        ]
                    },
                    "then": {
                        "$round": [
                            {
                                "$multiply": [
                                    {
                                        "$divide": [
                                            {
                                                "$subtract": [
                                                    "$close",
                                                    "$stocOsscLowest"
                                                ]
                                            },
                                            {
                                                "$subtract": [
                                                    "$stocOsscHighest",
                                                    "$stocOsscLowest"
                                                ]
                                            }
                                        ]
                                    },
                                    100
                                ]
                            },
                            2
                        ]
                    },
                    "else": null
                }
            }
        }
  }
  stages.push(stageKValue)
  
  let stageDValue =     {
        "$setWindowFields": {
            "partitionBy": "$_id.symbol",
            "sortBy": {
                "_id.time": 1
            },
            "output": {
                "stocOsscDValue": {
                    "$avg": "$stocOsscKValue",
                    "window": {
                        "documents": [
                            -2,
                            0
                        ]
                    }
                }
            }
        }
  }
  stages.push(stageDValue)

  let stageRounding =     {
        "$set": {
            "stocOsscKValue": {
                "$round": [
                    "$stocOsscKValue",
                    2
                ]
            },
            "stocOsscDValue": {
                "$round": [
                    "$stocOsscDValue",
                    2
                ]
            }
        }
  }
  stages.push(stageRounding)

  return stages
};