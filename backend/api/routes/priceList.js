const express = require("express");

const router = express.Router();

const priceListControllers = require("../controllers/priceListControllers");
const authControllers = require("../controllers/authControllers");
const mainControllers = require("../controllers/offerControllers");

router
  .route("/price-lists")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.getAllData
  )
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.insertData
  );

router
  .route("/price-lists/:id")
  // .get(
  //   authControllers.protect,
  //   authControllers.isUserInCompany,
  //   authControllers.restrictTo("User", "Admin"),
  //   mainControllers.getData
  // )
  .patch(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.patchData
  )
  .delete(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.archiveData
  )
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.restoreData
  );

router
  .route("/price-lists/free-intervals")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.getFreeIntervals
  );

router
  .route("/price-lists/utils/distinct")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    priceListControllers.getDistinctData
  );

module.exports = router;
