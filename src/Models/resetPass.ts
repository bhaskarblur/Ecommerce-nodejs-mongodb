import mongoose from "mongoose";

const resetPass = new mongoose.Schema({
    email:String,
    otp: Number
});

module.exports = mongoose.model('resetpass',resetPass);