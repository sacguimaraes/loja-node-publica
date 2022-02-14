'use strict';
const ValidationContract = require('../Validators/validator');
const repository = require('../repositories/productRepository');
const azure = require('azure-storage');
const config = require('../config');
const guid = require('guid');

exports.get = async(req, res, next) => {
    try{
        let data = await repository.get()
        res.status(200).send(data)
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.getbyslug = async(req, res, next) => {
    try{
        let data = await repository.getbyslug(req.params.slug);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.getbyid = async(req, res, next) => {
    try{
        let data = await repository.getbyid(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.getbytag = async(req, res, next) => {
    try{
        let data = await repository.getbytag(req.params.tags);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O Título deve conter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.slug, 3, 'O Slug deve conter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.description, 3, 'A Descrição deve conter pelo menos 3 caracteres.');
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try{
        let blobService = azure.createBlobService(config.containerConnectionString);
        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;//imagem convertida em base64
        let matches = rawdata.match(/^data:([A-Za-z+\/]+);base64,(.+)$/);
        let type = matches[1];
       
        let buffer = new Buffer(matches[2], 'base64');
        
        blobService.createAppendBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error)
                filename = 'default-product.png';
        });

        let model = req.body;
        model.image = 'HTTPS://ENDEREÇO DO SEU REPOSITORIO/' + filename
        await repository.create(model);
        res.status(201).send({message:'Produto cadastrado com sucesso!'});
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.put = async(req, res, next) => {
    try{
        await repository.update(req.params.id,req.body);
        res.status(201).send({message:'Produto alterado com sucesso!'});
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.delete = async(req, res, next) => {
    try{
        await repository.delele(req.body.id);
        res.status(201).send({message:'Produto excluído com sucesso!'});
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};