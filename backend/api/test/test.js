const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const {
  restoreData,
  archiveData,
  patchData,
  getDistinctData,
  getAllData,
} = require("../controllers/offerControllers");
const offerModel = require("../models/main/offer");
const AppError = require("../utils/AppError");
const Helper = require("../utils/Helpers");
const FilterAPI = require("../utils/FilterAPI");
const queries = require("../utils/queries");

describe("restoreData controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "offer-id",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should update the offer activity to "Active" and return a success response', async () => {
    const findByIdAndUpdateStub = sinon
      .stub(offerModel, "findByIdAndUpdate")
      .returns({
        _id: "offer-id",
      });

    await restoreData(req, res, next);

    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.args[0][0]).to.equal("offer-id");
    expect(findByIdAndUpdateStub.args[0][1]).to.deep.equal({
      activity: "Active",
    });

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.args[0][0]).to.deep.equal({
      status: "success",
    });
  });
});

describe("arhiveData controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "offer-id",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should update the offer activity to "Archived" and return a success response', async () => {
    const findByIdAndUpdateStub = sinon
      .stub(offerModel, "findByIdAndUpdate")
      .returns({
        _id: "offer-id",
      });

    await archiveData(req, res, next);

    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.args[0][0]).to.equal("offer-id");
    expect(findByIdAndUpdateStub.args[0][1]).to.deep.equal({
      activity: "Archived",
    });

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.args[0][0]).to.deep.equal({
      status: "success",
    });
  });
});

describe("patchData controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "offer-id",
      },
      body: {
        field: "value",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update the offer document, create a history copy, and return a success response", async () => {
    const findOneAndUpdateStub = sinon
      .stub(offerModel, "findOneAndUpdate")
      .returns({
        _id: "offer-id",
        field: "value",
      });

    const createHistoryCopyStub = sinon
      .stub(Helper.prototype, "createHistoryCopy")
      .returns();

    await patchData(req, res, next);

    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(findOneAndUpdateStub.args[0][0]).to.deep.equal({ _id: "offer-id" });
    expect(findOneAndUpdateStub.args[0][1]).to.deep.equal({ field: "value" });
    expect(findOneAndUpdateStub.args[0][2]).to.deep.equal({
      returnOriginal: true,
    });

    expect(createHistoryCopyStub.calledOnce).to.be.true;
    expect(createHistoryCopyStub.args[0][0]).to.deep.equal({
      _id: "offer-id",
      field: "value",
    });

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.args[0][0]).to.deep.equal({
      status: "success",
      code: 200,
    });
  });

  it('should call the "next" function with an AppError if the offer is not found', async () => {
    sinon.stub(offerModel, "findOneAndUpdate").returns(null);

    await patchData(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.args[0][0]).to.be.instanceOf(AppError);
    expect(next.args[0][0].message).to.equal("Offer not found");
    expect(next.args[0][0].statusCode).to.equal(404);
    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
  });
});
describe("getDistinctData", () => {
  let req, res, next, offerModelMock;

  beforeEach(() => {
    req = {
      query: {
        distinct: "final_destination,sealine", // Replace with the desired distinct keys
      },
      body: {
        company: "Capybara", // Replace with the desired company value
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();

    // Mock offerModel.distinct() method
    offerModelMock = {
      distinct: sinon.stub().returnsThis(),
    };

    // Mock the unique() method in FilterAPI
    sinon.stub(FilterAPI.prototype, "unique").returnsThis();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return distinct values for specified keys", async () => {
    // Mock the query result for each distinct key
    const distinctValues = ["final_destination", "sealine"];
    distinctValues.forEach((value, index) => {
      sinon.stub().resolves(value);
      offerModelMock.distinct.onCall(index).returnsThis();
    });

    const offerModelConstructorMock = sinon.stub().returns(offerModelMock);
    sinon
      .stub(FilterAPI.prototype, "constructor")
      .callsFake(offerModelConstructorMock);

    // Call the function
    await getDistinctData(req, res, next);

    // Assertions
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        status: "success",
        code: 200,
        data: {
          key1: distinctValues[0],
          key2: distinctValues[1],
        },
        results: 3,
      })
    ).to.be.true;
    expect(next.notCalled).to.be.true;

    // Verify mock behavior
    expect(FilterAPI.prototype.constructor.calledWithNew()).to.be.true;
    expect(
      FilterAPI.prototype.constructor.calledWith(
        offerModelMock.distinct(),
        sinon.match.string,
        "main",
        req.body.company
      )
    ).to.be.true;
    expect(FilterAPI.prototype.unique.calledOnce).to.be.true;
  });
});

describe("getAllData", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {}, // Replace with the desired query parameters
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return data with count", async () => {
    // Mock the FilterAPI instance
    const FilterAPIInstanceMock = {
      filter: sinon.stub().returnsThis(),
      sort: sinon.stub().returnsThis(),
      limitFields: sinon.stub().returnsThis(),
      paginate: sinon.stub().returnsThis(),
      facet: sinon.stub().returnsThis(),
      pipeline: [queries.main],
    };
    sinon
      .stub(FilterAPI.prototype, "constructor")
      .returns(FilterAPIInstanceMock);

    // Mock the aggregate method of the offerModel
    const aggregateResult = [
      {
        totalCount: { count: 5 },
        offer: [{}],
      },
    ];
    const offerModelMock = {
      aggregate: sinon.stub().resolves(aggregateResult),
    };

    // Call the function
    await getAllData(req, res, next);

    // Assertions
    expect(res.status.calledWith(201)).to.be.true;
    expect(
      res.json.calledWith({
        status: "success",
        code: 201,
        data: aggregateResult[0].offer,
        results: aggregateResult[0].totalCount.count,
      })
    ).to.be.result;
    expect(next.notCalled).to.be.true;

    // Verify mock behavior
    expect(FilterAPI.prototype.constructor.calledWithNew()).to.be.true;
    expect(FilterAPI.prototype.constructor.calledWith(req.query, "", "main")).to
      .be.true;
    expect(FilterAPIInstanceMock.filter.calledOnce).to.be.true;
    expect(FilterAPIInstanceMock.sort.calledOnce).to.be.true;
    expect(FilterAPIInstanceMock.limitFields.calledOnce).to.be.true;
    expect(FilterAPIInstanceMock.paginate.calledOnce).to.be.true;
    expect(FilterAPIInstanceMock.facet.calledOnce).to.be.true;
    expect(
      offerModelMock.aggregate.calledOnceWith(FilterAPIInstanceMock.pipeline)
    ).to.be.true;
  });
});
