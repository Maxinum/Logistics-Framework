const express = require("express");

const router = express.Router();
const authControllers = require("../controllers/authControllers");
const adminActionsController = require("../controllers/adminActionsControllers");

router.route("/login").post(authControllers.login);
router.route("/user/sign-up/:token").post(authControllers.signup);

router
  .route("/user/invite")
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.sendInvitation
  )
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.getAllInvitations
  );

router
  .route("/user/invite/:_id")
  .delete(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.deleteInvitation
  );

router
  .route("/user/utils/activate/:id")
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.activateUser
  );

router
  .route("/user/utils/deactivate/:id")
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.deactivateUser
  );

router
  .route("/user/utils/get-users")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.getAllUsers
  );

router
  .route("/user/utils/edit-user/:id")
  .post(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.editUser
  );
router
  .route("/user/utils/hash-check/:token")
  .post(authControllers.signupHashCheck);

router
  .route("/user/utils/get-distinct-users")
  .get(
    authControllers.protect,
    authControllers.isUserInCompany,
    authControllers.restrictTo("Admin"),
    adminActionsController.getDistinctUsers
  );

router.route("/user/forgot-password").post(authControllers.forgotPassword);
router.route("/user/reset-password/:token").post(authControllers.resetPassword);

module.exports = router;
