'use strict';
const jwt =  require('jsonwebtoken');

exports.generateToken = async(data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}
exports.decodeToken = async(token) => {
    let data = jwt.verify(token, global.SALT_KEY);
    return data;
}
exports.authorize = function(req, res,next) {
    let token = req.body.token || req.query.token || req.headers['x-acces-token'];
    if (!token){
        res.status(401).json({
            message: 'Acesso restrito.'
        });
    }else{
        jwt.verify(token,global.SALT_KEY, function(error, decoded){
            if(error){
                res.status(401).json({message:'Token inválido.'});
            }else{
                next();
            }
        })
    }
}
exports.Adminstrator = function(req, res,next) {
    let token = req.body.token || req.query.token || req.headers['x-acces-token'];
    if (!token){
        res.status(401).json({
            message: 'Acesso restrito.'
        });
    }else{
        jwt.verify(token,global.SALT_KEY, function(error, decoded){
            if(error){
                res.status(401).json({message:'Token inválido.'});
            }else{
                if(decoded.roles.includes('admin')){
                    next();
                }else{
                    res.status(403).json({message:'Acesso restrito a administradores.'});
                }
            }
        })
    }
}
