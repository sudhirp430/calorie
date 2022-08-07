const Food = require('../models/food');
const apiResponse = require('../utils/apiResponse');
const mongoose = require('mongoose');

exports.addFood = async (req, res) => {
    try {
        let food = req.body.food;
        let date = req.body.date;
        let calorie = req.body.calorie;
        let userId = req.user.id;

        date = new Date(date);

        if (!food) {
            return apiResponse.sendBadRequest(res, {
                statusMessage: "food is missing"
            })
        }

        if (!date) {
            return apiResponse.sendBadRequest(res, {
                statusMessage: "date is missing"
            })
        }

        if (!calorie) {
            return apiResponse.sendBadRequest(res, {
                statusMessage: "calorie is missing"
            })
        }

        const foodData = await Food.create({
            userId,
            date,
            food,
            calorie
        });
        return apiResponse.send(res, {
            data: foodData
        })
    }
    catch (err) {
        return apiResponse.sendInternalError(res, err);
    }

};

exports.listFoodForUser = async (req, res) => {
    try {
        const limit = req.headers.limit || 10;
        const page = req.headers.page || 0;
        const skip = limit * page;
        const userId = req.user.id;

        Food.find({ userId })
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: -1,
            })
            .then((foodList) => {
                return apiResponse.send(res, { data: foodList });
            });
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }
}

exports.totalFoodCalorisForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());


        console.log(startOfToday, userId);
        const totalCaloris = await Food.aggregate([{
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startOfToday }
            }
        },
        {
            $group: {
                "_id": "$userId",
                "calorie": { $sum: "$calorie" }
            }
        },
        {
            $project: {
                "_id": "$userId",
                "calorie": "$calorie"
            }
        }
        ])

        return apiResponse.send(res, {
            data: {
                calorie: totalCaloris[0].calorie
            }
        });
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }
}

exports.thresholdCrosedDaysForUser = async (req, res) => {
    try {
        const userId = req.user.id;


        const totalCaloris = await Food.aggregate([{
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $group: {
                "_id": "$date",
                "calorie": { $sum: "$calorie" }
            }
        },
        {
            $match: {
                "calorie": { $gte: 100 }
            }
        },
        { $sort: { _id: -1 } },
        {
            $project: {
                "_id": 0,
                "calorie": "$calorie",
                "date": "$_id"
            }
        }])

        return apiResponse.send(res, { data: totalCaloris });
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }
}
exports.listFoodForAdmin = async (req, res) => {
    try {
        const limit = req.headers.limit || 10;
        const page = req.headers.page || 0;
        const skip = limit * page;
        const userId = req.body.userId;

        Food.find({ userId })
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: -1,
            })
            .then((foodList) => {
                return apiResponse.send(res, { data: foodList });
            });
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }
}

exports.update = async (req, res) => {
    try {
        let updateObject = {};
        if (req.body.calorie) {
            updateObject.calorie = req.body.calorie;

        }
        if (req.body.food) {
            updateObject.calorie = req.body.calorie;

        }
        if (req.body.date) {
            updateObject.calorie = new Date(req.body.date);

        }
        const food = await Food.findByIdAndUpdate(req.headers.id, req.body);

        return apiResponse.send(res, food);
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Food.findByIdAndDelete(req.headers.id);

        return apiResponse.send(res, deleted);
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }
};

exports.report = async (req, res) => {
    try {

        const limit = req.headers.limit || 10;
        const page = req.headers.page || 0;
        const skip = limit * page;
        var previousSeven = new Date();
        previousSeven.setDate(previousSeven.getDate() - 7);
        let thisWeekCount = await Food.find({ createdAt: { $gt: previousSeven } }).count();

        var previousForteen = new Date();
        previousForteen.setDate(previousForteen.getDate() - 7);
        let previousWeekCount = await Food.find({ createdAt: { $gt: previousForteen, $lt: previousSeven } }).count();

        let userCalories = await Food.aggregate([{
            $match: {
                createdAt: { $gt: previousSeven }
            }
        },
        { $sort: { userId: -1 } },
        {
            $group: {
                "_id": {
                    "date": "$date",
                    "userId": "$userId"
                },

                "calorie": { $sum: "$calorie" }
            }
        },
        {
            $group: {
                "_id": "$_id.userId",

                "calorie": { $avg: "$calorie" }
            }
        },
        { $skip: skip },
        { $limit: limit }])

        return apiResponse.send(res, {
            data: {
                thisWeekCount,
                previousWeekCount,
                userCalories
            }
        });
    } catch (err) {
        return apiResponse.sendInternalError(res, err);
    }

}

