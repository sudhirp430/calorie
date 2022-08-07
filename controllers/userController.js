const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');
const { validateEmail } = require('../utils/common');
const { userTypeEnum } = require('../constants/userTypeEnum');

createToken = (payload) => {
    let token = jwt.sign({ id: payload.id, role: payload.role }, process.env.TOKEN_SECRET);
    return token;
}
exports.registerUser = async (req, res) => {
    try {
        let name = req.body.name;
        let age = req.body.age;
        let email = req.body.email;
        let userType = req.body.userType || userTypeEnum.user

        if (!name) {
            return apiResponse.sendBadRequest(res, {
                message: "Name is missing"
            })
        }

        if (!age && (age < 10 || age > 110)) {
            return apiResponse.sendBadRequest(res, {
                message: "Age is missing or invalid age"
            })
        }

        if (!email && !validateEmail(email)) {
            return apiResponse.sendBadRequest(res, {
                message: "Email is missing or invalid email"
            })
        }

        const userData = await Users.create({
            name,
            age,
            email,
            userType
        });
        const token = createToken({ id: userData._id, role: userType });
        return apiResponse.send(res, {
            data: {
                user: userData,
                token
            }
        })
    }
    catch (err) {
        return apiResponse.sendInternalError(res, err);
    }

};

exports.listUserForAdmin = async (req, res) => {
    try {
        const limit = req.body.limit || 10;
        const page = req.body.page || 0;
        const skip = limit * page;

        Users.find({})
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: -1,
            })
            .then((userList) => {
                return apiResp.send(res, { data: userList });
            });
    } catch (err) {
        return apiResp.sendInternalError(res, err);
    }
}

