exports = function(rsi){
  
  let stages = []
  
  let stageAddingPreviousPrice = {
    "$setWindowFields": {
        "partitionBy": "$_id.symbol",
        "sortBy": {
            "_id.time": 1
        },
        "output": {
            "prevClose": {
                "$shift": {
                    "by": -1,
                    "output": "$close"
                }
            }
        }
    }
  }
  stages.push(stageAddingPreviousPrice)
  
  let stageAddingDiffField =  {
        "$addFields": {
            "diff": {
                "$subtract": [
                    "$close",
                    {
                        "$ifNull": [
                            "$prevClose",
                            "$close"
                        ]
                    }
                ]
            }
        }
  }
  stages.push(stageAddingDiffField)
  
  let stageAddingGainAndLossField = {
        "$addFields": {
            "gain": {
                "$cond": {
                    "if": {
                        "$gte": [
                            "$diff",
                            0
                        ]
                    },
                    "then": "$diff",
                    "else": 0
                }
            },
            "loss": {
                "$cond": {
                    "if": {
                        "$lte": [
                            "$diff",
                            0
                        ]
                    },
                    "then": {
                        "$abs": "$diff"
                    },
                    "else": 0
                }
            }
        }
  }
  stages.push(stageAddingGainAndLossField)

  let stageAvgGainAndAvgLoss = {
        "$setWindowFields": {
            "partitionBy": "$_id.symbol",
            "sortBy": {
                "_id.time": 1
            },
            "output": {
                "avgGain": {
                    "$avg": "$gain",
                    "window": {
                        "documents": [
                            -1*(rsi-1),
                            0
                        ]
                    }
                },
                "avgLoss": {
                    "$avg": "$loss",
                    "window": {
                        "documents": [
                            -1*(rsi-1),
                            0
                        ]
                    }
                },
                "docNo": {
                    "$documentNumber": {}
                }
            }
        }
  }
  stages.push(stageAvgGainAndAvgLoss)

  let stageRelativeStrength = {
        "$addFields": {
            "relativeStrength": {
                "$cond": {
                    "if": {
                        "$gt": [
                            "$avgLoss",
                            0
                        ]
                    },
                    "then": {
                        "$divide": [
                            "$avgGain",
                            "$avgLoss"
                        ]
                    },
                    "else": "$avgGain"
                }
            }
        }
  }
  stages.push(stageRelativeStrength)

  let stageSmoothRSI = {
        "$addFields": {
            "rsi": {
                "$cond": {
                    "if": {
                        "$gt": [
                            "$docNo",
                            rsi
                        ]
                    },
                    "then": {
                        "$subtract": [
                            100,
                            {
                                "$divide": [
                                    100,
                                    {
                                        "$add": [
                                            1,
                                            "$relativeStrength"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "else": null
                }
            }
        }
  }  
  stages.push(stageSmoothRSI)

  return stages
  
};