'use strict';
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async() => {
    let res = await Product
    .find({active : true},'title price slug');
    return res;
}
exports.getbyslug = async(slug) => {
    let res = await Product
    .findOne({slug:slug,active : true},'title price slug tags');
    return res;
}
exports.getbyid = async(id) => {
    let res = await Product
    .findById({id:id});
    return res;
}
exports.getbytag = async(tags) => {
    let res = await Product
    .find({tags:tags,active:true},'title description price slug');
    return res;
}
exports.create = async(model) => {
    let product = new Product(model);
    return await product
    .save();
}
exports.update = async(id, model) => {
    let res = await Product
    .findByIdAndUpdate(id,{
        $set:{
            title:model.title,
            description:model.description,
            price:model.price,
            slug:model.slug
        }
    });
    return res;
}
exports.delele = async(id) => {
    let res = await Product
    .findByIdAndRemove(id);
    return res;
}