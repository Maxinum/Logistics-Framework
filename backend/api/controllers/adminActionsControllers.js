const UserModel = require("../models/login/user");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/email");
const FilterApi = require("../utils/FilterApi");
const Helper = require("../utils/Helpers");
const InvitationModel = require("../models/login/invitation");
const CompanyModel = require("../models/login/company");

/**
 * Controller for activating a user
 * @param req.params.id - User ID
 */
exports.activateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await UserModel.findByIdAndUpdate(id, {
    status: "Active",
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

/**
 * Controller for deactivating a user
 * @param req.params.id - User ID
 */
exports.deactivateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await UserModel.findByIdAndUpdate(id, {
    status: "Inactive",
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

/**
 * Controller for editing a user
 * @param req.params.id - User ID
 * @param req.body - Updated user data
 */
exports.editUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const updatedUser = await UserModel.findByIdAndUpdate(id, body);

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

/**
 * Controller for retrieving all users with filtering, sorting, pagination, and field limiting
 * @param req.query - Query parameters for filtering, sorting, pagination, and field limiting
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const api = new FilterApi(req.query, "", "login")
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .facet();
  const users = await UserModel.aggregate(api.pipeline);

  // get count from database answer object
  // eslint-disable-next-line prefer-destructuring
  const count = users[0].totalCount.count;
  // remove the totalCount field from the result
  delete users[0].totalCount;

  res.status(201).json({
    status: "success",
    code: 201,
    data: users[0].offer,
    results: count,
  });
});

/**
 * Controller for generating hashToken and sending an invitation to a user
 * @param req.body.email - User's email
 * @param req.body.company - User's company
 */
exports.sendInvitation = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { company, user } = req.headers;

  // Check if the user already exists
  const isUserExists = await UserModel.exists({ email });

  if (isUserExists) {
    return next(new AppError("Email already in use.", 400));
  }

  // Generate and hash the token
  const token = new Helper().getHexRandomBytes();
  const hashedToken = new Helper().getHashedToken(token);

  // Delete any previous invitations for the email
  await InvitationModel.findOneAndDelete({ email });

  // Create a new invitation
  const invitation = await InvitationModel.create({
    invitationToken: hashedToken,
    email,
    confirmEmail: req.body.confirmEmail,
    invitationTokenExpires: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours expiration
    senderInformation: user,
    company: req.body.company,
  });

  // Get the company name
  const companyData = await CompanyModel.findById(company);
  const { name } = companyData;

  // Generate the invitation message
  const invitationUrl = `http://ml.maxinum.kz/sign-up/${token}`;
  const message = new Helper().getMessage("invitation", name, invitationUrl);

  // Send the invitation email
  try {
    await sendEmail(email, "Invite", message);

    res.status(200).json({
      status: "success",
      message: "Your invitation is valid for 12 hours!",
    });
  } catch (err) {
    // If sending the email fails, delete the invitation
    await invitation.remove();

    return next(new AppError("Invitation error. Please try again!", 400));
  }
});

/**
 * Controller for setting results based on filter keys
 * @param req.query.keys - Array of filter keys
 */
exports.getDistinctUsers = catchAsync(async (req, res, next) => {
  const keys = req.query.distinct.split(",");
  console.log(keys);
  console.log(req.query);

  const results = {};

  const setResult = async (key) => {
    const api = new FilterApi(
      UserModel.distinct(),
      key,
      "login",
      req.query.company
    ).unique();
    results[key] = await api.queryString;
  };

  await Promise.all(keys.map(setResult));

  if (Object.keys(results).length === 0) {
    return next(new AppError("Something went wrong", 404));
  }

  res.status(200).json({
    status: "success",
    code: 200,
    data: results,
    results: keys.length,
  });
});

exports.deleteInvitation = catchAsync(async (req, res, next) => {
  // in this case we haven't company information in invitation model natively
  const params = new Helper().setCorrectTypesForAggregate(req.params);
  const invitation = await InvitationModel.findOneAndDelete(params);
  if (!invitation) {
    return next(new AppError("Invitation was not found", 400));
  }

  res.status(200).json({
    status: "success",
    code: 200,
  });
});

exports.getAllInvitations = catchAsync(async (req, res, next) => {
  // in this case we haven't company information in invitation model natively
  req.query = { "senderInformation.company": req.query.company };
  delete req.query.company;
  console.log(req.query);
  const api = new FilterApi(req.query, "", "invitation")
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .facet();

  console.log(req.query);
  const invitations = await InvitationModel.aggregate(api.pipeline);
  console.log(invitations);
  // get count from database answer object
  // eslint-disable-next-line prefer-destructuring
  const count = invitations[0].totalCount.count;
  // remove the totalCount field from the result
  delete invitations[0].totalCount;

  res.status(201).json({
    status: "success",
    code: 201,
    data: invitations[0].offer,
    results: count,
  });
});
