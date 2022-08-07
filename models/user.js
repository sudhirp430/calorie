const mongoose = require('mongoose');
const {userTypeEnum} = require('../constants/userTypeEnum')
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    userType:{
        type:String,
        default: userTypeEnum.user,
    },
    dailyLimit:{
        type:Number,
    }
},
{
  timestamps: true,
});

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;