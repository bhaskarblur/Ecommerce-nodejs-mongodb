import { request } from "http";
import * as crypto from "crypto";
const { MongoClient, ServerApiVersion } = require('mongodb');
const Categories = require('../Models/categories');
const Product = require('../Models/products');
import mongoose from "mongoose";
const deliveryaddresses = require('../Models/deliveryaddresses');
import * as bcrypt from 'bcrypt';
const User = require('../Models/user');
const Cart = require('../Models/cart');
const Order = require('../Models/order');

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

const database = (() => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        const uri = ""
        mongoose.connect(
            uri);
        console.log("Database connection established!")
    }
    catch (error) {
        console.log(error);
    }
});


const db = mongoose.connection;
db.once('open', () => console.log('Connected to database'));
database();

export async function getCategories(req, res) {

    const categories = await Categories.find();

    console.log(categories);
    res.status(200).send({'message':'All categories', 'categories': categories})
}

export async function getAllProducts(req, res) {

    const product = await Product.find();
    res.status(200).send({'message':'All products', 'products': product})
}

export async function addDeliveryAddress(req, res) {
    try{
        const user = await User.findOne({_id: req.body.userId});
        console.log(user);

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {

       
        const addAddress = await deliveryaddresses.create({
            userId: req.body?.userId, addressName: req.body?.addressName, streetAddress: req.body?.streetAddress,
            city: req.body?.city, state: req.body?.state, pinCode: req.body?.pinCode
        });

        return res.status(200).send({ 'message': 'Address saved!', 'addressData':addAddress });
    }
    else {
        return res.status(400).send({ 'message': 'Invalid Token!' });
    }
    }
    catch(err){
        return res.status(400).send({ 'message': 'Error!', 'Error':err.message });
    }
}

export async function editDeliveryAddress(req, res) {
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
       
        const changeAddress = await deliveryaddresses.updateOne({_id:req.body.addressId}, 
            { $set: { addressName:req.body.addressName, streetAddress: req.body.streetAddress, 
            city: req.body.city, state: req.body.state, pinCode: req.body.pinCode } });


           // console.log(await deliveryaddresses.findOne({_id:req.body.addressId}));
        return res.status(200).send({ 'message': 'Address Edited!', 'addressData':
        await deliveryaddresses.findOne({_id:req.body.addressId}) });
    }
    else {
        return res.status(400).send({ 'message': 'Invalid Token!' });
    }
    }
    catch(err){
        return res.status(400).send({ 'message': 'Error!', 'Error':err.message });
    }
}

export async function deleteDeliveryAddress(req, res) {
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
       
        const deleteAddres = await deliveryaddresses.deleteOne({_id:req.body.addressId});

        return res.status(200).send({ 'message': 'Address Deleted!'});
    }
    else {
        return res.status(400).send({ 'message': 'Invalid Token!' });
    }
    }
    catch(err){
        return res.status(400).send({ 'message': 'Error!', 'Error':err.message });
    }
}

export async function getAllDeliveryAddress(req, res) {
    try{
        const user = await User.findOne({_id: req.body.userId});

        if(await Encrypt.comparePassword(user.firstName, req.body.accessToken)) {
       
        const addresses = await deliveryaddresses.find({userId:req.body.userId});

        console.log(addresses);
        return res.status(200).send({ 'message': 'All addresses!', 'addressesList': addresses });
    }
    else {
        return res.status(400).send({ 'message': 'Invalid Token!' });
    }
    }
    catch(err){
        return res.status(400).send({ 'message': 'Error!', 'Error':err.message });
    }
}



