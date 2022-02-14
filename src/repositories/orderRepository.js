'use strict';
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async(id) => {
    let res = await Order.find({customer : id},'number status customer items')
    .populate('customer','name')
    .populate('items.product', 'title')
    return res;
}
exports.create = async(model) => {
    let order = new Order(model);
    return await order.save();
}