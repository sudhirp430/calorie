const jwt = require("jsonwebtoken");
const apiResponse = require("./apiResponse");

const basicAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return apiResponse.sendUnauthorizeRequest(res);
      }
      console.log(decoded)
      req.user = decoded;
      next();
    }
  );
};


module.exports = {
  basicAuth,
}