const express = require('express'); //MVC
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')

//Carrega Models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

//Carrega rotas
const index = require('./routes/index');
const productRoute = require('./routes/product');
const customerRoute = require('./routes/customer');
const orderRoute = require('./routes/order');
//conexão com o Banco
mongoose.connect(config.connectionString);


app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/',index);
app.use('/products',productRoute);
app.use('/customers',customerRoute);
app.use('/orders',orderRoute);
module.exports = app;
