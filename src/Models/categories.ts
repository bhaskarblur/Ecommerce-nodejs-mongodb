import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: String
});

module.exports = mongoose.model('categories',categorySchema);