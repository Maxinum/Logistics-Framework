const Helpers = require("./Helpers");
const queries = require("./queries");

/**
 * facet() method must be last! **/
class FilterAPI {
  /**
   * @param queryString
   * @param query
   * @param {"main" | "login" | "invitation" | "freeIntervals" | "currencyExchangePriceList"} variant - variant of filter pipeline config
   * @param company - companyID
   */
  constructor(queryString, query, variant, company) {
    this.queryString = queryString;
    this.pipeline = [...queries[variant]];
    this.copyPipeline = [];
    this.query = query;
    this.helpers = new Helpers();
    this.variant = variant;
    this.company = company;
  }

  filter() {
    let queryObj = this.helpers.transformQuery({ ...this.queryString });
    queryObj = this.helpers.deleteExcludedFields(queryObj);
    queryObj = this.helpers.setCorrectTypesForAggregate(queryObj);

    // Set the match stage
    const matchStage = { $match: queryObj };
    if (this.variant !== "invitation") {
      this.pipeline.unshift(matchStage);
    } else {
      this.pipeline.push(matchStage);
    }

    console.log(JSON.stringify(this.pipeline));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",");
      const sortObj = {};
      sortBy.forEach((sort) => {
        sort = sort.trim();
        sortObj[sort.charAt(0) === "-" ? sort.slice(1) : sort] =
          sort.charAt(0) === "-" ? -1 : 1;
      });
      this.pipeline.push({ $sort: sortObj });
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const projectObj = {};
      const fields = this.queryString.fields.split(",");
      fields.forEach((field) => {
        projectObj[field.trim()] = 1;
      });
      this.pipeline.push({ $project: projectObj });
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;
    const skipStage = { $skip: skip };
    const limitStage = { $limit: limit };

    this.copyPipeline = [...this.pipeline];
    this.copyPipeline.push({ $count: "count" });

    this.pipeline.push(skipStage, limitStage);

    return this;
  }

  facet() {
    //TODO: rename "currency_exchange" to "mainPipeline" in all usages
    const facetStage = {
      $facet: {
        currency_exchange: this.pipeline,
        count: this.copyPipeline,
      },
    };
    //TODO: rename "offer" to "data" in all usages
    const countingStage = {
      $project: {
        offer: "$currency_exchange",
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$count", 0] }, 0],
        },
      },
    };

    this.pipeline = [facetStage, countingStage];

    return this;
  }

  freeInterval() {
    let queryObj = this.helpers.transformQuery({ ...this.queryString });
    queryObj = this.helpers.deleteExcludedFields(queryObj);
    queryObj = this.helpers.setCorrectTypesForAggregate(queryObj);

    this.pipeline.unshift({ $match: queryObj });
    return this;
  }

  unique() {
    this.queryString = this.queryString.distinct(this.query, {
      company: this.company,
    });

    return this;
  }
}

module.exports = FilterAPI;
