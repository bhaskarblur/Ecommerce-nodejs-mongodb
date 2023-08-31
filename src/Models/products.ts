import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    categoryId: ObjectId,
    userId: ObjectId,
    Manufacturer: String,
    productName: String,
    productDescription: String,
    productPrice: String,
    productDiscountedPrice: String,
    productImages: Array,
    variants: Array


});


module.exports = mongoose.model('products',productsSchema);