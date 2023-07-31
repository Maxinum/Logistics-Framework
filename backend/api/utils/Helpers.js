const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const HistoryModel = require("../models/main/offerHistory");
const OfferModel = require("../models/main/offer");
const messages = require("./messages");

class Helper {
  setCorrectTypesForAggregate(globalObject) {
    console.log(globalObject);
    if (globalObject.valid_until) {
      const [key, value] = Object.entries(globalObject.valid_until)[0];
      globalObject.valid_until = { [`${key}`]: new Date(value) };
    }

    if (globalObject.valid_from) {
      const [key, value] = Object.entries(globalObject.valid_from)[0];
      globalObject.valid_from = { [`${key}`]: new Date(value) };
    }

    if (globalObject.valid_from && globalObject.valid_until) {
      globalObject.$and = [
        { valid_from: globalObject.valid_from },
        { valid_until: globalObject.valid_until },
      ];
      delete globalObject.valid_from;
      delete globalObject.valid_until;
    }

    if (globalObject.duration_sum) {
      const [key, value] = Object.entries(globalObject.duration_sum)[0];
      globalObject.duration_sum = { [`${key}`]: parseInt(value, 10) };
    }

    if (globalObject.free_days) {
      const [key, value] = Object.entries(globalObject.free_days)[0];
      globalObject.free_days = { [`${key}`]: parseInt(value, 10) };
    }

    if (globalObject._id) {
      globalObject._id = ObjectId(globalObject._id);
    }

    if (globalObject.company) {
      globalObject.company = ObjectId(globalObject.company);
    }

    if (globalObject["senderInformation.company"]) {
      globalObject["senderInformation.company"] = ObjectId(
        globalObject["senderInformation.company"]
      );
    }

    if (globalObject.uploaded_by) {
      globalObject.uploaded_by = ObjectId(globalObject.uploaded_by);
    }
    // console.log(globalObject);
    return globalObject;
  }

  async createHistoryCopy(object) {
    const documentForHistory = {
      ...object.toObject(),
      main_id: object._id,
    };
    delete documentForHistory._id;
    const updateDoc = new HistoryModel(documentForHistory);
    await updateDoc.save();

    const offer = await OfferModel.updateOne(
      { _id: object._id },
      { $push: { update_history: updateDoc._id } }
    );
    return offer;
  }

  getKeyFromObject(object) {
    return Object.keys(object)[0];
  }

  getValuesFromObject(object) {
    return Object.values(object)[0];
  }

  transformQuery(object) {
    let queryStr = JSON.stringify(object);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq|ne)\b/g,
      (match) => `$${match}`
    );
    return JSON.parse(queryStr);
  }

  deleteExcludedFields(globalObject) {
    const excludedFields = ["page", "sort", "limit", "fields", "distinct"];
    excludedFields.forEach((el) => delete globalObject[el]);
    return globalObject;
  }

  /**
   *
   * @param {"invitation" | "forgot"} type - required parameters for receiving a message!
   * @param key
   * @param company
   * @param url
   * @returns {*}
   */
  getMessage(type, company, url) {
    this._type = type;
    this._company = company;
    this._url = url;

    switch (this._type) {
      case "invitation":
        return messages.invitation(this._company, this._url);
      case "forgot":
        return messages.forgot(this._url);
      default:
        throw new Error(`Invalid message type: ${this._type}`);
    }
  }

  getHexRandomBytes() {
    return crypto.randomBytes(32).toString("hex");
  }

  getHashedToken(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
  }
}

module.exports = Helper;
