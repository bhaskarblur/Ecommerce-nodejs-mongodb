
import mongoose from "mongoose";
const Order = require('../Models/order');
import * as bcrypt from 'bcrypt';
const User = require('../Models/user');
const Cart = require('../Models/cart');
export const Encrypt = {

    cryptPassword: (password: string) =>
        bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),
    
        comparePassword: (password: string, hashPassword: string) =>
            bcrypt.compare(password, hashPassword)
            .then(resp => resp)
    
    }

    var randomFixedInteger = function (length) {
        return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
    }


export async function placeOrder(req, res) {
    // try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
 
            // place order here!
            const cart = await Cart.findOne({userId: req.body.userId});
            const order = await Order.create({userId: cart.userId, products: cart.products, 
                totalCost: cart.totalCost, appliedCoupon: cart.appliedCoupon});
            const clearCart = await Cart.deleteOne({userId: req.body.userId});

            res.status(200).send({'message':'Order Placed successfully!', 'orderDetails': cart});
        }
        else {
            res.status(200).send({'message':'No cart exists'})
        }
    // }
    // catch(err){
        // res.status(200).send({'message':err.message});
    // }
}

export async function getOrders(req, res){
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
            const orders = await Order.find({userId: req.body.userId});
            res.status(200).send({'message':'All Orders', 'orders': orders})
        }
        else {
            res.status(200).send({'message':'No orders placed'})
        }
    }
    catch(err){
        res.status(200).send({'message':err.message});
    }
}