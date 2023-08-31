import { request } from "http";
import * as crypto from "crypto";
const { MongoClient, ServerApiVersion } = require('mongodb');
const User = require('../Models/user');
const Token = require('../Models/accessToken');
import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';

const resetPass = require('../Models/resetPass');

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


export async function createUser_(req, res) {
    if(req.body.firstName !== undefined && req.body.lastName !==undefined && req.body.email !==undefined && req.body.password !==undefined) {
    try {

        const checkexists= await User.find({email: req.body.email});
      //  console.log(checkexists);
        if(checkexists.length < 1) {

        const today =  new Date();
        const token = await Encrypt.cryptPassword(req.body.firstName);
        const password = await Encrypt.cryptPassword(req.body.password);
        const user = await User.create({firstName:req.body.firstName, lastName:req.body.lastName,
        email:req.body.email, password:password, createdAt: today});

        const userId = user._id;

        const createToken = await Token.create({userId: userId, accessToken: token, createdAt: today,
        last_used_at: today});

        var _data ={};
      //  console.log(user);
        _data['accessToken'] = token;
        user['password'] = null;
        _data['userDetails'] = user;        

    return res.status(200).send({ 'message': 'User created successfully','Data':_data });

        }
        else {
            return res.status(400).send({ 'message': 'This email already exists!'});
        }
    } catch (err) {
        return res.status(400).send({ 'message': 'Error creating user!', 'Error':err.message });
    }
}
else {
    return res.status(400).send({ 'message': 'Fields missing! Please check that you are entering all the fields.'});
}
  

}

export async function login(req, res) {
    if(req.body.password !== undefined && req.body.email !== undefined) {
        try{
            const checkexists= await User.find({email: req.body.email});

            if(checkexists.length   > 0) {
                const passHash = checkexists[0].password;

                if(await Encrypt.comparePassword(req.body.password, passHash)) {
                    const today =    new Date();
                    const userId= checkexists[0]._id;
                    const token = await Encrypt.cryptPassword(checkexists[0].firstName);

                    const createToken = await Token.create({userId: userId, accessToken: token, createdAt: today,
                        last_used_at: today});

                        var _data ={};
                       // console.log(checkexists[0]);
                        _data['accessToken'] = token;
                        checkexists[0]['password'] = null;
                        _data['userDetails'] = checkexists[0];     
                        return res.status(400).send({ 'message': 'Login success!', 'userData': _data }); 
                }
                else {
                    return res.status(400).send({ 'message': 'Incorrect credentials!' });
                }
            }
            else {
                return res.status(400).send({ 'message': 'Incorrect credentials!' });
            }
        }
        catch(err) {
            return res.status(400).send({ 'message': 'Error logging!', 'Error':err.message });
        }
    }
    else {
        return res.status(400).send({ 'message': 'Fields missing! Please check that you are entering all the fields.'});
    }
}

export async function logout(req, res){
    if(req.body.accessToken !== undefined && req.body.email !== undefined) {
        try{
            const checkexists= await User.find({email: req.body.email});

            if(checkexists.length   > 0) {

                const checkToken = await Token.findOne({accessToken: req.body.accessToken});

                if(checkToken !== null) {
                const deleteToken = await Token.deleteOne({ accessToken: req.body.accessToken});
            
                return res.status(200).send({ 'message': 'Logout done!'});
                }
                else {
                    return res.status(400).send({ 'message': 'Incorrect token!'});
                }
            }
            else {
                return res.status(400).send({ 'message': 'This email does not exists!'});
            }

        }
        catch(err) {
            return res.status(400).send({ 'message': err});
        }
    }
    else {
        return res.status(400).send({ 'message': 'Fields missing!'});
            }
}

export async function forgotPassword(req, res) {
    if(req.body.email !== undefined) {
        try{
            const checkexists= await User.find({email: req.body.email});

            if(checkexists.length   > 0) {
                const checkotp = await resetPass.findOne({email:req.body.email});

                const otp = randomFixedInteger(6);
                if(checkotp!=null) {
                    await resetPass.updateOne({ email:req.body.email }, { $set: { otp:otp} })
                    return res.status(200).send({ 'message': 'OTP Sent!', 'OTP': otp});

                }
                else {
                    await resetPass.create({ email:req.body.email, otp:otp });

                    return res.status(200).send({ 'message': 'OTP Sent!', 'OTP': otp});

                }
            }
            else {
                return res.status(400).send({ 'message': 'This email does not exists!'});
            }
        }
        catch(err) {
            return res.status(400).send({'message': err});
        }
    }
    else {
        return res.status(400).send({ 'message': 'Fields missing!'});
    }
}

export async function verifyOTP(req, res) {
    if(req.body.email !== undefined && req.body.otp !== undefined) {
        try{
            const checkexists= await User.find({email: req.body.email});

            if(checkexists.length   > 0) {
                const checkotp = await resetPass.findOne({email:req.body.email});

                if(checkotp!=null) {
                    console.log(checkotp.otp,req.body.otp)
                    if(parseInt(checkotp.otp) === parseInt(req.body.otp)) {
                        const deleteToken = await resetPass.deleteOne({ email: req.body.email});
                        return res.status(200).send({ 'message': 'OTP Verified! You can now reset password!',});
                    }
                    else {
                        return res.status(400).send({ 'message': 'Incorrect OTP'});
                    }
                    

                }
                else {
                    return res.status(400).send({ 'message': 'No OTP Generated Or Incorrect'});
                   

                }
            }
            else {
                return res.status(400).send({ 'message': 'This email does not exists!'});
            }
        }
        catch(err) {
            return res.status(400).send({'message': err});
        }
    }
    else {
        return res.status(400).send({ 'message': 'Fields missing!'});
    }
}
