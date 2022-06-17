//_______________________Configuration du Server________________________//
//____Importations______//
// Importation du package HTTP de node.js pour créer le serveur : 
const http = require('http');
// Importation de l'application app.js : 
const app = require('./app');


// "normalizePort" permet de s'assurer que le port fourni est un "number" ou une "string" et si ce n'est pas le cas, retourne "false"
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// définition de 'port' 
const port = normalizePort(process.env.PORT || '3000');

// paramètrage du port avec la méthode set de express
app.set('port', port);

// définition de 'errorHandler' pour gérer les erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
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
};

//La méthode createServer() prend en argument la fonction qui sera appelée à chaque requête reçue par le serveur
const server = http.createServer(app);


server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// le serveur écoute les requêtes sur le port
server.listen(port);