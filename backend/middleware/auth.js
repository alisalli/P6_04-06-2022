//__________________________________Gestion de l'authentification__________________________//
//Importation de jsonwebtoken
const jwt = require('jsonwebtoken');

// exportation de la fonction du middleware
module.exports = (req, res, next) => {
    try {
        /*récupération du tocken dans le hearder Autorization : bearer tocken
         ** split('') on coupe à partir de l'espace pour ne pas récupérer "bearer"
         ** [1] sert à récupérer l'index 1*/
        const token = req.headers.authorization.split(' ')[1];
        // "decodedToken" sert à décoder le tocken
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // récupération de l'userId du token déchiffré 
        const userIdDecodedToken = decodedToken.userId;
        //comparaison avec l'user Id non chiffré avec l'userID qu'il y a dans le token
        req.auth = {
            userIdDecodedToken
        };
        //Si l'userId de la base de donnée MongoDB ET l'userId renseigné par l'utilisateur sont différents de l'userId chiffré
        if (req.body.userId && req.body.userId !== userIdDecodedToken) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: error,
            message: " Echec Authentification !"
        });
    }
};