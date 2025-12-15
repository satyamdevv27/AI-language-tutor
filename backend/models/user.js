const { types, string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userschema = new Schema({
    name:{
        type:string,
        required:true
    },
    email:{
        type:string,
        required:true,
        unique:true
    },
    password:{
        type:string,
        required:true       
    }
});

const user = mongoose.model('user',userschema);

module.exports = user;
