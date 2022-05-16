const JWT = require("jsonwebtoken");

const signAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1y" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};
const signRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1y" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
};
