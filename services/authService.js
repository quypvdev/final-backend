const Users = require("../models/hrModel");
const createError = require("http-errors");
const { userValidateLogin } = require("../helpers/validation");
const { signAccessToken, signRefreshToken } = require("../helpers/jwtService");
const auth = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");
const ResetPw = require("../models/resetPasswordModel");
const { sendResetPassword } = require("../services/mailService");

const authServices = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { error } = userValidateLogin(req.body);
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }

      const user = await Users.findOne({ email });
      if (!user) {
        throw createError.NotFound("User not User does not exist!");
      }

      const isValid = await user.isCheckPassword(password);
      if (!isValid) {
        throw createError.Unauthorized("Invalid password");
      }

      const { _id } = user;

      const accessToken = await signAccessToken({ _id });
      const refreshToken = await signRefreshToken({ _id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/api/refresh-token",
        maxAge: 1000 * 60 * 60 * 24 * 30, //30days
        sameSite: "strict",
      });

      return {
        accessToken,
        user: { ...user._doc, password: null },
      };
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const rf_token = req.cookies.refreshToken;

      if (!rf_token || rf_token === null) {
        throw createError.BadRequest("Please Login");
      }
      const { _id } = await auth.verifyRefreshToken(rf_token);

      const accessToken = await signAccessToken({ _id });
      const refreshToken = await signRefreshToken({ _id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/api/refresh-token",
        maxAge: 1000 * 60 * 60 * 24 * 30, //30days
      });
      console.log(_id);
      const user = await Users.findById(_id).select("-password");

      return {
        accessToken,
        user,
      };
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshToken", { path: "/api/refresh-token" });
      return { msg: "Logout success" };
    } catch (error) {
      next(error);
    }
  },

  emailResetPassword: async (req, next) => {
    const { email } = req.body;

    try {
      const user = await Users.findOne({ email });
      if (!user) throw createError.NotFound("Profile not found");

      const hasHash = await ResetPw.findOne({ profileId: user._id });

      if (hasHash) {
        throw createError.NotFound("The email has been sent");
      }

      const hash = new ResetPw({ profileId: user._id });

      await hash.save();

      await sendResetPassword({ toUser: user, hash: hash._id });

      return "The email has been sent";
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, next) => {
    const { password, id } = req.body;

    try {
      const aHash = await ResetPw.findOne({ _id: id });
      console.log(aHash);
      if (!aHash || !aHash.profileId) {
        throw createError.NotFound("Can not change password");
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await Users.findOneAndUpdate(
        { _id: aHash.profileId },
        {
          password: passwordHash,
        }
      );
      await aHash.remove();
      return "Password changed";
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authServices;
