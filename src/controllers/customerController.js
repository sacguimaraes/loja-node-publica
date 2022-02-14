'use strict';
const ValidationContract = require('../Validators/validator');
const repository = require('../repositories/customerRepository');
const bcrypt = require('bcrypt');
const email = require('../Services/email');
const auth = require('../Services/auth');
exports.get = async(req, res, next) => {
    try{
        let data = await repository.get()
        res.status(200).send(data)
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};
exports.authenticate = async(req, res, next) => {
    let model = req.body;
    let contract = new ValidationContract();
    contract.isEmail(model.email, 'E-mail inválido.');
    contract.hasMinLen(model.password, 6, 'A Senha deve conter pelo menos 6 caracteres.');
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
    try{
        let customer = await repository.authenticate(model);
        if(!customer){
            res.status(404).send({message:'Usuário ou senha inválidos!'});
            return;
        }
        let match = await bcrypt.compare(model.password, customer.password);
        if(!match){
            res.status(401).send({message:'Usuário ou senha inválidos!'});
            return;
        }
        let token = await auth.generateToken({
            email: customer.email, name: customer.name, id: customer.id, roles: customer.roles
        });
        res.status(200).send({
            token: token,
            data:{
                'email': customer.email, 
                'customer':customer.name,
            }
        });
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};
exports.refreshToken = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-acces-token'];
        const tokenData = await auth.decodeToken(token)
        let customer = await repository.getById(tokenData.id);
        if(!customer){
            res.status(404).send({message:'Cliente não encontrado!'});
            return;
        }
        let tokenRefreshed = await auth.generateToken({
            email: customer.email, name: customer.name, id: customer.id, roles: customer.roles
        });
        res.status(200).send({
            token: tokenRefreshed,
            data:{
                'email': customer.email, 
                'customer':customer.name,
            }
        });
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};

exports.post = async(req, res, next) => {
    let salt = bcrypt.genSaltSync()
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O Nome deve conter pelo menos 3 caracteres.');
    contract.isEmail(req.body.email, 'E-mail inválido.');
    contract.hasMinLen(req.body.password, 6, 'A Senha deve conter pelo menos 6 caracteres.');
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
    let model = req.body;
    model.password = bcrypt.hashSync(model.password,salt)
    try{
        await repository.create(model);
        //email.send(model.email,'Bem vindo.',global.EMAIL_TMPL.replace('{0}',model.name));
        res.status(201).send({message:'Cliente cadastrado com sucesso!'});
    }catch(e){
        res.status(500).send({message:'Erro!', data:e});
    }
};