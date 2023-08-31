import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: String,
    accessToken: String,
    last_used_at: Date,
    created_at: Date
});

module.exports = mongoose.model('accessTokens',tokenSchema);