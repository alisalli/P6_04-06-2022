//___________________________Création des "controllers" pour l'user____________________//
// Importation de l'outil bcrypt qui permet de sécuriser l'identification et le compte d'un utilisateur
const bcrypt = require('bcrypt');
// Importation du modèle d'une sauce
const User = require('../models/user');
// Importation de crypto-js
const cryptojs = require('crypto-js');
// Importation de l'outil "jsonwebtocken", permet de créer un tocken et sécuriser l'auth
const jwt = require('jsonwebtoken');


//Controller "signup" permet à un nouvel utilisateur de créer un compte
exports.signup = (req, res, next) => {
    // on crypte le mot de passe à 10 reprises pour plus de sécurité
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            // on crée un nouveau modèle qui prend en compte le cryptage du mot de passe
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log('inscription');
            // on sauvegarde dans la collection "users" de MongoDB
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch((e) => res.status(500).json({
                    e,
                    message: "Impossible de créer un compte. Cette adresse email est déjà utilisée."
                }));
        })
        .catch((e) => res.status(500).json({
            e,
            message: "une erreur est survenue"
        }));
};
//Controller "login" permet à un utilisateur déjà enregistré dans la collection "Users" de se connecter à son compte
exports.login = (req, res, next) => {
    // La méthode findOne avec le paramètre "email", permet de retrouver un user grâce à son email
    const cryptojsEmail = cryptojs.HmacSHA256(req.body.email, 'SECRET_KEY_123').toString();

    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                // si l'utilisateur n'a pas de compte, envoyer une erreur
                return res.status(401).json({
                    message: "Utilisateur inexistant"
                });
            }
            // bcrypt.compare permet de comparer le mot de passe saisi avec ceux de la collection Users de MongoDB
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) { // si le mot de passe n'est pas valide, renvoi d'un message d'erreur
                        return res.status(401).json({
                            message: 'Mauvaise saisie du mot de passe !'
                        });
                    }
                    res.status(200).json({
                        message: "le mot de passe est valide",
                        // renvoi d'un Token et acceptation de la requête
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id
                            },
                            'RANDOM_TOKEN_SECRET', {
                                expiresIn: '24h'
                            })
                    });
                })
                .catch((e) => res.status(500).json({
                    e,
                    message: "erreur serveur"
                }));
        })
        .catch((e) => res.status(500).json({
            e,
            message: "erreur serveur"
        }));
};