const express = require("express");

const router = express.Router();
const mainControllers = require("../controllers/offerControllers");
const authControllers = require("../controllers/authControllers");

router
  .route("/offer")
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    mainControllers.insertData
  )
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    mainControllers.getAllData
  );

router
  .route("/offer/:id")
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
    mainControllers.patchData
  )
  .delete(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    mainControllers.archiveData
  )
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    mainControllers.restoreData
  );

router
  .route("/offer/utils/distinct")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("User", "Admin"),
    mainControllers.getDistinctData
  );

module.exports = router;
