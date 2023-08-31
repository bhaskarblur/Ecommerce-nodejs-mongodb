import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: String,
    products: [{
        productId: ObjectId,
        productName: String,
        productPrice: String,
        quantity:Number,
        productDiscountedPrice: String,
        variantId: String,
        variantName: String
    }],
    totalCost: String,
    appliedCoupon: {
        couponId: ObjectId,
        couponName: String,
    }
    
    
});

module.exports = mongoose.model('orders',orderSchema);