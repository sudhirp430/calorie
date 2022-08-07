const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var foodSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: {
        type: Date,
        require:true
    },
    food:{
        type:String,
        require:true
    },
    calorie:{
        type:Number,
        require:true
    }
},
{
  timestamps: true,
});

var foodModel = mongoose.model('Food', foodSchema);

module.exports = foodModel;