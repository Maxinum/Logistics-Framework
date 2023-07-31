const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/login/user");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/email");
const Helper = require("../utils/Helpers");
const InvitationModel = require("../models/login/invitation");
const CompanyModel = require("../models/login/company");

/**
 * Helper function to sign a JSON Web Token (JWT)
 * @param id - User ID
 * @returns JWT
 */
const signToken = (id) =>
  jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

/**
 * Controller for user signup based on an invitation token
 * @param req.params.token - Invitation token
 */
exports.signup = catchAsync(async (req, res, next) => {
  // Get the hashed token from the request parameters
  const hashedToken = new Helper().getHashedToken(req.params.token);

  // Find the invitation with the matching hashed token and valid expiration time
  const invite = await InvitationModel.findOne({
    invitationToken: hashedToken,
    invitationTokenExpires: { $gt: Date.now() },
  }).populate({
    path: "senderInformation",
    select: "company email name surname",
  });

  // If no invitation is found, or it has expired, throw an error
  if (!invite) {
    return next(
      new AppError(
        "Invite does not exist or expired. Please, contact your manager.",
        400
      )
    );
  }

  // Create a new user object with the required fields from the request body
  const user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: "User",
    company: invite.senderInformation.company,
  };

  // Create a new user in the UserModel collection
  const newUser = await UserModel.create(user);

  // If user creation fails, throw an error
  if (!newUser) {
    return next(new AppError(`Cannot create user`, 400));
  }

  // Find the company based on the company ID from the invitation
  const company = await CompanyModel.findById(invite.senderInformation.company);

  // Add the new user's ID to the users array of the company and save the company
  company.users.push(newUser._id);
  company.save();

  // Clear the invitation token expiration and save the invitation without validation
  invite.invitationTokenExpires = undefined;
  invite.isUserRegistered = true;
  invite.save({ validateBeforeSave: false });

  // Send a success response
  res.status(201).json({
    status: "success",
  });
});

/**
 * Controller to check the validity of a signup hash token
 * @param req.params.token - Invitation token
 */
exports.signupHashCheck = catchAsync(async (req, res, next) => {
  // Check if the token is present in the request parameters
  if (!req.params.token) {
    return next(new AppError("Access denied", 400));
  }

  // Get the hashed token from the request parameters
  const hashedToken = new Helper().getHashedToken(req.params.token);

  // Find the invitation with the matching hashed token and valid expiration time
  const invite = await InvitationModel.findOne({
    invitationToken: hashedToken,
    invitationTokenExpires: { $gt: Date.now() },
  });

  // If no invitation is found or it has expired, throw an error
  if (!invite) {
    return next(
      new AppError(
        "Invite does not exist or expired. Please, contact your manager.",
        500
      )
    );
  }

  // Mark the invitation as email acquired
  invite.isEmailAcquired = true;
  await invite.save();

  // Send a success response with the email associated with the invitation
  res.status(200).json({
    status: "success",
    message: "Checked!",
    email: invite.email,
  });
});

/**
 * Controller for user login
 * @param req.body.email - User's email
 * @param req.body.password - User's password
 */
exports.login = catchAsync(async (req, res, next) => {
  // Get the email and password from the request body
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return next(new AppError(`Please provide email and password`, 400));
  }

  // Find the user with the provided email
  const user = await UserModel.findOne({ email })
    .select("+password")
    .populate({ path: "company", select: "name" });
  // If no user is found, throw an error
  if (!user) {
    return next(new AppError(`User does not exist`, 400));
  }

  //If user is inactive, throw an error
  if (user.status === "Inactive") {
    return next(
      new AppError(`Account is inactive. Please, contact your manager`, 400)
    );
  }

  // Generate a token for the user
  const token = signToken(user._id);

  // Check if the provided password is correct
  if (!(await user.correctPassword(password, user.password)) || !user) {
    return next(new AppError(`Incorrect email or password`, 401));
  }

  // Create an object with the user's relevant information
  const loggedInUser = {
    _id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    company: user.company,
    role: user.role,
    status: user.status,
  };

  // Send a success response with the token and the user's information
  res.status(200).json({
    status: "success",
    token: token,
    user: loggedInUser,
  });
});

/**
 * Middleware to protect routes that require authentication
 * It checks if a valid token is provided in the request headers
 * and verifies the token to authenticate the user
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is provided, throw an error
  if (!token) {
    return next(
      new AppError(
        `Your token is expired or doesn't exist... Please, log in to get access.`,
        401
      )
    );
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Find the user associated with the decoded token
    const freshUser = await UserModel.findById(decoded.id);

    // If no user is found, throw an error
    if (!freshUser) {
      return next(
        new AppError(
          `The user belonging to this token does no longer exist`,
          404
        )
      );
    }

    // Check if the user has changed the password after the token was issued
    freshUser.changedPasswordAfter(decoded.iat);

    // Set the user object in the request for further use
    req.user = freshUser;

    // Call the next middleware
    next();
  } catch (err) {
    // If there is an error during token verification, throw an error
    return next(
      new AppError(`Invalid token. Please log in to get access.`, 401)
    );
  }
});

/**
 * Middleware to check if the user belongs to the company
 * It verifies if the user exists in the company's user list
 * and adds the company information to the request query and body
 */
exports.isUserInCompany = async (req, res, next) => {
  const { company, user } = req.headers;

  // Check if the user exists in the company's user list
  const userExists = await CompanyModel.findOne({
    _id: company,
    users: user,
  }).populate({
    path: "users",
    select: "_id status",
  });

  // If the user does not exist in the company, throw an error
  if (!userExists) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  // If the user is inactive, throw an error
  if (userExists.users[0].status !== "Active") {
    return next(
      new AppError("Your account is inactive. Please contact your manager", 403)
    );
  }

  // Add the company information to the request query
  req.query.company = req.headers.company;
  req.params.company = req.headers.company;
  // Add the company information to the request body
  Object.assign(req.body, { company: req.headers.company });

  // Call the next middleware
  next();
};

/**
 * Middleware to restrict access based on user roles
 * @param  {...string} roles - Roles allowed to access the route
 */
exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    const { role } = await UserModel.findOne({ _id: req.headers.user });
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    // Call the next middleware if the user has permission
    next();
  };

/**
 * Controller for handling forgot password functionality
 * Generates a password reset token and sends it to the user's email
 * @param req.body.email - User's email for password reset
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Find user by email
  const user = await UserModel.findOne({ email: req.body.email });

  // If user does not exist, return an error
  if (!user) {
    return next(new AppError(`There is no user with that email`));
  }

  // Create a password reset token and save the user
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Generate the reset password link with the reset token
  const resetPasswordLink = `${process.env.SITE_URL}reset-password/${resetToken}`;

  // Create the email message
  const message = new Helper().getMessage("forgot", "", resetPasswordLink);

  try {
    // Send the reset password email to the user
    await sendEmail(
      user.email,
      "Your password reset token (valid for 10 minutes)",
      message
    );

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // If there was an error sending the email, clear the reset token and expiration date
    user.passwordResetToken = undefined;
    user.passwordExpiresToken = undefined;
    await user.save({ validateBeforeSave: false });

    // Return an error response
    return next(
      new AppError(
        "There was an error sending the email. Please try again later!",
        500
      )
    );
  }

  // Proceed to the next middleware
  next();
});

/**
 * Controller for handling password reset functionality
 * Resets the user's password based on the provided reset token
 * @param req.params.token - Password reset token
 * @param req.body.password - New password
 * @param req.body.confirmPassword - Confirmation of new password
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hash the reset token from the request parameters
  const hashedToken = new Helper().getHashedToken(req.params.token);

  // Find user by the hashed reset token and check if it's still valid
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If user does not exist or token has expired, return an error
  if (!user) {
    return next(
      new AppError("Token is invalid or has expired. Please try again.", 400)
    );
  }

  // Set the user's new password and clear the reset token and expiration date
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Respond with success message
  res.status(200).json({
    status: "success",
    message: "Password reset successful!",
  });
});
