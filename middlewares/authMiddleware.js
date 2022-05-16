const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../helpers/connectRedis");

const auth = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return next(createError.Unauthorized("Invalid Token"));
      }
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return next(createError.Unauthorized("Invalid Token"));
          }
          return next(createError.Unauthorized(err.message));
        }
        req.payload = decoded;
        next();
      });
    } catch (error) {
      next(error);
    }
  },
  verifyRefreshToken: async (rf_token) => {
    return new Promise((resolve, reject) => {
      JWT.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  },
};

module.exports = auth;
