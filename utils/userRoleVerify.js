const apiResponse = require("./apiResponse");
const { userTypeEnum } = require("../constants/userTypeEnum")

const verifyAdminRole = (req, res, next) => {
  if (req.user.role === userTypeEnum.admin) {
    return next();
  }
  return apiResponse.sendForbiddenRequest(res);
};


module.exports = {
  verifyAdminRole,
}