'use strict';
const repository = require('../repositories/OrderRepository');
const guid = require('guid');
const auth = require('../services/auth');
exports.get = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-acces-token'];
        const tokenData = await auth.decodeToken(token)
        let model = await repository.get(tokenData.id)
        res.status(200).send(model)
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};
exports.post = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-acces-token'];
        const tokenData = await auth.decodeToken(token)
        let model = req.body;
        model.number = guid.raw();
        model.customer = tokenData.id;
        await repository.create(model);
        res.status(201).send({message:'Pedido cadastrado com sucesso!'});
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};