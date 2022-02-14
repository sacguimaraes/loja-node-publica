'use strict';
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async() => {
    let res = await Customer
    .find({active : true},'name email active roles');
    return res;
}
exports.getById = async(id) => {
    let res = await Customer
    .findOne({
        _id:id,
        active:true},'name email id');
    return res;
}
exports.authenticate = async(model) => {
    let res = await Customer
    .findOne({
        email:model.email,
        active:true},'name email password id roles');
    return res;
}
exports.create = async(model) => {
    let customer = new Customer(model);
    return await customer
    .save();
}