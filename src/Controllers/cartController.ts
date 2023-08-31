
const Product = require('../Models/products');
import mongoose from "mongoose";

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

export async function addToCart(req, res){
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
            const checkcart = await Cart.findOne({userId: req.body.userId});
            const product = await Product.findOne({_id: req.body.productId});
            if(checkcart!=null) {
                const alreadyInCart = checkcart.products;
                var isInCart=false;
               
                for(const product__ of alreadyInCart) {
                    if(String(product__.productId )=== String(product._id)) {
                        isInCart = true;   
                    }
                    console.log(String(product__.productId) === String(product._id));
                }

               // console.log(isInCart);
                if(isInCart) {
                const updateCart1 = await Cart.updateOne({userId: req.body.userId, "products.productId":req.body.productId}
                , { $inc: {"products.$.quantity": 1}});
                }
                else  {
                const updateCart = await Cart.updateOne({userId: req.body.userId}, { $push: { "products":    {
                    productId: req.body.productId, productName: product.productName,
                    productPrice: product.totalPrice, quantity: req.body.quantity, productDiscountedPrice: product.productDiscountedPrice,
                    variantId: req.body.variantId, variantName: req.body.variantName} }
                });
            
                }

                var totalCost=0;

                checkcart.products.forEach(element => {
                    totalCost = totalCost
                    + parseInt(String(element.productDiscountedPrice).toString().replace('$','')) * element.quantity;

                });
                totalCost = totalCost + parseInt(String(product.productDiscountedPrice).toString()
                .replace('$','')) * req.body.quantity;
                console.log(totalCost);
                const totalCostUpdate = await Cart.updateOne({userId: req.body.userId}, { $set: {totalCost: '$'+totalCost}})
                
                res.status(200).send({'message':'Cart updated successfully'})
            }
            else {
                const addCart = await Cart.create({
                    userId: req.body.userId, 
                    totalCost: product.productDiscountedPrice,
                    appliedCoupon: {
                        couponId: req.body.couponId,
                        couponName: req.body.couponName
                    },
                    products: [
                        {  productId: req.body.productId,productName: product.productName,
                            productPrice: product.totalPrice, quantity: req.body.quantity, productDiscountedPrice: product.productDiscountedPrice,
                            variantId: req.body.variantId, variantName: req.body.variantName }
                    ]
                });
                
                res.status(200).send({'message':'Cart added successfully', 'cart': addCart})
            }
        }
    }
    catch(err){

    }
}

export async function removeFromCart(req, res){
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
            const checkcart = await Cart.findOne({userId: req.body.userId});
            const product = await Product.findOne({_id: req.body.productId});
            if(checkcart!=null) {

                const updateCart1 = await Cart.updateOne({userId: req.body.userId, "products.productId":req.body.productId}
                , { $inc: {"products.$.quantity": -1}});

                var totalCost=0;
               
                const checkcartnew = await Cart.findOne({userId: req.body.userId});
                checkcartnew.products.forEach(element => {
                    totalCost = totalCost
                    + parseInt(String(element.productDiscountedPrice).toString().replace('$','')) * element.quantity;

                });

              //  totalCost = totalCost - parseInt(String(product.productDiscountedPrice).toString()
                //.replace('$','')) * req.body.quantity;
                console.log(totalCost);
                const totalCostUpdate = await Cart.updateOne({userId: req.body.userId}, { $set: {totalCost: '$'+totalCost}})
                
                res.status(200).send({'message':'Product removed successfully'})
            }
            else {
                res.status(200).send({'message':'Empty cart'})
            }
        }
    }
    catch(err){

    }
}

export async function getCart(req, res){
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
            const checkcart = await Cart.findOne({userId: req.body.userId});
            res.status(200).send({'message':'cart found', 'cart': checkcart})
        }
        else {
            res.status(200).send({'message':'No cart exists'})
        }
    }
    catch(err){
        res.status(200).send({'message':err.message});
    }
}