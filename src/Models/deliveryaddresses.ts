import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: String,
    addressName: String,
    streetAddress: String,
    city: String,
    pinCode: String,
    state: String,
    
});

module.exports = mongoose.model('deliveryaddresses',addressSchema);