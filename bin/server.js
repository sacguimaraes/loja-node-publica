const app = require('../src/app');
const debug = require('debug')('nodestr:server');
const http = require('http');
const port = NormalizePort(process.env.port || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', OnError);
server.on('listening', OnListening);
console.log("API rodando na porta " + port);

function NormalizePort(valor){
    const port = parseInt(valor, 10);
    if (isNaN(port)){
        return val;
    }
    if (port >=0){
        return port;
    }
    return false;
}

function OnError(error){
    if (error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

    switch (error.code){
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
    //podemos pegar mais erros da lista de erros do Node.
}

function OnListening(){
    const addr = server.address();
    const bind = typeof addr === 'string' 
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
}