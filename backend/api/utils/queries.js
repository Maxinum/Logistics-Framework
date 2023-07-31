const queries = {
  main: [
    {
      $unwind: "$details",
    },
    {
      $lookup: {
        from: "currencies",
        let: {
          currency_code: "$details.currency_code",
        },
        pipeline: [
          {
            $unwind: "$rates",
          },
          {
            $match: {
              $expr: {
                $eq: ["$rates.currency_code", "$$currency_code"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              rate: "$rates.rate",
            },
          },
        ],
        as: "currency",
      },
    },
    {
      $addFields: {
        "details.price_20_usd": {
          $divide: [
            "$details.price_20",
            {
              $arrayElemAt: ["$currency.rate", 0],
            },
          ],
        },
        "details.price_40_usd": {
          $divide: [
            "$details.price_40",
            {
              $arrayElemAt: ["$currency.rate", 0],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        loading_port: {
          $first: "$loading_port",
        },
        final_destination: {
          $first: "$final_destination",
        },
        discharge_port: {
          $first: "$discharge_port",
        },
        transit_port: {
          $first: "$transit_port",
        },
        point_of_shipment: {
          $first: "$point_of_shipment",
        },
        train_station: {
          $first: "$train_station",
        },
        country: {
          $first: "$country",
        },
        forwarder: {
          $first: "$forwarder",
        },
        sealine: {
          $first: "$sealine",
        },
        customs: {
          $first: "$customs",
        },
        weight_limit: {
          $first: "$weight_limit",
        },
        valid_from: {
          $first: "$valid_from",
        },
        valid_until: {
          $first: "$valid_until",
        },
        duration: {
          $first: "$duration",
        },
        free_days: {
          $first: "$free_days",
        },
        mode: {
          $first: "$mode",
        },
        certificate: {
          $first: "$certificate",
        },
        incoterm: {
          $first: "$incoterm",
        },
        importer: {
          $first: "$importer",
        },
        inland_carrier: {
          $first: "$inland_carrier",
        },
        client: {
          $first: "$client",
        },
        details: {
          $push: "$details",
        },
        activity: {
          $first: "$activity",
        },
        uploaded_by: {
          $first: "$uploaded_by",
        },
        created_at: {
          $first: "$created_at",
        },
        secret_status: {
          $first: "$secret_status",
        },
        update_history: {
          $first: "$update_history",
        },
        duration_sum: {
          $first: "$duration_sum",
        },
        company: {
          $first: "$company",
        },
        senderInformation: {
          $first: "$senderInformation",
        },
        total_price_20_usd: {
          $sum: "$details.price_20_usd",
        },
        total_price_40_usd: {
          $sum: "$details.price_40_usd",
        },
        __v: {
          $first: "$__v",
        },
      },
    },
  ],
  login: [],
  invitation: [
    {
      $lookup: {
        from: "users",
        let: { senderInformationId: "$senderInformation" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$senderInformationId"],
              },
            },
          },
          {
            $project: {
              company: 1,
            },
          },
        ],
        as: "senderInformation",
      },
    },
    {
      $addFields: {
        senderInformation: { $arrayElemAt: ["$senderInformation", 0] },
      },
    },
  ],
  freeIntervals: [
    { $sort: { valid_from: 1 } },

    {
      $group: {
        _id: "$category",
        pricelists: { $push: "$$ROOT" },
        validIntervals: {
          $push: {
            valid_from: "$valid_from",
            valid_until: "$valid_until",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        validIntervals: {
          $reduce: {
            input: "$validIntervals",
            initialValue: [],
            in: {
              $cond: {
                if: {
                  $or: [
                    {
                      $not: {
                        $anyElementTrue: {
                          $map: {
                            input: "$$value",
                            as: "interval",
                            in: {
                              $or: [
                                {
                                  $gt: [
                                    "$$this.valid_until",
                                    "$$interval.valid_from",
                                  ],
                                },
                                {
                                  $lt: [
                                    "$$this.valid_from",
                                    "$$interval.valid_until",
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                then: {
                  $concatArrays: ["$$value", ["$$this"]],
                },
                else: "$$value",
              },
            },
          },
        },
        freeIntervals: {
          $let: {
            vars: {
              firstInterval: {
                $arrayElemAt: ["$validIntervals", 0],
              },
            },
            in: {
              $concatArrays: [
                [
                  {
                    valid_from: "1970-01-01T00:00:00.000Z",
                    valid_until: "$$firstInterval.valid_from",
                  },
                ],
                {
                  $map: {
                    input: "$validIntervals",
                    as: "interval",
                    in: {
                      valid_from: {
                        $add: ["$$interval.valid_until", 1],
                      },
                      valid_until: {
                        $let: {
                          vars: {
                            nextIndex: {
                              $indexOfArray: ["$validIntervals", "$$interval"],
                            },
                          },
                          in: {
                            $cond: [
                              {
                                $eq: [
                                  "$$nextIndex",
                                  {
                                    $subtract: [
                                      {
                                        $size: "$validIntervals",
                                      },
                                      1,
                                    ],
                                  },
                                ],
                              },
                              null,
                              {
                                $arrayElemAt: [
                                  "$validIntervals.valid_from",
                                  {
                                    $add: ["$$nextIndex", 1],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ],
  currencyExchangePriceList: [
    {
      $unwind: "$details",
    },
    {
      $lookup: {
        from: "currencies",
        let: {
          currency_code: "$details.currency_code",
        },
        pipeline: [
          {
            $unwind: "$rates",
          },
          {
            $match: {
              $expr: {
                $eq: ["$rates.currency_code", "$$currency_code"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              rate: "$rates.rate",
            },
          },
        ],
        as: "currency",
      },
    },
    {
      $addFields: {
        "details.price_20_usd": {
          $divide: [
            "$details.price_20",
            {
              $arrayElemAt: ["$currency.rate", 0],
            },
          ],
        },
        "details.price_40_usd": {
          $divide: [
            "$details.price_40",
            {
              $arrayElemAt: ["$currency.rate", 0],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        category: {
          $first: "$category",
        },
        final_destination: {
          $first: "$final_destination",
        },
        forwarder: {
          $first: "$forwarder",
        },
        sealine: {
          $first: "$sealine",
        },
        train_station: {
          $first: "$train_station",
        },
        valid_from: {
          $first: "$valid_from",
        },
        valid_until: {
          $first: "$valid_until",
        },
        details: {
          $push: "$details",
        },
        customs: {
          $first: "$customs",
        },
        discharge_port: {
          $first: "$discharge_port",
        },
        inland_carrier: {
          $first: "$inland_carrier",
        },
        activity: {
          $first: "$activity",
        },
        total_price_20_usd: {
          $sum: "$details.price_20_usd",
        },
        total_price_40_usd: {
          $sum: "$details.price_40_usd",
        },
        company: {
          $first: "$company",
        },
      },
    },
  ],
  offersWithPriceListsCurrencyExchange: [
    {
      $lookup: {
        from: "price_list_currency_exchange",
        let: {
          final_destination: "$final_destination",
          discharge_port: "$discharge_port",
          customs_clearance: "$customs.discharge_port",
          train_station: "$train_station",
          inland_carrier: "$inland_carrier",
          forwarder: "$forwarder",
          incoterm: "$incoterm",
          sealine: "$sealine",
          valid_from: "$valid_from",
          valid_until: "$valid_until",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$customs.discharge_port", "$$customs_clearance"],
                  },
                  {
                    $eq: ["$discharge_port", "$$discharge_port"],
                  },
                  {
                    $lte: ["$valid_until", "$$valid_until"],
                  },
                  {
                    $gte: ["$valid_from", "$$valid_from"],
                  },
                ],
              },
            },
          },
        ],
        as: "condition1",
      },
    },
    {
      $lookup: {
        from: "price_list_currency_exchange",
        let: {
          final_destination: "$final_destination",
          discharge_port: "$discharge_port",
          customs_clearance: "$customs.discharge_port",
          train_station: "$train_station",
          inland_carrier: "$inland_carrier",
          forwarder: "$forwarder",
          incoterm: "$incoterm",
          sealine: "$sealine",
          valid_from: "$valid_from",
          valid_until: "$valid_until",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$inland_carrier.discharge_port",
                      "$$inland_carrier.discharge_port",
                    ],
                  },
                  {
                    $eq: ["$train_station", "$$train_station"],
                  },
                  {
                    $eq: ["$discharge_port", "$$discharge_port"],
                  },
                  {
                    $eq: ["$final_destination", "$$final_destination"],
                  },
                  {
                    $lte: ["$valid_until", "$$valid_until"],
                  },
                  {
                    $gte: ["$valid_from", "$$valid_from"],
                  },
                ],
              },
            },
          },
        ],
        as: "condition2",
      },
    },
    {
      $lookup: {
        from: "price_list_currency_exchange",
        let: {
          final_destination: "$final_destination",
          discharge_port: "$discharge_port",
          customs_clearance: "$customs.discharge_port",
          train_station: "$train_station",
          inland_carrier: "$inland_carrier",
          forwarder: "$forwarder",
          incoterm: "$incoterm",
          sealine: "$sealine",
          valid_from: "$valid_from",
          valid_until: "$valid_until",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$incoterm", "$$incoterm"],
                  },
                  {
                    $eq: ["$forwarder", "$$forwarder"],
                  },
                  {
                    $lte: ["$valid_until", "$$valid_until"],
                  },
                  {
                    $gte: ["$valid_from", "$$valid_from"],
                  },
                ],
              },
            },
          },
        ],
        as: "condition3",
      },
    },
    {
      $lookup: {
        from: "price_list_currency_exchange",
        let: {
          final_destination: "$final_destination",
          discharge_port: "$discharge_port",
          customs_clearance: "$customs.discharge_port",
          train_station: "$train_station",
          inland_carrier_loading: "$inland_carrier.loading_port",
          inland_carrier_discharge: "inland_carrier.discharge_port",
          forwarder: "$forwarder",
          incoterm: "$incoterm",
          sealine: "$sealine",
          valid_from: "$valid_from",
          valid_until: "$valid_until",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$inland_carrier.loading_port",
                      "$$inland_carrier_loading",
                    ],
                  },
                  {
                    $lte: ["$valid_until", "$$valid_until"],
                  },
                  {
                    $gte: ["$valid_from", "$$valid_from"],
                  },
                ],
              },
            },
          },
        ],
        as: "condition4",
      },
    },
    {
      $lookup: {
        from: "price_list_currency_exchange",
        let: {
          final_destination: "$final_destination",
          discharge_port: "$discharge_port",
          customs_clearance: "$customs.discharge_port",
          train_station: "$train_station",
          inland_carrier: "$inland_carrier",
          forwarder: "$forwarder",
          incoterm: "$incoterm",
          sealine: "$sealine",
          valid_from: "$valid_from",
          valid_until: "$valid_until",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$sealine", "$$sealine"],
                  },
                  {
                    $lte: ["$valid_until", "$$valid_until"],
                  },
                  {
                    $gte: ["$valid_from", "$$valid_from"],
                  },
                ],
              },
            },
          },
        ],
        as: "condition5",
      },
    },
    {
      $addFields: {
        priceLists: {
          $concatArrays: [
            "$condition1",
            "$condition2",
            "$condition3",
            "$condition4",
            "$condition5",
          ],
        },
      },
    },
    {
      $project: {
        condition1: 0,
        condition2: 0,
        condition3: 0,
        condition4: 0,
        condition5: 0,
      },
    },
    {
      $addFields: {
        total_price_20_usd: {
          $add: [
            "$total_price_20_usd",
            {
              $reduce: {
                input: "$priceLists",
                initialValue: 0,
                in: {
                  $sum: ["$$value", "$$this.total_price_20_usd"],
                },
              },
            },
          ],
        },
        total_price_40_usd: {
          $add: [
            "$total_price_40_usd",
            {
              $reduce: {
                input: "$priceLists",
                initialValue: 0,
                in: {
                  $sum: ["$$value", "$$this.total_price_40_usd"],
                },
              },
            },
          ],
        },
      },
    },
  ],
  empty: [],
};

module.exports = queries;
