import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    secondName: String,
    email:String,
    password:String,
    createdAt: Date
});

module.exports = mongoose.model('users',userSchema);